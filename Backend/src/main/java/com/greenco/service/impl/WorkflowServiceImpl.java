package com.greenco.service.impl;

import com.greenco.dto.WorkflowHistoryResponse;
import com.greenco.dto.WorkflowTransitionRequest;
import com.greenco.entity.Assessment;
import com.greenco.entity.User;
import com.greenco.entity.WorkflowHistory;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.WorkflowHistoryRepository;
import com.greenco.service.CertificateService;
import com.greenco.service.WorkflowService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowHistoryRepository historyRepository;
    private final AssessmentRepository assessmentRepository;
    private final CertificateService certificateService;

    public WorkflowServiceImpl(WorkflowHistoryRepository historyRepository,
                               AssessmentRepository assessmentRepository,
                               @Lazy CertificateService certificateService) {
        this.historyRepository = historyRepository;
        this.assessmentRepository = assessmentRepository;
        this.certificateService = certificateService;
    }

    @Override
    @Transactional
    public void transitionAssessment(Long assessmentId, WorkflowTransitionRequest request, User actor) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        String fromStatus = assessment.getStatus();
        String toStatus = request.toStatus().toUpperCase();

        // 1. Validate State Machine Transitions
        validateTransition(fromStatus, toStatus, actor);

        // 2. Update Assessment Status
        assessment.setStatus(toStatus);
        assessmentRepository.save(assessment);

        // 3. Log Workflow History
        WorkflowHistory history = WorkflowHistory.builder()
                .assessment(assessment)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .assignedTo(actor)
                .comment(request.comment())
                .build();

        historyRepository.save(history);

        // 4. Automatically issue certificate if state transitioned to APPROVED
        if ("APPROVED".equals(toStatus)) {
            certificateService.issueCertificate(assessmentId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkflowHistoryResponse> getWorkflowHistory(Long assessmentId) {
        // Confirm assessment exists
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new ResourceNotFoundException("Assessment", "id", assessmentId);
        }

        return historyRepository.findByAssessmentIdOrderByTransitionDateDesc(assessmentId).stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    private void validateTransition(String from, String to, User actor) {
        // Admin overrides all restrictions
        boolean isAdmin = actor.getRoles().stream()
                .anyMatch(r -> "ROLE_ADMIN".equals(r.getName()) || "ROLE_SUPER_ADMIN".equals(r.getName()));

        boolean isCoordinator = actor.getRoles().stream()
                .anyMatch(r -> "ROLE_GREENCO_COORDINATOR".equals(r.getName()));

        boolean isAssessor = actor.getRoles().stream()
                .anyMatch(r -> "ROLE_GREENCO_ASSESSOR".equals(r.getName()));

        if ("DRAFT".equals(from) && "SUBMITTED".equals(to)) {
            // Checked by controller role guards (MANUFACTURING_COMPANY)
            return;
        }

        if ("SUBMITTED".equals(from) && "UNDER_TECHNICAL_REVIEW".equals(to)) {
            if (!isAdmin && !isCoordinator) {
                throw new BusinessException("Only GreenCo Coordinators can start the Technical Review process");
            }
            return;
        }

        if ("UNDER_TECHNICAL_REVIEW".equals(from) && "SITE_AUDIT".equals(to)) {
            if (!isAdmin && !isAssessor) {
                throw new BusinessException("Only assigned GreenCo Assessors can schedule a Site Audit");
            }
            return;
        }

        if ("SITE_AUDIT".equals(from) && ("APPROVED".equals(to) || "REJECTED".equals(to))) {
            if (!isAdmin && !isAssessor) {
                throw new BusinessException("Only assigned GreenCo Assessors can Approve or Reject a Rating request");
            }
            return;
        }

        throw new BusinessException("Invalid workflow status transition from " + from + " to " + to);
    }

    private WorkflowHistoryResponse mapToHistoryResponse(WorkflowHistory history) {
        String actorName = history.getAssignedTo() != null 
                ? history.getAssignedTo().getFirstName() + " " + history.getAssignedTo().getLastName()
                : "System";

        return new WorkflowHistoryResponse(
                history.getId(),
                history.getAssessment().getId(),
                history.getFromStatus(),
                history.getToStatus(),
                actorName,
                history.getComment(),
                history.getTransitionDate()
        );
    }
}
