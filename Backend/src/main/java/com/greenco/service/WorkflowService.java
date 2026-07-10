package com.greenco.service;

import com.greenco.dto.WorkflowHistoryResponse;
import com.greenco.dto.WorkflowTransitionRequest;
import com.greenco.entity.User;

import java.util.List;

public interface WorkflowService {
    void transitionAssessment(Long assessmentId, WorkflowTransitionRequest request, User actor);
    List<WorkflowHistoryResponse> getWorkflowHistory(Long assessmentId);
}
