package com.greenco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentUploadRequest(
    @NotNull(message = "Assessment ID is required")
    Long assessmentId,

    @NotBlank(message = "Parameter code is required")
    String parameterCode
) {}
