package com.greenco.service;

import com.greenco.dto.AiAnalysisResponse;
import com.greenco.dto.AiRecommendationResponse;

import java.util.List;

public interface AiService {
    void triggerDocumentAnalysis(Long documentId);
    AiAnalysisResponse getAnalysisResult(Long documentId);
    List<AiRecommendationResponse> generateRecommendations(Long assessmentId);
}
