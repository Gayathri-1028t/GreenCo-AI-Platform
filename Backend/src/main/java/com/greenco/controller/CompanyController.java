package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.CompanyCreateRequest;
import com.greenco.dto.CompanyResponse;
import com.greenco.dto.CompanyUpdateRequest;
import com.greenco.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR')")
    public ResponseEntity<BaseResponse<Page<CompanyResponse>>> getAllCompanies(
            @PageableDefault(sort = "id") Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        Page<CompanyResponse> companies = companyService.getAllCompanies(pageable, search, status);
        return new ResponseEntity<>(BaseResponse.success(companies), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<CompanyResponse>> getCompanyById(@PathVariable Long id) {
        CompanyResponse company = companyService.getCompanyById(id);
        return new ResponseEntity<>(BaseResponse.success(company), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BaseResponse<CompanyResponse>> createCompany(@Valid @RequestBody CompanyCreateRequest request) {
        CompanyResponse company = companyService.createCompany(request);
        return new ResponseEntity<>(BaseResponse.success(company, "Company registered successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<BaseResponse<CompanyResponse>> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyUpdateRequest request) {
        CompanyResponse company = companyService.updateCompany(id, request);
        return new ResponseEntity<>(BaseResponse.success(company, "Company profile updated successfully"), HttpStatus.OK);
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR')")
    public ResponseEntity<BaseResponse<Void>> approveCompany(@PathVariable Long id) {
        companyService.approveCompany(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Company onboarding approved"), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<BaseResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Company deactivated successfully"), HttpStatus.OK);
    }
}
