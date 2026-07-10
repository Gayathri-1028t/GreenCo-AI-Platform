package com.greenco.dto;

import java.util.List;

public record CopilotResponse(
    Double sustainabilityScore,
    Double aiReadiness,
    String carbonRisk,
    String esgRating,
    Double netZeroProgress,
    String complianceIndex,
    List<String> strengths,
    List<String> weaknesses,
    List<String> opportunities,
    List<String> risks,
    List<EsgForecastPoint> esgForecast,
    List<CarbonForecastPoint> carbonForecast,
    List<String> recommendations,
    String aiSummary
) {
    public record EsgForecastPoint(String year, Double actual, Double forecast) {}
    public record CarbonForecastPoint(String month, Double emissions) {}
}
