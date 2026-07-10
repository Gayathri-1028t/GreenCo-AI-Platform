package com.greenco.service.impl;

import com.greenco.dto.AssessmentCreateRequest;
import com.greenco.dto.AssessmentResponseDto;
import com.greenco.dto.AssessmentSummaryResponse;
import com.greenco.dto.ParameterResponseDto;
import com.greenco.entity.Assessment;
import com.greenco.entity.AssessmentParameter;
import com.greenco.entity.AssessmentResponse;
import com.greenco.entity.Factory;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AssessmentParameterRepository;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.AssessmentResponseRepository;
import com.greenco.repository.FactoryRepository;
import com.greenco.service.AssessmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final AssessmentParameterRepository parameterRepository;
    private final FactoryRepository factoryRepository;

    public AssessmentServiceImpl(AssessmentRepository assessmentRepository,
                                 AssessmentResponseRepository responseRepository,
                                 AssessmentParameterRepository parameterRepository,
                                 FactoryRepository factoryRepository) {
        this.assessmentRepository = assessmentRepository;
        this.responseRepository = responseRepository;
        this.parameterRepository = parameterRepository;
        this.factoryRepository = factoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssessmentSummaryResponse> getAllAssessments(Pageable pageable, Long factoryId, Long companyId, String status) {
        String statusParam = (status == null || status.trim().isEmpty()) ? null : status.trim();
        return assessmentRepository.findAssessmentsFiltered(factoryId, companyId, statusParam, pageable)
                .map(this::mapToSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentSummaryResponse getAssessmentById(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));
        return mapToSummaryResponse(assessment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParameterResponseDto> getAssessmentResponses(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        List<AssessmentParameter> parameters = parameterRepository.findAll();
        List<AssessmentResponse> existingResponses = responseRepository.findByAssessmentId(id);
        
        Map<String, AssessmentResponse> responseMap = existingResponses.stream()
                .collect(Collectors.toMap(r -> r.getParameter().getParameterCode(), r -> r));

        List<ParameterResponseDto> dtos = new ArrayList<>();
        for (AssessmentParameter param : parameters) {
            AssessmentResponse resp = responseMap.get(param.getParameterCode());
            dtos.add(new ParameterResponseDto(
                    param.getParameterCode(),
                    param.getDescription(),
                    param.getPillarName(),
                    resp != null ? resp.getEnteredValue() : 0.0,
                    resp != null ? resp.getCalculatedPoints() : 0.0,
                    param.getMaxScore(),
                    resp != null ? resp.getAuditorComment() : null
            ));
        }

        return dtos;
    }

    @Override
    @Transactional
    public AssessmentSummaryResponse createAssessment(AssessmentCreateRequest request) {
        Factory factory = factoryRepository.findById(request.factoryId())
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", request.factoryId()));

        Assessment assessment = Assessment.builder()
                .factory(factory)
                .ratingVersion(request.ratingVersion())
                .status("DRAFT")
                .scoreAchieved(0.0)
                .build();

        return mapToSummaryResponse(assessmentRepository.save(assessment));
    }

    @Override
    @Transactional
    public void saveResponses(Long id, AssessmentResponseDto responseDto) {
        Assessment assessment = assessmentRepository.findById(id)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        if (!"DRAFT".equalsIgnoreCase(assessment.getStatus())) {
            throw new BusinessException("Assessment is locked. Responses cannot be modified in " + assessment.getStatus() + " state.");
        }

        double totalPoints = 0.0;

        for (AssessmentResponseDto.ParameterResponseInput input : responseDto.responses()) {
            AssessmentParameter parameter = parameterRepository.findByParameterCode(input.parameterCode())
                    .orElseThrow(() -> new ResourceNotFoundException("AssessmentParameter", "code", input.parameterCode()));

            // Simple rating scoring calculation: normalize input values (maxing points at parameter cap)
            double points = Math.min((input.enteredValue() / 100.0) * parameter.getMaxScore(), parameter.getMaxScore());
            points = Math.round(points * 100.0) / 100.0; // round to 2 decimal places

            Optional<AssessmentResponse> existingResponse = responseRepository
                    .findByAssessmentIdAndParameterParameterCode(id, input.parameterCode());

            AssessmentResponse response;
            if (existingResponse.isPresent()) {
                response = existingResponse.get();
                response.setEnteredValue(input.enteredValue());
                response.setCalculatedPoints(points);
            } else {
                response = AssessmentResponse.builder()
                        .assessment(assessment)
                        .parameter(parameter)
                        .enteredValue(input.enteredValue())
                        .calculatedPoints(points)
                        .build();
            }

            responseRepository.save(response);
            totalPoints += points;
        }

        assessment.setScoreAchieved(Math.round(totalPoints * 100.0) / 100.0);
        assessmentRepository.save(assessment);
    }

    @Override
    @Transactional
    public void submitAssessment(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        if (!"DRAFT".equalsIgnoreCase(assessment.getStatus())) {
            throw new BusinessException("Only DRAFT assessments can be submitted");
        }

        assessment.setStatus("SUBMITTED");
        assessment.setSubmittedAt(LocalDateTime.now());
        assessmentRepository.save(assessment);
    }

    @Override
    @Transactional
    public void deleteAssessment(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        // Soft delete
        assessment.setDeletedAt(LocalDateTime.now());
        assessment.setStatus("INACTIVE");
        assessmentRepository.save(assessment);
    }

    private AssessmentSummaryResponse mapToSummaryResponse(Assessment assessment) {
        return new AssessmentSummaryResponse(
                assessment.getId(),
                assessment.getFactory().getId(),
                assessment.getFactory().getName(),
                assessment.getStatus(),
                assessment.getRatingVersion(),
                assessment.getScoreAchieved(),
                assessment.getRatingLevel(),
                assessment.getSubmittedAt(),
                assessment.getCreatedAt(),
                assessment.getFactory().getCompany() != null ? assessment.getFactory().getCompany().getId() : null,
                assessment.getFactory().getCompany() != null ? assessment.getFactory().getCompany().getLegalName() : null
        );
    }
}
