package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.AssessmentCreateRequest;
import com.greenco.dto.AssessmentResponseDto;
import com.greenco.dto.AssessmentSummaryResponse;
import com.greenco.dto.ParameterResponseDto;
import com.greenco.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Page<AssessmentSummaryResponse>>> getAllAssessments(
            @PageableDefault(sort = "id") Pageable pageable,
            @RequestParam(required = false) Long factoryId,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String status) {
        Page<AssessmentSummaryResponse> assessments = assessmentService.getAllAssessments(pageable, factoryId, companyId, status);
        return new ResponseEntity<>(BaseResponse.success(assessments), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<AssessmentSummaryResponse>> getAssessmentById(@PathVariable Long id) {
        AssessmentSummaryResponse assessment = assessmentService.getAssessmentById(id);
        return new ResponseEntity<>(BaseResponse.success(assessment), HttpStatus.OK);
    }

    @GetMapping("/{id}/responses")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<List<ParameterResponseDto>>> getAssessmentResponses(@PathVariable Long id) {
        List<ParameterResponseDto> responses = assessmentService.getAssessmentResponses(id);
        return new ResponseEntity<>(BaseResponse.success(responses), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<AssessmentSummaryResponse>> createAssessment(@Valid @RequestBody AssessmentCreateRequest request) {
        AssessmentSummaryResponse assessment = assessmentService.createAssessment(request);
        return new ResponseEntity<>(BaseResponse.success(assessment, "Assessment initialized successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/responses")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Void>> saveResponses(
            @PathVariable Long id,
            @Valid @RequestBody AssessmentResponseDto responseDto) {
        assessmentService.saveResponses(id, responseDto);
        return new ResponseEntity<>(BaseResponse.success(null, "Responses saved successfully"), HttpStatus.OK);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Void>> submitAssessment(@PathVariable Long id) {
        assessmentService.submitAssessment(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Assessment submitted successfully"), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<BaseResponse<Void>> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Assessment cancelled successfully"), HttpStatus.OK);
    }
}
