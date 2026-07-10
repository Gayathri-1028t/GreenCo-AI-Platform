package com.greenco.dto;

import java.util.List;
import java.util.Map;

public record DashboardSummaryResponse(
    long totalCompanies,
    long pendingOnboardings,
    long totalFactories,
    long activeAssessments,
    Map<String, Long> statusDistribution,
    List<RecentActivity> recentActivities
) {
    public record RecentActivity(
        String title,
        String description,
        String timestamp
    ) {}
}
