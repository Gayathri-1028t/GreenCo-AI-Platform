package com.greenco.dto;

import java.time.LocalDateTime;

public record FactoryResponse(
    Long id,
    Long companyId,
    String companyName,
    String name,
    String sectorType,
    String address,
    Double latitude,
    Double longitude,
    Double buildingAreaSqm,
    Integer employeeCount,
    String status,
    String factoryCode,
    String logoUrl,
    String factoryType,
    String manufacturingCategory,
    String factoryHead,
    String email,
    String phone,
    Double annualProductionCapacity,
    String sustainabilityGrade,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
