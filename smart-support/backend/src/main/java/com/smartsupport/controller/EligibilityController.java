package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.dto.EligibilityCheckRequest;
import com.smartsupport.dto.EligibilityResultDto;
import com.smartsupport.security.UserPrincipal;
import com.smartsupport.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    @PostMapping("/check")
    public ResponseEntity<ApiResponse<List<EligibilityResultDto>>> checkEligibility(
            @RequestBody EligibilityCheckRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getUser().getId() : null;
        List<EligibilityResultDto> results = eligibilityService.checkEligibility(request, userId);
        return ResponseEntity.ok(ApiResponse.ok("Eligibility checked", results));
    }
}
