package com.greenco.repository;

import com.greenco.entity.FactoryBaseline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactoryBaselineRepository extends JpaRepository<FactoryBaseline, Long> {
    List<FactoryBaseline> findByFactoryId(Long factoryId);
    Optional<FactoryBaseline> findByFactoryIdAndBaselineYear(Long factoryId, Integer baselineYear);
}
