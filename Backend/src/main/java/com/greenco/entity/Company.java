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
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "legal_name", nullable = false, unique = true, length = 150)
    private String legalName;

    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @Column(name = "tax_id", nullable = false, length = 50)
    private String taxId;

    @Column(nullable = false, length = 30)
    private String status; // PENDING_APPROVAL, ACTIVE, SUSPENDED

    @Column(name = "headquarters_address", columnDefinition = "TEXT")
    private String headquartersAddress;

    @Column(name = "website", length = 100)
    private String website;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "annual_revenue")
    private Double annualRevenue;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
