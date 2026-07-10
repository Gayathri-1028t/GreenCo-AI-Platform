package com.greenco.repository;

import com.greenco.entity.AssessmentParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssessmentParameterRepository extends JpaRepository<AssessmentParameter, Long> {
    Optional<AssessmentParameter> findByParameterCode(String parameterCode);
}
