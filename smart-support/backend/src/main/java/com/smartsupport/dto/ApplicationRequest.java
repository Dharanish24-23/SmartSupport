package com.smartsupport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {

    @NotNull(message = "Scheme is required")
    private Long schemeId;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Income is required")
    private Double income;

    @NotBlank(message = "Bank account is required")
    private String bankAccount;

    @NotBlank(message = "IFSC is required")
    private String ifsc;
}
