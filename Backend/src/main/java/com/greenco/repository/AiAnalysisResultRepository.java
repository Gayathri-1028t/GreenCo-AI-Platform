package com.greenco.repository;

import com.greenco.entity.AiAnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiAnalysisResultRepository extends JpaRepository<AiAnalysisResult, Long> {
    Optional<AiAnalysisResult> findByDocumentId(Long documentId);
}
