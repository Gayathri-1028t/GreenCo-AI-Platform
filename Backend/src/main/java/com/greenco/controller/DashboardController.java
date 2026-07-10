package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.DashboardSummaryResponse;
import com.greenco.entity.User;
import com.greenco.security.CustomUserDetails;
import com.greenco.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<DashboardSummaryResponse>> getSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User actor = userDetails.getUser();
        DashboardSummaryResponse response = dashboardService.getSummary(actor);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }
}
