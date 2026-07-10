package com.greenco.repository;

import com.greenco.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByAssessmentIdAndDeletedAtIsNull(Long assessmentId);
    List<Document> findByAssessmentIdAndParameterCodeAndDeletedAtIsNull(Long assessmentId, String parameterCode);
    Optional<Document> findByIdAndDeletedAtIsNull(Long id);
}
