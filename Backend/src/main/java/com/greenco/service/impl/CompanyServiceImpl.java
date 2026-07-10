package com.greenco.service.impl;

import com.greenco.dto.CompanyCreateRequest;
import com.greenco.dto.CompanyResponse;
import com.greenco.dto.CompanyUpdateRequest;
import com.greenco.entity.Company;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.CompanyRepository;
import com.greenco.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> getAllCompanies(Pageable pageable, String search, String status) {
        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();
        String statusParam = (status == null || status.trim().isEmpty()) ? null : status.trim();
        
        return companyRepository.findCompaniesFiltered(searchParam, statusParam, pageable)
                .map(this::mapToCompanyResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return mapToCompanyResponse(company);
    }

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyCreateRequest request) {
        if (companyRepository.existsByLegalName(request.legalName())) {
            throw new BusinessException("Company already exists with legal name: " + request.legalName());
        }
        if (companyRepository.existsByRegistrationNumber(request.registrationNumber())) {
            throw new BusinessException("Company already exists with registration number: " + request.registrationNumber());
        }

        Company company = Company.builder()
                .legalName(request.legalName())
                .registrationNumber(request.registrationNumber())
                .taxId(request.taxId())
                .headquartersAddress(request.headquartersAddress())
                .website(request.website())
                .industry(request.industry())
                .contactPerson(request.contactPerson())
                .contactEmail(request.contactEmail())
                .contactPhone(request.contactPhone())
                .employeeCount(request.employeeCount())
                .annualRevenue(request.annualRevenue())
                .logoUrl(request.logoUrl())
                .status("PENDING_APPROVAL")
                .build();

        return mapToCompanyResponse(companyRepository.save(company));
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyUpdateRequest request) {
        Company company = companyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));

        if (!company.getLegalName().equalsIgnoreCase(request.legalName()) && 
            companyRepository.existsByLegalName(request.legalName())) {
            throw new BusinessException("Company already exists with legal name: " + request.legalName());
        }

        company.setLegalName(request.legalName());
        company.setTaxId(request.taxId());
        company.setHeadquartersAddress(request.headquartersAddress());
        company.setWebsite(request.website());
        company.setStatus(request.status());
        company.setIndustry(request.industry());
        company.setContactPerson(request.contactPerson());
        company.setContactEmail(request.contactEmail());
        company.setContactPhone(request.contactPhone());
        company.setEmployeeCount(request.employeeCount());
        company.setAnnualRevenue(request.annualRevenue());
        company.setLogoUrl(request.logoUrl());

        return mapToCompanyResponse(companyRepository.save(company));
    }

    @Override
    @Transactional
    public void approveCompany(Long id) {
        Company company = companyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        company.setStatus("ACTIVE");
        companyRepository.save(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        
        // Apply soft delete
        company.setDeletedAt(LocalDateTime.now());
        company.setStatus("INACTIVE");
        companyRepository.save(company);
    }

    private CompanyResponse mapToCompanyResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getLegalName(),
                company.getRegistrationNumber(),
                company.getTaxId(),
                company.getStatus(),
                company.getHeadquartersAddress(),
                company.getWebsite(),
                company.getIndustry(),
                company.getContactPerson(),
                company.getContactEmail(),
                company.getContactPhone(),
                company.getEmployeeCount(),
                company.getAnnualRevenue(),
                company.getLogoUrl(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}
