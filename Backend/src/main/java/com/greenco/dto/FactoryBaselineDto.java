package com.greenco.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FactoryBaselineDto(
    @NotNull(message = "Baseline year is required")
    @Min(value = 2000, message = "Baseline year must be after 2000")
    Integer baselineYear,

    @NotNull(message = "Electricity baseline consumption is required")
    @Min(value = 0, message = "Consumption value must be positive")
    Double electricityConsumptionKwh,

    @NotNull(message = "Water baseline consumption is required")
    @Min(value = 0, message = "Consumption value must be positive")
    Double waterConsumptionKl,

    @NotNull(message = "Waste baseline generated is required")
    @Min(value = 0, message = "Waste value must be positive")
    Double wasteGeneratedMt
) {}
