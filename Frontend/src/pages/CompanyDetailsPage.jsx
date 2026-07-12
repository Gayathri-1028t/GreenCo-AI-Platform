import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'
import { 
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Activity,
  FileBadge,
  ShieldAlert,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react'

const FRONTEND_DEMO_COMPANIES = [
  {
    id: 1,
    legalName: "SteelCorp Industries",
    name: "SteelCorp Industries",
    industry: "Metals",
    industryType: "Metals",
    headquartersAddress: "12 Industrial Estate, Guindy, Chennai, TN",
    location: "Chennai, TN",
    employeeCount: 1200,
    employees: 1200,
    factoryCount: 3,
    sustainabilityScore: 82.5,
    carbonRating: "A+",
    waterEfficiency: "92%",
    renewableEnergy: 64,
    esgRating: "AA",
    ratingLevel: "GOLD",
    certificationLevel: "GOLD",
    status: "ACTIVE",
    createdDate: "2024-05-15",
    description: "Leading metallurgy and steel manufacturing company focusing on energy-efficient arc furnaces and carbon offset initiatives.",
    ceo: "Rajesh Kumar",
    contactEmail: "info@steelcorp.com",
    contactPhone: "+91 44 2490 8123",
    website: "https://www.steelcorp.com",
    annualRevenue: 420.5,
    foundedYear: 1998,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=SC"
  },
  {
    id: 2,
    legalName: "Eco Cement Ltd",
    name: "Eco Cement Ltd",
    industry: "Cement & Glass",
    industryType: "Cement & Glass",
    headquartersAddress: "45 Kurichi Industrial Area, Coimbatore, TN",
    location: "Coimbatore, TN",
    employeeCount: 850,
    employees: 850,
    factoryCount: 2,
    sustainabilityScore: 78.4,
    carbonRating: "A",
    waterEfficiency: "88%",
    renewableEnergy: 45,
    esgRating: "A",
    ratingLevel: "SILVER",
    certificationLevel: "SILVER",
    status: "ACTIVE",
    createdDate: "2024-06-20",
    description: "Specialized in eco-friendly cement clinker formulations and waste heat recovery systems for modern building aggregates.",
    ceo: "Suresh Menon",
    contactEmail: "contact@ecocement.co.in",
    contactPhone: "+91 422 2678 1234",
    website: "https://www.ecocement.co.in",
    annualRevenue: 290.0,
    foundedYear: 2005,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=EC"
  },
  {
    id: 3,
    legalName: "GreenTextiles Pvt Ltd",
    name: "GreenTextiles Pvt Ltd",
    industry: "Textiles",
    industryType: "Textiles",
    headquartersAddress: "88 Peepul Road, Tiruppur, TN",
    location: "Tiruppur, TN",
    employeeCount: 1500,
    employees: 1500,
    factoryCount: 3,
    sustainabilityScore: 71.3,
    carbonRating: "B",
    waterEfficiency: "76%",
    renewableEnergy: 35,
    esgRating: "BBB",
    ratingLevel: "BRONZE",
    certificationLevel: "BRONZE",
    status: "ACTIVE",
    createdDate: "2024-07-02",
    description: "Premium organic cotton processing, zero-liquid-discharge dyeing facilities, and solar-integrated spinning loops.",
    ceo: "Anjali Sharma",
    contactEmail: "admin@greentextiles.com",
    contactPhone: "+91 421 2476 5678",
    website: "https://www.greentextiles.com",
    annualRevenue: 150.2,
    foundedYear: 2012,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=GT"
  },
  {
    id: 4,
    legalName: "SolarTech Energy",
    name: "SolarTech Energy",
    industry: "Power Utilities",
    industryType: "Power Utilities",
    headquartersAddress: "102 Whitefield Tech Park, Bengaluru, KA",
    location: "Bengaluru, KA",
    employeeCount: 620,
    employees: 620,
    factoryCount: 2,
    sustainabilityScore: 92.1,
    carbonRating: "A++",
    waterEfficiency: "95%",
    renewableEnergy: 98,
    esgRating: "AAA",
    ratingLevel: "PLATINUM",
    certificationLevel: "PLATINUM",
    status: "ACTIVE",
    createdDate: "2024-03-10",
    description: "Pioneering utility-scale solar generation, microgrids, and high-efficiency photovoltaic assembly complexes.",
    ceo: "Vikram Hegde",
    contactEmail: "hello@solartech.org",
    contactPhone: "+91 80 4123 9999",
    website: "https://www.solartech.org",
    annualRevenue: 510.0,
    foundedYear: 2015,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=ST"
  },
  {
    id: 5,
    legalName: "Smart Chemicals Ltd",
    name: "Smart Chemicals Ltd",
    industry: "Chemicals",
    industryType: "Chemicals",
    headquartersAddress: "GIDC Industrial Zone, Vadodara, GJ",
    location: "Vadodara, GJ",
    employeeCount: 780,
    employees: 780,
    factoryCount: 1,
    sustainabilityScore: 91.2,
    carbonRating: "A+",
    waterEfficiency: "90%",
    renewableEnergy: 82,
    esgRating: "AA",
    ratingLevel: "PLATINUM",
    certificationLevel: "PLATINUM",
    status: "ACTIVE",
    createdDate: "2024-02-18",
    description: "Green chemical synthesis, biological solvent production, and comprehensive toxic residue neutralisation systems.",
    ceo: "Dr. K. Patel",
    contactEmail: "sales@smartchemicals.com",
    contactPhone: "+91 265 2341 0000",
    website: "https://www.smartchemicals.com",
    annualRevenue: 340.5,
    foundedYear: 2008,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=SC"
  },
  {
    id: 6,
    legalName: "Future Plastics",
    name: "Future Plastics",
    industry: "Chemicals",
    industryType: "Chemicals",
    headquartersAddress: "66 Noida Sector 63, UP",
    location: "Noida, UP",
    employeeCount: 450,
    employees: 450,
    factoryCount: 1,
    sustainabilityScore: 68.2,
    carbonRating: "B",
    waterEfficiency: "72%",
    renewableEnergy: 25,
    esgRating: "BB",
    ratingLevel: "BRONZE",
    certificationLevel: "BRONZE",
    status: "ACTIVE",
    createdDate: "2024-08-14",
    description: "Developing biodegradable polymer resins and starch-based alternatives to eliminate single-use plastics.",
    ceo: "Amit Verma",
    contactEmail: "contact@futureplastics.in",
    contactPhone: "+91 120 4889 1234",
    website: "https://www.futureplastics.in",
    annualRevenue: 85.0,
    foundedYear: 2019,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=FP"
  },
  {
    id: 7,
    legalName: "Green Metals",
    name: "Green Metals",
    industry: "Metals",
    industryType: "Metals",
    headquartersAddress: "99 Kalina Estate, Mumbai, MH",
    location: "Mumbai, MH",
    employeeCount: 1100,
    employees: 1100,
    factoryCount: 2,
    sustainabilityScore: 89.6,
    carbonRating: "A+",
    waterEfficiency: "91%",
    renewableEnergy: 75,
    esgRating: "AA",
    ratingLevel: "GOLD",
    certificationLevel: "GOLD",
    status: "ACTIVE",
    createdDate: "2024-01-22",
    description: "Advanced non-ferrous metal recycling and green alloy fabrication with low embedded carbon footprints.",
    ceo: "Mohit Singhal",
    contactEmail: "info@greenmetals.com",
    contactPhone: "+91 22 2890 4567",
    website: "https://www.greenmetals.com",
    annualRevenue: 620.0,
    foundedYear: 2011,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=GM"
  },
  {
    id: 8,
    legalName: "Hydro Industries",
    name: "Hydro Industries",
    industry: "Water supply",
    industryType: "Water supply",
    headquartersAddress: "22 Gachibowli, Hyderabad, TS",
    location: "Hyderabad, TS",
    employeeCount: 950,
    employees: 950,
    factoryCount: 2,
    sustainabilityScore: 74.8,
    carbonRating: "A",
    waterEfficiency: "89%",
    renewableEnergy: 60,
    esgRating: "A",
    ratingLevel: "SILVER",
    certificationLevel: "SILVER",
    status: "ACTIVE",
    createdDate: "2024-09-05",
    description: "Specialized in industrial wastewater treatment plants, reverse osmosis, and municipal water conservation systems.",
    ceo: "Satish Kumar",
    contactEmail: "reachus@hydroindustries.co.in",
    contactPhone: "+91 40 6677 8899",
    website: "https://www.hydroindustries.co.in",
    annualRevenue: 180.0,
    foundedYear: 2003,
    logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=HI"
  },
  {
    id: 9,
    legalName: "Eco Automotive",
    name: "Eco Automotive",
    industry: "Automotive",
    industryType: "Automotive",
    headquartersAddress: "10 Chakan MIDC, Pune, MH",
    location: "Pune, MH",
    employeeCount: 3500,
    employees: 3500,
    factoryCount: 4,
    sustainabilityScore: 86.4,
    carbonRating: "A+",
    waterEfficiency: "85%",
    renewableEnergy: 70,
    esgRating: "AA",
    ratingLevel: "GOLD",
    certificationLevel: "GOLD",
      status: "ACTIVE",
      createdDate: "2024-04-12",
      description: "Hybrid drivetrains, EV component forging, and recycling-oriented vehicle disassembly infrastructure.",
      ceo: "Prakash Chawla",
      contactEmail: "press@ecoauto.com",
      contactPhone: "+91 20 2744 5566",
      website: "https://www.ecoauto.com",
      annualRevenue: 1250.0,
      foundedYear: 1995,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=EA"
    },
    {
      id: 10,
      legalName: "Nature Foods",
      name: "Nature Foods",
      industry: "Food & Beverage",
      industryType: "Food & Beverage",
      headquartersAddress: "88 Salt Lake, Kolkata, WB",
      location: "Kolkata, WB",
      employeeCount: 890,
      employees: 890,
      factoryCount: 1,
      sustainabilityScore: 64.5,
      carbonRating: "C",
      waterEfficiency: "70%",
      renewableEnergy: 20,
      esgRating: "B",
      ratingLevel: "BRONZE",
      certificationLevel: "BRONZE",
      status: "ACTIVE",
      createdDate: "2024-10-30",
      description: "Organic food processing, green cold chains, and crop protection schemes powered by rural biogas networks.",
      ceo: "Siddharth Dey",
      contactEmail: "hello@naturefoods.co.in",
      contactPhone: "+91 33 2415 6789",
      website: "https://www.naturefoods.co.in",
      annualRevenue: 110.0,
      foundedYear: 2016,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=NF"
    },
    {
      id: 11,
      legalName: "Blue Manufacturing",
      name: "Blue Manufacturing",
      industry: "Metals",
      industryType: "Metals",
      headquartersAddress: "12 Guindy Estate, Chennai, TN",
      location: "Chennai, TN",
      employeeCount: 740,
      employees: 740,
      factoryCount: 1,
      sustainabilityScore: 79.8,
      carbonRating: "A",
      waterEfficiency: "83%",
      renewableEnergy: 55,
      esgRating: "A",
      ratingLevel: "SILVER",
      certificationLevel: "SILVER",
      status: "ACTIVE",
      createdDate: "2024-11-15",
      description: "Precision high-strength structural metal stamping using cold press techniques powered by roof-mounted solar.",
      ceo: "Hari Narayanan",
      contactEmail: "ops@bluemanufacturing.com",
      contactPhone: "+91 44 2234 5678",
      website: "https://www.bluemanufacturing.com",
      annualRevenue: 220.0,
      foundedYear: 2000,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=BM"
    },
    {
      id: 12,
      legalName: "Sunrise Paper Mills",
      name: "Sunrise Paper Mills",
      industry: "Paper",
      industryType: "Paper",
      headquartersAddress: "44 Focal Point, Ludhiana, PB",
      location: "Ludhiana, PB",
      employeeCount: 680,
      employees: 680,
      factoryCount: 1,
      sustainabilityScore: 75.3,
      carbonRating: "A",
      waterEfficiency: "86%",
      renewableEnergy: 65,
      esgRating: "A",
      ratingLevel: "SILVER",
      certificationLevel: "SILVER",
      status: "ACTIVE",
      createdDate: "2024-12-05",
      description: "Using 100% recycled fibers and chlorine-free bleaching with closed-loop effluent recycle systems.",
      ceo: "J. S. Dhillon",
      contactEmail: "info@sunrisepaper.com",
      contactPhone: "+91 161 2567 890",
      website: "https://www.sunrisepaper.com",
      annualRevenue: 98.4,
      foundedYear: 1991,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=SP"
    },
    {
      id: 13,
      legalName: "Eco Electronics",
      name: "Eco Electronics",
      industry: "Electronics",
      industryType: "Electronics",
      headquartersAddress: "88 Verna Industrial Area, Goa",
      location: "Goa",
      employeeCount: 1100,
      employees: 1100,
      factoryCount: 1,
      sustainabilityScore: 83.2,
      carbonRating: "A+",
      waterEfficiency: "88%",
      renewableEnergy: 72,
      esgRating: "AA",
      ratingLevel: "GOLD",
      certificationLevel: "GOLD",
      status: "ACTIVE",
      createdDate: "2025-01-20",
      description: "High-efficiency semiconductor sub-assembly, lead-free soldering, and e-waste recapture programs.",
      ceo: "Fernandes D'Souza",
      contactEmail: "compliance@ecoele.com",
      contactPhone: "+91 832 2789 123",
      website: "https://www.ecoele.com",
      annualRevenue: 410.0,
      foundedYear: 2014,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=EE"
    },
    {
      id: 14,
      legalName: "Clean Packaging Ltd",
      name: "Clean Packaging Ltd",
      industry: "Paper",
      industryType: "Paper",
      headquartersAddress: "123 Industrial Area, Haridwar, UK",
      location: "Haridwar, UK",
      employeeCount: 2200,
      employees: 2200,
      factoryCount: 2,
      sustainabilityScore: 69.4,
      carbonRating: "B",
      waterEfficiency: "74%",
      renewableEnergy: 40,
      esgRating: "BBB",
      ratingLevel: "BRONZE",
      certificationLevel: "BRONZE",
      status: "ACTIVE",
      createdDate: "2025-02-12",
      description: "Recyclable kraft paper boxes and plant-fiber-based honeycomb cushioning for e-commerce logistics.",
      ceo: "R. K. Rastogi",
      contactEmail: "support@cleanpkg.com",
      contactPhone: "+91 1334 256 789",
      website: "https://www.cleanpkg.com",
      annualRevenue: 175.5,
      foundedYear: 2007,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=CP"
    },
    {
      id: 15,
      legalName: "Vision Engineering",
      name: "Vision Engineering",
      industry: "Automotive",
      industryType: "Automotive",
      headquartersAddress: "10 Industrial Complex, Sanand, GJ",
      location: "Sanand, GJ",
      employeeCount: 930,
      employees: 930,
      factoryCount: 2,
      sustainabilityScore: 94.7,
      carbonRating: "A++",
      waterEfficiency: "94%",
      renewableEnergy: 90,
      esgRating: "AAA",
      ratingLevel: "PLATINUM",
      certificationLevel: "PLATINUM",
      status: "ACTIVE",
      createdDate: "2025-03-01",
      description: "Precision low-tolerance green tooling, automation controllers, and zero-emission manufacturing systems.",
      ceo: "Aniket Mehta",
      contactEmail: "contact@visioneng.co.in",
      contactPhone: "+91 2717 241 123",
      website: "https://www.visioneng.co.in",
      annualRevenue: 380.0,
      foundedYear: 2010,
      logoUrl: "https://placehold.co/100x100/10b981/ffffff?text=VE"
    }
]

const getDemoCertificates = (compId) => [
  {
    id: compId * 10 + 1,
    certificateName: "ISO 14001 Environmental Certification",
    certificationLevel: "Gold",
    certificateNumber: `GC-ISO-2026-00${compId}`,
    issueDate: "2026-01-15",
    expiryDate: "2029-01-15",
    status: "Active"
  },
  {
    id: compId * 10 + 2,
    certificateName: "GreenCo Platinum Sustainability Certificate",
    certificationLevel: "Platinum",
    certificateNumber: `GC-PLT-2026-01${compId}`,
    issueDate: "2026-03-20",
    expiryDate: "2029-03-20",
    status: "Active"
  },
  {
    id: compId * 10 + 3,
    certificateName: "Zero Waste to Landfill Standard",
    certificationLevel: "Silver",
    certificateNumber: `GC-ZWL-2026-00${compId}`,
    issueDate: "2025-11-10",
    expiryDate: "2028-11-10",
    status: "Active"
  },
  {
    id: compId * 10 + 4,
    certificateName: "ISO 5001 Energy Management Standard",
    certificationLevel: "Gold",
    certificateNumber: `GC-EN-2026-02${compId}`,
    issueDate: "2023-08-05",
    expiryDate: "2026-08-05",
    status: "Expired"
  }
]

const getDemoAssessments = (compId) => [
  {
    id: compId * 100 + 1,
    assessmentName: "Annual Sustainability Assessment 2026",
    assessmentVersion: "V3.0",
    assessmentDate: "2026-06-15",
    scoreAchieved: 910,
    carbonRating: "A++",
    status: "Approved",
    auditorName: "GreenCo Audit Team",
    overallGrade: "Platinum"
  },
  {
    id: compId * 100 + 2,
    assessmentName: "Quarterly ESG Assessment",
    assessmentVersion: "V2.1",
    assessmentDate: "2026-03-12",
    scoreAchieved: 860,
    carbonRating: "A+",
    status: "Completed",
    auditorName: "GreenCo Audit Team",
    overallGrade: "Gold"
  },
  {
    id: compId * 100 + 3,
    assessmentName: "Water Efficiency Audit",
    assessmentVersion: "V1.8",
    assessmentDate: "2025-12-05",
    scoreAchieved: 880,
    carbonRating: "A+",
    status: "Completed",
    auditorName: "GreenCo Audit Team",
    overallGrade: "Gold"
  },
  {
    id: compId * 100 + 4,
    assessmentName: "Carbon Emission Audit",
    assessmentVersion: "V2.0",
    assessmentDate: "2025-09-18",
    scoreAchieved: 820,
    carbonRating: "A",
    status: "Approved",
    auditorName: "GreenCo Audit Team",
    overallGrade: "Silver"
  },
  {
    id: compId * 100 + 5,
    assessmentName: "Renewable Energy Compliance Review",
    assessmentVersion: "V1.5",
    assessmentDate: "2025-06-10",
    scoreAchieved: 940,
    carbonRating: "A++",
    status: "Approved",
    auditorName: "GreenCo Audit Team",
    overallGrade: "Platinum"
  }
]

function CompanyDetailsPage() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch Company metadata
  const { data: rawCompany, isLoading: isCompanyLoading, error: companyError } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const response = await api.get(`/companies/${companyId}`)
      return response.data?.data
    },
    enabled: !!companyId
  })

  const company = rawCompany || FRONTEND_DEMO_COMPANIES.find(c => c.id === parseInt(companyId)) || FRONTEND_DEMO_COMPANIES[0]

  // 2. Fetch Factories of this company
  const { data: factories, isLoading: isFactoriesLoading } = useQuery({
    queryKey: ['companyFactories', companyId],
    queryFn: async () => {
      const response = await api.get(`/factories/company/${companyId}`)
      return response.data?.data || []
    },
    enabled: !!companyId
  })

  // 3. Fetch Certificates of this company
  const { data: serverCertificates, isLoading: isCertsLoading } = useQuery({
    queryKey: ['companyCertificates', companyId],
    queryFn: async () => {
      const response = await api.get('/certificates', {
        params: { companyId, page: 0, size: 100 }
      })
      return response.data?.data?.content || []
    },
    enabled: !!companyId
  })

  // 4. Fetch Assessments of this company
  const { data: serverAssessments, isLoading: isAssessmentsLoading } = useQuery({
    queryKey: ['companyAssessments', companyId],
    queryFn: async () => {
      const response = await api.get('/assessments', {
        params: { companyId, page: 0, size: 100 }
      })
      return response.data?.data?.content || []
    },
    enabled: !!companyId
  })

  const cid = parseInt(companyId) || 1
  const certificates = serverCertificates && serverCertificates.length > 0 ? serverCertificates : getDemoCertificates(cid)
  const assessments = serverAssessments && serverAssessments.length > 0 ? serverAssessments : getDemoAssessments(cid)

  const isLoading = isCompanyLoading || isFactoriesLoading || isCertsLoading || isAssessmentsLoading

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-sm font-semibold text-slate-500">Loading organization details...</p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-900 p-6 rounded-2xl max-w-xl mx-auto my-12 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-rose-600" size={24} />
          <h2 className="text-lg font-bold">Organization Not Found</h2>
        </div>
        <p className="text-sm">The organization profile you are trying to view does not exist, or you do not have permission to view it.</p>
        <button 
          onClick={() => navigate('/companies')} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} />
          Back to Registry
        </button>
      </div>
    )
  }

  // Analytical trends mapping
  const esgHistory = Array.isArray(assessments) && assessments.length > 0
    ? [...assessments]
        .filter(a => a.status === 'APPROVED' || (a.scoreAchieved && a.scoreAchieved > 0))
        .map(a => {
          const yr = a.createdAt ? new Date(a.createdAt).getFullYear().toString() : '2026'
          const pct = a.scoreAchieved ? Math.round((a.scoreAchieved / 1000) * 100) : 0
          return { year: yr, Score: pct }
        })
        .sort((x, y) => x.year.localeCompare(y.year))
    : [
        { year: '2023', Score: 65 },
        { year: '2024', Score: 71 },
        { year: '2025', Score: 78 },
        { year: '2026', Score: 82.5 }
      ]

  const carbonTrend = [
    { month: 'Jan', Emissions: 380 - ((company.id || 0) % 4) * 20 },
    { month: 'Feb', Emissions: 360 - ((company.id || 0) % 4) * 15 },
    { month: 'Mar', Emissions: 345 - ((company.id || 0) % 4) * 25 },
    { month: 'Apr', Emissions: 320 - ((company.id || 0) % 4) * 10 },
    { month: 'May', Emissions: 300 - ((company.id || 0) % 4) * 20 },
    { month: 'Jun', Emissions: 280 - ((company.id || 0) % 4) * 30 }
  ]

  const latestEsgScore = esgHistory.length > 0 ? esgHistory[esgHistory.length - 1].Score : 0
  const latestGrade = Array.isArray(assessments) && assessments.length > 0 
    ? assessments[0].ratingLevel || 'B' 
    : 'B'

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={company.logoUrl || `https://placehold.co/100x100/10b981/ffffff?text=${company.legalName?.substring(0, 2).toUpperCase()}`} 
            alt={company.legalName}
            className="w-16 h-16 rounded-xl border border-slate-200 shadow-inner bg-slate-50 object-cover" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">{company.legalName}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                company.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : company.status === 'PENDING_APPROVAL' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {company.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{company.industry || 'Manufacturing'} Sector</p>
          </div>
        </div>
        
        {isManagement && (
          <button 
            onClick={() => navigate('/companies')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Registry
          </button>
        )}
      </div>

      {/* Profile Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Corporate Profile</h3>
          
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
            <p className="text-xs text-slate-600 leading-relaxed italic">"{company.description || 'Enterprise industrial manufacturing operator specialized in clean-loop production.'}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CEO</label>
              <p className="text-xs font-bold text-slate-850 mt-0.5">{company.ceo || 'Rajesh Kumar'}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Founded Year</label>
              <p className="text-xs font-bold text-slate-850 mt-0.5">{company.foundedYear || '1998'}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employees</label>
              <p className="text-xs font-bold text-slate-850 mt-0.5">{company.employeeCount || 250}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Revenue</label>
              <p className="text-xs font-bold text-slate-850 mt-0.5">${company.annualRevenue || '12.5'}M USD</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-slate-600">
              <Globe size={15} className="text-slate-400 shrink-0" />
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-600 hover:underline">{company.website || 'N/A'}</a>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail size={15} className="text-slate-400 shrink-0" />
              <span className="text-xs font-semibold">{company.contactEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone size={15} className="text-slate-400 shrink-0" />
              <span className="text-xs font-semibold">{company.contactPhone || 'N/A'}</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="text-xs font-medium leading-relaxed">{company.headquartersAddress}</span>
            </div>
          </div>
        </div>

        {/* ESG KPI Stats and Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 text-center">
              <Award className="text-emerald-600 mx-auto" size={18} />
              <p className="text-[9px] font-bold text-emerald-800 uppercase mt-1">ESG Score</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{latestEsgScore}%</p>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-center">
              <Building2 className="text-blue-600 mx-auto" size={18} />
              <p className="text-[9px] font-bold text-blue-800 uppercase mt-1">Factories</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{Array.isArray(factories) ? factories.length : 0} Assets</p>
            </div>

            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-center">
              <TrendingUp className="text-purple-600 mx-auto" size={18} />
              <p className="text-[9px] font-bold text-purple-800 uppercase mt-1">Grade</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{latestGrade}</p>
            </div>

            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 text-center">
              <FileBadge size={18} className="text-rose-600 mx-auto" />
              <p className="text-[9px] font-bold text-rose-800 uppercase mt-1">Certificates</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{Array.isArray(certificates) ? certificates.length : 0} Active</p>
            </div>
          </div>

          {/* Charts Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={16} className="text-emerald-600" />
              ESG & Carbon Performance Trends
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ESG Progress Chart */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sustainability Index History</span>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={esgHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Carbon Emission Trend Chart */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Emissions (MT CO2eq)</span>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carbonTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Emissions" fill="#f43f5e" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factories & Certificates Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factories Asset List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-blue-600" />
            Manufacturing Factories ({Array.isArray(factories) ? factories.length : 0})
          </h3>
          {!Array.isArray(factories) || factories.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No factories registered for this company.</p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {factories.map(factory => (
                <div key={factory.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{factory.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{factory.factoryCode} • {factory.factoryType}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      factory.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {factory.status}
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Grade: {factory.sustainabilityGrade || 'B'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates Compliance Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileBadge size={16} className="text-rose-600" />
            Compliance Certificates ({certificates.length})
          </h3>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {certificates.map(cert => {
              const name = cert.certificateName || "GreenCo Sustainability Certificate"
              const num = cert.certificateNumber
              const level = cert.certificationLevel || cert.ratingLevel || "Gold"
              const issue = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "March 2026"
              const expiry = cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "March 2029"
              const statusVal = cert.status || "Active"
              
              return (
                <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">Certificate No: <span className="font-mono">{num}</span></p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9px] uppercase border ${
                      level.toUpperCase() === 'PLATINUM' 
                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                        : level.toUpperCase() === 'GOLD' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : level.toUpperCase() === 'SILVER'
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-orange-100 text-orange-800 border-orange-200'
                    }`}>
                      {level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500">
                    <div>
                      <span>Issued:</span>
                      <p className="font-bold text-slate-700">{issue}</p>
                    </div>
                    <div>
                      <span>Expires:</span>
                      <p className="font-bold text-slate-700">{expiry}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      statusVal === 'Active' || statusVal === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : statusVal === 'Expiring Soon' || statusVal === 'EXPIRING_SOON'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {statusVal.replace(/_/g, ' ')}
                    </span>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate('/certificates')}
                        className="px-2.5 py-1 text-[9px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded shadow-sm transition-all cursor-pointer"
                      >
                        View Certificate
                      </button>
                      <button 
                        onClick={() => navigate('/certificates')}
                        className="px-2.5 py-1 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition-all cursor-pointer"
                      >
                        Download Certificate
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Assessment History Ledger */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <FileText size={16} className="text-emerald-600" />
          Sustainability Assessment History ({assessments.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.map(ass => {
            const name = ass.assessmentName || ass.name || "Annual Sustainability Assessment"
            const version = ass.assessmentVersion || ass.ratingVersion || "V3.0"
            const date = ass.assessmentDate || ass.submittedAt || ass.createdAt
            const formattedDate = date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : "June 2026"
            const pct = ass.esgScore || (ass.scoreAchieved ? Math.round((ass.scoreAchieved / 1000) * 100) : 85)
            const carbon = ass.carbonRating || "A+"
            const statusVal = ass.status || "Approved"
            const auditor = ass.auditorName || "GreenCo Audit Team"
            const grade = ass.overallGrade || ass.ratingLevel || "Platinum"
            
            return (
              <div key={ass.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between space-y-3.5 hover:shadow-md transition-all">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight pr-2">{name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider shrink-0">{version}</span>
                  </div>
                  <p className="text-[10px] text-slate-450">Date: {formattedDate}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">ESG Score</span>
                    <span className="text-xs font-black text-emerald-650 mt-0.5 block">{pct}%</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Carbon</span>
                    <span className="text-xs font-black text-slate-800 mt-0.5 block">{carbon}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Grade</span>
                    <span className="text-xs font-black text-indigo-650 mt-0.5 block">{grade}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[9px] text-slate-500 font-semibold">
                  <p>Auditor: <span className="text-slate-800 font-bold">{auditor}</span></p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 mt-auto">
                  <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                    statusVal.toUpperCase() === 'APPROVED' || statusVal.toUpperCase() === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {statusVal.replace(/_/g, ' ')}
                  </span>

                  <button 
                    onClick={() => navigate(`/assessments/${ass.id}/workflow`)}
                    className="px-3 py-1 text-[9px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded shadow-sm transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsPage
