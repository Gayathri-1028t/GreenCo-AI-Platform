package com.greenco.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analysis_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    private Document document;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(nullable = false, length = 30)
    private String status; // PROCESSING, SUCCESS, FAILED

    @Column(name = "extracted_text_json", columnDefinition = "JSON")
    private String extractedTextJson; // Holds structured key-value extracted details

    @Column(name = "anomaly_flags_json", columnDefinition = "JSON")
    private String anomalyFlagsJson; // Holds warning messages list

    @CreationTimestamp
    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;
}
