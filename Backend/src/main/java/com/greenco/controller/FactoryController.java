package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.FactoryBaselineDto;
import com.greenco.dto.FactoryCreateRequest;
import com.greenco.dto.FactoryResponse;
import com.greenco.dto.FactoryUpdateRequest;
import com.greenco.service.FactoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/factories")
public class FactoryController {

    private final FactoryService factoryService;

    public FactoryController(FactoryService factoryService) {
        this.factoryService = factoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR')")
    public ResponseEntity<BaseResponse<Page<FactoryResponse>>> getAllFactories(
            @PageableDefault(sort = "id") Pageable pageable,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sectorType,
            @RequestParam(required = false) String status) {
        Page<FactoryResponse> factories = factoryService.getAllFactories(pageable, companyId, search, sectorType, status);
        return new ResponseEntity<>(BaseResponse.success(factories), HttpStatus.OK);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<List<FactoryResponse>>> getFactoriesByCompany(@PathVariable Long companyId) {
        List<FactoryResponse> factories = factoryService.getFactoriesByCompany(companyId);
        return new ResponseEntity<>(BaseResponse.success(factories), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FactoryResponse>> getFactoryById(@PathVariable Long id) {
        FactoryResponse factory = factoryService.getFactoryById(id);
        return new ResponseEntity<>(BaseResponse.success(factory), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FactoryResponse>> createFactory(@Valid @RequestBody FactoryCreateRequest request) {
        FactoryResponse factory = factoryService.createFactory(request);
        return new ResponseEntity<>(BaseResponse.success(factory, "Factory registered successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FactoryResponse>> updateFactory(
            @PathVariable Long id,
            @Valid @RequestBody FactoryUpdateRequest request) {
        FactoryResponse factory = factoryService.updateFactory(id, request);
        return new ResponseEntity<>(BaseResponse.success(factory, "Factory profile updated successfully"), HttpStatus.OK);
    }

    @GetMapping("/{id}/baselines/{year}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FactoryBaselineDto>> getFactoryBaseline(
            @PathVariable Long id,
            @PathVariable Integer year) {
        FactoryBaselineDto baseline = factoryService.getFactoryBaseline(id, year);
        return new ResponseEntity<>(BaseResponse.success(baseline), HttpStatus.OK);
    }

    @PostMapping("/{id}/baselines")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<FactoryBaselineDto>> saveFactoryBaseline(
            @PathVariable Long id,
            @Valid @RequestBody FactoryBaselineDto baselineDto) {
        FactoryBaselineDto baseline = factoryService.saveFactoryBaseline(id, baselineDto);
        return new ResponseEntity<>(BaseResponse.success(baseline, "Factory baseline saved successfully"), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Void>> deleteFactory(@PathVariable Long id) {
        factoryService.deleteFactory(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Factory deactivated successfully"), HttpStatus.OK);
    }
}
