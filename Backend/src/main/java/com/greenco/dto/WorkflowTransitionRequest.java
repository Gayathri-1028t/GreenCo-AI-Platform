package com.greenco.dto;

import jakarta.validation.constraints.NotBlank;

public record WorkflowTransitionRequest(
    @NotBlank(message = "Target status is required")
    String toStatus,

    String comment
) {}
