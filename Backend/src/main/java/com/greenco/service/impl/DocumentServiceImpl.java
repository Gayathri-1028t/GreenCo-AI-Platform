package com.greenco.service.impl;

import com.greenco.dto.DocumentResponse;
import com.greenco.entity.Assessment;
import com.greenco.entity.Document;
import com.greenco.entity.User;
import com.greenco.exception.BusinessException;
import com.greenco.exception.ResourceNotFoundException;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.DocumentRepository;
import com.greenco.service.DocumentService;
import com.greenco.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "application/pdf", "image/jpeg", "image/png"
    );

    private final DocumentRepository documentRepository;
    private final AssessmentRepository assessmentRepository;
    private final StorageService storageService;

    public DocumentServiceImpl(DocumentRepository documentRepository,
                               AssessmentRepository assessmentRepository,
                               StorageService storageService) {
        this.documentRepository = documentRepository;
        this.assessmentRepository = assessmentRepository;
        this.storageService = storageService;
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(Long assessmentId, String parameterCode, MultipartFile file, User uploader) {
        // 1. Validate File Size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("File size exceeds maximum limit of 25MB");
        }

        // 2. Validate MIME Type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new BusinessException("Only PDF, JPEG, and PNG files are allowed");
        }

        // 3. Resolve parent Assessment
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .filter(a -> a.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", assessmentId));

        if (!"DRAFT".equalsIgnoreCase(assessment.getStatus())) {
            throw new BusinessException("Documents can only be uploaded to DRAFT assessments.");
        }

        // 4. Save file to storage
        String subfolder = "assessment-" + assessmentId;
        String s3Key = storageService.store(file, subfolder);

        // 5. Create Document record in Database (Default to CLEAN after scan)
        Document document = Document.builder()
                .assessment(assessment)
                .parameterCode(parameterCode)
                .fileName(file.getOriginalFilename())
                .s3BucketKey(s3Key)
                .fileSizeBytes(file.getSize())
                .mimeType(contentType)
                .status("CLEAN") // Mock virus scan sets status directly to CLEAN
                .uploadedBy(uploader)
                .build();

        return mapToDocumentResponse(documentRepository.save(document));
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadDocument(Long documentId) {
        Document document = documentRepository.findByIdAndDeletedAtIsNull(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));
        return storageService.loadAsResource(document.getS3BucketKey());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByAssessment(Long assessmentId) {
        return documentRepository.findByAssessmentIdAndDeletedAtIsNull(assessmentId).stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findByIdAndDeletedAtIsNull(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        if (!"DRAFT".equalsIgnoreCase(document.getAssessment().getStatus())) {
            throw new BusinessException("Documents can only be deleted from DRAFT assessments.");
        }

        // Apply soft delete
        document.setDeletedAt(LocalDateTime.now());
        document.setStatus("DELETED");
        documentRepository.save(document);
    }

    private DocumentResponse mapToDocumentResponse(Document document) {
        return new DocumentResponse(
                document.getId(),
                document.getAssessment().getId(),
                document.getParameterCode(),
                document.getFileName(),
                document.getFileSizeBytes(),
                document.getMimeType(),
                document.getStatus(),
                document.getS3BucketKey(),
                document.getCreatedAt()
        );
    }
}
