package com.greenco.service;

import com.greenco.dto.DocumentResponse;
import com.greenco.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    DocumentResponse uploadDocument(Long assessmentId, String parameterCode, MultipartFile file, User uploader);
    Resource downloadDocument(Long documentId);
    List<DocumentResponse> getDocumentsByAssessment(Long assessmentId);
    void deleteDocument(Long documentId);
}
