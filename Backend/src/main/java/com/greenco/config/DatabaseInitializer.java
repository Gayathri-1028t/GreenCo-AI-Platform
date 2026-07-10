package com.greenco.config;

import com.greenco.common.AppConstants;
import com.greenco.entity.AssessmentParameter;
import com.greenco.entity.Permission;
import com.greenco.entity.Role;
import com.greenco.entity.User;
import com.greenco.entity.Company;
import com.greenco.entity.Factory;
import com.greenco.entity.FactoryBaseline;
import com.greenco.entity.Assessment;
import com.greenco.entity.AssessmentResponse;
import com.greenco.entity.Certificate;
import com.greenco.entity.WorkflowHistory;
import com.greenco.repository.AssessmentParameterRepository;
import com.greenco.repository.RoleRepository;
import com.greenco.repository.UserRepository;
import com.greenco.repository.CompanyRepository;
import com.greenco.repository.FactoryRepository;
import com.greenco.repository.FactoryBaselineRepository;
import com.greenco.repository.AssessmentRepository;
import com.greenco.repository.AssessmentResponseRepository;
import com.greenco.repository.CertificateRepository;
import com.greenco.repository.WorkflowHistoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AssessmentParameterRepository parameterRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final FactoryRepository factoryRepository;
    private final FactoryBaselineRepository baselineRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final CertificateRepository certificateRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    private Role adminRoleCached;
    private Role companyRoleCached;

    public DatabaseInitializer(UserRepository userRepository, 
                               RoleRepository roleRepository, 
                               AssessmentParameterRepository parameterRepository,
                               PasswordEncoder passwordEncoder,
                               CompanyRepository companyRepository,
                               FactoryRepository factoryRepository,
                               FactoryBaselineRepository baselineRepository,
                               AssessmentRepository assessmentRepository,
                               AssessmentResponseRepository responseRepository,
                               CertificateRepository certificateRepository,
                               WorkflowHistoryRepository workflowHistoryRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.parameterRepository = parameterRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
        this.factoryRepository = factoryRepository;
        this.baselineRepository = baselineRepository;
        this.assessmentRepository = assessmentRepository;
        this.responseRepository = responseRepository;
        this.certificateRepository = certificateRepository;
        this.workflowHistoryRepository = workflowHistoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@greenco.org")) {
            seedDatabase();
        } else {
            userRepository.findByEmail("admin@greenco.org").ifPresent(admin -> {
                admin.setPasswordHash(passwordEncoder.encode("AdminPass123!"));
                userRepository.save(admin);
            });
        }
        
        if (!userRepository.existsByEmail("factory@steelcorp.com")) {
            Role companyRole = roleRepository.findByName("ROLE_MANUFACTURING_COMPANY")
                .orElseGet(() -> roleRepository.findByName("MANUFACTURING_COMPANY")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_MANUFACTURING_COMPANY").description("Company Representative").build())));

            // Find or create Company for SteelCorp
            Company company = companyRepository.findByLegalName("SteelCorp Industries")
                .orElseGet(() -> companyRepository.save(Company.builder()
                    .legalName("SteelCorp Industries")
                    .registrationNumber("REG-100000")
                    .taxId("GST-300000AA")
                    .status("ACTIVE")
                    .build()));

            User companyUser = User.builder()
                    .email("factory@steelcorp.com")
                    .passwordHash(passwordEncoder.encode("FactoryPass123!"))
                    .firstName("SteelCorp")
                    .lastName("Operator")
                    .status("ACTIVE")
                    .companyId(company.getId())
                    .roles(Set.of(companyRole))
                    .build();
            userRepository.save(companyUser);
        }

        seedParameters();
        seedEnterpriseDemoData();
    }

    private void seedDatabase() {
        Permission readFactory = Permission.builder().code("read:factory").description("Read factory metadata").build();
        Permission writeAssessment = Permission.builder().code("write:assessment").description("Submit sustainability values").build();
        Permission verifyDoc = Permission.builder().code("verify:documents").description("Read AI OCR reports").build();

        Role adminRole = Role.builder()
                .name(AppConstants.ROLE_ADMIN)
                .description("System administrator")
                .permissions(Set.of(readFactory, writeAssessment, verifyDoc))
                .build();

        Role companyRole = Role.builder()
                .name(AppConstants.ROLE_COMPANY)
                .description("Manufacturing company user")
                .permissions(Set.of(readFactory, writeAssessment))
                .build();

        adminRoleCached = roleRepository.save(adminRole);
        companyRoleCached = roleRepository.save(companyRole);

        User adminUser = User.builder()
                .email("admin@greenco.org")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .firstName("GreenCo")
                .lastName("Admin")
                .status("ACTIVE")
                .roles(Set.of(adminRole))
                .build();

        User companyUser = User.builder()
                .email("factory@steelcorp.com")
                .passwordHash(passwordEncoder.encode("FactoryPass123!"))
                .firstName("SteelCorp")
                .lastName("Operator")
                .status("ACTIVE")
                .roles(Set.of(companyRole))
                .build();

        userRepository.save(adminUser);
        userRepository.save(companyUser);
    }

    private void seedParameters() {
        saveParamIfAbsent("ENV-PAR-01", "Environmental Parameters", "Environmental Parameters & general criteria compliance", 50.0);
        saveParamIfAbsent("EN-EFF-01", "Energy Efficiency", "Specific Energy Consumption reduction targets and performance", 150.0);
        saveParamIfAbsent("WT-CON-02", "Water Conservation", "Rainwater harvesting capacity and water recycling systems", 100.0);
        saveParamIfAbsent("WS-GEN-03", "Waste Management", "Solid waste categorization and zero landfill disposal progress", 120.0);
        saveParamIfAbsent("GHG-EM-01", "Carbon Emissions", "Greenhouse gas emissions scope-1 and scope-2 mapping", 100.0);
        saveParamIfAbsent("RE-USE-01", "Renewable Energy", "Renewable energy usage ratio and onsite solar/wind setups", 80.0);
    }

    private void saveParamIfAbsent(String code, String pillar, String desc, double maxScore) {
        if (parameterRepository.findByParameterCode(code).isEmpty()) {
            parameterRepository.save(AssessmentParameter.builder()
                .parameterCode(code)
                .pillarName(pillar)
                .description(desc)
                .maxScore(maxScore)
                .build());
        }
    }

    private void seedEnterpriseDemoData() {
        // 1. Generate 20 companies
        List<Company> companies = new ArrayList<>();
        String[] companyNames = {
            "SteelCorp Industries", "EcoBuild Construction", "GreenGrid Energy", "BioPharma Solutions",
            "Oceanic Shipping", "Apex Logistics", "Nova Textiles", "TerraAgro Foods",
            "SolaTech Systems", "HydraWater Corp", "AeroDynamics Aerospace", "Quantum Computing",
            "Vertex Chemicals", "Pioneer Paper", "Summit Plastics", "Infinity Auto",
            "EcoPaper Packaging", "GreenSteel Metallurgy", "CleanEnergy Systems", "PureWater Utilities"
        };
        String[] sectors = {
            "Metals", "Cement & Building Materials", "Power & Energy", "Pharmaceuticals",
            "Logistics & Shipping", "Transportation", "Textiles", "Food Processing",
            "Electronics & Semiconductor", "Chemicals", "Engineering & Machinery", "Glass & Ceramics",
            "Paper & Pulp", "Plastics", "Automotive", "Foundry", "Mining", "Fertilizers",
            "Sugar & Distilleries", "Water Management"
        };
        for (int i = 0; i < 20; i++) {
            final int index = i;
            Company comp = companyRepository.findByLegalName(companyNames[i]).orElse(null);
            if (comp == null) {
                comp = companyRepository.save(Company.builder()
                    .legalName(companyNames[index])
                    .registrationNumber("REG-" + (100000 + index))
                    .taxId("GST-" + (300000 + index) + "AA")
                    .status("ACTIVE")
                    .headquartersAddress((100 + index) + " Industrial Zone, Phase " + (1 + (index % 3)))
                    .website("https://www." + companyNames[index].toLowerCase().replace(" ", "").replace("&", "") + ".com")
                    .industry(sectors[index])
                    .contactPerson("Manager " + companyNames[index].split(" ")[0])
                    .contactEmail("contact@" + companyNames[index].toLowerCase().replace(" ", "").replace("&", "") + ".com")
                    .contactPhone("+91 98765 " + String.format("%05d", 10000 + index))
                    .employeeCount(250 + index * 115)
                    .annualRevenue(12.5 + index * 8.4)
                    .logoUrl("https://placehold.co/100x100/10b981/ffffff?text=" + companyNames[index].substring(0, 2).toUpperCase())
                    .build());
            } else if (comp.getIndustry() == null) {
                comp.setIndustry(sectors[index]);
                comp.setContactPerson("Manager " + companyNames[index].split(" ")[0]);
                comp.setContactEmail("contact@" + companyNames[index].toLowerCase().replace(" ", "").replace("&", "") + ".com");
                comp.setContactPhone("+91 98765 " + String.format("%05d", 10000 + index));
                comp.setEmployeeCount(250 + index * 115);
                comp.setAnnualRevenue(12.5 + index * 8.4);
                comp.setLogoUrl("https://placehold.co/100x100/10b981/ffffff?text=" + companyNames[index].substring(0, 2).toUpperCase());
                comp.setTaxId("GST-" + (300000 + index) + "AA");
                comp = companyRepository.save(comp);
            }
            companies.add(comp);
        }

        // 2. Generate 30 users (including admin already seeded)
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
            .orElseGet(() -> roleRepository.findByName("ADMIN")
            .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").description("System administrator").build())));

        Role companyRole = roleRepository.findByName("ROLE_MANUFACTURING_COMPANY")
            .orElseGet(() -> roleRepository.findByName("MANUFACTURING_COMPANY")
            .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_MANUFACTURING_COMPANY").description("Company Representative").build())));
        
        for (int i = 0; i < 20; i++) {
            String email = "operator" + (i + 1) + "@" + companies.get(i).getWebsite().replace("https://www.", "");
            if (!userRepository.existsByEmail(email)) {
                User operator = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .firstName("Operator")
                    .lastName("No" + (i + 1))
                    .status("ACTIVE")
                    .companyId(companies.get(i).getId())
                    .roles(Set.of(companyRole))
                    .build();
                userRepository.save(operator);
            }
        }
        
        for (int i = 0; i < 8; i++) {
            String email = "assessor" + (i + 1) + "@greenco.org";
            if (!userRepository.existsByEmail(email)) {
                User assessor = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .firstName("Assessor")
                    .lastName("No" + (i + 1))
                    .status("ACTIVE")
                    .roles(Set.of(adminRole))
                    .build();
                userRepository.save(assessor);
            }
        }

        Role assessorRole = roleRepository.findByName("ROLE_GREENCO_ASSESSOR")
            .orElseGet(() -> roleRepository.findByName("GREENCO_ASSESSOR")
            .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_GREENCO_ASSESSOR").description("GreenCo Assessor (Auditor)").build())));

        Role coordinatorRole = roleRepository.findByName("ROLE_GREENCO_COORDINATOR")
            .orElseGet(() -> roleRepository.findByName("GREENCO_COORDINATOR")
            .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_GREENCO_COORDINATOR").description("GreenCo Coordinator (Sustainability Manager)").build())));

        if (userRepository.countByRoleName("ROLE_GREENCO_ASSESSOR") == 0) {
            String[] assessorFirst = {"Arun", "Deepak", "Kiran", "Mohan", "Vinod"};
            String[] assessorLast = {"Kumar", "Nair", "Reddy", "Raj", "Sharma"};
            for (int i = 0; i < 5; i++) {
                String email = assessorFirst[i].toLowerCase() + "." + assessorLast[i].toLowerCase() + "@greenco.org";
                if (!userRepository.existsByEmail(email)) {
                    userRepository.save(User.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .firstName(assessorFirst[i])
                        .lastName(assessorLast[i])
                        .status("ACTIVE")
                        .roles(Set.of(assessorRole))
                        .build());
                }
            }
        }

        if (userRepository.countByRoleName("ROLE_GREENCO_COORDINATOR") == 0) {
            String[] coordFirst = {"Priya", "Sneha", "Meera", "Kavya", "Ananya"};
            String[] coordLast = {"Iyer", "Patel", "Gupta", "Rao", "Sharma"};
            for (int i = 0; i < 5; i++) {
                String email = coordFirst[i].toLowerCase() + "." + coordLast[i].toLowerCase() + "@greenco.org";
                if (!userRepository.existsByEmail(email)) {
                    userRepository.save(User.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .firstName(coordFirst[i])
                        .lastName(coordLast[i])
                        .status("ACTIVE")
                        .roles(Set.of(coordinatorRole))
                        .build());
                }
            }
        }

        // 3. Generate 40 factories (2 per company)
        List<Factory> factories = new ArrayList<>();
        String[] factoryTypes = { "Processing", "Manufacturing", "Assembly", "Refinery" };
        String[] grades = { "Platinum", "Gold", "Silver", "Certified" };
        for (int i = 0; i < 20; i++) {
            Company comp = companies.get(i);
            for (int f = 1; f <= 2; f++) {
                String factoryName = comp.getLegalName() + " Plant " + f;
                final int index = i;
                final int factoryIndex = f;
                
                String fCode = "FAC-" + comp.getLegalName().substring(0,3).toUpperCase() + "-" + factoryIndex;
                String fType = factoryTypes[(index + factoryIndex) % 4];
                String fCategory = comp.getIndustry();
                String fHead = "Director " + comp.getLegalName().split(" ")[0] + " P" + factoryIndex;
                String fEmail = "plant" + factoryIndex + "@" + comp.getWebsite().replace("https://www.", "");
                String fPhone = "+91 99887 " + String.format("%05d", 20000 + index * 2 + factoryIndex);
                Double fCap = 50000.0 + (index * 10000.0) + (factoryIndex * 2500.0);
                String fGrade = grades[(index + factoryIndex) % 4];
                String fLogo = "https://placehold.co/100x100/3b82f6/ffffff?text=" + comp.getLegalName().substring(0, 2).toUpperCase() + "P" + factoryIndex;

                Factory fact = factoryRepository.findByName(factoryName).stream().findFirst().orElse(null);
                if (fact == null) {
                    fact = factoryRepository.save(Factory.builder()
                        .company(comp)
                        .name(factoryName)
                        .sectorType(sectors[index])
                        .address("Plot " + (factoryIndex * 12) + ", sector " + index + ", Industrial Area")
                        .latitude(12.9716 + (index * 0.1) + (factoryIndex * 0.05))
                        .longitude(77.5946 + (index * 0.1) - (factoryIndex * 0.05))
                        .buildingAreaSqm(5000.0 + (index * 1000.0) + (factoryIndex * 500.0))
                        .employeeCount(150 + (index * 20) + (factoryIndex * 10))
                        .status("ACTIVE")
                        .factoryCode(fCode)
                        .logoUrl(fLogo)
                        .factoryType(fType)
                        .manufacturingCategory(fCategory)
                        .factoryHead(fHead)
                        .email(fEmail)
                        .phone(fPhone)
                        .annualProductionCapacity(fCap)
                        .sustainabilityGrade(fGrade)
                        .build());
                    
                    // Add baseline data for this factory
                    baselineRepository.save(FactoryBaseline.builder()
                        .factory(fact)
                        .baselineYear(2022)
                        .electricityConsumptionKwh(150000.0 + (index * 25000.0))
                        .waterConsumptionKl(8000.0 + (index * 500.0))
                        .wasteGeneratedMt(300.0 + (index * 20.0))
                        .build());
                } else if (fact.getFactoryCode() == null) {
                    fact.setFactoryCode(fCode);
                    fact.setLogoUrl(fLogo);
                    fact.setFactoryType(fType);
                    fact.setManufacturingCategory(fCategory);
                    fact.setFactoryHead(fHead);
                    fact.setEmail(fEmail);
                    fact.setPhone(fPhone);
                    fact.setAnnualProductionCapacity(fCap);
                    fact.setSustainabilityGrade(fGrade);
                    fact = factoryRepository.save(fact);
                }
                factories.add(fact);
            }
        }
        // 4. Generate 150 Sustainability Assessments
        List<Assessment> assessments = new ArrayList<>();
        String[] statuses = {"APPROVED", "DRAFT", "SUBMITTED", "UNDER_TECHNICAL_REVIEW", "SITE_AUDIT"};
        List<AssessmentParameter> params = parameterRepository.findAll();
        
        java.util.Random rand = new java.util.Random(42);
        
        for (int i = 0; i < 150; i++) {
            Factory fact = factories.get(i % factories.size());
            
            if (assessmentRepository.count() >= 150) {
                break;
            }
            
            String status = statuses[i % statuses.length];
            if (i < 100) {
                status = "APPROVED";
            }
            
            double score = 150.0 + rand.nextDouble() * 200.0;
            String ratingLevel;
            if (score >= 320) ratingLevel = "Platinum";
            else if (score >= 280) ratingLevel = "Gold";
            else if (score >= 240) ratingLevel = "Silver";
            else if (score >= 200) ratingLevel = "Bronze";
            else ratingLevel = "Certified";
            
            Assessment ass = Assessment.builder()
                .factory(fact)
                .status(status)
                .ratingVersion("v3.0")
                .scoreAchieved(score)
                .ratingLevel(ratingLevel)
                .submittedAt(LocalDateTime.now().minusDays(150 - i))
                .build();
            ass = assessmentRepository.save(ass);
            assessments.add(ass);

            for (AssessmentParameter param : params) {
                double maxVal = param.getMaxScore();
                double entered = maxVal * (0.6 + rand.nextDouble() * 0.4);
                AssessmentResponse resp = AssessmentResponse.builder()
                    .assessment(ass)
                    .parameter(param)
                    .enteredValue(entered * 1.5)
                    .calculatedPoints(Math.round(entered * 100.0) / 100.0)
                    .isOverridden(false)
                    .build();
                responseRepository.save(resp);
            }

            if ("APPROVED".equals(status)) {
                Certificate cert = Certificate.builder()
                    .company(fact.getCompany())
                    .factory(fact)
                    .assessment(ass)
                    .certificateNumber("GC-2026-" + String.format("%05d", i + 1))
                    .ratingLevel(ratingLevel)
                    .scoreAchieved(score)
                    .issueDate(java.time.LocalDate.now().minusDays(120 - i))
                    .expiryDate(java.time.LocalDate.now().plusYears(2).minusDays(120 - i))
                    .status("ACTIVE")
                    .pdfUrl("https://greenco-s3.s3.amazonaws.com/certificates/GC-2026-" + String.format("%05d", i + 1) + ".pdf")
                    .build();
                certificateRepository.save(cert);
            }

            if (i < 50) {
                WorkflowHistory hist = WorkflowHistory.builder()
                    .assessment(ass)
                    .fromStatus("SUBMITTED")
                    .toStatus(status)
                    .comment("Automated transition based on technical assessment review verification.")
                    .transitionDate(LocalDateTime.now().minusDays(50 - i))
                    .build();
                workflowHistoryRepository.save(hist);
            }
        }
    }
}
