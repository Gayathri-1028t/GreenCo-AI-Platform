package com.greenco.service.impl;

import com.greenco.dto.FactoryBaselineDto;
import com.greenco.dto.FactoryCreateRequest;
import com.greenco.dto.FactoryResponse;
import com.greenco.dto.FactoryUpdateRequest;
import com.greenco.entity.Company;
import com.greenco.entity.Factory;
import com.greenco.entity.FactoryBaseline;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.CompanyRepository;
import com.greenco.repository.FactoryBaselineRepository;
import com.greenco.repository.FactoryRepository;
import com.greenco.service.FactoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FactoryServiceImpl implements FactoryService {

    private final FactoryRepository factoryRepository;
    private final FactoryBaselineRepository factoryBaselineRepository;
    private final CompanyRepository companyRepository;

    public FactoryServiceImpl(FactoryRepository factoryRepository,
                              FactoryBaselineRepository factoryBaselineRepository,
                              CompanyRepository companyRepository) {
        this.factoryRepository = factoryRepository;
        this.factoryBaselineRepository = factoryBaselineRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FactoryResponse> getAllFactories(Pageable pageable, Long companyId, String search, String sectorType, String status) {
        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();
        String sectorParam = (sectorType == null || sectorType.trim().isEmpty()) ? null : sectorType.trim();
        String statusParam = (status == null || status.trim().isEmpty()) ? null : status.trim();

        return factoryRepository.findFactoriesFiltered(companyId, searchParam, sectorParam, statusParam, pageable)
                .map(this::mapToFactoryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactoryResponse> getFactoriesByCompany(Long companyId) {
        return factoryRepository.findByCompanyIdAndDeletedAtIsNull(companyId).stream()
                .map(this::mapToFactoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FactoryResponse getFactoryById(Long id) {
        Factory factory = factoryRepository.findById(id)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", id));
        return mapToFactoryResponse(factory);
    }

    @Override
    @Transactional
    public FactoryResponse createFactory(FactoryCreateRequest request) {
        Company company = companyRepository.findById(request.companyId())
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.companyId()));

        Factory factory = Factory.builder()
                .company(company)
                .name(request.name())
                .sectorType(request.sectorType())
                .address(request.address())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .buildingAreaSqm(request.buildingAreaSqm())
                .employeeCount(request.employeeCount())
                .factoryCode(request.factoryCode())
                .logoUrl(request.logoUrl())
                .factoryType(request.factoryType())
                .manufacturingCategory(request.manufacturingCategory())
                .factoryHead(request.factoryHead())
                .email(request.email())
                .phone(request.phone())
                .annualProductionCapacity(request.annualProductionCapacity())
                .sustainabilityGrade(request.sustainabilityGrade())
                .status("ACTIVE")
                .build();

        Factory savedFactory = factoryRepository.save(factory);

        // Save initial baseline configurations
        if (request.baseline() != null) {
            saveFactoryBaseline(savedFactory.getId(), request.baseline());
        }

        return mapToFactoryResponse(savedFactory);
    }

    @Override
    @Transactional
    public FactoryResponse updateFactory(Long id, FactoryUpdateRequest request) {
        Factory factory = factoryRepository.findById(id)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", id));

        factory.setName(request.name());
        factory.setSectorType(request.sectorType());
        factory.setAddress(request.address());
        factory.setLatitude(request.latitude());
        factory.setLongitude(request.longitude());
        factory.setBuildingAreaSqm(request.buildingAreaSqm());
        factory.setEmployeeCount(request.employeeCount());
        factory.setStatus(request.status());
        factory.setFactoryCode(request.factoryCode());
        factory.setLogoUrl(request.logoUrl());
        factory.setFactoryType(request.factoryType());
        factory.setManufacturingCategory(request.manufacturingCategory());
        factory.setFactoryHead(request.factoryHead());
        factory.setEmail(request.email());
        factory.setPhone(request.phone());
        factory.setAnnualProductionCapacity(request.annualProductionCapacity());
        factory.setSustainabilityGrade(request.sustainabilityGrade());

        return mapToFactoryResponse(factoryRepository.save(factory));
    }

    @Override
    @Transactional(readOnly = true)
    public FactoryBaselineDto getFactoryBaseline(Long factoryId, Integer year) {
        FactoryBaseline baseline = factoryBaselineRepository.findByFactoryIdAndBaselineYear(factoryId, year)
                .orElseThrow(() -> new ResourceNotFoundException("FactoryBaseline", "year", year));
        return mapToBaselineDto(baseline);
    }

    @Override
    @Transactional
    public FactoryBaselineDto saveFactoryBaseline(Long factoryId, FactoryBaselineDto baselineDto) {
        Factory factory = factoryRepository.findById(factoryId)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", factoryId));

        Optional<FactoryBaseline> existingBaseline = factoryBaselineRepository
                .findByFactoryIdAndBaselineYear(factoryId, baselineDto.baselineYear());

        FactoryBaseline baseline;
        if (existingBaseline.isPresent()) {
            baseline = existingBaseline.get();
            baseline.setElectricityConsumptionKwh(baselineDto.electricityConsumptionKwh());
            baseline.setWaterConsumptionKl(baselineDto.waterConsumptionKl());
            baseline.setWasteGeneratedMt(baselineDto.wasteGeneratedMt());
        } else {
            baseline = FactoryBaseline.builder()
                    .factory(factory)
                    .baselineYear(baselineDto.baselineYear())
                    .electricityConsumptionKwh(baselineDto.electricityConsumptionKwh())
                    .waterConsumptionKl(baselineDto.waterConsumptionKl())
                    .wasteGeneratedMt(baselineDto.wasteGeneratedMt())
                    .build();
        }

        return mapToBaselineDto(factoryBaselineRepository.save(baseline));
    }

    @Override
    @Transactional
    public void deleteFactory(Long id) {
        Factory factory = factoryRepository.findById(id)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Factory", "id", id));

        // Soft delete
        factory.setDeletedAt(LocalDateTime.now());
        factory.setStatus("INACTIVE");
        factoryRepository.save(factory);
    }

    private FactoryResponse mapToFactoryResponse(Factory factory) {
        return new FactoryResponse(
                factory.getId(),
                factory.getCompany().getId(),
                factory.getCompany().getLegalName(),
                factory.getName(),
                factory.getSectorType(),
                factory.getAddress(),
                factory.getLatitude(),
                factory.getLongitude(),
                factory.getBuildingAreaSqm(),
                factory.getEmployeeCount(),
                factory.getStatus(),
                factory.getFactoryCode(),
                factory.getLogoUrl(),
                factory.getFactoryType(),
                factory.getManufacturingCategory(),
                factory.getFactoryHead(),
                factory.getEmail(),
                factory.getPhone(),
                factory.getAnnualProductionCapacity(),
                factory.getSustainabilityGrade(),
                factory.getCreatedAt(),
                factory.getUpdatedAt()
        );
    }

    private FactoryBaselineDto mapToBaselineDto(FactoryBaseline baseline) {
        return new FactoryBaselineDto(
                baseline.getBaselineYear(),
                baseline.getElectricityConsumptionKwh(),
                baseline.getWaterConsumptionKl(),
                baseline.getWasteGeneratedMt()
        );
    }
}
