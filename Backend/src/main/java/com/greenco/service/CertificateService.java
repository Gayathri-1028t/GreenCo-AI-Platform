package com.greenco.service;

import com.greenco.dto.CertificateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface CertificateService {
    CertificateResponse issueCertificate(Long assessmentId);
    Page<CertificateResponse> getAllCertificates(Pageable pageable, Long companyId, String status);
    List<CertificateResponse> getCertificatesByCompany(Long companyId);
    CertificateResponse getCertificateById(Long id);
    CertificateResponse getCertificateByNumber(String number);
    ByteArrayInputStream downloadCertificatePdf(Long id);
}
