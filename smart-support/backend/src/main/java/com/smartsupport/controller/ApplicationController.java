package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.dto.ApplicationRequest;
import com.smartsupport.dto.ApplicationResponse;
import com.smartsupport.security.UserPrincipal;
import com.smartsupport.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> submit(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ApplicationResponse response = applicationService.submitApplication(principal.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Application submitted successfully", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> myApplications(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ApplicationResponse> responses = applicationService.getMyApplications(principal.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok("Applications fetched", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Application fetched", applicationService.getApplicationById(id)));
    }
}
