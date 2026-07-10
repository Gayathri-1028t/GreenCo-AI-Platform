package com.greenco.dto;

public record ParameterResponseDto(
    String parameterCode,
    String description,
    String pillarName,
    Double enteredValue,
    Double calculatedPoints,
    Double maxScore,
    String auditorComment
) {}
