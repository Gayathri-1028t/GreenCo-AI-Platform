import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==========================================
// 🛠️ MOCK DATABASE SYSTEM FOR FRONTEND DEMO
// ==========================================
const MOCK_DB_KEY = 'greenco_demo_db'

const initialDB = {
  companies: [
    { id: 1, name: "SteelCorp Industries", industryType: "Metals", location: "Chennai, TN", employeeCount: 1200, factoryCount: 3, sustainabilityScore: 82.5, ratingLevel: "GOLD" },
    { id: 2, name: "EcoBuild Construction", industryType: "Cement & Glass", location: "Coimbatore, TN", employeeCount: 850, factoryCount: 2, sustainabilityScore: 78.4, ratingLevel: "SILVER" },
    { id: 3, name: "GreenGrid Energy", industryType: "Power Utilities", location: "Bengaluru, KA", employeeCount: 620, factoryCount: 2, sustainabilityScore: 92.1, ratingLevel: "PLATINUM" },
    { id: 4, name: "Nova Textiles", industryType: "Textiles", location: "Mumbai, MH", employeeCount: 1500, factoryCount: 3, sustainabilityScore: 71.3, ratingLevel: "BRONZE" },
    { id: 5, name: "Apex Logistics", industryType: "Automotive", location: "Pune, MH", employeeCount: 1100, factoryCount: 2, sustainabilityScore: 68.2, ratingLevel: "BRONZE" },
    { id: 6, name: "PureWater Utilities", industryType: "Water supply", location: "Hyderabad, TS", employeeCount: 450, factoryCount: 1, sustainabilityScore: 89.6, ratingLevel: "GOLD" },
    { id: 7, name: "IndoGlass Manufacturing", industryType: "Cement & Glass", location: "Firozabad, UP", employeeCount: 950, factoryCount: 2, sustainabilityScore: 74.8, ratingLevel: "SILVER" },
    { id: 8, name: "Tata Metallurgy", industryType: "Metals", location: "Jamshedpur, JH", employeeCount: 3500, factoryCount: 4, sustainabilityScore: 86.4, ratingLevel: "GOLD" },
    { id: 9, name: "Godrej Eco-Furniture", industryType: "Wood products", location: "Surat, GJ", employeeCount: 780, factoryCount: 1, sustainabilityScore: 91.2, ratingLevel: "PLATINUM" },
    { id: 10, name: "Chennai Metallurgy Works", industryType: "Metals", location: "Chennai, TN", employeeCount: 890, factoryCount: 1, sustainabilityScore: 64.5, ratingLevel: "BRONZE" },
    { id: 11, name: "GreenSteel Foundry", industryType: "Metals", location: "Tumkur, KA", employeeCount: 740, factoryCount: 1, sustainabilityScore: 79.8, ratingLevel: "SILVER" },
    { id: 12, name: "Salem Rolling Mills", industryType: "Metals", location: "Salem, TN", employeeCount: 680, factoryCount: 1, sustainabilityScore: 75.3, ratingLevel: "SILVER" },
    { id: 13, name: "Coimbatore Textiles B", industryType: "Textiles", location: "Coimbatore, TN", employeeCount: 1100, factoryCount: 1, sustainabilityScore: 83.2, ratingLevel: "GOLD" },
    { id: 14, name: "Hindustan Petrochemicals", industryType: "Chemicals", location: "Visakhapatnam, AP", employeeCount: 2200, factoryCount: 2, sustainabilityScore: 69.4, ratingLevel: "BRONZE" },
    { id: 15, name: "Giga Solar Systems", industryType: "Power Utilities", location: "Ahmedabad, GJ", employeeCount: 930, factoryCount: 2, sustainabilityScore: 94.7, ratingLevel: "PLATINUM" }
  ],
  factories: [
    { id: 1, companyId: 1, name: "SteelCorp Chennai Plant 1", companyName: "SteelCorp Industries", state: "Tamil Nadu", city: "Chennai", latitude: 13.0827, longitude: 80.2707, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 84, emissionScore: 78, energyUsage: 45000, waterUsage: 25000, sectorType: "Metals", employeeCount: 500, address: "Industrial Estate, Guindy, Chennai, TN" },
    { id: 2, companyId: 1, name: "SteelCorp Chennai Plant 2", companyName: "SteelCorp Industries", state: "Tamil Nadu", city: "Chennai", latitude: 13.1584, longitude: 80.1649, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 76, emissionScore: 85, energyUsage: 52000, waterUsage: 28000, sectorType: "Metals", employeeCount: 400, address: "Ambattur Industrial Area, Chennai, TN" },
    { id: 3, companyId: 1, name: "SteelCorp Coimbatore Plant", companyName: "SteelCorp Industries", state: "Tamil Nadu", city: "Coimbatore", latitude: 11.0168, longitude: 76.9558, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 87, emissionScore: 72, energyUsage: 38000, waterUsage: 22000, sectorType: "Metals", employeeCount: 300, address: "Peelamedu, Coimbatore, TN" },
    { id: 4, companyId: 2, name: "EcoBuild Coimbatore Block A", companyName: "EcoBuild Construction", state: "Tamil Nadu", city: "Coimbatore", latitude: 11.0315, longitude: 77.0142, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 79, emissionScore: 68, energyUsage: 29000, waterUsage: 19000, sectorType: "Cement & Glass", employeeCount: 450, address: "Ganapathy, Coimbatore, TN" },
    { id: 5, companyId: 2, name: "EcoBuild Coimbatore Block B", companyName: "EcoBuild Construction", state: "Tamil Nadu", city: "Coimbatore", latitude: 10.9880, longitude: 76.9620, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 68, emissionScore: 92, energyUsage: 33000, waterUsage: 24000, sectorType: "Cement & Glass", employeeCount: 400, address: "Kurichi Industrial Area, Coimbatore, TN" },
    { id: 6, companyId: 3, name: "GreenGrid Bengaluru HQ", companyName: "GreenGrid Energy", state: "Karnataka", city: "Bengaluru", latitude: 12.9716, longitude: 77.5946, status: "ACTIVE", ratingLevel: "PLATINUM", sustainabilityScore: 94, emissionScore: 40, energyUsage: 12000, waterUsage: 8000, sectorType: "Power Utilities", employeeCount: 320, address: "Whitefield, Bengaluru, KA" },
    { id: 7, companyId: 3, name: "GreenGrid Tumkur Array", companyName: "GreenGrid Energy", state: "Karnataka", city: "Tumkur", latitude: 13.3379, longitude: 77.1173, status: "ACTIVE", ratingLevel: "PLATINUM", sustainabilityScore: 91, emissionScore: 42, energyUsage: 14000, waterUsage: 9000, sectorType: "Power Utilities", employeeCount: 300, address: "Vasanthanarasapura, Tumkur, KA" },
    { id: 8, companyId: 4, name: "Nova Textiles Mumbai Mill", companyName: "Nova Textiles", state: "Maharashtra", city: "Mumbai", latitude: 19.0760, longitude: 72.8777, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 72, emissionScore: 80, energyUsage: 48000, waterUsage: 35000, sectorType: "Textiles", employeeCount: 600, address: "Lower Parel, Mumbai, MH" },
    { id: 9, companyId: 4, name: "Nova Textiles Pune Mill", companyName: "Nova Textiles", state: "Maharashtra", city: "Pune", latitude: 18.5204, longitude: 73.8567, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 77, emissionScore: 74, energyUsage: 41000, waterUsage: 29000, sectorType: "Textiles", employeeCount: 500, address: "Hadapsar, Pune, MH" },
    { id: 10, companyId: 4, name: "Nova Textiles Surat Facility", companyName: "Nova Textiles", state: "Gujarat", city: "Surat", latitude: 21.1702, longitude: 72.8311, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 65, emissionScore: 89, energyUsage: 55000, waterUsage: 41000, sectorType: "Textiles", employeeCount: 400, address: "Sachin GIDC, Surat, GJ" },
    { id: 11, companyId: 5, name: "Apex Motors Pune Plant 1", companyName: "Apex Logistics", state: "Maharashtra", city: "Pune", latitude: 18.6298, longitude: 73.7997, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 74, emissionScore: 82, energyUsage: 62000, waterUsage: 31000, sectorType: "Automotive", employeeCount: 650, address: "Pimpri Chinchwad, Pune, MH" },
    { id: 12, companyId: 5, name: "Apex Motors Chakan Plant 2", companyName: "Apex Logistics", state: "Maharashtra", city: "Pune", latitude: 18.7844, longitude: 73.8488, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 62, emissionScore: 95, energyUsage: 71000, waterUsage: 38000, sectorType: "Automotive", employeeCount: 450, address: "Chakan Phase II, Pune, MH" },
    { id: 13, companyId: 6, name: "PureWater Hyd Filtration", companyName: "PureWater Utilities", state: "Telangana", city: "Hyderabad", latitude: 17.3850, longitude: 78.4867, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 89, emissionScore: 48, energyUsage: 19000, waterUsage: 11000, sectorType: "Water supply", employeeCount: 450, address: "Gachibowli, Hyderabad, TS" },
    { id: 14, companyId: 7, name: "IndoGlass Firozabad Works", companyName: "IndoGlass Manufacturing", state: "Uttar Pradesh", city: "Firozabad", latitude: 27.1512, longitude: 78.3972, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 76, emissionScore: 84, energyUsage: 58000, waterUsage: 39000, sectorType: "Cement & Glass", employeeCount: 550, address: "Glass Colony, Firozabad, UP" },
    { id: 15, companyId: 7, name: "IndoGlass Agra Plant", companyName: "IndoGlass Manufacturing", state: "Uttar Pradesh", city: "Agra", latitude: 27.1767, longitude: 78.0081, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 68, emissionScore: 90, energyUsage: 46000, waterUsage: 32000, sectorType: "Cement & Glass", employeeCount: 400, address: "Sikandra, Agra, UP" },
    { id: 16, companyId: 8, name: "Tata Metals Jamshedpur 1", companyName: "Tata Metallurgy", state: "Jharkhand", city: "Jamshedpur", latitude: 22.8046, longitude: 86.2029, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 86, emissionScore: 71, energyUsage: 95000, waterUsage: 54000, sectorType: "Metals", employeeCount: 1500, address: "Bistupur, Jamshedpur, JH" },
    { id: 17, companyId: 8, name: "Tata Metals Jamshedpur 2", companyName: "Tata Metallurgy", state: "Jharkhand", city: "Jamshedpur", latitude: 22.7801, longitude: 86.2234, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 85, emissionScore: 75, energyUsage: 89000, waterUsage: 49000, sectorType: "Metals", employeeCount: 1200, address: "Golmuri, Jamshedpur, JH" },
    { id: 18, companyId: 8, name: "Tata Metals Kalinganagar", companyName: "Tata Metallurgy", state: "Odisha", city: "Kalinganagar", latitude: 20.9634, longitude: 86.1322, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 79, emissionScore: 80, energyUsage: 78000, waterUsage: 43000, sectorType: "Metals", employeeCount: 800, address: "Kalinganagar Industrial Complex, OD" },
    { id: 19, companyId: 9, name: "Godrej Woodwork Surat", companyName: "Godrej Eco-Furniture", state: "Gujarat", city: "Surat", latitude: 21.2185, longitude: 72.8639, status: "ACTIVE", ratingLevel: "PLATINUM", sustainabilityScore: 91, emissionScore: 35, energyUsage: 16000, waterUsage: 10000, sectorType: "Wood products", employeeCount: 780, address: "Hazira, Surat, GJ" },
    { id: 20, companyId: 10, name: "Chennai Metallurgy Plant", companyName: "Chennai Metallurgy Works", state: "Tamil Nadu", city: "Chennai", latitude: 13.0418, longitude: 80.2034, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 64, emissionScore: 96, energyUsage: 42000, waterUsage: 27000, sectorType: "Metals", employeeCount: 890, address: "Guindy, Chennai, TN" },
    { id: 21, companyId: 11, name: "GreenSteel Tumkur Foundry", companyName: "GreenSteel Foundry", state: "Karnataka", city: "Tumkur", latitude: 13.3400, longitude: 77.1000, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 79, emissionScore: 82, energyUsage: 35000, waterUsage: 21000, sectorType: "Metals", employeeCount: 740, address: "Tumkur Industrial Area, KA" },
    { id: 22, companyId: 12, name: "Salem Steel Rolling Mills", companyName: "Salem Rolling Mills", state: "Tamil Nadu", city: "Salem", latitude: 11.6643, longitude: 78.1460, status: "ACTIVE", ratingLevel: "SILVER", sustainabilityScore: 75, emissionScore: 83, energyUsage: 31000, waterUsage: 18000, sectorType: "Metals", employeeCount: 680, address: "Salem Steel Plant Road, TN" },
    { id: 23, companyId: 13, name: "Coimbatore Textiles Mill B", companyName: "Coimbatore Textiles B", state: "Tamil Nadu", city: "Coimbatore", latitude: 11.0180, longitude: 76.9700, status: "ACTIVE", ratingLevel: "GOLD", sustainabilityScore: 83, emissionScore: 69, energyUsage: 34000, waterUsage: 21000, sectorType: "Textiles", employeeCount: 1100, address: "Singanallur, Coimbatore, TN" },
    { id: 24, companyId: 14, name: "HPCL Visakhapatnam Plant", companyName: "Hindustan Petrochemicals", state: "Andhra Pradesh", city: "Visakhapatnam", latitude: 17.6868, longitude: 83.2185, status: "ACTIVE", ratingLevel: "BRONZE", sustainabilityScore: 69, emissionScore: 94, energyUsage: 85000, waterUsage: 59000, sectorType: "Chemicals", employeeCount: 2200, address: "Malkapuram, Visakhapatnam, AP" },
    { id: 25, companyId: 15, name: "Giga Solar Ahmedabad Array", companyName: "Giga Solar Systems", state: "Gujarat", city: "Ahmedabad", latitude: 23.0225, longitude: 72.5714, status: "ACTIVE", ratingLevel: "PLATINUM", sustainabilityScore: 94, emissionScore: 28, energyUsage: 8000, waterUsage: 5000, sectorType: "Power Utilities", employeeCount: 930, address: "Sanand, Ahmedabad, GJ" }
  ],
  assessments: [
    { id: 1, companyId: 1, companyName: "SteelCorp Industries", factoryId: 1, factoryName: "SteelCorp Chennai Plant 1", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 840.0, submittedAt: "2026-05-10T10:00:00Z", createdAt: "2026-04-10T09:00:00Z" },
    { id: 2, companyId: 1, companyName: "SteelCorp Industries", factoryId: 2, factoryName: "SteelCorp Chennai Plant 2", ratingVersion: "V3.0", status: "UNDER_TECHNICAL_REVIEW", scoreAchieved: 760.0, submittedAt: "2026-07-02T14:30:00Z", createdAt: "2026-06-01T11:00:00Z" },
    { id: 3, companyId: 1, companyName: "SteelCorp Industries", factoryId: 3, factoryName: "SteelCorp Coimbatore Plant", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 870.0, submittedAt: "2026-06-15T16:20:00Z", createdAt: "2026-05-15T10:00:00Z" },
    { id: 4, companyId: 2, companyName: "EcoBuild Construction", factoryId: 4, factoryName: "EcoBuild Coimbatore Block A", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 790.0, submittedAt: "2026-04-20T11:15:00Z", createdAt: "2026-03-20T09:30:00Z" },
    { id: 5, companyId: 2, companyName: "EcoBuild Construction", factoryId: 5, factoryName: "EcoBuild Coimbatore Block B", ratingVersion: "V3.0", status: "SITE_AUDIT", scoreAchieved: 680.0, submittedAt: "2026-07-09T09:45:00Z", createdAt: "2026-06-09T14:00:00Z" },
    { id: 6, companyId: 3, companyName: "GreenGrid Energy", factoryId: 6, factoryName: "GreenGrid Bengaluru HQ", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 940.0, submittedAt: "2026-03-05T10:30:00Z", createdAt: "2026-02-05T09:00:00Z" },
    { id: 7, companyId: 3, companyName: "GreenGrid Energy", factoryId: 7, factoryName: "GreenGrid Tumkur Array", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 910.0, submittedAt: "2026-05-22T15:00:00Z", createdAt: "2026-04-22T11:00:00Z" },
    { id: 8, companyId: 4, companyName: "Nova Textiles", factoryId: 8, factoryName: "Nova Textiles Mumbai Mill", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 720.0, submittedAt: "2026-01-10T14:00:00Z", createdAt: "2025-12-10T10:00:00Z" },
    { id: 9, companyId: 4, companyName: "Nova Textiles", factoryId: 9, factoryName: "Nova Textiles Pune Mill", ratingVersion: "V3.0", status: "UNDER_TECHNICAL_REVIEW", scoreAchieved: 770.0, submittedAt: "2026-07-08T11:30:00Z", createdAt: "2026-06-08T09:00:00Z" },
    { id: 10, companyId: 4, companyName: "Nova Textiles", factoryId: 10, factoryName: "Nova Textiles Surat Facility", ratingVersion: "V3.0", status: "DRAFT", scoreAchieved: 650.0, submittedAt: null, createdAt: "2026-07-01T15:00:00Z" },
    { id: 11, companyId: 5, companyName: "Apex Logistics", factoryId: 11, factoryName: "Apex Motors Pune Plant 1", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 740.0, submittedAt: "2026-02-28T16:00:00Z", createdAt: "2026-01-28T10:00:00Z" },
    { id: 12, companyId: 5, companyName: "Apex Logistics", factoryId: 12, factoryName: "Apex Motors Chakan Plant 2", ratingVersion: "V3.0", status: "REJECTED", scoreAchieved: 620.0, submittedAt: "2026-06-30T10:00:00Z", createdAt: "2026-05-30T09:00:00Z" },
    { id: 13, companyId: 6, companyName: "PureWater Utilities", factoryId: 13, factoryName: "PureWater Hyd Filtration", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 890.0, submittedAt: "2026-03-12T11:00:00Z", createdAt: "2026-02-12T09:00:00Z" },
    { id: 14, companyId: 7, companyName: "IndoGlass Manufacturing", factoryId: 14, factoryName: "IndoGlass Firozabad Works", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 760.0, submittedAt: "2026-05-18T14:00:00Z", createdAt: "2026-04-18T09:00:00Z" },
    { id: 15, companyId: 8, companyName: "Tata Metallurgy", factoryId: 16, factoryName: "Tata Metals Jamshedpur 1", ratingVersion: "V3.0", status: "APPROVED", scoreAchieved: 860.0, submittedAt: "2026-06-20T10:00:00Z", createdAt: "2026-05-20T08:00:00Z" }
  ],
  auditLogs: [
    { id: 1, timestamp: "2026-07-12T14:30:00Z", user: "admin@greenco.org", module: "AUTH", action: "LOGIN", ip: "192.168.1.50", status: "SUCCESS", details: "User login successful from IP 192.168.1.50" },
    { id: 2, timestamp: "2026-07-12T12:15:00Z", user: "auditor@greenco.org", module: "ASSESSMENT", action: "ASSESSMENT_REVIEW", ip: "192.168.1.51", status: "SUCCESS", details: "Started review for SteelCorp Chennai Plant 2" },
    { id: 3, timestamp: "2026-07-12T10:45:00Z", user: "manager@steelcorp.com", module: "DOCUMENT", action: "DOCUMENT_UPLOAD", ip: "192.168.1.52", status: "SUCCESS", details: "Uploaded Coimbatore_Textiles_Audit_Report.pdf" },
    { id: 4, timestamp: "2026-07-11T16:20:00Z", user: "operator2@ecobuild.com", module: "ASSESSMENT", action: "ASSESSMENT_SUBMIT", ip: "192.168.1.53", status: "SUCCESS", details: "Submitted EcoBuild Coimbatore Block B for technical audit" },
    { id: 5, timestamp: "2026-07-11T14:10:00Z", user: "admin@greenco.org", module: "USER", action: "USER_CREATE", ip: "192.168.1.54", status: "SUCCESS", details: "Created new user auditor2@greenco.org with ROLE_GREENCO_ASSESSOR" },
    { id: 6, timestamp: "2026-07-11T11:30:00Z", user: "manager@novatex.com", module: "ASSESSMENT", action: "ASSESSMENT_CREATE", ip: "192.168.1.55", status: "SUCCESS", details: "Initialized V3.0 rating roadmap for Nova Textiles Surat Facility" },
    { id: 7, timestamp: "2026-07-10T17:05:00Z", user: "auditor@greenco.org", module: "ASSESSMENT", action: "ASSESSMENT_APPROVE", ip: "192.168.1.56", status: "SUCCESS", details: "Approved Tata Metals Jamshedpur 1 with score 860.0" },
    { id: 8, timestamp: "2026-07-10T15:25:00Z", user: "admin@greenco.org", module: "COMPANY", action: "COMPANY_CREATE", ip: "192.168.1.57", status: "SUCCESS", details: "Registered Tata Metallurgy as corporate partner" },
    { id: 9, timestamp: "2026-07-10T12:00:00Z", user: "manager@apex.com", module: "ASSESSMENT", action: "ASSESSMENT_SUBMIT", ip: "192.168.1.58", status: "SUCCESS", details: "Submitted Apex Motors Chakan Plant 2" },
    { id: 10, timestamp: "2026-07-10T09:40:00Z", user: "auditor@greenco.org", module: "ASSESSMENT", action: "ASSESSMENT_REJECT", ip: "192.168.1.59", status: "SUCCESS", details: "Rejected Apex Motors Chakan Plant 2 (critical energy gaps)" },
    { id: 11, timestamp: "2026-07-09T18:15:00Z", user: "operator1@steelcorp.com", module: "ASSESSMENT", action: "ANSWER_SAVE", ip: "192.168.1.60", status: "SUCCESS", details: "Saved answers for Section 3 (Water Stewardship) on Plant 2" },
    { id: 12, timestamp: "2026-07-09T15:30:00Z", user: "admin@greenco.org", module: "FACTORY", action: "FACTORY_CREATE", ip: "192.168.1.61", status: "SUCCESS", details: "Registered Tata Metals Kalinganagar under Tata Metallurgy" },
    { id: 13, timestamp: "2026-07-09T11:00:00Z", user: "auditor@greenco.org", module: "CERTIFICATE", action: "CERTIFICATE_GENERATION", ip: "192.168.1.62", status: "SUCCESS", details: "Generated certificate GC-2026-00108 for Tata Metals Jamshedpur 1" },
    { id: 14, timestamp: "2026-07-08T16:50:00Z", user: "manager@steelcorp.com", module: "DOCUMENT", action: "DOCUMENT_UPLOAD", ip: "192.168.1.63", status: "SUCCESS", details: "Uploaded Furnace_Green_Hydrogen_Proposal.pdf" },
    { id: 15, timestamp: "2026-07-08T14:20:00Z", user: "admin@greenco.org", module: "SETTINGS", action: "SETTINGS_UPDATE", ip: "192.168.1.64", status: "SUCCESS", details: "Updated platform SMTP notification templates" },
    { id: 16, timestamp: "2026-07-08T10:00:00Z", user: "operator1@novatex.com", module: "ASSESSMENT", action: "ANSWER_SAVE", ip: "192.168.1.65", status: "SUCCESS", details: "Saved answers for Section 1 (Energy Efficiency) on Pune Mill" },
    { id: 17, timestamp: "2026-07-07T15:30:00Z", user: "manager@novatex.com", module: "DOCUMENT", action: "DOCUMENT_UPLOAD", ip: "192.168.1.66", status: "SUCCESS", details: "Uploaded Water_Management_Strategy.pdf" },
    { id: 18, timestamp: "2026-07-07T11:15:00Z", user: "auditor@greenco.org", module: "ASSESSMENT", action: "ASSESSMENT_REVIEW", ip: "192.168.1.67", status: "SUCCESS", details: "Assigned site audit schedule for EcoBuild Coimbatore Block B" },
    { id: 19, timestamp: "2026-07-06T14:40:00Z", user: "admin@greenco.org", module: "USER", action: "USER_ROLE_UPDATE", ip: "192.168.1.68", status: "SUCCESS", details: "Promoted manager@steelcorp.com to ROLE_COMPANY_MANAGER" },
    { id: 20, timestamp: "2026-07-06T09:20:00Z", user: "operator1@steelcorp.com", module: "ASSESSMENT", action: "ANSWER_SAVE", ip: "192.168.1.69", status: "SUCCESS", details: "Saved answers for Section 2 (Materials & Recycling) on Plant 2" }
  ],
  users: [
    { id: 1, email: "admin@greenco.org", firstName: "System", lastName: "Admin", roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"], companyId: null, companyName: "GreenCo Corp", status: "ACTIVE" },
    { id: 2, email: "manager@steelcorp.com", firstName: "Satish", lastName: "Kumar", roles: ["ROLE_MANUFACTURING_COMPANY"], companyId: 1, companyName: "SteelCorp Industries", status: "ACTIVE" },
    { id: 3, email: "operator1@steelcorp.com", firstName: "Vijay", lastName: "Prasad", roles: ["ROLE_FACTORY_OPERATOR"], companyId: 1, companyName: "SteelCorp Industries", status: "ACTIVE" },
    { id: 4, email: "auditor@greenco.org", firstName: "Ramesh", lastName: "Krishnan", roles: ["ROLE_GREENCO_ASSESSOR"], companyId: null, companyName: "GreenCo Corp", status: "ACTIVE" },
    { id: 5, email: "manager@ecobuild.com", firstName: "Anjali", lastName: "Sharma", roles: ["ROLE_MANUFACTURING_COMPANY"], companyId: 2, companyName: "EcoBuild Construction", status: "ACTIVE" },
    { id: 6, email: "operator2@ecobuild.com", firstName: "Deepak", lastName: "Nair", roles: ["ROLE_FACTORY_OPERATOR"], companyId: 2, companyName: "EcoBuild Construction", status: "ACTIVE" },
    { id: 7, email: "sustainability@greengrid.com", firstName: "Priya", lastName: "Patel", roles: ["ROLE_GREENCO_COORDINATOR"], companyId: 3, companyName: "GreenGrid Energy", status: "ACTIVE" },
    { id: 8, email: "viewer@steelcorp.com", firstName: "Karthik", lastName: "Rao", roles: ["ROLE_VIEWER"], companyId: 1, companyName: "SteelCorp Industries", status: "ACTIVE" }
  ],
  reports: [
    { id: 1, type: "CARBON", name: "SteelCorp Q2 Carbon Emissions Audit", period: "Q2 2026", generatedAt: "2026-07-05", status: "READY", carbonEmission: 87430, energyUsage: 254920 },
    { id: 2, type: "WATER", name: "Chennai Metallurgy Water Footprint Log", period: "Q2 2026", generatedAt: "2026-07-04", status: "READY", waterUsage: 45890, waterRecycled: 18230 },
    { id: 3, type: "WASTE", name: "EcoBuild Solid Waste diversion report", period: "H1 2026", generatedAt: "2026-07-01", status: "READY", wasteGenerated: 12450, wasteRecycled: 9870 },
    { id: 4, type: "ESG", name: "Nova Textiles Consolidated ESG Rating Report", period: "FY2025-26", generatedAt: "2026-06-28", status: "READY", scoreAchieved: 79.4, complianceStatus: "COMPLIANT" },
    { id: 5, type: "COMPLIANCE", name: "Salem Rolling Mills Environmental Audit", period: "Annual 2026", generatedAt: "2026-06-25", status: "READY", detectedIssues: 0, complianceStatus: "COMPLIANT" },
    { id: 6, type: "ENERGY", name: "Tata Metals Energy efficiency summary", period: "Q2 2026", generatedAt: "2026-06-20", status: "READY", energyUsage: 954020, energySaved: 84500 }
  ],
  documents: [
    { id: 1, fileName: "Coimbatore_Textiles_Audit_Report.pdf", fileType: "PDF", uploadedBy: "Satish Kumar", createdAt: "2026-07-08", parameterCode: "ENV-PAR-01", assessmentId: 2 },
    { id: 2, fileName: "Furnace_Green_Hydrogen_Proposal.pdf", fileType: "PDF", uploadedBy: "Satish Kumar", createdAt: "2026-07-08", parameterCode: "EN-EFF-01", assessmentId: 2 },
    { id: 3, fileName: "Water_Management_Strategy.pdf", fileType: "PDF", uploadedBy: "Satish Kumar", createdAt: "2026-07-07", parameterCode: "WT-CON-02", assessmentId: 2 }
  ],
  workflowHistory: [
    { id: 1, assessmentId: 2, assignedToName: "Satish Kumar", fromStatus: "DRAFT", toStatus: "SUBMITTED", comment: "Ready for coordinator technical review.", transitionDate: "2026-07-02T14:00:00Z" },
    { id: 2, assessmentId: 2, assignedToName: "Ramesh Krishnan", fromStatus: "SUBMITTED", toStatus: "UNDER_TECHNICAL_REVIEW", comment: "Beginning audit checks.", transitionDate: "2026-07-02T14:30:00Z" }
  ]
}

const getDemoDB = () => {
  let dbStr = window.localStorage.getItem(MOCK_DB_KEY)
  if (!dbStr) {
    window.localStorage.setItem(MOCK_DB_KEY, JSON.stringify(initialDB))
    return initialDB
  }
  try {
    return JSON.parse(dbStr)
  } catch (e) {
    window.localStorage.setItem(MOCK_DB_KEY, JSON.stringify(initialDB))
    return initialDB
  }
}

const saveDemoDB = (db) => {
  window.localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db))
}

const getMockCertificates = (db) => {
  return db.assessments.filter(a => a.status === 'APPROVED').map((a) => {
    const issueTime = new Date(a.submittedAt || a.createdAt)
    issueTime.setDate(issueTime.getDate() + 30)
    const expiryTime = new Date(issueTime)
    expiryTime.setFullYear(expiryTime.getFullYear() + 2)
    
    let level = 'Certified'
    if (a.scoreAchieved >= 900) level = 'Platinum'
    else if (a.scoreAchieved >= 800) level = 'Gold'
    else if (a.scoreAchieved >= 700) level = 'Silver'
    else if (a.scoreAchieved >= 600) level = 'Bronze'

    const serialNum = 10000 + a.id * 183
    
    return {
      id: a.id,
      certificateNumber: `GC-2026-${serialNum}`,
      companyName: a.companyName,
      companyId: a.companyId,
      factoryName: a.factoryName,
      factoryId: a.factoryId,
      ratingLevel: level,
      status: 'ACTIVE',
      issueDate: issueTime.toISOString().split('T')[0],
      expiryDate: expiryTime.toISOString().split('T')[0],
      scoreAchieved: a.scoreAchieved
    }
  })
}

const getMockReportMetrics = (facilityId) => {
  const fId = parseInt(facilityId) || 1
  const energySaved = Math.max(10, Math.min(45, Math.round(20 + (fId * 1.5) % 25)))
  const waterSaved = Math.max(15, Math.min(50, Math.round(25 + (fId * 2) % 25)))
  const wasteSaved = Math.max(10, Math.min(60, Math.round(15 + (fId * 3) % 40)))

  const baselineEnergy = 150000
  const baselineWater = 8000
  const baselineWaste = 300
  const baselineCarbon = 400

  const actualEnergy = Math.round(baselineEnergy * (1 - energySaved / 100))
  const actualWater = Math.round(baselineWater * (1 - waterSaved / 100))
  const actualWaste = Math.round(baselineWaste * (1 - wasteSaved / 100))
  
  const db = getDemoDB()
  const fact = db.factories.find(f => f.id === fId) || db.factories[0]
  const co2Reduced = Math.round((baselineCarbon - (fact?.emissionScore || 70)) * 1.5)

  return {
    electricityBaselineKwh: baselineEnergy,
    electricityActualKwh: actualEnergy,
    waterBaselineKl: baselineWater,
    waterActualKl: actualWater,
    wasteBaselineMt: baselineWaste,
    wasteActualMt: actualWaste,
    co2EmissionsReducedMt: co2Reduced,
    electricitySavedPct: energySaved,
    waterSavedPct: waterSaved,
    wasteSavedPct: wasteSaved
  }
}

const getMockCopilotData = (facilityId) => {
  const fId = parseInt(facilityId) || 1
  const db = getDemoDB()
  const fact = db.factories.find(f => f.id === fId) || db.factories[0]
  
  let readiness = 82
  if (fId % 3 === 0) readiness = 90
  else if (fId % 3 === 1) readiness = 78
  
  const score = fact.sustainabilityScore || 75
  const isHeavy = fact.sectorType === 'Metals' || fact.sectorType === 'Chemicals'
  const risk = isHeavy ? 'HIGH' : 'LOW'
  const rating = fact.ratingLevel || 'SILVER'
  const progress = Math.min(100, Math.max(0, Math.round(score * 0.95)))
  
  const complianceIndex = score > 85 ? 'TIER_1' : score > 70 ? 'TIER_2' : 'TIER_3'

  return {
    sustainabilityScore: score,
    aiReadiness: readiness,
    carbonRisk: risk,
    esgRating: rating,
    netZeroProgress: progress,
    complianceIndex: complianceIndex,
    esgForecast: [
      { year: '2021', actual: score - 15, forecast: null },
      { year: '2022', actual: score - 10, forecast: null },
      { year: '2023', actual: score - 5, forecast: null },
      { year: '2024', actual: score - 2, forecast: null },
      { year: '2025', actual: score, forecast: score },
      { year: '2026', actual: null, forecast: Math.min(100, score + 4) },
      { year: '2027', actual: null, forecast: Math.min(100, score + 8) }
    ],
    strengths: [
      "On-site solar array installations offset peak grid dependency.",
      "High level of water recycling in cooling tower blowdown lines."
    ],
    weaknesses: [
      "Scope 1 emissions still remain high due to natural gas furnace combustion.",
      "Waste segregation monitoring is currently handled manually, causing occasional logging delays."
    ],
    recommendations: [
      "Install automated waste sensors to streamline resource logs.",
      "Introduce low-nitrogen gas burners or electric heating elements in rolling mills."
    ]
  }
}

// Intercept, process and serve mock data logic
function handleMockRequest(config) {
  const method = config.method.toUpperCase()
  const rawUrl = config.url || ''
  
  let url = rawUrl
  const v1Index = url.indexOf('/api/v1')
  if (v1Index !== -1) {
    url = url.substring(v1Index + 7)
  }
  url = url.replace(/^\/+/, '').split('?')[0] // get clean relative URL path

  const db = getDemoDB()

  // 1. GET dashboard/summary
  if (method === 'GET' && url === 'dashboard/summary') {
    const APPROVED = db.assessments.filter(a => a.status === 'APPROVED').length
    const UNDER_TECHNICAL_REVIEW = db.assessments.filter(a => a.status === 'UNDER_TECHNICAL_REVIEW').length
    const SITE_AUDIT = db.assessments.filter(a => a.status === 'SITE_AUDIT').length
    const DRAFT = db.assessments.filter(a => a.status === 'DRAFT').length
    const REJECTED = db.assessments.filter(a => a.status === 'REJECTED').length

    return {
      success: true,
      data: {
        totalCompanies: db.companies.length,
        totalFactories: db.factories.length,
        activeAssessments: db.assessments.filter(a => a.status !== 'APPROVED').length,
        statusDistribution: {
          APPROVED,
          UNDER_TECHNICAL_REVIEW,
          SITE_AUDIT,
          DRAFT,
          REJECTED
        }
      }
    }
  }

  // 2. GET certificates
  if (method === 'GET' && url === 'certificates') {
    const certs = getMockCertificates(db)
    const companyId = config.params?.companyId
    const filteredCerts = companyId ? certs.filter(c => c.companyId === parseInt(companyId)) : certs
    return {
      success: true,
      data: {
        content: filteredCerts,
        totalElements: filteredCerts.length,
        totalPages: 1
      }
    }
  }

  // 3. GET companies
  if (method === 'GET' && url === 'companies') {
    const search = (config.params?.search || '').toLowerCase()
    const status = config.params?.status
    let list = db.companies
    if (search) {
      list = list.filter(c => c.name.toLowerCase().includes(search))
    }
    if (status) {
      list = list.filter(c => c.ratingLevel === status)
    }
    return {
      success: true,
      data: {
        content: list,
        totalElements: list.length,
        totalPages: 1
      }
    }
  }

  // 4. GET companies/:id
  const companyMatch = url.match(/^companies\/(\d+)$/)
  if (method === 'GET' && companyMatch) {
    const companyId = parseInt(companyMatch[1])
    const company = db.companies.find(c => c.id === companyId)
    return {
      success: true,
      data: company
    }
  }

  // 5. POST companies
  if (method === 'POST' && url === 'companies') {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const newCompany = {
      id: db.companies.length > 0 ? Math.max(...db.companies.map(c => c.id)) + 1 : 1,
      name: data.name,
      industryType: data.industryType || 'General Manufacturing',
      location: data.location || 'India',
      employeeCount: data.employeeCount || 250,
      factoryCount: 0,
      sustainabilityScore: 0,
      ratingLevel: 'Certified'
    }
    db.companies.push(newCompany)
    saveDemoDB(db)
    return {
      success: true,
      data: newCompany
    }
  }

  // 6. GET factories
  if (method === 'GET' && url === 'factories') {
    const search = (config.params?.search || '').toLowerCase()
    const sector = config.params?.sectorType
    let list = db.factories
    if (search) {
      list = list.filter(f => f.name.toLowerCase().includes(search) || f.city.toLowerCase().includes(search))
    }
    if (sector) {
      list = list.filter(f => f.sectorType === sector)
    }
    return {
      success: true,
      data: {
        content: list,
        totalElements: list.length,
        totalPages: 1
      }
    }
  }

  // 7. GET factories/company/:id
  const companyFactoriesMatch = url.match(/^factories\/company\/(\d+)$/)
  if (method === 'GET' && companyFactoriesMatch) {
    const companyId = parseInt(companyFactoriesMatch[1])
    const list = db.factories.filter(f => f.companyId === companyId)
    return {
      success: true,
      data: list
    }
  }

  // 8. GET factories/:id
  const factoryMatch = url.match(/^factories\/(\d+)$/)
  if (method === 'GET' && factoryMatch) {
    const factoryId = parseInt(factoryMatch[1])
    const factory = db.factories.find(f => f.id === factoryId)
    return {
      success: true,
      data: factory
    }
  }

  // 9. POST factories
  if (method === 'POST' && url === 'factories') {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const companyId = parseInt(data.companyId) || 1
    const company = db.companies.find(c => c.id === companyId)
    const newFactory = {
      id: db.factories.length > 0 ? Math.max(...db.factories.map(f => f.id)) + 1 : 1,
      companyId,
      companyName: company ? company.name : 'Unknown Company',
      name: data.name,
      state: data.state || 'Tamil Nadu',
      city: data.city || 'Chennai',
      latitude: parseFloat(data.latitude) || 13.0827,
      longitude: parseFloat(data.longitude) || 80.2707,
      status: 'ACTIVE',
      ratingLevel: 'Certified',
      sustainabilityScore: 0,
      emissionScore: 0,
      energyUsage: 0,
      waterUsage: 0,
      sectorType: data.sectorType || 'Manufacturing',
      employeeCount: parseInt(data.employeeCount) || 100,
      address: data.address || `${data.city}, ${data.state}`
    }
    db.factories.push(newFactory)
    if (company) {
      company.factoryCount = db.factories.filter(f => f.companyId === companyId).length
    }
    saveDemoDB(db)
    return {
      success: true,
      data: newFactory
    }
  }

  // 10. GET assessments
  if (method === 'GET' && url === 'assessments') {
    const companyId = config.params?.companyId
    let list = db.assessments
    if (companyId) {
      list = list.filter(a => a.companyId === parseInt(companyId))
    }
    return {
      success: true,
      data: {
        content: list,
        totalElements: list.length,
        totalPages: 1
      }
    }
  }

  // 11. GET assessments/:id
  const assessmentMatch = url.match(/^assessments\/(\d+)$/)
  if (method === 'GET' && assessmentMatch) {
    const assId = parseInt(assessmentMatch[1])
    const ass = db.assessments.find(a => a.id === assId)
    return {
      success: true,
      data: ass
    }
  }

  // 12. GET assessments/:id/responses
  const responsesMatch = url.match(/^assessments\/(\d+)\/responses$/)
  if (method === 'GET' && responsesMatch) {
    const assId = parseInt(responsesMatch[1])
    const ass = db.assessments.find(a => a.id === assId)
    return {
      success: true,
      data: ass ? (ass.responses || []) : []
    }
  }

  // 13. PUT assessments/:id/responses
  if (method === 'PUT' && responsesMatch) {
    const assId = parseInt(responsesMatch[1])
    const ass = db.assessments.find(a => a.id === assId)
    if (ass) {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      ass.responses = data.responses || []
      
      const energyVal = ass.responses.find(r => r.parameterCode === 'EN-EFF-01')?.enteredValue || 0
      const waterVal = ass.responses.find(r => r.parameterCode === 'WT-CON-02')?.enteredValue || 0
      const wasteVal = ass.responses.find(r => r.parameterCode === 'WS-GEN-03')?.enteredValue || 0
      const renewableVal = ass.responses.find(r => r.parameterCode === 'RE-USE-01')?.enteredValue || 0

      const energyEff = Math.max(0, Math.min(100, Math.round(((150000 - energyVal) / 150000) * 100)))
      const waterEff = Math.max(0, Math.min(100, Math.round(((8000 - waterVal) / 8000) * 100)))
      const wasteEff = Math.max(0, Math.min(100, Math.round(((300 - wasteVal) / 300) * 100)))
      const score = Math.round((energyEff + waterEff + wasteEff) / 3)
      const esg = Math.round(score * 0.8 + renewableVal * 0.2)

      ass.scoreAchieved = esg * 10 

      const fact = db.factories.find(f => f.id === ass.factoryId)
      if (fact) {
        fact.sustainabilityScore = esg
        if (esg >= 90) fact.ratingLevel = 'PLATINUM'
        else if (esg >= 80) fact.ratingLevel = 'GOLD'
        else if (esg >= 70) fact.ratingLevel = 'SILVER'
        else if (esg >= 60) fact.ratingLevel = 'BRONZE'
        else fact.ratingLevel = 'Certified'
      }

      saveDemoDB(db)
    }
    return {
      success: true,
      data: ass ? ass.responses : []
    }
  }

  // 14. POST assessments
  if (method === 'POST' && url === 'assessments') {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const factoryId = parseInt(data.factoryId)
    const factory = db.factories.find(f => f.id === factoryId)
    const newAss = {
      id: db.assessments.length > 0 ? Math.max(...db.assessments.map(a => a.id)) + 1 : 1,
      companyId: factory ? factory.companyId : 1,
      companyName: factory ? factory.companyName : 'Unknown Company',
      factoryId,
      factoryName: factory ? factory.name : 'Unknown Factory',
      ratingVersion: data.ratingVersion || 'V3.0',
      status: 'DRAFT',
      scoreAchieved: 0,
      submittedAt: null,
      createdAt: new Date().toISOString()
    }
    db.assessments.push(newAss)
    saveDemoDB(db)
    return {
      success: true,
      data: newAss
    }
  }

  // 15. POST assessments/:id/submit
  const submitMatch = url.match(/^assessments\/(\d+)\/submit$/)
  if (method === 'POST' && submitMatch) {
    const assId = parseInt(submitMatch[1])
    const ass = db.assessments.find(a => a.id === assId)
    if (ass) {
      ass.status = 'SUBMITTED'
      ass.submittedAt = new Date().toISOString()
      db.workflowHistory.push({
        id: Date.now(),
        assessmentId: assId,
        assignedToName: 'Vijay Prasad',
        fromStatus: 'DRAFT',
        toStatus: 'SUBMITTED',
        comment: 'Assessment form submitted for technical audit.',
        transitionDate: new Date().toISOString()
      })
      saveDemoDB(db)
    }
    return {
      success: true,
      data: ass
    }
  }

  // 16. GET documents/assessment/:id
  const docsMatch = url.match(/^documents\/assessment\/(\d+)$/)
  if (method === 'GET' && docsMatch) {
    const assId = parseInt(docsMatch[1])
    const list = db.documents.filter(d => d.assessmentId === assId)
    return {
      success: true,
      data: list
    }
  }

  // 17. POST documents/upload
  if (method === 'POST' && url === 'documents/upload') {
    let assId = 1
    let parameterCode = ''
    let fileName = 'support_invoice.pdf'
    
    if (config.data instanceof FormData) {
      assId = parseInt(config.data.get('assessmentId')) || 1
      parameterCode = config.data.get('parameterCode') || ''
      const fileObj = config.data.get('file')
      if (fileObj) {
        fileName = fileObj.name
      }
    } else {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      assId = parseInt(data?.assessmentId) || 1
      parameterCode = data?.parameterCode || ''
      fileName = data?.fileName || 'support_invoice.pdf'
    }

    const newDoc = {
      id: Date.now(),
      fileName,
      fileType: fileName.split('.').pop().toUpperCase(),
      uploadedBy: 'Vijay Prasad',
      createdAt: new Date().toISOString().split('T')[0],
      parameterCode,
      assessmentId: assId
    }
    db.documents.push(newDoc)
    saveDemoDB(db)
    return {
      success: true,
      data: newDoc
    }
  }

  // 18. GET workflow/assessments/:id/history
  const wfHistoryMatch = url.match(/^workflow\/assessments\/(\d+)\/history$/)
  if (method === 'GET' && wfHistoryMatch) {
    const assId = parseInt(wfHistoryMatch[1])
    const list = db.workflowHistory.filter(h => h.assessmentId === assId)
    return {
      success: true,
      data: list
    }
  }

  // 19. POST workflow/assessments/:id/transition
  const wfTransitionMatch = url.match(/^workflow\/assessments\/(\d+)\/transition$/)
  if (method === 'POST' && wfTransitionMatch) {
    const assId = parseInt(wfTransitionMatch[1])
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const ass = db.assessments.find(a => a.id === assId)
    if (ass) {
      const oldStatus = ass.status
      ass.status = data.toStatus
      ass.updatedAt = new Date().toISOString()
      db.workflowHistory.push({
        id: Date.now(),
        assessmentId: assId,
        assignedToName: 'Ramesh Krishnan',
        fromStatus: oldStatus,
        toStatus: data.toStatus,
        comment: data.comment || '',
        transitionDate: new Date().toISOString()
      })
      
      // If approved, trigger certificate emission
      if (data.toStatus === 'APPROVED') {
        const fact = db.factories.find(f => f.id === ass.factoryId)
        const certSerialNum = 10000 + assId * 183
        db.auditLogs.push({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          user: "auditor@greenco.org",
          module: "CERTIFICATE",
          action: "CERTIFICATE_GENERATION",
          ip: "192.168.1.62",
          status: "SUCCESS",
          details: `Certificate GC-2026-${certSerialNum} generated for ${ass.factoryName}`
        })
      }
      
      saveDemoDB(db)
    }
    return {
      success: true,
      data: ass
    }
  }

  // 20. GET users
  if (method === 'GET' && url === 'users') {
    return {
      success: true,
      data: {
        content: db.users,
        totalElements: db.users.length,
        totalPages: 1
      }
    }
  }

  // 21. POST users
  if (method === 'POST' && url === 'users') {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      email: data.email,
      firstName: data.firstName || 'User',
      lastName: data.lastName || 'GreenCo',
      roles: data.roles || ['ROLE_VIEWER'],
      companyId: data.companyId || 1,
      companyName: db.companies.find(c => c.id === parseInt(data.companyId))?.name || 'SteelCorp Industries',
      status: 'ACTIVE'
    }
    db.users.push(newUser)
    saveDemoDB(db)
    return {
      success: true,
      data: newUser
    }
  }

  // 22. DELETE users/:id
  const userDeleteMatch = url.match(/^users\/(\d+)$/)
  if (method === 'DELETE' && userDeleteMatch) {
    const uId = parseInt(userDeleteMatch[1])
    const user = db.users.find(u => u.id === uId)
    if (user) {
      user.status = 'INACTIVE'
      saveDemoDB(db)
    }
    return {
      success: true,
      data: user
    }
  }

  // 23. GET reports/facility/:id
  const reportsFacilityMatch = url.match(/^reports\/facility\/(\d+)$/)
  if (method === 'GET' && reportsFacilityMatch) {
    const facilityId = parseInt(reportsFacilityMatch[1])
    const metrics = getMockReportMetrics(facilityId)
    return {
      success: true,
      data: metrics
    }
  }

  // 24. GET copilot/factory/:id
  const copilotFactoryMatch = url.match(/^copilot\/factory\/(\d+)$/)
  if (method === 'GET' && copilotFactoryMatch) {
    const facilityId = parseInt(copilotFactoryMatch[1])
    const metrics = getMockCopilotData(facilityId)
    return {
      success: true,
      data: metrics
    }
  }

  // 25. GET audit-logs
  if (method === 'GET' && url === 'audit-logs') {
    return {
      success: true,
      data: {
        content: db.auditLogs,
        totalElements: db.auditLogs.length,
        totalPages: 1
      }
    }
  }

  // GET AI Gap suggestions
  const aiRecMatch = url.match(/^ai\/assessments\/(\d+)\/recommendations$/)
  if (method === 'GET' && aiRecMatch) {
    const assId = parseInt(aiRecMatch[1])
    const ass = db.assessments.find(a => a.id === assId)
    const score = ass ? ass.scoreAchieved / 10 : 75
    return {
      success: true,
      data: [
        {
          pillarName: "Energy Efficiency",
          currentScore: Math.round(score * 0.95),
          maxScore: 100,
          gapPoints: 100 - Math.round(score * 0.95),
          recommendations: [
            "Upgrade rolling mill induction induction furnace to high-temperature green hydrogen blend.",
            "Install variable frequency drives on cooling water recirculation pump loops."
          ]
        },
        {
          pillarName: "Water Stewardship",
          currentScore: Math.round(score * 0.85),
          maxScore: 100,
          gapPoints: 100 - Math.round(score * 0.85),
          recommendations: [
            "Install automatic reverse-osmosis filtration membranes to recover cooling tower blowdown effluent.",
            "Fit electromagnetic ultrasonic flow meters to detect leakage profiles."
          ]
        }
      ]
    }
  }

  return null
}

// Request Interceptor: Inject JWT token from Zustand store & Intercept mock routing
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Intercept API call for Demo Mode routing
    const mockRes = handleMockRequest(config)
    if (mockRes) {
      return Promise.reject({
        config,
        response: {
          status: 200,
          data: mockRes,
          headers: {},
          statusText: 'OK'
        },
        __isMock: true
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Global error logging and refresh trigger callbacks
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Return intercepted mock responses directly as resolved responses
    if (error && error.__isMock) {
      return error.response
    }

    const originalRequest = error.config
    
    // Check if error is 401 (Unauthorized) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Trigger silent token refresh logic
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true } // Cookies contain the HTTP-only refresh token
        )
        
        const { accessToken, user } = response.data
        
        // Update Zustand store
        useAuthStore.getState().setAuth(user, accessToken)
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token failed/expired -> Clear session
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
