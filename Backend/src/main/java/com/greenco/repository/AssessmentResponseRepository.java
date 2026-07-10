package com.greenco.repository;

import com.greenco.entity.AssessmentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentResponseRepository extends JpaRepository<AssessmentResponse, Long> {
    List<AssessmentResponse> findByAssessmentId(Long assessmentId);
    Optional<AssessmentResponse> findByAssessmentIdAndParameterParameterCode(Long assessmentId, String parameterCode);
}
