package com.smartsupport.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateApplicationStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String rejectionReason;
}
