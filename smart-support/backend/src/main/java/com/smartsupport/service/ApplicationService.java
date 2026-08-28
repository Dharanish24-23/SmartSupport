package com.smartsupport.service;

import com.smartsupport.dto.ApplicationRequest;
import com.smartsupport.dto.ApplicationResponse;
import com.smartsupport.dto.UpdateApplicationStatusRequest;
import com.smartsupport.entity.Application;
import com.smartsupport.entity.ApplicationStatus;
import com.smartsupport.entity.Scheme;
import com.smartsupport.entity.User;
import com.smartsupport.exception.BadRequestException;
import com.smartsupport.exception.ResourceNotFoundException;
import com.smartsupport.repository.ApplicationRepository;
import com.smartsupport.repository.SchemeRepository;
import com.smartsupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final SchemeRepository schemeRepository;
    private final UserRepository userRepository;

    public ApplicationResponse submitApplication(Long userId, ApplicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Scheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        Application application = Application.builder()
                .applicationNumber(generateApplicationNumber())
                .user(user)
                .scheme(scheme)
                .applicantName(request.getApplicantName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .income(request.getIncome())
                .bankAccount(request.getBankAccount())
                .ifsc(request.getIfsc())
                .status(ApplicationStatus.PENDING)
                .build();

        application = applicationRepository.save(application);
        return toResponse(application);
    }

    public List<ApplicationResponse> getMyApplications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return applicationRepository.findByUserOrderBySubmittedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(application);
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ApplicationResponse updateStatus(Long id, UpdateApplicationStatusRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status value: " + request.getStatus());
        }

        if (newStatus == ApplicationStatus.REJECTED &&
                (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new BadRequestException("Rejection reason is required when rejecting an application");
        }

        application.setStatus(newStatus);
        application.setRejectionReason(newStatus == ApplicationStatus.REJECTED ? request.getRejectionReason() : null);
        application = applicationRepository.save(application);
        return toResponse(application);
    }

    private ApplicationResponse toResponse(Application a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .applicationNumber(a.getApplicationNumber())
                .schemeName(a.getScheme().getName())
                .schemeId(a.getScheme().getId())
                .applicantName(a.getApplicantName())
                .status(a.getStatus().name())
                .rejectionReason(a.getRejectionReason())
                .submittedAt(a.getSubmittedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    private String generateApplicationNumber() {
        int year = Year.now().getValue();
        long count = applicationRepository.count() + 1;
        return String.format("APP-%d-%06d", year, count);
    }
}
