package com.greenco.repository;

import com.greenco.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByCompanyId(Long companyId);
    Optional<Certificate> findByAssessmentId(Long assessmentId);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    @Query("SELECT c FROM Certificate c WHERE " +
           "(:companyId IS NULL OR c.company.id = :companyId) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Certificate> findCertificatesFiltered(
        @Param("companyId") Long companyId,
        @Param("status") String status,
        Pageable pageable
    );
}
