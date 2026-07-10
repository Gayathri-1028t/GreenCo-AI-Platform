package com.greenco.repository;

import com.greenco.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByLegalName(String legalName);
    boolean existsByLegalName(String legalName);
    boolean existsByRegistrationNumber(String registrationNumber);

    @Query("SELECT c FROM Company c WHERE " +
           "c.deletedAt IS NULL AND " +
           "(:search IS NULL OR LOWER(c.legalName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.registrationNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Company> findCompaniesFiltered(
        @Param("search") String search,
        @Param("status") String status,
        Pageable pageable
    );
}
