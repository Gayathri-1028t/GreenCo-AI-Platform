package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.FacilityReportResponse;
import com.greenco.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/facility/{factoryId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FacilityReportResponse>> getFacilityReport(@PathVariable Long factoryId) {
        FacilityReportResponse response = reportService.generateFacilityReport(factoryId);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }

    @GetMapping("/facility/{factoryId}/export")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<Resource> exportFacilityReportCsv(@PathVariable Long factoryId) {
        ByteArrayInputStream csvStream = reportService.exportFacilityReportCsv(factoryId);
        InputStreamResource file = new InputStreamResource(csvStream);

        String filename = "sustainability-report-plant-" + factoryId + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }
}
