package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.CertificateResponse;
import com.greenco.service.CertificateService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Page<CertificateResponse>>> getAllCertificates(
            @PageableDefault(sort = "id") Pageable pageable,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String status) {
        Page<CertificateResponse> certificates = certificateService.getAllCertificates(pageable, companyId, status);
        return new ResponseEntity<>(BaseResponse.success(certificates), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<CertificateResponse>> getCertificateById(@PathVariable Long id) {
        CertificateResponse certificate = certificateService.getCertificateById(id);
        return new ResponseEntity<>(BaseResponse.success(certificate), HttpStatus.OK);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<Resource> downloadCertificatePdf(@PathVariable Long id) {
        ByteArrayInputStream pdfStream = certificateService.downloadCertificatePdf(id);
        InputStreamResource file = new InputStreamResource(pdfStream);

        String filename = "greenco-certificate-" + id + ".txt";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(file);
    }

    @GetMapping("/verify/{number}")
    public ResponseEntity<BaseResponse<CertificateResponse>> verifyCertificate(@PathVariable String number) {
        CertificateResponse certificate = certificateService.getCertificateByNumber(number);
        return new ResponseEntity<>(BaseResponse.success(certificate), HttpStatus.OK);
    }
}
