package com.greenco.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_id", nullable = false)
    private Factory factory;

    @Column(nullable = false, length = 30)
    private String status; // DRAFT, SUBMITTED, UNDER_TECHNICAL_REVIEW, SITE_AUDIT, APPROVED, REJECTED

    @Column(name = "rating_version", nullable = false, length = 10)
    private String ratingVersion;

    @Column(name = "score_achieved")
    @Builder.Default
    private Double scoreAchieved = 0.0;

    @Column(name = "rating_level", length = 30)
    private String ratingLevel; // Certified, Bronze, Silver, Gold, Platinum

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
