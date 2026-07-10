package com.greenco.dto;

import java.time.LocalDateTime;

public record DocumentResponse(
    Long id,
    Long assessmentId,
    String parameterCode,
    String fileName,
    Long fileSizeBytes,
    String mimeType,
    String status,
    String s3BucketKey,
    LocalDateTime createdAt
) {}
