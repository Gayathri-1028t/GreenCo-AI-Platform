package com.greenco.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record AiAnalysisResponse(
    Long id,
    Long documentId,
    String fileName,
    String parameterCode,
    Double confidenceScore,
    String status,
    Map<String, Object> extractedFields,
    List<AnomalyFlag> anomalyFlags,
    LocalDateTime analyzedAt
) {
    public record AnomalyFlag(
        String flagCode,
        String severity, // HIGH, MEDIUM, LOW
        String message
    ) {}
}
