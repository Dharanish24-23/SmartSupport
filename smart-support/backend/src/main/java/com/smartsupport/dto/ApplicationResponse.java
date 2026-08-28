package com.smartsupport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String applicationNumber;
    private String schemeName;
    private Long schemeId;
    private String applicantName;
    private String status;
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
