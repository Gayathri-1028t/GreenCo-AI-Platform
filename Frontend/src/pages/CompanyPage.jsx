import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { 
  Search, 
  Building, 
  CheckCircle, 
  ShieldAlert,
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
  FileText,
  X,
  ChevronRight,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Eye,
  FileSpreadsheet
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

function CompanyPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('legalName')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Modal / Detail States
  const [viewingCompany, setViewingCompany] = useState(null)
  const [editingCompany, setEditingCompany] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState(null)

  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm()
  const { register: registerCreate, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm()

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR'].includes(role)
  )

  const isSuperOrAdmin = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'].includes(role)
  )

  // 1. Query all companies (for Admin/Coordinators)
  const { data: companiesData, isLoading: isListLoading } = useQuery({
    queryKey: ['companies', search, status],
    queryFn: async () => {
      const response = await api.get('/companies', {
        params: { page: 0, size: 100, search, status }
      })
      return response.data.data
    },
    enabled: isManagement
  })

  // 2. Query own company (for Manufacturing Company users)
  const { data: ownCompany, isLoading: isSingleLoading } = useQuery({
    queryKey: ['company', user?.companyId],
    queryFn: async () => {
      const id = user?.companyId || 1
      const response = await api.get(`/companies/${id}`)
      return response.data.data
    },
    enabled: !isManagement
  })

  // 3. Approve onboarding mutation
  const approveOnboardingMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/companies/${id}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      toast.success('Company onboarding approved successfully!')
    },
    onError: () => {
      toast.error('Failed to approve company onboarding')
    }
  })

  // 4. Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return api.put(`/companies/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      queryClient.invalidateQueries(['company'])
      toast.success('Company details updated successfully!')
      setEditingCompany(null)
      resetEdit()
    },
    onError: () => {
      toast.error('Failed to update company details')
    }
  })

  // 5. Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/companies', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      toast.success('Company registered successfully!')
      setIsCreateModalOpen(false)
      resetCreate()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register company')
    }
  })

  // 6. Delete (Soft Delete) company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/companies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      toast.success('Company deactivated (soft deleted) successfully!')
      setActiveMenuId(null)
    },
    onError: () => {
      toast.error('Failed to delete company')
    }
  })

  const handleEdit = (comp) => {
    setEditingCompany(comp)
    setActiveMenuId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to deactivate (soft delete) this company?')) {
      deleteCompanyMutation.mutate(id)
    }
  }

  const handleUpdateSubmitForm = (data) => {
    updateCompanyMutation.mutate({
      id: editingCompany.id,
      payload: {
        legalName: data.legalName,
        taxId: data.taxId,
        headquartersAddress: data.headquartersAddress,
        website: data.website,
        status: data.status,
        industry: data.industry,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        employeeCount: parseInt(data.employeeCount) || null,
        annualRevenue: parseFloat(data.annualRevenue) || null,
        logoUrl: data.logoUrl
      }
    })
  }

  const handleCreateSubmitForm = (data) => {
    createCompanyMutation.mutate({
      legalName: data.legalName,
      registrationNumber: data.registrationNumber,
      taxId: data.taxId,
      headquartersAddress: data.headquartersAddress,
      website: data.website,
      industry: data.industry,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      employeeCount: parseInt(data.employeeCount) || null,
      annualRevenue: parseFloat(data.annualRevenue) || null,
      logoUrl: data.logoUrl || `https://placehold.co/100x100/10b981/ffffff?text=${data.legalName.substring(0,2).toUpperCase()}`
    })
  }

  // Client-side filtering, sorting and pagination
  const rawList = (companiesData?.content && companiesData.content.length > 0) ? companiesData.content : FRONTEND_DEMO_COMPANIES
  
  // 1. Filter
  const filteredList = rawList.filter(comp => {
    const matchesIndustry = selectedIndustry ? comp.industry === selectedIndustry : true
    const matchesStatus = status ? comp.status === status : true
    const matchesSearch = search ? (
      (comp.legalName || '').toLowerCase().includes(search.toLowerCase()) || 
      (comp.registrationNumber || '').toLowerCase().includes(search.toLowerCase())
    ) : true
    return matchesIndustry && matchesStatus && matchesSearch
  })

  // 2. Sort
  const sortedList = [...filteredList].sort((a, b) => {
    let valA = a[sortBy]
    let valB = b[sortBy]

    if (valA == null) return sortOrder === 'asc' ? 1 : -1
    if (valB == null) return sortOrder === 'asc' ? -1 : 1

    if (typeof valA === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA)
    } else {
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }
  })

  // 3. Paginate
  const pageSize = 10
  const totalPages = Math.ceil(sortedList.length / pageSize)
  const paginatedList = sortedList.slice(page * pageSize, (page + 1) * pageSize)

  // Industries list for filtering
  const industries = Array.from(new Set(rawList.map(c => c.industry).filter(Boolean)))

  // CSV/Excel Export Handlers
  const handleExportCSV = () => {
    const headers = ['ID', 'Legal Name', 'Reg Number', 'GST/Tax ID', 'Status', 'Industry', 'Website', 'Contact Person', 'Email', 'Phone', 'Employees', 'Revenue ($M)']
    const rows = sortedList.map(c => [
      c.id, c.legalName, c.registrationNumber, c.taxId, c.status, c.industry || '', c.website || '', c.contactPerson || '', c.contactEmail || '', c.contactPhone || '', c.employeeCount || '', c.annualRevenue || ''
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "greenco_enterprise_companies.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Mock deterministic analytics details for company profile page
  const getESGHistory = (compId) => [
    { year: '2022', Score: 62 + (compId % 5) * 3 },
    { year: '2023', Score: 67 + (compId % 5) * 2 },
    { year: '2024', Score: 71 + (compId % 5) * 4 },
    { year: '2025', Score: 75 + (compId % 5) * 2 },
    { year: '2026', Score: 79.4 + (compId % 5) * 1.5 }
  ]

  const getCarbonTrend = (compId) => [
    { month: 'Jan', Emissions: 450 - (compId % 4) * 25 },
    { month: 'Feb', Emissions: 420 - (compId % 4) * 20 },
    { month: 'Mar', Emissions: 405 - (compId % 4) * 30 },
    { month: 'Apr', Emissions: 380 - (compId % 4) * 15 },
    { month: 'May', Emissions: 360 - (compId % 4) * 25 },
    { month: 'Jun', Emissions: 335 - (compId % 4) * 35 }
  ]

  const getFactoryPerf = (compId) => [
    { name: 'Plant 1', Energy: 78 + (compId % 3) * 5, Water: 82 + (compId % 3) * 4, Waste: 85 + (compId % 3) * 2 },
    { name: 'Plant 2', Energy: 72 + (compId % 3) * 6, Water: 76 + (compId % 3) * 5, Waste: 80 + (compId % 3) * 3 }
  ]

  const getCertificates = (compId) => [
    { id: 1, title: 'ISO 14001:2015 Environmental Certification', date: 'Jan 15, 2024', status: 'Active' },
    { id: 2, title: 'GreenCo Gold Rating Framework v3.0', date: 'May 20, 2025', status: 'Active' },
    { id: 3, title: 'Zero Waste to Landfill Standard', date: 'Nov 10, 2025', status: 'Active' }
  ]

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  // Profile details rendering helper
  const renderProfile = (company, isOwnProfile = false) => {
    const compId = company.id || 1
    const esgData = getESGHistory(compId)
    const carbonData = getCarbonTrend(compId)
    const factoryData = getFactoryPerf(compId)
    const certTimeline = getCertificates(compId)

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={company.logoUrl || `https://placehold.co/100x100/10b981/ffffff?text=${company.legalName.substring(0, 2).toUpperCase()}`} 
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
              onClick={() => setViewingCompany(null)}
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
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Corporate Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration Number</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{company.registrationNumber}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST/Tax Identifier</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{company.taxId}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Count</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{company.employeeCount || 250}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Revenue</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">${company.annualRevenue || '12.5'}M USD</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <Globe size={15} className="text-slate-400 shrink-0" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-600 hover:underline">{company.website || 'N/A'}</a>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <User size={15} className="text-slate-400 shrink-0" />
                <span className="text-xs font-semibold">{company.contactPerson || 'N/A'}</span>
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
                <p className="text-lg font-black text-slate-800 mt-0.5">{esgData[esgData.length - 1].Score}%</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-center">
                <Building2 className="text-blue-600 mx-auto" size={18} />
                <p className="text-[9px] font-bold text-blue-800 uppercase mt-1">Factories</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">2 Assets</p>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-center">
                <TrendingUp className="text-purple-600 mx-auto" size={18} />
                <p className="text-[9px] font-bold text-purple-800 uppercase mt-1">Carbon Saved</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">18.2%</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 text-center">
                <FileBadge size={18} className="text-rose-600 mx-auto" />
                <p className="text-[9px] font-bold text-rose-800 uppercase mt-1">Certificates</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">3 Active</p>
              </div>
            </div>

            {/* Charts Tab Container */}
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
                      <LineChart data={esgData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[50, 100]} />
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
                      <BarChart data={carbonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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

        {/* Factory Performance & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Asset Performance comparison</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factoryData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Energy" fill="#3b82f6" name="Energy Score" />
                  <Bar dataKey="Water" fill="#06b6d4" name="Water Score" />
                  <Bar dataKey="Waste" fill="#f59e0b" name="Waste Score" />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileBadge size={16} className="text-indigo-600" />
              Certificate & Compliance Timeline
            </h3>
            <div className="space-y-4">
              {certTimeline.map(cert => (
                <div key={cert.id} className="flex items-start gap-3 pl-3 border-l border-slate-200 relative py-1">
                  <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{cert.title}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{cert.date}</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{cert.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if we are viewing a single company profile details page
  if (viewingCompany) {
    return renderProfile(viewingCompany)
  }

  if (!isManagement) {
    // Manufacturing Representative Corporate View
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Profile</h1>
          <p className="mt-1 text-slate-500 text-sm">Manage legal credentials, headquarters details and review corporate ESG metrics.</p>
        </div>
        {isSingleLoading ? (
          <div className="text-slate-500">Loading profile details...</div>
        ) : !ownCompany ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-center gap-3">
            <ShieldAlert className="text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold">No Organization Profile Linked</p>
              <p className="text-sm">Please register your organization profile to start applying for assessments.</p>
            </div>
          </div>
        ) : renderProfile(ownCompany, true)}
      </div>
    )
  }

  // Chart datasets
  const industryDistributionData = [
    { name: 'Metals', count: 4 },
    { name: 'Cement', count: 2 },
    { name: 'Textiles', count: 2 },
    { name: 'Utilities', count: 2 },
    { name: 'Chemicals', count: 2 },
    { name: 'Automotive', count: 2 },
    { name: 'Paper', count: 1 }
  ]

  const certDistributionData = [
    { name: 'Platinum', value: 3, color: '#a855f7' },
    { name: 'Gold', value: 5, color: '#eab308' },
    { name: 'Silver', value: 4, color: '#94a3b8' },
    { name: 'Bronze', value: 3, color: '#f97316' }
  ]

  const companyGrowthData = [
    { year: '2022', Companies: 6 },
    { year: '2023', Companies: 9 },
    { year: '2024', Companies: 12 },
    { year: '2025', Companies: 14 },
    { year: '2026', Companies: 15 }
  ]

  const esgComparisonData = [
    { name: 'SteelCorp', Score: 82.5 },
    { name: 'Eco Cement', Score: 78.4 },
    { name: 'GreenTextiles', Score: 71.3 },
    { name: 'SolarTech', Score: 92.1 },
    { name: 'Smart Chem', Score: 91.2 },
    { name: 'Green Metals', Score: 89.6 },
    { name: 'Hydro Ind', Score: 74.8 }
  ]

  // Registry Listing View for Assessors & Admins
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Registry</h1>
          <p className="mt-1 text-slate-500 text-sm">Review, evaluate, and approve onboarding applications for manufacturing companies.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all shadow-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          
          {isSuperOrAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/10"
            >
              <Plus size={14} />
              Add Company
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Total Companies</span>
          <span className="text-lg font-black text-slate-800 mt-1">15</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Active Companies</span>
          <span className="text-lg font-black text-slate-800 mt-1">15</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Average ESG Score</span>
          <span className="text-lg font-black text-emerald-600 mt-1">81.2%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Average Carbon Reduction</span>
          <span className="text-lg font-black text-emerald-600 mt-1">18.2%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Total Factories</span>
          <span className="text-lg font-black text-slate-800 mt-1">28</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Industry Distribution</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistributionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Certification Levels</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={certDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {certDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Company Growth</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={companyGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Companies" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">ESG Score Comparison</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={esgComparisonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="Score" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or registration number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-semibold transition-all"
          />
        </div>
        
        <select
          value={selectedIndustry}
          onChange={(e) => { setSelectedIndustry(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-bold text-slate-600 transition-all"
        >
          <option value="">All Sectors</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-bold text-slate-600 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="text-xs font-bold text-slate-500 px-1 mt-1">
        Showing {sortedList.length} of {rawList.length} companies
      </div>

      {/* Registry Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isListLoading ? (
          <div className="p-8 text-center text-slate-500">Loading companies registry...</div>
        ) : sortedList.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No companies match the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150">
              <thead className="bg-slate-55">
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th onClick={() => toggleSort('legalName')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Company Name</th>
                  <th onClick={() => toggleSort('industry')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Industry</th>
                  <th onClick={() => toggleSort('location')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Headquarters</th>
                  <th onClick={() => toggleSort('factoryCount')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Factories</th>
                  <th onClick={() => toggleSort('sustainabilityScore')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Sustainability Score</th>
                  <th onClick={() => toggleSort('carbonRating')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Carbon Rating</th>
                  <th onClick={() => toggleSort('waterEfficiency')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Water Efficiency</th>
                  <th onClick={() => toggleSort('renewableEnergy')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Renewable Energy %</th>
                  <th onClick={() => toggleSort('esgRating')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">ESG Rating</th>
                  <th onClick={() => toggleSort('ratingLevel')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Certification Level</th>
                  <th onClick={() => toggleSort('status')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Status</th>
                  <th onClick={() => toggleSort('createdDate')} className="px-4 py-3 text-left cursor-pointer hover:bg-slate-100/50">Created Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-xs">
                {paginatedList.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900 flex items-center space-x-2">
                      <img 
                        src={comp.logoUrl || `https://placehold.co/32x32/10b981/ffffff?text=${comp.legalName.substring(0,2).toUpperCase()}`} 
                        alt="" 
                        className="w-6 h-6 rounded-lg border border-slate-150 bg-slate-50 object-cover shrink-0" 
                      />
                      <span>{comp.legalName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-500">{comp.industry || 'Metals'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{comp.location || 'Chennai, TN'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-700">{comp.factoryCount || 2}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-black text-emerald-600">{comp.sustainabilityScore}%</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-700">{comp.carbonRating || 'A+'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{comp.waterEfficiency || '85%'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-650">{comp.renewableEnergy || 60}%</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-indigo-650">{comp.esgRating || 'AA'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9px] uppercase border ${
                        comp.ratingLevel === 'PLATINUM' 
                          ? 'bg-purple-100 text-purple-800 border-purple-200' 
                          : comp.ratingLevel === 'GOLD' 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : comp.ratingLevel === 'SILVER'
                          ? 'bg-slate-100 text-slate-800 border-slate-200'
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}>
                        {comp.ratingLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                        comp.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : comp.status === 'PENDING_APPROVAL' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-semibold">{comp.createdDate || '2024-05-15'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold space-x-2 relative">
                      <button 
                        onClick={() => navigate(`/companies/${comp.id}`)} 
                        className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye size={12} />
                        View
                      </button>
                      
                      {isSuperOrAdmin && (
                        <>
                          <button 
                            onClick={() => handleEdit(comp)} 
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(comp.id)} 
                            className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </>
                      )}

                      {comp.status === 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => approveOnboardingMutation.mutate(comp.id)}
                          className="text-indigo-600 hover:text-indigo-850 inline-flex items-center gap-0.5"
                        >
                          <CheckCircle size={13} />
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="text-emerald-600" size={18} />
                Edit Company Details
              </h2>
              <button onClick={() => setEditingCompany(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit(handleUpdateSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Legal Name</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.legalName}
                    {...registerEdit('legalName', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tax ID / GST Number</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.taxId}
                    {...registerEdit('taxId', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sector / Industry</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.industry}
                    {...registerEdit('industry')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Website URL</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.website}
                    {...registerEdit('website')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.contactPerson}
                    {...registerEdit('contactPerson')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    defaultValue={editingCompany.contactEmail}
                    {...registerEdit('contactEmail')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    defaultValue={editingCompany.contactPhone}
                    {...registerEdit('contactPhone')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Status</label>
                  <select
                    defaultValue={editingCompany.status}
                    {...registerEdit('status', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Employee Count</label>
                  <input
                    type="number"
                    defaultValue={editingCompany.employeeCount}
                    {...registerEdit('employeeCount')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Annual Revenue ($M)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingCompany.annualRevenue}
                    {...registerEdit('annualRevenue')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Logo Image URL</label>
                <input
                  type="text"
                  defaultValue={editingCompany.logoUrl}
                  {...registerEdit('logoUrl')}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Headquarters Address</label>
                <textarea
                  defaultValue={editingCompany.headquartersAddress}
                  {...registerEdit('headquartersAddress', { required: true })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 h-20"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={updateCompanyMutation.isLoading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
                >
                  {updateCompanyMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-emerald-600" size={18} />
                Register New Enterprise Organization
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit(handleCreateSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. SteelCorp Industries"
                    {...registerCreate('legalName', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Registration Number</label>
                  <input
                    type="text"
                    placeholder="REG-100101"
                    {...registerCreate('registrationNumber', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">GST/Tax ID</label>
                  <input
                    type="text"
                    placeholder="GST-300101AA"
                    {...registerCreate('taxId', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sector / Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Metals"
                    {...registerCreate('industry')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    {...registerCreate('website')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Manager Name"
                    {...registerCreate('contactPerson')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    {...registerCreate('contactEmail')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    {...registerCreate('contactPhone')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Employee Count</label>
                  <input
                    type="number"
                    placeholder="100"
                    {...registerCreate('employeeCount')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Annual Revenue ($M)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="5.0"
                    {...registerCreate('annualRevenue')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Logo Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  {...registerCreate('logoUrl')}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Headquarters Address</label>
                <textarea
                  placeholder="Street details..."
                  {...registerCreate('headquartersAddress', { required: true })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 h-20"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={createCompanyMutation.isLoading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
                >
                  {createCompanyMutation.isLoading ? 'Registering...' : 'Register Company'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyPage
