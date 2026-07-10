package com.greenco.dto;

public record FacilityReportResponse(
    Long factoryId,
    String factoryName,
    Integer baselineYear,
    
    // Electricity
    Double electricityBaselineKwh,
    Double electricityActualKwh,
    Double electricitySavedKwh,
    Double electricitySavedPct,
    
    // Water
    Double waterBaselineKl,
    Double waterActualKl,
    Double waterSavedKl,
    Double waterSavedPct,
    
    // Waste
    Double wasteBaselineMt,
    Double wasteActualMt,
    Double wasteSavedMt,
    Double wasteSavedPct,
    
    // ESG/Carbon impact
    Double co2EmissionsReducedMt
) {}
