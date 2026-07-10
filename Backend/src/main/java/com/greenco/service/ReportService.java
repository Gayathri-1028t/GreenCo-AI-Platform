package com.greenco.service;

import com.greenco.dto.FacilityReportResponse;
import java.io.ByteArrayInputStream;

public interface ReportService {
    FacilityReportResponse generateFacilityReport(Long factoryId);
    ByteArrayInputStream exportFacilityReportCsv(Long factoryId);
}
