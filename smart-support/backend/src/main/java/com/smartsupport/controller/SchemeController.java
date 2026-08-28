package com.smartsupport.controller;

import com.smartsupport.dto.ApiResponse;
import com.smartsupport.entity.Scheme;
import com.smartsupport.service.SchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Scheme>>> getAllSchemes() {
        return ResponseEntity.ok(ApiResponse.ok("Schemes fetched", schemeService.getAllActiveSchemes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Scheme>> getSchemeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Scheme fetched", schemeService.getSchemeById(id)));
    }
}
