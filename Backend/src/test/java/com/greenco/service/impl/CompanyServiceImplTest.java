package com.greenco.service.impl;

import com.greenco.dto.CompanyCreateRequest;
import com.greenco.dto.CompanyResponse;
import com.greenco.entity.Company;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyServiceImpl companyService;

    @Test
    void shouldRegisterNewCompanySuccessfully() {
        // Given
        CompanyCreateRequest request = new CompanyCreateRequest(
                "Acme Corp", "REG-9912", "TAX-US-99", "Road 1", "https://acme.com"
        );

        when(companyRepository.existsByLegalName(anyString())).thenReturn(false);
        when(companyRepository.existsByRegistrationNumber(anyString())).thenReturn(false);
        when(companyRepository.existsByTaxId(anyString())).thenReturn(false);

        Company savedCompany = Company.builder()
                .id(1L)
                .legalName(request.legalName())
                .registrationNumber(request.registrationNumber())
                .taxId(request.taxId())
                .headquartersAddress(request.headquartersAddress())
                .website(request.website())
                .status("PENDING_APPROVAL")
                .build();

        when(companyRepository.save(any(Company.class))).thenReturn(savedCompany);

        // When
        CompanyResponse response = companyService.registerCompany(request);

        // Then
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.legalName()).isEqualTo("Acme Corp");
        assertThat(response.status()).isEqualTo("PENDING_APPROVAL");
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    void shouldThrowExceptionWhenLegalNameExists() {
        // Given
        CompanyCreateRequest request = new CompanyCreateRequest(
                "Existing Corp", "REG-9912", "TAX-US-99", "Road 1", "https://acme.com"
        );

        when(companyRepository.existsByLegalName("Existing Corp")).thenReturn(true);

        // When & Then
        assertThrows(BusinessException.class, () -> companyService.registerCompany(request));
        verify(companyRepository, never()).save(any(Company.class));
    }

    @Test
    void shouldApproveCompanySuccessfully() {
        // Given
        Company company = Company.builder()
                .id(1L)
                .legalName("Springfield Steel")
                .status("PENDING_APPROVAL")
                .build();

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(companyRepository.save(any(Company.class))).thenReturn(company);

        // When
        CompanyResponse response = companyService.approveCompany(1L);

        // Then
        assertThat(response.status()).isEqualTo("ACTIVE");
        verify(companyRepository, times(1)).save(company);
    }
}
