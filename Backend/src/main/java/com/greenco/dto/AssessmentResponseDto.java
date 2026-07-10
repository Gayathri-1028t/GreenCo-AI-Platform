package com.greenco.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AssessmentResponseDto(
    @NotEmpty(message = "Responses list cannot be empty")
    @Valid
    List<ParameterResponseInput> responses
) {
    public record ParameterResponseInput(
        @NotEmpty(message = "Parameter code is required")
        String parameterCode,

        @NotNull(message = "Value is required")
        Double enteredValue
    ) {}
}
