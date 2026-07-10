package com.greenco.service;

import com.greenco.dto.AssessmentCreateRequest;
import com.greenco.dto.AssessmentResponseDto;
import com.greenco.dto.AssessmentSummaryResponse;
import com.greenco.dto.ParameterResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AssessmentService {
    Page<AssessmentSummaryResponse> getAllAssessments(Pageable pageable, Long factoryId, Long companyId, String status);
    AssessmentSummaryResponse getAssessmentById(Long id);
    List<ParameterResponseDto> getAssessmentResponses(Long id);
    AssessmentSummaryResponse createAssessment(AssessmentCreateRequest request);
    void saveResponses(Long id, AssessmentResponseDto responseDto);
    void submitAssessment(Long id);
    void deleteAssessment(Long id);
}
