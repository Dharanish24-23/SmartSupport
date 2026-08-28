package com.smartsupport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String organization;

    private String category;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "max_income")
    private Double maxIncome;

    /** "ANY" means all states supported */
    private String state;

    /** "ANY" means all districts supported */
    private String district;

    /** "ANY", "MALE", "FEMALE", "OTHER" */
    private String gender;

    /** "ANY" or comma separated list of diseases/conditions supported */
    private String disease;

    @Column(name = "bpl_required")
    @Builder.Default
    private Boolean bplRequired = false;

    @Column(name = "maximum_amount")
    private Double maximumAmount;

    /** comma separated list, e.g. "Aadhaar,Income Certificate,Medical Report" */
    @Column(name = "required_documents", length = 1000)
    private String requiredDocuments;

    @Column(name = "application_url")
    private String applicationUrl;

    @Builder.Default
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
