package com.smartsupport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SchemeDto {
    private Long id;

    @NotBlank(message = "Scheme name is required")
    private String name;

    private String description;
    private String organization;
    private String category;

    @PositiveOrZero(message = "Minimum age must be zero or positive")
    private Integer minAge;

    @PositiveOrZero(message = "Maximum age must be zero or positive")
    private Integer maxAge;

    @NotNull(message = "Maximum income is required")
    @PositiveOrZero(message = "Maximum income must be zero or positive")
    private Double maxIncome;

    private String state;
    private String district;
    private String gender;
    private String disease;
    private Boolean bplRequired;

    @NotNull(message = "Maximum support amount is required")
    @PositiveOrZero(message = "Maximum support amount must be zero or positive")
    private Double maximumAmount;

    private String requiredDocuments;
    private String applicationUrl;
    private Boolean active;
}
