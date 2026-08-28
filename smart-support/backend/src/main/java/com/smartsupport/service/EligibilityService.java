package com.smartsupport.service;

import com.smartsupport.dto.EligibilityCheckRequest;
import com.smartsupport.dto.EligibilityResultDto;
import com.smartsupport.entity.EligibilityResult;
import com.smartsupport.entity.Scheme;
import com.smartsupport.entity.User;
import com.smartsupport.repository.EligibilityResultRepository;
import com.smartsupport.repository.SchemeRepository;
import com.smartsupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * Implements the weighted eligibility matching algorithm described in the
 * project spec:
 *
 *   Income match      = 30%
 *   Age match         = 15%
 *   Location match    = 15%
 *   Disease match     = 20%
 *   Document match    = 10%
 *   Other criteria    = 10%  (gender + BPL requirement)
 *
 * A scheme is marked ELIGIBLE only when every *hard* (must-pass) criterion
 * is satisfied: age range, income ceiling, state/district, gender, BPL
 * requirement and disease requirement (when the scheme mandates a specific
 * disease). matchScore is always returned (even when not eligible) so the
 * frontend can show "how close" a user was, along with human readable
 * reasons for every criterion that was checked.
 */
@Service
@RequiredArgsConstructor
public class EligibilityService {

    private static final double W_INCOME = 30.0;
    private static final double W_AGE = 15.0;
    private static final double W_LOCATION = 15.0;
    private static final double W_DISEASE = 20.0;
    private static final double W_DOCUMENTS = 10.0;
    private static final double W_OTHER = 10.0;

    private final SchemeRepository schemeRepository;
    private final UserRepository userRepository;
    private final EligibilityResultRepository eligibilityResultRepository;

    @Transactional
    public List<EligibilityResultDto> checkEligibility(EligibilityCheckRequest request, Long userId) {
        List<Scheme> schemes = schemeRepository.findByActiveTrue();
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        List<EligibilityResultDto> results = new ArrayList<>();

        for (Scheme scheme : schemes) {
            EligibilityResultDto dto = evaluate(scheme, request);
            results.add(dto);

            EligibilityResult record = EligibilityResult.builder()
                    .user(user)
                    .scheme(scheme)
                    .eligible(dto.isEligible())
                    .matchScore(dto.getMatchScore())
                    .reasons(String.join(" | ", dto.getReasons()))
                    .build();
            eligibilityResultRepository.save(record);
        }

        results.sort(Comparator.comparingDouble(EligibilityResultDto::getMatchScore).reversed());
        return results;
    }

    private EligibilityResultDto evaluate(Scheme scheme, EligibilityCheckRequest req) {
        List<String> reasons = new ArrayList<>();
        boolean hardFail = false;
        double score = 0.0;

        // ---- Age ----
        boolean ageOk = true;
        if (req.getAge() != null) {
            if (scheme.getMinAge() != null && req.getAge() < scheme.getMinAge()) ageOk = false;
            if (scheme.getMaxAge() != null && req.getAge() > scheme.getMaxAge()) ageOk = false;
        }
        if (ageOk) {
            reasons.add("\u2713 Age requirement satisfied");
            score += W_AGE;
        } else {
            reasons.add("\u2717 Age (" + req.getAge() + ") is outside the scheme's allowed range ("
                    + scheme.getMinAge() + " - " + scheme.getMaxAge() + ")");
            hardFail = true;
        }

        // ---- Income ----
        boolean incomeOk = true;
        if (req.getAnnualIncome() != null && scheme.getMaxIncome() != null) {
            if (req.getAnnualIncome() > scheme.getMaxIncome()) {
                incomeOk = false;
            } else {
                // partial credit for being comfortably under the limit
                double ratio = req.getAnnualIncome() / scheme.getMaxIncome();
                score += W_INCOME * Math.max(0.5, 1 - ratio * 0.5);
            }
        } else {
            score += W_INCOME * 0.5;
        }
        if (incomeOk) {
            reasons.add("\u2713 Income within allowed limit");
        } else {
            double excess = req.getAnnualIncome() - scheme.getMaxIncome();
            reasons.add(String.format(Locale.US,
                    "\u2717 Annual income exceeds the scheme limit by \u20B9%,.0f", excess));
            hardFail = true;
        }

        // ---- Location (state/district) ----
        boolean locationOk = true;
        if (scheme.getState() != null && !scheme.getState().equalsIgnoreCase("ANY")) {
            if (req.getState() == null || !req.getState().equalsIgnoreCase(scheme.getState())) {
                locationOk = false;
            }
        }
        if (locationOk && scheme.getDistrict() != null && !scheme.getDistrict().equalsIgnoreCase("ANY")) {
            if (req.getDistrict() == null || !req.getDistrict().equalsIgnoreCase(scheme.getDistrict())) {
                locationOk = false;
            }
        }
        if (locationOk) {
            reasons.add("\u2713 State/district requirement satisfied");
            score += W_LOCATION;
        } else {
            reasons.add("\u2717 This scheme is not available in your state/district");
            hardFail = true;
        }

        // ---- Disease ----
        boolean diseaseOk = true;
        if (scheme.getDisease() != null && !scheme.getDisease().equalsIgnoreCase("ANY")) {
            List<String> supported = Arrays.stream(scheme.getDisease().split(","))
                    .map(String::trim).map(String::toLowerCase).toList();
            String userDisease = req.getDisease() == null ? "" : req.getDisease().trim().toLowerCase();
            diseaseOk = !userDisease.isBlank() && supported.contains(userDisease);
        }
        if (diseaseOk) {
            reasons.add("\u2713 Medical condition supported");
            score += W_DISEASE;
        } else {
            reasons.add("\u2717 Your medical condition is not covered under this scheme");
            hardFail = true;
        }

        // ---- Gender + BPL ("other criteria") ----
        boolean otherOk = true;
        if (scheme.getGender() != null && !scheme.getGender().equalsIgnoreCase("ANY")) {
            if (req.getGender() == null || !req.getGender().equalsIgnoreCase(scheme.getGender())) {
                otherOk = false;
            }
        }
        if (Boolean.TRUE.equals(scheme.getBplRequired())) {
            if (req.getBplStatus() == null || !req.getBplStatus()) {
                otherOk = false;
            }
        }
        if (otherOk) {
            reasons.add("\u2713 Gender/BPL requirement satisfied");
            score += W_OTHER;
        } else {
            reasons.add("\u2717 Gender or BPL card requirement not met");
            hardFail = true;
        }

        // ---- Documents ----
        List<String> required = scheme.getRequiredDocuments() == null
                ? List.of()
                : Arrays.stream(scheme.getRequiredDocuments().split(",")).map(String::trim).toList();
        List<String> available = req.getDocumentsAvailable() == null ? List.of() : req.getDocumentsAvailable();
        long matchedDocs = required.stream()
                .filter(doc -> available.stream().anyMatch(a -> a.equalsIgnoreCase(doc)))
                .count();
        double docRatio = required.isEmpty() ? 1.0 : (double) matchedDocs / required.size();
        score += W_DOCUMENTS * docRatio;
        if (docRatio == 1.0) {
            reasons.add("\u2713 Required documents available");
        } else if (docRatio > 0) {
            reasons.add("\u26A0 Some required documents are missing (" + matchedDocs + "/" + required.size() + " available)");
        } else if (!required.isEmpty()) {
            reasons.add("\u2717 Required documents missing");
        }

        boolean eligible = !hardFail;
        double matchScore = Math.round(Math.min(100.0, score) * 10.0) / 10.0;

        return EligibilityResultDto.builder()
                .schemeId(scheme.getId())
                .schemeName(scheme.getName())
                .organization(scheme.getOrganization())
                .category(scheme.getCategory())
                .eligible(eligible)
                .matchScore(matchScore)
                .maximumAmount(scheme.getMaximumAmount())
                .reasons(reasons)
                .requiredDocuments(required)
                .build();
    }
}
