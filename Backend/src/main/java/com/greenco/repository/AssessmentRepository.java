package com.greenco.repository;

import com.greenco.entity.Assessment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByFactoryIdAndDeletedAtIsNull(Long factoryId);

    @Query("SELECT a FROM Assessment a WHERE " +
           "a.deletedAt IS NULL AND " +
           "(:factoryId IS NULL OR a.factory.id = :factoryId) AND " +
           "(:companyId IS NULL OR a.factory.company.id = :companyId) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Assessment> findAssessmentsFiltered(
        @Param("factoryId") Long factoryId,
        @Param("companyId") Long companyId,
        @Param("status") String status,
        Pageable pageable
    );
}
