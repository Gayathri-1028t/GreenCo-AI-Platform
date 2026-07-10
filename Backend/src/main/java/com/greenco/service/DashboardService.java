package com.greenco.service;

import com.greenco.dto.DashboardSummaryResponse;
import com.greenco.entity.User;

public interface DashboardService {
    DashboardSummaryResponse getSummary(User actor);
}
