package com.smartsupport.config;

import com.smartsupport.entity.Role;
import com.smartsupport.entity.Scheme;
import com.smartsupport.entity.User;
import com.smartsupport.repository.SchemeRepository;
import com.smartsupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the database with a default admin account and sample (demo) schemes
 * on first startup, if none exist yet. All scheme data here is clearly
 * DEMO / SAMPLE data for the purposes of this project and does not
 * represent real government or NGO schemes.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String adminEmail;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSchemes();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) return;

        User admin = User.builder()
                .fullName("System Administrator")
                .email(adminEmail)
                .phone("9999999999")
                .password(passwordEncoder.encode(adminPassword))
                .gender("OTHER")
                .state("Tamil Nadu")
                .district("Chennai")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
    }

    private void seedSchemes() {
        if (schemeRepository.count() > 0) return;

        List<Scheme> schemes = List.of(
                Scheme.builder()
                        .name("Medical Financial Assistance Scheme (Demo)")
                        .description("Sample demo scheme providing financial help for medical treatment expenses for low and middle income families.")
                        .organization("Tamil Nadu Health Department (Demo)")
                        .category("Medical")
                        .minAge(18).maxAge(80)
                        .maxIncome(300000.0)
                        .state("Tamil Nadu").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(200000.0)
                        .requiredDocuments("Aadhaar,Income Certificate,Medical Report")
                        .applicationUrl("https://example.gov.in/demo-scheme-1")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Senior Citizen Support Scheme (Demo)")
                        .description("Sample demo scheme offering monthly financial support to senior citizens above 60 years of age.")
                        .organization("Ministry of Social Justice (Demo)")
                        .category("Senior Citizen")
                        .minAge(60).maxAge(120)
                        .maxIncome(250000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(60000.0)
                        .requiredDocuments("Aadhaar,Address Proof,Bank Passbook")
                        .applicationUrl("https://example.gov.in/demo-scheme-2")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Women Financial Support Scheme (Demo)")
                        .description("Sample demo scheme supporting women entrepreneurs and homemakers from economically weaker sections.")
                        .organization("Department of Women & Child Development (Demo)")
                        .category("Women Welfare")
                        .minAge(18).maxAge(60)
                        .maxIncome(200000.0)
                        .state("ANY").district("ANY").gender("FEMALE")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(100000.0)
                        .requiredDocuments("Aadhaar,Income Certificate,Bank Passbook")
                        .applicationUrl("https://example.gov.in/demo-scheme-3")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Student Education Assistance Scheme (Demo)")
                        .description("Sample demo scheme providing scholarships and fee assistance to students from low-income families.")
                        .organization("Department of Education (Demo)")
                        .category("Education")
                        .minAge(15).maxAge(25)
                        .maxIncome(150000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(50000.0)
                        .requiredDocuments("Aadhaar,Income Certificate,Address Proof")
                        .applicationUrl("https://example.gov.in/demo-scheme-4")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Disability Assistance Scheme (Demo)")
                        .description("Sample demo scheme offering financial assistance and assistive devices for persons with disabilities.")
                        .organization("Department of Empowerment of Persons with Disabilities (Demo)")
                        .category("Disability")
                        .minAge(5).maxAge(100)
                        .maxIncome(300000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("Disability")
                        .bplRequired(false)
                        .maximumAmount(120000.0)
                        .requiredDocuments("Aadhaar,Medical Report,Address Proof")
                        .applicationUrl("https://example.gov.in/demo-scheme-5")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Emergency Medical Support Scheme (Demo)")
                        .description("Sample demo scheme for immediate financial help during medical emergencies requiring urgent treatment.")
                        .organization("State Emergency Relief Fund (Demo)")
                        .category("Medical")
                        .minAge(0).maxAge(120)
                        .maxIncome(500000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(300000.0)
                        .requiredDocuments("Aadhaar,Medical Report")
                        .applicationUrl("https://example.gov.in/demo-scheme-6")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Low Income Family Support Scheme (Demo)")
                        .description("Sample demo scheme providing monthly income support to families living below the poverty line.")
                        .organization("Rural Development Department (Demo)")
                        .category("Family Welfare")
                        .minAge(18).maxAge(100)
                        .maxIncome(120000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(true)
                        .maximumAmount(80000.0)
                        .requiredDocuments("Aadhaar,BPL Card,Income Certificate")
                        .applicationUrl("https://example.gov.in/demo-scheme-7")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Child Healthcare Assistance Scheme (Demo)")
                        .description("Sample demo scheme covering medical treatment costs for children under 12 years of age.")
                        .organization("Child Welfare Board (Demo)")
                        .category("Medical")
                        .minAge(0).maxAge(12)
                        .maxIncome(250000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(150000.0)
                        .requiredDocuments("Aadhaar,Medical Report,Address Proof")
                        .applicationUrl("https://example.gov.in/demo-scheme-8")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("Farmer Financial Assistance Scheme (Demo)")
                        .description("Sample demo scheme providing financial relief to farmers affected by crop loss or medical emergencies.")
                        .organization("Department of Agriculture (Demo)")
                        .category("Agriculture")
                        .minAge(18).maxAge(100)
                        .maxIncome(200000.0)
                        .state("Tamil Nadu").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(100000.0)
                        .requiredDocuments("Aadhaar,Income Certificate,Bank Passbook,Address Proof")
                        .applicationUrl("https://example.gov.in/demo-scheme-9")
                        .active(true)
                        .build(),

                Scheme.builder()
                        .name("NGO Medical Aid Scheme (Demo)")
                        .description("Sample demo scheme by a charitable NGO offering partial funding for surgeries and long-term treatment.")
                        .organization("HelpingHands Foundation (Demo NGO)")
                        .category("Medical")
                        .minAge(0).maxAge(120)
                        .maxIncome(400000.0)
                        .state("ANY").district("ANY").gender("ANY")
                        .disease("ANY")
                        .bplRequired(false)
                        .maximumAmount(250000.0)
                        .requiredDocuments("Aadhaar,Medical Report,Income Certificate")
                        .applicationUrl("https://example.gov.in/demo-scheme-10")
                        .active(true)
                        .build()
        );

        schemeRepository.saveAll(schemes);
    }
}
