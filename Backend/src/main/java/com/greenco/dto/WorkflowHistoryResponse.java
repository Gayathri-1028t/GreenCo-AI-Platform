package com.greenco.dto;

import java.time.LocalDateTime;

public record WorkflowHistoryResponse(
    Long id,
    Long assessmentId,
    String fromStatus,
    String toStatus,
    String assignedToName,
    String comment,
    LocalDateTime transitionDate
) {}
