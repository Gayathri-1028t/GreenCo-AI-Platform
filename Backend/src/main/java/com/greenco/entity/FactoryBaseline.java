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
@Table(name = "factory_baselines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactoryBaseline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_id", nullable = false)
    private Factory factory;

    @Column(name = "baseline_year", nullable = false)
    private Integer baselineYear;

    @Column(name = "electricity_consumption_kwh", nullable = false)
    private Double electricityConsumptionKwh;

    @Column(name = "water_consumption_kl", nullable = false)
    private Double waterConsumptionKl;

    @Column(name = "waste_generated_mt", nullable = false)
    private Double wasteGeneratedMt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
