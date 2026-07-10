package com.greenco.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenco.dto.AiAnalysisResponse;
import com.greenco.dto.AiRecommendationResponse;
import com.greenco.entity.*;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AiAnalysisResultRepository;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.AssessmentResponseRepository;
import com.greenco.repository.DocumentRepository;
import com.greenco.service.AiService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AiServiceImpl implements AiService {

    private final AiAnalysisResultRepository aiRepository;
    private final DocumentRepository documentRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final ObjectMapper objectMapper;

    public AiServiceImpl(AiAnalysisResultRepository aiRepository,
                          DocumentRepository documentRepository,
                          AssessmentRepository assessmentRepository,
                          AssessmentResponseRepository responseRepository,
                          ObjectMapper objectMapper) {
        this.aiRepository = aiRepository;
        this.documentRepository = documentRepository;
        this.assessmentRepository = assessmentRepository;
        this.responseRepository = responseRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Async
    @Transactional
    public void triggerDocumentAnalysis(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .filter(d -> d.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        try {
            // Simulate AI OCR server pipeline latencies (e.g. 3 seconds)
            Thread.sleep(3000);

            // 1. Generate Mock Extracted Fields depending on the parameter code
            Map<String, Object> fields = new HashMap<>();
            List<AiAnalysisResponse.AnomalyFlag> anomalies = new ArrayList<>();
            double confidence = 95.5;

            // Fetch user response value to compare and detect discrepancies
            Optional<AssessmentResponse> userResponseOpt = responseRepository
                    .findByAssessmentIdAndParameterParameterCode(
                            document.getAssessment().getId(),
                            document.getParameterCode()
                    );

            double userValue = userResponseOpt.map(AssessmentResponse::getEnteredValue).orElse(0.0);

            if ("EN-EFF-01".equalsIgnoreCase(document.getParameterCode())) {
                fields.put("billingPeriod", "June 2026");
                fields.put("kilowattHours", userValue); // Mock perfect match
                fields.put("meterId", "M-991223");
            } else if ("WT-CON-02".equalsIgnoreCase(document.getParameterCode())) {
                fields.put("billingPeriod", "June 2026");
                fields.put("kiloliters", userValue + 50.0); // Create discrepancy mismatch
                fields.put("meterId", "W-112233");
                
                anomalies.add(new AiAnalysisResponse.AnomalyFlag(
                        "DATA_MISMATCH",
                        "MEDIUM",
                        "Extracted bill quantity (350 kL) does not match reported input (" + userValue + " kL). Discrepancy: 50 kL"
                ));
                confidence = 82.4;
            }

            // Save AI result
            AiAnalysisResult result = AiAnalysisResult.builder()
                    .document(document)
                    .confidenceScore(confidence)
                    .status("SUCCESS")
                    .extractedTextJson(objectMapper.writeValueAsString(fields))
                    .anomalyFlagsJson(objectMapper.writeValueAsString(anomalies))
                    .build();

            aiRepository.save(result);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException("AI thread processing interrupted", e);
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON serialization error during AI mapping", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AiAnalysisResponse getAnalysisResult(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .filter(d -> d.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        AiAnalysisResult result = aiRepository.findByDocumentId(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("AiAnalysisResult", "documentId", documentId));

        try {
            Map<String, Object> fields = objectMapper.readValue(
                    result.getExtractedTextJson(), 
                    new TypeReference<Map<String, Object>>() {}
            );
            List<AiAnalysisResponse.AnomalyFlag> anomalies = objectMapper.readValue(
                    result.getAnomalyFlagsJson(), 
                    new TypeReference<List<AiAnalysisResponse.AnomalyFlag>>() {}
            );

            return new AiAnalysisResponse(
                    result.getId(),
                    document.getId(),
                    document.getFileName(),
                    document.getParameterCode(),
                    result.getConfidenceScore(),
                    result.getStatus(),
                    fields,
                    anomalies,
                    result.getAnalyzedAt()
            );
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON parsing error during DTO mapping", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiRecommendationResponse> generateRecommendations(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        List<AssessmentResponse> responses = responseRepository.findByAssessmentId(assessmentId);

        List<AiRecommendationResponse> recommendationsList = new ArrayList<>();
        for (AssessmentResponse resp : responses) {
            double maxScore = resp.getParameter().getMaxScore();
            double score = resp.getCalculatedPoints();
            double gap = maxScore - score;

            if (gap > 0) {
                List<String> advices = new ArrayList<>();
                if ("Energy Efficiency".equalsIgnoreCase(resp.getParameter().getPillarName())) {
                    advices.add("Upgrade to IE3/IE4 high-efficiency motors for all main pump units.");
                    advices.add("Install Variable Frequency Drives (VFDs) on air compressor setups.");
                    advices.add("Conduct a thermal heat-loss audit on steam distribution pipelines.");
                } else if ("Water Conservation".equalsIgnoreCase(resp.getParameter().getPillarName())) {
                    advices.add("Expand rainwater harvesting catchment pits to capture roof runoffs.");
                    advices.add("Install sub-meters at high-consumption cooling towers to track evaporation loss.");
                    advices.add("Evaluate the feasibility of a Zero Liquid Discharge (ZLD) purification system.");
                } else {
                    advices.add("Establish zero-waste-to-landfill partnerships with local authorized co-processors.");
                    advices.add("Implement segregation of hazardous vs non-hazardous waste at generation points.");
                }

                recommendationsList.add(new AiRecommendationResponse(
                        resp.getParameter().getPillarName(),
                        score,
                        maxScore,
                        gap,
                        advices
                ));
            }
        }

        return recommendationsList;
    }
}
