-- ====================================================================
-- GreenCo Platform - Complete Database Seed Script
-- Production-Ready Mock Records for Testing & Demos
-- ====================================================================

-- Clear existing data (in correct dependency order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `certificates`;
TRUNCATE TABLE `workflow_histories`;
TRUNCATE TABLE `ai_analysis_results`;
TRUNCATE TABLE `documents`;
TRUNCATE TABLE `assessment_responses`;
TRUNCATE TABLE `assessment_parameters`;
TRUNCATE TABLE `assessments`;
TRUNCATE TABLE `factory_baselines`;
TRUNCATE TABLE `factories`;
TRUNCATE TABLE `companies`;
TRUNCATE TABLE `refresh_tokens`;
TRUNCATE TABLE `user_roles`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `role_permissions`;
TRUNCATE TABLE `roles`;
TRUNCATE TABLE `permissions`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Permissions Seeds
INSERT INTO `permissions` (`id`, `code`, `description`) VALUES
(1, 'read:factory', 'Read plant details and metrics'),
(2, 'write:factory', 'Modify plant metadata'),
(3, 'write:assessment', 'Submit self-assessment questionnaire responses'),
(4, 'verify:documents', 'Review attached invoice evidence files'),
(5, 'transition:workflow', 'Approve or reject status steps'),
(6, 'admin:all', 'Full system overrides');

-- 2. Roles Seeds
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ROLE_SUPER_ADMIN', 'System Master Administrator'),
(2, 'ROLE_ADMIN', 'System Administrator'),
(3, 'ROLE_GREENCO_COORDINATOR', 'GreenCo Rating Coordinator'),
(4, 'ROLE_GREENCO_ASSESSOR', 'Assessor and Auditor'),
(5, 'ROLE_MANUFACTURING_COMPANY', 'Manufacturing Company Representative');

-- 3. Role Permissions Associations
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), -- Admin permissions
(3, 1), (3, 4), (3, 5),                 -- Coordinator permissions
(4, 1), (4, 4), (4, 5),                 -- Assessor permissions
(5, 1), (5, 2), (5, 3);                 -- Company user permissions

-- 4. Companies Seeds
INSERT INTO `companies` (`id`, `legal_name`, `registration_number`, `tax_id`, `headquarters_address`, `website`, `status`) VALUES
(1, 'SteelCorp Industries Ltd', 'REG-1092837', 'TAX-US-991823', '742 Evergreen Terrace, Springfield', 'https://steelcorp.com', 'ACTIVE'),
(2, 'GreenChem Manufacturing Inc', 'REG-2231908', 'TAX-US-887123', '109 Industrial Parkway, Ohio', 'https://greenchem.org', 'ACTIVE'),
(3, 'Apex Automotive Group', 'REG-8812903', 'TAX-US-112233', '88 Assembly Line Blvd, Detroit', 'https://apexauto.com', 'PENDING_APPROVAL');

-- 5. Users Seeds (All password hashes resolve to "AdminPass123!" or "FactoryPass123!")
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `company_id`, `status`) VALUES
(1, 'admin@greenco.org', '$2a$10$o1v9n9j0R2N5a3GZ3yJ/beHn9KjHn0zCkW1o5KkX9o1p3f1.3f.1y', 'GreenCo', 'Admin', NULL, 'ACTIVE'),
(2, 'coordinator@greenco.org', '$2a$10$o1v9n9j0R2N5a3GZ3yJ/beHn9KjHn0zCkW1o5KkX9o1p3f1.3f.1y', 'Sarah', 'Jenkins', NULL, 'ACTIVE'),
(3, 'assessor@greenco.org', '$2a$10$o1v9n9j0R2N5a3GZ3yJ/beHn9KjHn0zCkW1o5KkX9o1p3f1.3f.1y', 'Robert', 'Miller', NULL, 'ACTIVE'),
(4, 'factory@steelcorp.com', '$2a$10$2lK0S5m7m.1O2X4Y6n9mpeL1k3N5a7m9eO2w4k6Y9o1p3f1.3f.1y', 'John', 'Doe', 1, 'ACTIVE'),
(5, 'operator@greenchem.com', '$2a$10$2lK0S5m7m.1O2X4Y6n9mpeL1k3N5a7m9eO2w4k6Y9o1p3f1.3f.1y', 'Alice', 'Smith', 2, 'ACTIVE');

-- 6. User Roles Associations
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 2), -- Admin gets ROLE_ADMIN
(2, 3), -- Coordinator gets ROLE_GREENCO_COORDINATOR
(3, 4), -- Assessor gets ROLE_GREENCO_ASSESSOR
(4, 5), -- Operator gets ROLE_MANUFACTURING_COMPANY
(5, 5); -- Operator gets ROLE_MANUFACTURING_COMPANY

-- 7. Factories Seeds
INSERT INTO `factories` (`id`, `company_id`, `name`, `sector_type`, `address`, `latitude`, `longitude`, `building_area_sqm`, `employee_count`, `status`) VALUES
(1, 1, 'Springfield Casting Plant', 'Steel Production', 'Sector 7G, Industrial Area, Springfield', 39.7817, -89.6501, 150000.00, 450, 'ACTIVE'),
(2, 2, 'Cleveland Solvent Refining Unit', 'Chemical Processing', '412 Chemistry Way, Cleveland, Ohio', 41.4993, -81.6944, 85000.00, 220, 'ACTIVE'),
(3, 1, 'Columbus Metal Stamping Yard', 'Automotive Assembly', '88 Fabricators Lane, Columbus, Ohio', 39.9612, -82.9988, 120000.00, 310, 'ACTIVE');

-- 8. Factory Baselines Seeds (Utility metrics)
INSERT INTO `factory_baselines` (`factory_id`, `baseline_year`, `electricity_consumption_kwh`, `water_consumption_kl`, `waste_generated_mt`) VALUES
(1, 2024, 1500000.00, 45000.00, 800.00),
(2, 2024, 950000.00, 25000.00, 400.00),
(3, 2024, 1100000.00, 30000.00, 500.00);

-- 9. Assessment Parameters Seeds (Master Benchmarks)
INSERT INTO `assessment_parameters` (`id`, `pillar_name`, `parameter_code`, `description`, `max_score`) VALUES
(1, 'Energy Efficiency', 'EN-EFF-01', 'Specific Energy Consumption reduction targets and performance', 150.00),
(2, 'Water Conservation', 'WT-CON-02', 'Rainwater harvesting capacity and water recycling systems', 100.00),
(3, 'Waste Management', 'WS-GEN-03', 'Solid waste categorization and zero landfill disposal progress', 120.00);

-- 10. Assessments Seeds (Rating statuses workflows)
INSERT INTO `assessments` (`id`, `factory_id`, `status`, `rating_version`, `score_achieved`, `rating_level`, `submitted_at`) VALUES
(1, 1, 'APPROVED', 'v3.0', 720.00, 'Gold', '2026-06-01 10:00:00'),
(2, 2, 'DRAFT', 'v3.0', 0.00, NULL, NULL),
(3, 3, 'SUBMITTED', 'v3.0', 250.00, NULL, '2026-07-08 09:30:00');

-- 11. Assessment Responses Seeds (Inputs scores mapping)
-- For Approved Assessment 1 (Springfield plant - scored gold 720.0/1000 equivalent ratios)
INSERT INTO `assessment_responses` (`assessment_id`, `parameter_id`, `entered_value`, `calculated_points`, `auditor_comment`) VALUES
(1, 1, 90.0000, 135.00, 'Validated energy billing invoices. 10% reduction verified.'),
(1, 2, 85.0000, 85.00, 'Verified rainwater pit capacity. Clean records.'),
(1, 3, 80.0000, 96.00, 'Waste audit sheet complete and validated.'),
-- For Submitted Assessment 3 (Columbus plant - pending coordinator review)
(3, 1, 75.0000, 112.50, NULL),
(3, 2, 60.0000, 60.00, NULL),
(3, 3, 50.0000, 60.00, NULL);

-- 12. Documents Seeds (Evidence uploads)
INSERT INTO `documents` (`id`, `assessment_id`, `parameter_code`, `file_name`, `s3_bucket_key`, `file_size_bytes`, `mime_type`, `status`, `uploaded_by_id`) VALUES
(1, 1, 'EN-EFF-01', 'electricity_bill_june_2026.pdf', 'assessment-1/elec-bill.pdf', 1048576, 'application/pdf', 'CLEAN', 4),
(2, 1, 'WT-CON-02', 'water_invoice_june_2026.png', 'assessment-1/water-inv.png', 524288, 'image/png', 'CLEAN', 4);

-- 13. AI Analysis Results Seeds (Mock OCR runs)
INSERT INTO `ai_analysis_results` (`document_id`, `confidence_score`, `status`, `extracted_text_json`, `anomaly_flags_json`) VALUES
(1, 98.50, 'SUCCESS', '{"billingPeriod": "June 2026", "kilowattHours": 90.0, "meterId": "M-991223"}', '[]'),
(2, 92.40, 'SUCCESS', '{"billingPeriod": "June 2026", "kiloliters": 85.0, "meterId": "W-112233"}', '[]');

-- 14. Workflow History Seeds (Transition Logs)
INSERT INTO `workflow_histories` (`assessment_id`, `from_status`, `to_status`, `assigned_to_id`, `comment`) VALUES
(1, 'DRAFT', 'SUBMITTED', 4, 'Initial submission of rating files'),
(1, 'SUBMITTED', 'UNDER_TECHNICAL_REVIEW', 2, 'Starting initial verification of invoices'),
(1, 'UNDER_TECHNICAL_REVIEW', 'SITE_AUDIT', 3, 'In-person audit scheduled for Springfield facility'),
(1, 'SITE_AUDIT', 'APPROVED', 3, 'Audit passed. Awarding Gold status certificate.');

-- 15. Certificates Seeds (Final ledger)
INSERT INTO `certificates` (`company_id`, `factory_id`, `assessment_id`, `certificate_number`, `rating_level`, `score_achieved`, `issue_date`, `expiry_date`, `status`, `pdf_url`) VALUES
(1, 1, 1, 'GC-2026-10823', 'Gold', 720.00, '2026-06-01', '2028-06-01', 'ACTIVE', '/certificates/GC-2026-10823/pdf');
