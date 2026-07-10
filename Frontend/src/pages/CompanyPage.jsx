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
  Cell 
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
  const rawList = companiesData?.content || []
  
  // 1. Filter
  const filteredList = rawList.filter(comp => {
    const matchesIndustry = selectedIndustry ? comp.industry === selectedIndustry : true
    const matchesSearch = search ? (
      comp.legalName.toLowerCase().includes(search.toLowerCase()) || 
      comp.registrationNumber.toLowerCase().includes(search.toLowerCase())
    ) : true
    return matchesIndustry && matchesSearch
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

      {/* Registry Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isListLoading ? (
          <div className="p-8 text-center text-slate-500">Loading companies registry...</div>
        ) : sortedList.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No organizations found matching search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150">
              <thead className="bg-slate-50/40">
                <tr>
                  <th onClick={() => toggleSort('legalName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Company</th>
                  <th onClick={() => toggleSort('industry')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Sector</th>
                  <th onClick={() => toggleSort('registrationNumber')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Registration</th>
                  <th onClick={() => toggleSort('taxId')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">GST Number</th>
                  <th onClick={() => toggleSort('employeeCount')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Employees</th>
                  <th onClick={() => toggleSort('status')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paginatedList.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 flex items-center space-x-3">
                      <img 
                        src={comp.logoUrl || `https://placehold.co/40x40/10b981/ffffff?text=${comp.legalName.substring(0,2).toUpperCase()}`} 
                        alt="" 
                        className="w-8 h-8 rounded-lg border border-slate-150 bg-slate-50 object-cover" 
                      />
                      <span>{comp.legalName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{comp.industry || 'Metals'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{comp.registrationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{comp.taxId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{comp.employeeCount || 250}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                        comp.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : comp.status === 'PENDING_APPROVAL' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {comp.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3.5 relative">
                      <button 
                        onClick={() => navigate(`/companies/${comp.id}`)} 
                        className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5"
                      >
                        <Eye size={13} />
                        View
                      </button>
                      
                      {isSuperOrAdmin && (
                        <>
                          <button 
                            onClick={() => handleEdit(comp)} 
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5"
                          >
                            <Edit size={13} />
                            Edit
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(comp.id)} 
                            className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-0.5"
                          >
                            <Trash2 size={13} />
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
