package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.dto.ApplicationResponse;
import com.smartsupport.dto.UpdateApplicationStatusRequest;
import com.smartsupport.security.UserPrincipal;
import com.smartsupport.service.OfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> applications(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Assigned applications fetched",
                officerService.getAssignedApplications(principal.getUser())));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Application status updated",
                officerService.updateStatus(id, request, principal.getUser())));
    }
}