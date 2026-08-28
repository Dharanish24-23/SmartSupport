package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.entity.Document;
import com.smartsupport.security.UserPrincipal;
import com.smartsupport.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Document>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @AuthenticationPrincipal UserPrincipal principal) {
        Document document = documentService.uploadDocument(principal.getUser().getId(), documentType, file);
        return ResponseEntity.ok(ApiResponse.ok("Document uploaded successfully", document));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Document>>> myDocuments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Documents fetched", documentService.getDocumentsForUser(principal.getUser().getId())));
    }
}
