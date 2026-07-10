-- ====================================================================
-- GreenCo AI-Powered Sustainability Rating & Certification Platform
-- MySQL 8.x Database Schema Blueprint
-- Production-Ready Relational Design
-- ====================================================================

-- Disable foreign key checks to prevent drops order issues
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `workflow_histories`;
DROP TABLE IF EXISTS `ai_analysis_results`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `assessment_responses`;
DROP TABLE IF EXISTS `assessment_parameters`;
DROP TABLE IF EXISTS `assessments`;
DROP TABLE IF EXISTS `factory_baselines`;
DROP TABLE IF EXISTS `factories`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `permissions`;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 1. Authentication & Role Management Layer
-- ====================================================================

-- Permissions Table
CREATE TABLE `permissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_permissions_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles Table
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Join Table for Roles & Permissions
CREATE TABLE `role_permissions` (
    `role_id` BIGINT NOT NULL,
    `permission_id` BIGINT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `company_id` BIGINT NULL, -- Scoped ID link for Company operators
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Join Table for Users & Roles
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens Table (Token Rotation Support)
CREATE TABLE `refresh_tokens` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `token` VARCHAR(255) NOT NULL UNIQUE,
    `expiry_date` TIMESTAMP NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_refresh_tokens_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- 2. Organizations & Facility Assets Layer
-- ====================================================================

-- Companies Table
CREATE TABLE `companies` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `legal_name` VARCHAR(150) NOT NULL UNIQUE,
    `registration_number` VARCHAR(100) NOT NULL UNIQUE,
    `tax_id` VARCHAR(100) NOT NULL UNIQUE,
    `headquarters_address` TEXT NOT NULL,
    `website` VARCHAR(255) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL', -- ACTIVE, PENDING_APPROVAL, SUSPENDED, INACTIVE
    `deleted_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_companies_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Factories / Plants Table
CREATE TABLE `factories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `sector_type` VARCHAR(50) NOT NULL, -- Steel Production, Chemical Processing, etc.
    `address` TEXT NOT NULL,
    `latitude` DECIMAL(9, 6) NOT NULL,
    `longitude` DECIMAL(9, 6) NOT NULL,
    `building_area_sqm` DECIMAL(12, 2) NULL,
    `employee_count` INT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE
    `deleted_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_factories_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    INDEX `idx_factories_company` (`company_id`),
    INDEX `idx_factories_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Factory Baseline utility usage Table
CREATE TABLE `factory_baselines` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `factory_id` BIGINT NOT NULL,
    `baseline_year` INT NOT NULL,
    `electricity_consumption_kwh` DECIMAL(15, 2) NOT NULL,
    `water_consumption_kl` DECIMAL(15, 2) NOT NULL,
    `waste_generated_mt` DECIMAL(12, 2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_baselines_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_factory_baseline_year` (`factory_id`, `baseline_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- 3. Sustainability Assessments & Questionnaires Layer
-- ====================================================================

-- Assessments Table
CREATE TABLE `assessments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `factory_id` BIGINT NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, UNDER_TECHNICAL_REVIEW, SITE_AUDIT, APPROVED, REJECTED, INACTIVE
    `rating_version` VARCHAR(10) NOT NULL, -- e.g. v3.0
    `score_achieved` DECIMAL(6, 2) DEFAULT 0.00,
    `rating_level` VARCHAR(30) NULL, -- Certified, Bronze, Silver, Gold, Platinum
    `submitted_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_assessments_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`) ON DELETE CASCADE,
    INDEX `idx_assessments_status` (`status`),
    INDEX `idx_assessments_factory` (`factory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessment Parameters Master Table
CREATE TABLE `assessment_parameters` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `pillar_name` VARCHAR(50) NOT NULL, -- Energy Efficiency, Water Conservation, Waste Management
    `parameter_code` VARCHAR(50) NOT NULL UNIQUE, -- EN-EFF-01, WT-CON-02, WS-GEN-03
    `description` TEXT NOT NULL,
    `max_score` DECIMAL(5, 2) NOT NULL,
    INDEX `idx_parameters_code` (`parameter_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessment Responses Table
CREATE TABLE `assessment_responses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `assessment_id` BIGINT NOT NULL,
    `parameter_id` BIGINT NOT NULL,
    `entered_value` DECIMAL(15, 4) NOT NULL,
    `calculated_points` DECIMAL(5, 2) NOT NULL,
    `auditor_comment` TEXT NULL,
    `is_overridden` BOOLEAN DEFAULT FALSE,
    `override_reason` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_responses_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_responses_parameter` FOREIGN KEY (`parameter_id`) REFERENCES `assessment_parameters` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_assessment_parameter` (`assessment_id`, `parameter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- 4. Document Management & AI Scan Layer
-- ====================================================================

-- Documents Table
CREATE TABLE `documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `assessment_id` BIGINT NOT NULL,
    `parameter_code` VARCHAR(50) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `s3_bucket_key` VARCHAR(255) NOT NULL,
    `file_size_bytes` BIGINT NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_SCAN', -- PENDING_SCAN, CLEAN, INFECTED, DELETED
    `uploaded_by_id` BIGINT NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_documents_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_documents_uploader` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users` (`id`),
    INDEX `idx_documents_assessment` (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Analysis Results Table
CREATE TABLE `ai_analysis_results` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `document_id` BIGINT NOT NULL UNIQUE,
    `confidence_score` DECIMAL(5, 2) NOT NULL,
    `status` VARCHAR(30) NOT NULL, -- PROCESSING, SUCCESS, FAILED
    `extracted_text_json` JSON NULL,
    `anomaly_flags_json` JSON NULL,
    `analyzed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ai_results_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ====================================================================
-- 5. Audits, Workflow History & Certificates Layer
-- ====================================================================

-- Workflow History Table
CREATE TABLE `workflow_histories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `assessment_id` BIGINT NOT NULL,
    `from_status` VARCHAR(30) NOT NULL,
    `to_status` VARCHAR(30) NOT NULL,
    `assigned_to_id` BIGINT NULL,
    `comment` TEXT NULL,
    `transition_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_workflow_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_workflow_actor` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`),
    INDEX `idx_workflow_assessment` (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Certificates Table
CREATE TABLE `certificates` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `company_id` BIGINT NOT NULL,
    `factory_id` BIGINT NOT NULL,
    `assessment_id` BIGINT NOT NULL UNIQUE,
    `certificate_number` VARCHAR(100) NOT NULL UNIQUE, -- GC-YYYY-XXXXX
    `rating_level` VARCHAR(30) NOT NULL, -- Bronze, Silver, Gold, Platinum
    `score_achieved` DECIMAL(6, 2) NOT NULL,
    `issue_date` DATE NOT NULL,
    `expiry_date` DATE NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED
    `pdf_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_certificates_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_certificates_factory` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_certificates_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
    INDEX `idx_certificates_number` (`certificate_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- 6. Core Metadata Seeds
-- ====================================================================

-- Permissions Seeds
INSERT INTO `permissions` (`code`, `description`) VALUES
('read:factory', 'Read factory metadata'),
('write:assessment', 'Submit sustainability values'),
('verify:documents', 'Read AI OCR reports');

-- Roles Seeds
INSERT INTO `roles` (`name`, `description`) VALUES
('ROLE_SUPER_ADMIN', 'System Master Administrator'),
('ROLE_ADMIN', 'System Administrator'),
('ROLE_GREENCO_COORDINATOR', 'GreenCo Rating Coordinator'),
('ROLE_GREENCO_ASSESSOR', 'Assessor and Auditor'),
('ROLE_MANUFACTURING_COMPANY', 'Manufacturing Company Representative');

-- Admin Role Permissions Association
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 1), -- Admin maps read:factory
(2, 2), -- Admin maps write:assessment
(2, 3); -- Admin maps verify:documents

-- Demo Users Seeds (Pass hashes correspond to AdminPass123! and FactoryPass123!)
INSERT INTO `users` (`email`, `password_hash`, `first_name`, `last_name`, `status`) VALUES
('admin@greenco.org', '$2a$10$o1v9n9j0R2N5a3GZ3yJ/beHn9KjHn0zCkW1o5KkX9o1p3f1.3f.1y', 'GreenCo', 'Admin', 'ACTIVE'),
('factory@steelcorp.com', '$2a$10$2lK0S5m7m.1O2X4Y6n9mpeL1k3N5a7m9eO2w4k6Y9o1p3f1.3f.1y', 'SteelCorp', 'Operator', 'ACTIVE');

-- Demo Users Roles Association
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 2), -- Admin gets ROLE_ADMIN
(2, 5); -- Operator gets ROLE_MANUFACTURING_COMPANY
