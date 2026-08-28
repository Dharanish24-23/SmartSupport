package com.smartsupport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "eligibility_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    private Boolean eligible;

    @Column(name = "match_score")
    private Double matchScore;

    @Column(length = 2000)
    private String reasons;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;

    @PrePersist
    public void prePersist() {
        this.checkedAt = LocalDateTime.now();
    }
}
