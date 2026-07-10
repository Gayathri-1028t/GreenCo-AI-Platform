package com.greenco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssessmentCreateRequest(
    @NotNull(message = "Factory ID is required")
    Long factoryId,

    @NotBlank(message = "Rating version is required")
    String ratingVersion
) {}
