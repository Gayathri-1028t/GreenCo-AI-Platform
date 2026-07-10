package com.greenco.service;

import com.greenco.dto.FactoryCreateRequest;
import com.greenco.dto.FactoryResponse;
import com.greenco.dto.FactoryUpdateRequest;
import com.greenco.dto.FactoryBaselineDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FactoryService {
    Page<FactoryResponse> getAllFactories(Pageable pageable, Long companyId, String search, String sectorType, String status);
    List<FactoryResponse> getFactoriesByCompany(Long companyId);
    FactoryResponse getFactoryById(Long id);
    FactoryResponse createFactory(FactoryCreateRequest request);
    FactoryResponse updateFactory(Long id, FactoryUpdateRequest request);
    FactoryBaselineDto getFactoryBaseline(Long factoryId, Integer year);
    FactoryBaselineDto saveFactoryBaseline(Long factoryId, FactoryBaselineDto baselineDto);
    void deleteFactory(Long id);
}
