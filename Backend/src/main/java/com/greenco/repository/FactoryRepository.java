package com.greenco.repository;

import com.greenco.entity.Factory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FactoryRepository extends JpaRepository<Factory, Long> {
    List<Factory> findByCompanyIdAndDeletedAtIsNull(Long companyId);
    List<Factory> findByName(String name);

    @Query("SELECT f FROM Factory f WHERE " +
           "f.deletedAt IS NULL AND " +
           "(:companyId IS NULL OR f.company.id = :companyId) AND " +
           "(:search IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.address) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:sectorType IS NULL OR f.sectorType = :sectorType) AND " +
           "(:status IS NULL OR f.status = :status)")
    Page<Factory> findFactoriesFiltered(
        @Param("companyId") Long companyId,
        @Param("search") String search,
        @Param("sectorType") String sectorType,
        @Param("status") String status,
        Pageable pageable
    );
}
