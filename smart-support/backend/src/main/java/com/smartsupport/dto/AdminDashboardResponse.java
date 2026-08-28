package com.smartsupport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalSchemes;
    private long totalApplications;
    private long pendingApplications;
    private long underReviewApplications;
    private long approvedApplications;
    private long rejectedApplications;
}
