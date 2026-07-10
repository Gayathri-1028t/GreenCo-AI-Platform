package com.greenco.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FactoryUpdateRequest(
    @NotBlank(message = "Factory name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    String name,

    @NotBlank(message = "Sector type is required")
    @Size(max = 50, message = "Sector type cannot exceed 50 characters")
    String sectorType,

    @NotBlank(message = "Address is required")
    String address,

    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Latitude must be between -90 and 90")
    @Max(value = 90, message = "Latitude must be between -90 and 90")
    Double latitude,

    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Longitude must be between -180 and 180")
    @Max(value = 180, message = "Longitude must be between -180 and 180")
    Double longitude,

    @Min(value = 0, message = "Building area must be positive")
    Double buildingAreaSqm,

    @Min(value = 0, message = "Employee count must be positive")
    Integer employeeCount,

    @NotBlank(message = "Status is required")
    String status,

    String factoryCode,
    String logoUrl,
    String factoryType,
    String manufacturingCategory,
    String factoryHead,
    String email,
    String phone,
    Double annualProductionCapacity,
    String sustainabilityGrade
) {}
