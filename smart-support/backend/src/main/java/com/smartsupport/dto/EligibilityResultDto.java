package com.smartsupport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EligibilityResultDto {
    private Long schemeId;
    private String schemeName;
    private String organization;
    private String category;
    private boolean eligible;
    private double matchScore;
    private Double maximumAmount;
    private List<String> reasons;
    private List<String> requiredDocuments;
}
