package com.smartsupport.dto;

import lombok.Data;

import java.util.List;

@Data
public class EligibilityCheckRequest {

    // Step 1 - Personal information
    private Integer age;
    private String gender;
    private String state;
    private String district;
    private String occupation;

    // Step 2 - Financial information
    private Double annualIncome;
    private String employmentStatus;
    private Boolean bplStatus;
    private Integer familySize;

    // Step 3 - Medical information
    private String disease;
    private Boolean treatmentRequired;
    private Boolean medicalEmergency;
    private Boolean medicalReportAvailable;
    private List<String> medicalBillFileNames;

    // Step 4 - Documents available (checkbox names)
    private List<String> documentsAvailable;
}
