package com.greenco.dto;

import java.time.LocalDateTime;

public record AssessmentSummaryResponse(
    Long id,
    Long factoryId,
    String factoryName,
    String status,
    String ratingVersion,
    Double scoreAchieved,
    String ratingLevel,
    LocalDateTime submittedAt,
    LocalDateTime createdAt,
    Long companyId,
    String companyName
) {}
