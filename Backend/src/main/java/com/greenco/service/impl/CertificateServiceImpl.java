package com.greenco.service.impl;

import com.greenco.dto.CertificateResponse;
import com.greenco.entity.Assessment;
import com.greenco.entity.Certificate;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.CertificateRepository;
import com.greenco.service.CertificateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final AssessmentRepository assessmentRepository;

    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  AssessmentRepository assessmentRepository) {
        this.certificateRepository = certificateRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    @Transactional
    public CertificateResponse issueCertificate(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        if (!"APPROVED".equalsIgnoreCase(assessment.getStatus())) {
            throw new BusinessException("Certificates can only be issued for APPROVED assessments.");
        }

        // Check if certificate already exists
        if (certificateRepository.findByAssessmentId(assessmentId).isPresent()) {
            throw new BusinessException("Certificate already issued for this assessment.");
        }

        // 1. Calculate Rating Level based on score
        double score = assessment.getScoreAchieved();
        String level = "Certified";
        if (score >= 800) {
            level = "Platinum";
        } else if (score >= 700) {
            level = "Gold";
        } else if (score >= 600) {
            level = "Silver";
        } else if (score >= 500) {
            level = "Bronze";
        }

        // Update assessment's final level in DB
        assessment.setRatingLevel(level);
        assessmentRepository.save(assessment);

        // 2. Generate Serial Code
        int randomSuffix = 10000 + new Random().nextInt(90000);
        String serialNumber = "GC-2026-" + randomSuffix;

        // 3. Set Issue and Expiry (Valid for 2 years)
        LocalDate today = LocalDate.now();
        LocalDate expiry = today.plusYears(2);

        Certificate certificate = Certificate.builder()
                .company(assessment.getFactory().getCompany())
                .factory(assessment.getFactory())
                .assessment(assessment)
                .certificateNumber(serialNumber)
                .ratingLevel(level)
                .scoreAchieved(score)
                .issueDate(today)
                .expiryDate(expiry)
                .status("ACTIVE")
                .pdfUrl("/certificates/" + serialNumber + "/pdf")
                .build();

        return mapToCertificateResponse(certificateRepository.save(certificate));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CertificateResponse> getAllCertificates(Pageable pageable, Long companyId, String status) {
        String statusParam = (status == null || status.trim().isEmpty()) ? null : status.trim();
        return certificateRepository.findCertificatesFiltered(companyId, statusParam, pageable)
                .map(this::mapToCertificateResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByCompany(Long companyId) {
        return certificateRepository.findByCompanyId(companyId).stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", id));
        return mapToCertificateResponse(certificate);
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayInputStream downloadCertificatePdf(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", id));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(out)) {

            writer.println("==================================================================");
            writer.println("               CII GREEN BUSINESS CENTRE CERTIFICATE              ");
            writer.println("==================================================================");
            writer.println();
            writer.println("This is to certify that the facility:");
            writer.println("Plant Name:       " + cert.getFactory().getName());
            writer.println("Parent Company:   " + cert.getCompany().getLegalName());
            writer.println();
            writer.println("has successfully completed the GreenCo rating framework assessment.");
            writer.println();
            writer.println("Rating Achieved:  " + cert.getRatingLevel().toUpperCase());
            writer.println("Score Achieved:   " + cert.getScoreAchieved() + " / 1000 points");
            writer.println();
            writer.println("Certificate ID:   " + cert.getCertificateNumber());
            writer.println("Issue Date:       " + cert.getIssueDate());
            writer.println("Expiry Date:      " + cert.getExpiryDate());
            writer.println();
            writer.println("==================================================================");
            writer.println("               VALIDATED BY GREENCO AUDIT SYSTEM                  ");
            writer.println("==================================================================");

            writer.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Certificate PDF simulation stream", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateByNumber(String number) {
        Certificate certificate = certificateRepository.findByCertificateNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "certificateNumber", number));
        return mapToCertificateResponse(certificate);
    }

    private CertificateResponse mapToCertificateResponse(Certificate cert) {
        return new CertificateResponse(
                cert.getId(),
                cert.getCompany().getLegalName(),
                cert.getFactory().getName(),
                cert.getCertificateNumber(),
                cert.getRatingLevel(),
                cert.getScoreAchieved(),
                cert.getIssueDate(),
                cert.getExpiryDate(),
                cert.getStatus(),
                cert.getPdfUrl()
        );
    }
}
