package com.greenco.controller;

import com.greenco.common.BaseResponse;
import com.greenco.dto.DocumentResponse;
import com.greenco.entity.User;
import com.greenco.security.CustomUserDetails;
import com.greenco.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("assessmentId") Long assessmentId,
            @RequestParam("parameterCode") String parameterCode,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User uploader = userDetails.getUser();
        DocumentResponse response = documentService.uploadDocument(assessmentId, parameterCode, file, uploader);
        return new ResponseEntity<>(BaseResponse.success(response, "Document uploaded successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/assessment/{assessmentId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<List<DocumentResponse>>> getDocumentsByAssessment(
            @PathVariable Long assessmentId) {
        List<DocumentResponse> response = documentService.getDocumentsByAssessment(assessmentId);
        return new ResponseEntity<>(BaseResponse.success(response), HttpStatus.OK);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Resource resource = documentService.downloadDocument(id);
        String filename = resource.getFilename();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANUFACTURING_COMPANY')")
    public ResponseEntity<BaseResponse<Void>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return new ResponseEntity<>(BaseResponse.success(null, "Document deleted successfully"), HttpStatus.OK);
    }
}
