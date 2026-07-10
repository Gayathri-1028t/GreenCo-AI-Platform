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
@Table(name = "factories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "sector_type", nullable = false, length = 50)
    private String sectorType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "building_area_sqm")
    private Double buildingAreaSqm;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(nullable = false, length = 30)
    private String status; // ACTIVE, INACTIVE

    @Column(name = "factory_code", length = 30)
    private String factoryCode;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "factory_type", length = 50)
    private String factoryType;

    @Column(name = "manufacturing_category", length = 100)
    private String manufacturingCategory;

    @Column(name = "factory_head", length = 100)
    private String factoryHead;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "annual_production_capacity")
    private Double annualProductionCapacity;

    @Column(name = "sustainability_grade", length = 20)
    private String sustainabilityGrade;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
