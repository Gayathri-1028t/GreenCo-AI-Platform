package com.greenco.dto;

import java.time.LocalDateTime;

public record CompanyResponse(
    Long id,
    String legalName,
    String registrationNumber,
    String taxId,
    String status,
    String headquartersAddress,
    String website,
    String industry,
    String contactPerson,
    String contactEmail,
    String contactPhone,
    Integer employeeCount,
    Double annualRevenue,
    String logoUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
