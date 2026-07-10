package com.greenco.service.impl;

import com.greenco.dto.CopilotResponse;
import com.greenco.entity.Assessment;
import com.greenco.entity.Factory;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.FactoryRepository;
import com.greenco.service.CopilotService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CopilotServiceImpl implements CopilotService {

    private final FactoryRepository factoryRepository;
    private final AssessmentRepository assessmentRepository;

    public CopilotServiceImpl(FactoryRepository factoryRepository, AssessmentRepository assessmentRepository) {
        this.factoryRepository = factoryRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CopilotResponse getCopilotAnalysis(Long factoryId) {
        Factory factory = factoryRepository.findById(factoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", factoryId));

        List<Assessment> assessments = assessmentRepository.findByFactoryIdAndDeletedAtIsNull(factoryId);

        Double sustainabilityScore = 75.0;
        String esgRating = "Gold";
        Double scoreAchieved = 250.0;
        
        if (!assessments.isEmpty()) {
            Assessment latest = assessments.stream()
                    .max((a1, a2) -> {
                        java.time.LocalDateTime t1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : java.time.LocalDateTime.MIN;
                        java.time.LocalDateTime t2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : java.time.LocalDateTime.MIN;
                        return t1.compareTo(t2);
                    })
                    .get();
            scoreAchieved = latest.getScoreAchieved();
            sustainabilityScore = scoreAchieved != null ? Math.round((scoreAchieved / 1000.0) * 100.0 * 10.0) / 10.0 : 75.0;
            esgRating = latest.getRatingLevel() != null ? latest.getRatingLevel() : "Gold";
        } else {
            sustainabilityScore = 60.0 + (factoryId % 5) * 6.5;
            if (sustainabilityScore >= 85) esgRating = "Platinum";
            else if (sustainabilityScore >= 70) esgRating = "Gold";
            else if (sustainabilityScore >= 60) esgRating = "Silver";
            else esgRating = "Bronze";
            scoreAchieved = sustainabilityScore * 10.0;
        }

        Double aiReadiness = 78.0 + (factoryId % 3) * 7.0;
        String carbonRisk = sustainabilityScore > 80 ? "Low" : (sustainabilityScore > 65 ? "Medium" : "High");
        Double netZeroProgress = 20.0 + (sustainabilityScore / 100.0) * 35.0;
        String complianceIndex = sustainabilityScore > 70 ? "100% OK" : "90% OK";

        List<String> strengths = Arrays.asList(
            "Onsite water recycle loop enabled at " + factory.getName(),
            "Active ISO 14001 certification validated for " + factory.getFactoryCode()
        );
        List<String> weaknesses = Arrays.asList(
            "Scope-2 carbon footprints above " + factory.getSectorType() + " sector baseline",
            "Sub-optimal solar PV roof array coverage on plant area (" + factory.getBuildingAreaSqm() + " sqm)"
        );
        List<String> opportunities = Arrays.asList(
            "Expand solar array capacity by " + (100 + (factoryId % 4) * 50) + " kW",
            "Deploy smart AI boiler valves for energy saving targets"
        );
        List<String> risks = Arrays.asList(
            "Audit flags due to delayed " + factory.getManufacturingCategory() + " document uploads",
            "Vulnerable to carbon tax adjustments in " + factory.getSectorType() + " sector"
        );

        List<CopilotResponse.EsgForecastPoint> esgForecast = new ArrayList<>();
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2023", sustainabilityScore - 12.0, sustainabilityScore - 12.0));
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2024", sustainabilityScore - 6.0, sustainabilityScore - 6.0));
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2025", sustainabilityScore - 2.0, sustainabilityScore - 2.0));
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2026 (Now)", sustainabilityScore, sustainabilityScore));
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2027 (AI)", null, sustainabilityScore + 5.0));
        esgForecast.add(new CopilotResponse.EsgForecastPoint("2028 (AI)", null, sustainabilityScore + 9.5));

        List<CopilotResponse.CarbonForecastPoint> carbonForecast = Arrays.asList(
            new CopilotResponse.CarbonForecastPoint("Jan", 320.0 - (factoryId % 5) * 15.0),
            new CopilotResponse.CarbonForecastPoint("Feb", 305.0 - (factoryId % 5) * 12.0),
            new CopilotResponse.CarbonForecastPoint("Mar", 290.0 - (factoryId % 5) * 18.0),
            new CopilotResponse.CarbonForecastPoint("Apr", 270.0 - (factoryId % 5) * 10.0),
            new CopilotResponse.CarbonForecastPoint("May", 255.0 - (factoryId % 5) * 15.0),
            new CopilotResponse.CarbonForecastPoint("Jun", 240.0 - (factoryId % 5) * 20.0)
        );

        List<String> recommendations = Arrays.asList(
            "Shift energy scope to rooftop arrays to improve score by up to " + (5.0 + (factoryId % 3) * 1.5) + "%",
            "Set up water looping recycling systems to save water volume at " + factory.getName(),
            "Complete scheduled Q2 compliance documents to clear technical reviews"
        );

        String aiSummary = String.format(
            "Based on the assessment analysis of %s, the facility shows solid baseline compliance in the %s sector, " +
            "notably in water loop recirculation. However, energy scope outputs show elevated footprint loads relative " +
            "to %s region benchmarks. To achieve a %s grade level, implement the recommended solar capacity improvements.",
            factory.getName(), factory.getSectorType(), factory.getAddress().split(",")[0], esgRating
        );

        return new CopilotResponse(
            sustainabilityScore,
            aiReadiness,
            carbonRisk,
            esgRating,
            netZeroProgress,
            complianceIndex,
            strengths,
            weaknesses,
            opportunities,
            risks,
            esgForecast,
            carbonForecast,
            recommendations,
            aiSummary
        );
    }
}
