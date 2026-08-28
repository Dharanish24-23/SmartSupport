package com.smartsupport.service;

import com.smartsupport.dto.SchemeDto;
import com.smartsupport.entity.Scheme;
import com.smartsupport.exception.ResourceNotFoundException;
import com.smartsupport.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public List<Scheme> getAllActiveSchemes() {
        return schemeRepository.findByActiveTrue();
    }

    public List<Scheme> getAllSchemesForAdmin() {
        return schemeRepository.findAll();
    }

    public Scheme getSchemeById(Long id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));
    }

    public Scheme createScheme(SchemeDto dto) {
        Scheme scheme = Scheme.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .organization(dto.getOrganization())
                .category(dto.getCategory())
                .minAge(dto.getMinAge())
                .maxAge(dto.getMaxAge())
                .maxIncome(dto.getMaxIncome())
                .state(dto.getState())
                .district(dto.getDistrict())
                .gender(dto.getGender())
                .disease(dto.getDisease())
                .bplRequired(dto.getBplRequired() != null && dto.getBplRequired())
                .maximumAmount(dto.getMaximumAmount())
                .requiredDocuments(dto.getRequiredDocuments())
                .applicationUrl(dto.getApplicationUrl())
                .active(dto.getActive() == null || dto.getActive())
                .build();
        return schemeRepository.save(scheme);
    }

    public Scheme updateScheme(Long id, SchemeDto dto) {
        Scheme scheme = getSchemeById(id);
        scheme.setName(dto.getName());
        scheme.setDescription(dto.getDescription());
        scheme.setOrganization(dto.getOrganization());
        scheme.setCategory(dto.getCategory());
        scheme.setMinAge(dto.getMinAge());
        scheme.setMaxAge(dto.getMaxAge());
        scheme.setMaxIncome(dto.getMaxIncome());
        scheme.setState(dto.getState());
        scheme.setDistrict(dto.getDistrict());
        scheme.setGender(dto.getGender());
        scheme.setDisease(dto.getDisease());
        scheme.setBplRequired(dto.getBplRequired() != null && dto.getBplRequired());
        scheme.setMaximumAmount(dto.getMaximumAmount());
        scheme.setRequiredDocuments(dto.getRequiredDocuments());
        scheme.setApplicationUrl(dto.getApplicationUrl());
        if (dto.getActive() != null) scheme.setActive(dto.getActive());
        return schemeRepository.save(scheme);
    }

    public void deleteScheme(Long id) {
        Scheme scheme = getSchemeById(id);
        schemeRepository.delete(scheme);
    }

    public Scheme toggleActive(Long id) {
        Scheme scheme = getSchemeById(id);
        scheme.setActive(!Boolean.TRUE.equals(scheme.getActive()));
        return schemeRepository.save(scheme);
    }
}
