package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.dto.ProfileResponse;
import com.smartsupport.dto.ProfileUpdateRequest;
import com.smartsupport.security.UserPrincipal;
import com.smartsupport.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Profile fetched",
                profileService.getProfile(principal.getUser().getId())));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated",
                profileService.updateProfile(principal.getUser().getId(), request)));
    }
}