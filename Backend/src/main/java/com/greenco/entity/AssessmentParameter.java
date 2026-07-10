package com.greenco.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assessment_parameters")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pillar_name", nullable = false, length = 50)
    private String pillarName; // Energy Efficiency, Water Conservation, Waste Management, etc.

    @Column(name = "parameter_code", nullable = false, unique = true, length = 50)
    private String parameterCode; // EN-EFF-01, WT-CON-02, etc.

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_score", nullable = false)
    private Double maxScore;
}
