package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.WorkflowHistoryResponse;
import com.greenco.dto.WorkflowTransitionRequest;
import com.greenco.entity.User;
import com.greenco.security.CustomUserDetails;
import com.greenco.service.WorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workflow")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping("/assessments/{id}/transition")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR')")
    public ResponseEntity<BaseResponse<Void>> transitionAssessment(
            @PathVariable Long id,
            @Valid @RequestBody WorkflowTransitionRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User actor = userDetails.getUser();
        workflowService.transitionAssessment(id, request, actor);
        return new ResponseEntity<>(BaseResponse.success(null, "Assessment transitioned successfully"), HttpStatus.OK);
    }

    @GetMapping("/assessments/{id}/history")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<List<WorkflowHistoryResponse>>> getWorkflowHistory(
            @PathVariable Long id) {
        List<WorkflowHistoryResponse> history = workflowService.getWorkflowHistory(id);
        return new ResponseEntity<>(BaseResponse.success(history), HttpStatus.OK);
    }
}
