package com.greenco.dto;

import java.time.LocalDate;

public record CertificateResponse(
    Long id,
    String companyName,
    String factoryName,
    String certificateNumber,
    String ratingLevel,
    Double scoreAchieved,
    LocalDate issueDate,
    LocalDate expiryDate,
    String status,
    String pdfUrl
) {}
