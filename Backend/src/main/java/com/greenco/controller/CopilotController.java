package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.CopilotResponse;
import com.greenco.service.CopilotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/copilot")
public class CopilotController {

    private final CopilotService copilotService;

    public CopilotController(CopilotService copilotService) {
        this.copilotService = copilotService;
    }

    @GetMapping("/factory/{factoryId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<CopilotResponse>> getCopilotAnalysisByPath(@PathVariable Long factoryId) {
        CopilotResponse response = copilotService.getCopilotAnalysis(factoryId);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<CopilotResponse>> getCopilotAnalysisByQuery(@RequestParam(required = false) Long factoryId) {
        // Fallback to factory 1 if parameter is absent
        Long id = factoryId != null ? factoryId : 1L;
        CopilotResponse response = copilotService.getCopilotAnalysis(id);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }
}
