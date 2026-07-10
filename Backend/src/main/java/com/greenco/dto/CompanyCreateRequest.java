package com.greenco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CompanyCreateRequest(
    @NotBlank(message = "Legal company name is required")
    @Size(max = 150, message = "Legal name cannot exceed 150 characters")
    String legalName,

    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    String registrationNumber,

    @NotBlank(message = "Tax ID is required")
    @Size(max = 50, message = "Tax ID cannot exceed 50 characters")
    String taxId,

    @NotBlank(message = "Headquarters address is required")
    String headquartersAddress,

    @Size(max = 100, message = "Website cannot exceed 100 characters")
    String website,

    String industry,
    String contactPerson,
    String contactEmail,
    String contactPhone,
    Integer employeeCount,
    Double annualRevenue,
    String logoUrl
) {}
