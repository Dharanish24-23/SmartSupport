package com.smartsupport.service;

import com.smartsupport.dto.ApplicationResponse;
import com.smartsupport.dto.UpdateApplicationStatusRequest;
import com.smartsupport.entity.Application;
import com.smartsupport.entity.ApplicationStatus;
import com.smartsupport.entity.User;
import com.smartsupport.exception.BadRequestException;
import com.smartsupport.exception.ResourceNotFoundException;
import com.smartsupport.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OfficerService {

    private static final EnumSet<ApplicationStatus> OFFICER_STATUSES = EnumSet.of(
            ApplicationStatus.DOCUMENT_VERIFICATION,
            ApplicationStatus.REVIEW,
            ApplicationStatus.APPROVED
    );

    private final ApplicationRepository applicationRepository;

    public List<ApplicationResponse> getAssignedApplications(User officer) {
        return applicationRepository.findBySchemeOfficerOrderBySubmittedAtDesc(officer)
                .stream().map(this::toResponse).toList();
    }

    public ApplicationResponse updateStatus(Long id, UpdateApplicationStatusRequest request, User officer) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (application.getScheme().getOfficer() == null
                || !application.getScheme().getOfficer().getId().equals(officer.getId())) {
            throw new ResourceNotFoundException("Application not found");
        }

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Officer status must be Document Verification, Review, or Approved");
        }
        if (!OFFICER_STATUSES.contains(newStatus)) {
            throw new BadRequestException("Officer status must be Document Verification, Review, or Approved");
        }

        application.setStatus(newStatus);
        application.setRejectionReason(null);
        return toResponse(applicationRepository.save(application));
    }

    private ApplicationResponse toResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .applicationNumber(application.getApplicationNumber())
                .schemeName(application.getScheme().getName())
                .schemeId(application.getScheme().getId())
                .applicantName(application.getApplicantName())
                .status(application.getStatus().name())
                .rejectionReason(application.getRejectionReason())
                .submittedAt(application.getSubmittedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}