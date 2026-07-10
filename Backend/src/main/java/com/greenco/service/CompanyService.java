package com.greenco.service;

import com.greenco.dto.CompanyCreateRequest;
import com.greenco.dto.CompanyResponse;
import com.greenco.dto.CompanyUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyService {
    Page<CompanyResponse> getAllCompanies(Pageable pageable, String search, String status);
    CompanyResponse getCompanyById(Long id);
    CompanyResponse createCompany(CompanyCreateRequest request);
    CompanyResponse updateCompany(Long id, CompanyUpdateRequest request);
    void approveCompany(Long id);
    void deleteCompany(Long id);
}
