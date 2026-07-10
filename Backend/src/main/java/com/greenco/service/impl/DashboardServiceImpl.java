package com.greenco.service.impl;

import com.greenco.dto.DashboardSummaryResponse;
import com.greenco.entity.Assessment;
import com.greenco.entity.User;
import com.greenco.entity.WorkflowHistory;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.CompanyRepository;
import com.greenco.repository.FactoryRepository;
import com.greenco.repository.WorkflowHistoryRepository;
import com.greenco.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final CompanyRepository companyRepository;
    private final FactoryRepository factoryRepository;
    private final AssessmentRepository assessmentRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    public DashboardServiceImpl(CompanyRepository companyRepository,
                                FactoryRepository factoryRepository,
                                AssessmentRepository assessmentRepository,
                                WorkflowHistoryRepository workflowHistoryRepository) {
        this.companyRepository = companyRepository;
        this.factoryRepository = factoryRepository;
        this.assessmentRepository = assessmentRepository;
        this.workflowHistoryRepository = workflowHistoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(User actor) {
        boolean isCompany = actor.getRoles().stream()
                .anyMatch(r -> "ROLE_MANUFACTURING_COMPANY".equals(r.getName()));

        Long companyId = isCompany ? (actor.getCompanyId() != null ? actor.getCompanyId() : 1L) : null;

        // 1. Fetch counts
        long totalCompanies = companyRepository.count();
        // Since we are mocking pending values or checking database fields, we can count pending statuses
        long pendingOnboardings = companyRepository.findAll().stream()
                .filter(c -> "PENDING_APPROVAL".equalsIgnoreCase(c.getStatus()) && c.getDeletedAt() == null)
                .count();

        long totalFactories;
        if (companyId != null) {
            totalFactories = factoryRepository.findByCompanyIdAndDeletedAtIsNull(companyId).size();
        } else {
            totalFactories = factoryRepository.count();
        }

        // 2. Fetch assessment distribution
        List<Assessment> assessments;
        if (companyId != null) {
            assessments = assessmentRepository.findAssessmentsFiltered(null, companyId, null, null).getContent();
        } else {
            assessments = assessmentRepository.findAll().stream()
                    .filter(a -> a.getDeletedAt() == null)
                    .collect(Collectors.toList());
        }

        long activeAssessments = assessments.stream()
                .filter(a -> !"APPROVED".equalsIgnoreCase(a.getStatus()) && !"REJECTED".equalsIgnoreCase(a.getStatus()))
                .count();

        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("DRAFT", assessments.stream().filter(a -> "DRAFT".equalsIgnoreCase(a.getStatus())).count());
        statusDistribution.put("SUBMITTED", assessments.stream().filter(a -> "SUBMITTED".equalsIgnoreCase(a.getStatus())).count());
        statusDistribution.put("UNDER_TECHNICAL_REVIEW", assessments.stream().filter(a -> "UNDER_TECHNICAL_REVIEW".equalsIgnoreCase(a.getStatus())).count());
        statusDistribution.put("SITE_AUDIT", assessments.stream().filter(a -> "SITE_AUDIT".equalsIgnoreCase(a.getStatus())).count());
        statusDistribution.put("APPROVED", assessments.stream().filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus())).count());

        // 3. Dynamic Recent Activity Trail from database
        List<WorkflowHistory> histories;
        if (companyId != null) {
            histories = workflowHistoryRepository.findAll().stream()
                    .filter(h -> h.getAssessment().getFactory() != null && h.getAssessment().getFactory().getCompany() != null && companyId.equals(h.getAssessment().getFactory().getCompany().getId()))
                    .sorted((h1, h2) -> h2.getTransitionDate().compareTo(h1.getTransitionDate()))
                    .limit(10)
                    .collect(Collectors.toList());
        } else {
            histories = workflowHistoryRepository.findAll().stream()
                    .sorted((h1, h2) -> h2.getTransitionDate().compareTo(h1.getTransitionDate()))
                    .limit(10)
                    .collect(Collectors.toList());
        }

        List<DashboardSummaryResponse.RecentActivity> activities = histories.stream()
                .map(h -> new DashboardSummaryResponse.RecentActivity(
                        "Status: " + h.getToStatus().replace("_", " "),
                        "Assessment #" + h.getAssessment().getId() + " for " + h.getAssessment().getFactory().getName() + " transitioned" + (h.getComment() != null ? " (" + h.getComment() + ")" : ""),
                        h.getTransitionDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                ))
                .collect(Collectors.toList());

        if (activities.isEmpty()) {
            activities.add(new DashboardSummaryResponse.RecentActivity(
                    "System Initialized",
                    "Sustainability baseline monitoring and verification services active.",
                    java.time.LocalDateTime.now().minusHours(2).format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
            ));
        }

        return new DashboardSummaryResponse(
                totalCompanies,
                pendingOnboardings,
                totalFactories,
                activeAssessments,
                statusDistribution,
                activities
        );
    }
}
