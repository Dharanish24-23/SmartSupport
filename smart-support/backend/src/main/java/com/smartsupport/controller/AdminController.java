package com.smartsupport.controller;

import com.smartsupport.dto.*;
import com.smartsupport.entity.Scheme;
import com.smartsupport.entity.User;
import com.smartsupport.service.AdminService;
import com.smartsupport.service.ApplicationService;
import com.smartsupport.service.SchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final SchemeService schemeService;
    private final ApplicationService applicationService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats fetched", adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> allUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users fetched", adminService.getAllUsers()));
    }

    // ---- Scheme management ----

    @GetMapping("/schemes")
    public ResponseEntity<ApiResponse<List<Scheme>>> allSchemes() {
        return ResponseEntity.ok(ApiResponse.ok("Schemes fetched", schemeService.getAllSchemesForAdmin()));
    }

    @PostMapping("/schemes")
    public ResponseEntity<ApiResponse<Scheme>> createScheme(@Valid @RequestBody SchemeDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Scheme created", schemeService.createScheme(dto)));
    }

    @PutMapping("/schemes/{id}")
    public ResponseEntity<ApiResponse<Scheme>> updateScheme(@PathVariable Long id, @Valid @RequestBody SchemeDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Scheme updated", schemeService.updateScheme(id, dto)));
    }

    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.ok(ApiResponse.ok("Scheme deleted", null));
    }

    @PatchMapping("/schemes/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Scheme>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Scheme status updated", schemeService.toggleActive(id)));
    }

    // ---- Application management ----

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> allApplications() {
        return ResponseEntity.ok(ApiResponse.ok("Applications fetched", applicationService.getAllApplications()));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Application status updated", applicationService.updateStatus(id, request)));
    }
}
