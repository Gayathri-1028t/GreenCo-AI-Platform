package com.greenco.dto;

import java.util.List;

public record AiRecommendationResponse(
    String pillarName,
    Double currentScore,
    Double maxScore,
    Double gapPoints,
    List<String> recommendations
) {}
