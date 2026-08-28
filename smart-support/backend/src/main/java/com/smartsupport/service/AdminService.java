package com.smartsupport.service;

import com.smartsupport.dto.AdminDashboardResponse;
import com.smartsupport.entity.ApplicationStatus;
import com.smartsupport.entity.User;
import com.smartsupport.repository.ApplicationRepository;
import com.smartsupport.repository.SchemeRepository;
import com.smartsupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final ApplicationRepository applicationRepository;

    public AdminDashboardResponse getDashboardStats() {
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalSchemes(schemeRepository.count())
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING))
                .underReviewApplications(applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW))
                .approvedApplications(applicationRepository.countByStatus(ApplicationStatus.APPROVED))
                .rejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
