package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.AiAnalysisResponse;
import com.greenco.dto.AiRecommendationResponse;
import com.greenco.service.AiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/documents/{id}/analyze")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Void>> triggerDocumentAnalysis(@PathVariable Long id) {
        aiService.triggerDocumentAnalysis(id);
        return new ResponseEntity<>(BaseResponse.success(null, "AI document analysis submitted successfully"), HttpStatus.ACCEPTED);
    }

    @GetMapping("/documents/{id}/analysis")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<AiAnalysisResponse>> getAnalysisResult(@PathVariable Long id) {
        AiAnalysisResponse response = aiService.getAnalysisResult(id);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }

    @GetMapping("/assessments/{id}/recommendations")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<List<AiRecommendationResponse>>> generateRecommendations(
            @PathVariable Long id) {
        List<AiRecommendationResponse> response = aiService.generateRecommendations(id);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }
}
