import { useState } from 'react'
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
  MapPin, 
  Building, 
  Plus, 
  Trash2, 
  ShieldAlert,
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Mail,
  User,
  Users,
  TrendingUp,
  Award,
  Activity,
  FileText,
  X,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileBadge,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Calendar
} from 'lucide-react'

function FactoriesPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [sectorType, setSectorType] = useState('')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // UI state variables
  const [viewingFactory, setViewingFactory] = useState(null)
  const [editingFactory, setEditingFactory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickedFactory, setClickedFactory] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { register: registerCreate, handleSubmit: handleCreateSubmit, reset: resetCreate, formState: { errors: createErrors } } = useForm()
  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm()

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  const isSuperOrAdmin = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'].includes(role)
  )

  // 1. Fetch factories list
  const { data: factoriesData, isLoading } = useQuery({
    queryKey: ['factories', page, search, sectorType, isManagement, user?.companyId],
    queryFn: async () => {
      if (isManagement) {
        // Coordinator / Assessor view of all factories
        const response = await api.get('/factories', {
          params: { page: 0, size: 100, search, sectorType }
        })
        return response.data.data
      } else {
        // Company view of own factories
        const companyId = user?.companyId || 1
        const response = await api.get(`/factories/company/${companyId}`)
        return { content: response.data.data, totalPages: 1 }
      }
    }
  })

  // 2. Fetch companies list for filters / creation mapping
  const { data: companies } = useQuery({
    queryKey: ['companies-dropdown'],
    queryFn: async () => {
      const response = await api.get('/companies', { params: { size: 100 } })
      return response.data.data.content
    },
    enabled: isManagement
  })

  // 3. Create factory mutation
  const createFactoryMutation = useMutation({
    mutationFn: async (newFactory) => {
      return api.post('/factories', newFactory)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['factories'])
      toast.success('Factory registered successfully!')
      setIsModalOpen(false)
      resetCreate()
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to register factory.'
      toast.error(msg)
    }
  })

  // 4. Update factory mutation
  const updateFactoryMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return api.put(`/factories/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['factories'])
      toast.success('Factory details updated successfully!')
      setEditingFactory(null)
      resetEdit()
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update factory.'
      toast.error(msg)
    }
  })

  // 5. Deactivate (soft delete) factory mutation
  const deactivateFactoryMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/factories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['factories'])
      toast.success('Factory deactivated successfully')
    },
    onError: () => {
      toast.error('Failed to deactivate factory')
    }
  })

  const handleCreateSubmitForm = (formData) => {
    createFactoryMutation.mutate({
      companyId: isManagement ? parseInt(formData.companyId) : (user?.companyId || 1),
      name: formData.name,
      sectorType: formData.sectorType,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      buildingAreaSqm: parseFloat(formData.buildingAreaSqm),
      employeeCount: parseInt(formData.employeeCount),
      factoryCode: formData.factoryCode,
      logoUrl: formData.logoUrl || `https://placehold.co/100x100/3b82f6/ffffff?text=${formData.name.substring(0,3).toUpperCase()}`,
      factoryType: formData.factoryType,
      manufacturingCategory: formData.manufacturingCategory,
      factoryHead: formData.factoryHead,
      email: formData.email,
      phone: formData.phone,
      annualProductionCapacity: parseFloat(formData.annualProductionCapacity) || null,
      sustainabilityGrade: formData.sustainabilityGrade || 'Gold',
      baseline: {
        baselineYear: parseInt(formData.baselineYear),
        electricityConsumptionKwh: parseFloat(formData.electricityConsumptionKwh),
        waterConsumptionKl: parseFloat(formData.waterConsumptionKl),
        wasteGeneratedMt: parseFloat(formData.wasteGeneratedMt)
      }
    })
  }

  const handleEditSubmitForm = (formData) => {
    updateFactoryMutation.mutate({
      id: editingFactory.id,
      payload: {
        name: formData.name,
        sectorType: formData.sectorType,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        buildingAreaSqm: parseFloat(formData.buildingAreaSqm),
        employeeCount: parseInt(formData.employeeCount),
        status: formData.status,
        factoryCode: formData.factoryCode,
        logoUrl: formData.logoUrl,
        factoryType: formData.factoryType,
        manufacturingCategory: formData.manufacturingCategory,
        factoryHead: formData.factoryHead,
        email: formData.email,
        phone: formData.phone,
        annualProductionCapacity: parseFloat(formData.annualProductionCapacity) || null,
        sustainabilityGrade: formData.sustainabilityGrade
      }
    })
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Factory Name', 'Code', 'Sector', 'Type', 'Head', 'Email', 'Phone', 'Capacity', 'Grade', 'Status']
    const rows = sortedList.map(f => [
      f.id, f.name, f.factoryCode || '', f.sectorType, f.factoryType || '', f.factoryHead || '', f.email || '', f.phone || '', f.annualProductionCapacity || '', f.sustainabilityGrade || '', f.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "greenco_factories_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const rawList = factoriesData?.content || []

  // Client-side filtering, sorting, pagination
  const filteredList = rawList.filter(fact => {
    const matchesSearch = search ? (
      fact.name.toLowerCase().includes(search.toLowerCase()) ||
      fact.address.toLowerCase().includes(search.toLowerCase())
    ) : true
    const matchesSector = sectorType ? fact.sectorType === sectorType : true
    const matchesCompany = selectedCompanyId ? fact.companyId === parseInt(selectedCompanyId) : true
    const matchesStatus = selectedStatus ? fact.status === selectedStatus : true

    return matchesSearch && matchesSector && matchesCompany && matchesStatus
  })

  const sortedList = [...filteredList].sort((a, b) => {
    let valA = a[sortBy]
    let valB = b[sortBy]

    if (valA == null) return sortOrder === 'asc' ? 1 : -1
    if (valB == null) return sortOrder === 'asc' ? -1 : 1

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    } else {
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }
  })

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(sortedList.length / pageSize))
  const paginatedList = sortedList.slice(page * pageSize, (page + 1) * pageSize)

  const sectors = Array.from(new Set(rawList.map(f => f.sectorType).filter(Boolean)))

  // SVG Geographic mapping coordinates translation
  const minLat = 12.8
  const maxLat = 15.2
  const minLng = 77.3
  const maxLng = 79.7

  const getXY = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20
    const y = 230 - ((lat - minLat) / (maxLat - minLat)) * 210
    return { x, y }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // Mock deterministic details for factory profile
  const getCarbonTrend = (fid) => [
    { month: 'Jan', Emissions: 230 - (fid % 3) * 15 },
    { month: 'Feb', Emissions: 215 - (fid % 3) * 10 },
    { month: 'Mar', Emissions: 200 - (fid % 3) * 12 },
    { month: 'Apr', Emissions: 185 - (fid % 3) * 18 },
    { month: 'May', Emissions: 170 - (fid % 3) * 15 }
  ]

  const getEnergyTrend = (fid) => [
    { month: 'Jan', Electricity: 45000 + (fid % 2) * 5000 },
    { month: 'Feb', Electricity: 43000 + (fid % 2) * 4500 },
    { month: 'Mar', Electricity: 41000 + (fid % 2) * 4000 },
    { month: 'Apr', Electricity: 39500 + (fid % 2) * 3800 },
    { month: 'May', Electricity: 38000 + (fid % 2) * 3500 }
  ]

  const getWaterTrend = (fid) => [
    { month: 'Jan', Water: 2400 + (fid % 3) * 200 },
    { month: 'Feb', Water: 2300 + (fid % 3) * 180 },
    { month: 'Mar', Water: 2150 + (fid % 3) * 150 },
    { month: 'Apr', Water: 2000 + (fid % 3) * 100 },
    { month: 'May', Water: 1850 + (fid % 3) * 120 }
  ]

  const getESGRatingHistory = (fid) => [
    { year: '2022', Score: 60 + (fid % 4) * 4 },
    { year: '2023', Score: 66 + (fid % 4) * 3 },
    { year: '2024', Score: 73 + (fid % 4) * 4 },
    { year: '2025', Score: 79 + (fid % 4) * 2 },
    { year: '2026', Score: 85 + (fid % 4) * 3.5 }
  ]

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  // Profile Rendering function
  const renderProfile = (factory) => {
    const fid = factory.id || 1
    const carbonData = getCarbonTrend(fid)
    const energyData = getEnergyTrend(fid)
    const waterData = getWaterTrend(fid)
    const esgHistory = getESGRatingHistory(fid)

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={factory.logoUrl || `https://placehold.co/100x100/3b82f6/ffffff?text=${factory.name.substring(0, 3).toUpperCase()}`} 
              alt={factory.name} 
              className="w-16 h-16 rounded-xl border border-slate-200 shadow-inner bg-slate-50 object-cover" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-800 tracking-tight">{factory.name}</h1>
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  factory.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {factory.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{factory.companyName} | Code: {factory.factoryCode || 'N/A'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setViewingFactory(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Registry
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details list */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Factory master data</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Code</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.factoryCode || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Type</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.factoryType || 'Manufacturing'}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.manufacturingCategory || factory.sectorType}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Production Capacity</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.annualProductionCapacity || '50,000'} Tons</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Staff</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.employeeCount || 150} Staff</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plant Area</label>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{factory.buildingAreaSqm || 'N/A'} sqm</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <User size={15} className="text-slate-400 shrink-0" />
                <span className="text-xs font-semibold">Head: {factory.factoryHead || 'Plant Director'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="text-xs font-semibold">{factory.email || 'plant@company.com'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <span className="text-xs font-semibold">{factory.phone || '+91 99887 00000'}</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-600">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-xs font-medium leading-relaxed">{factory.address}</span>
              </div>
            </div>
          </div>

          {/* Widgets & KPI details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 text-center">
                <Award className="text-emerald-600 mx-auto" size={18} />
                <p className="text-[9px] font-bold text-emerald-800 uppercase mt-1">Health Score</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">85/100</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-center">
                <ShieldCheck className="text-blue-600 mx-auto" size={18} />
                <p className="text-[9px] font-bold text-blue-800 uppercase mt-1">Compliance</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">100% Ok</p>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-center">
                <TrendingUp className="text-purple-600 mx-auto" size={18} />
                <p className="text-[9px] font-bold text-purple-800 uppercase mt-1">Carbon Saved</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">18.2%</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 text-center">
                <FileBadge size={18} className="text-rose-600 mx-auto" />
                <p className="text-[9px] font-bold text-rose-800 uppercase mt-1">Certificates</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">2 Active</p>
              </div>
            </div>

            {/* Performance charts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-600" />
                Resource consumption & carbon footprints
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Emissions (MT CO2eq)</span>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={carbonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 10 }} />
                        <Bar dataKey="Emissions" fill="#f43f5e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Electricity usage (kWh)</span>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 10 }} />
                        <Line type="monotone" dataKey="Electricity" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Water Consumption (kL)</span>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waterData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 10 }} />
                        <Line type="monotone" dataKey="Water" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ESG rating trend history & timelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ESG rating progression</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={esgHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compliance audits timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pl-3 border-l border-slate-200 relative py-1">
                <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Assessor Site Audit Approved</p>
                  <span className="text-[10px] text-slate-400 font-semibold">Jan 12, 2026</span>
                </div>
                <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Passed</span>
              </div>
              
              <div className="flex items-start gap-3 pl-3 border-l border-slate-200 relative py-1">
                <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Documents Verification Pending</p>
                  <span className="text-[10px] text-slate-400 font-semibold">Pending since Q2 submission</span>
                </div>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewingFactory) {
    return renderProfile(viewingFactory)
  }

  // Registry & Map View for listings
  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Factory Assets</h1>
          <p className="mt-1 text-slate-500 text-sm">Register plants, manage baseline targets, and monitor geographic layout coordinates.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all shadow-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          
          {!isManagement && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all gap-2"
            >
              <Plus size={16} />
              Register Plant
            </button>
          )}
        </div>
      </div>

      {/* Mini dashboard widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Index</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">86 / 100</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Status</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">100% OK</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Ratings</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">12 Active</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Audits</p>
          <p className="text-lg font-black text-amber-600 mt-0.5">5 Audits</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">8 Active</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO2 Saved</p>
          <p className="text-lg font-black text-purple-600 mt-0.5">18.2%</p>
        </div>
      </div>

      {/* Geographic Interactive Map */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Regional Factory Distribution</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Interactive spatial view of factories across Southern India. Click a node to inspect compliance info.</p>
        </div>

        <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[300px]" onMouseMove={handleMouseMove}>
          <svg viewBox="0 0 400 250" className="w-full h-full cursor-crosshair">
            <defs>
              <pattern id="mapGridFactories" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGridFactories)" />

            {/* Industrial Logistics Grid */}
            <line x1="50" y1="45" x2="250" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="80" y1="205" x2="260" y2="185" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="80" y1="205" x2="250" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            <text x="35" y="35" fill="#475569" fontSize="7" fontWeight="bold">TUMKUR REGION</text>
            <text x="240" y="60" fill="#475569" fontSize="7" fontWeight="bold">KOLAR INDUSTRIAL SECTOR</text>
            <text x="70" y="225" fill="#475569" fontSize="7" fontWeight="bold">BANGALORE INDUSTRIAL CORE</text>
            <text x="250" y="210" fill="#475569" fontSize="7" fontWeight="bold">CHITTOOR BORDER ZONE</text>

            {sortedList.map(fact => {
              const lat = fact.latitude || 12.9716
              const lng = fact.longitude || 77.5946
              const { x, y } = getXY(lat, lng)

              const color = fact.id % 4 === 0 ? '#10b981' : fact.id % 3 === 0 ? '#f59e0b' : '#3b82f6'

              return (
                <g 
                  key={fact.id}
                  onClick={() => setClickedFactory(fact)}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle cx={x} cy={y} r="6" fill={color} className="animate-ping" opacity="0.3" />
                  <circle cx={x} cy={y} r="3.5" fill={color} stroke="#0f172a" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* Click Tooltip Details Modal */}
          {clickedFactory && (
            <div 
              className="absolute z-30 bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex flex-col space-y-1.5 w-60 transition-all duration-150"
              style={{ left: `${mousePos.x + 15}px`, top: `${mousePos.y + 15}px` }}
            >
              <div className="flex justify-between items-start">
                <p className="text-[12px] font-bold tracking-tight">{clickedFactory.name}</p>
                <button onClick={() => setClickedFactory(null)} className="text-slate-400 hover:text-white p-0.5">
                  <X size={12} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400">{clickedFactory.companyName}</p>
              
              <div className="border-t border-slate-800 pt-2 mt-2 space-y-1 text-[10px] text-slate-350">
                <p>⚡ ESG Score: <strong className="text-emerald-400">82.4% ({clickedFactory.sustainabilityGrade || 'Gold'})</strong></p>
                <p>🍃 Carbon Footprint: <strong className="text-rose-400">{200 + (clickedFactory.id % 5) * 45} MT</strong></p>
                <p>📜 Active Certificate: <strong className="text-indigo-400">ISO 14001:2015</strong></p>
                <p>⚙️ Current Rating: <strong className="text-amber-400">Under Technical Review</strong></p>
              </div>
              
              <button 
                onClick={() => { setViewingFactory(clickedFactory); setClickedFactory(null); }}
                className="mt-2.5 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
              >
                Inspect Factory Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-semibold transition-all"
          />
        </div>
        
        {isManagement && (
          <select
            value={selectedCompanyId}
            onChange={(e) => { setSelectedCompanyId(e.target.value); setPage(0); }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-bold text-slate-600 transition-all"
          >
            <option value="">All Companies</option>
            {companies?.map(comp => (
              <option key={comp.id} value={comp.id}>{comp.legalName}</option>
            ))}
          </select>
        )}

        <select
          value={sectorType}
          onChange={(e) => { setSectorType(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-bold text-slate-600 transition-all"
        >
          <option value="">All Sectors</option>
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-bold text-slate-600 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Enterprise Data Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading factories registry...</div>
        ) : sortedList.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No factory assets registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150">
              <thead className="bg-slate-50/40">
                <tr>
                  <th onClick={() => toggleSort('name')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Factory Asset</th>
                  <th onClick={() => toggleSort('factoryCode')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Code</th>
                  <th onClick={() => toggleSort('factoryType')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Type</th>
                  <th onClick={() => toggleSort('companyName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Company</th>
                  <th onClick={() => toggleSort('annualProductionCapacity')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Capacity</th>
                  <th onClick={() => toggleSort('status')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paginatedList.map(fact => (
                  <tr key={fact.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 flex items-center space-x-3">
                      <img 
                        src={fact.logoUrl || `https://placehold.co/40x40/3b82f6/ffffff?text=${fact.name.substring(0, 2).toUpperCase()}`} 
                        alt="" 
                        className="w-8 h-8 rounded-lg border border-slate-150 bg-slate-50 object-cover" 
                      />
                      <div>
                        <p className="font-bold text-slate-800">{fact.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{fact.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{fact.factoryCode || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{fact.factoryType || 'Manufacturing'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600">{fact.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{fact.annualProductionCapacity || '50,000'} Tons</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                        fact.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {fact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3.5">
                      <button 
                        onClick={() => setViewingFactory(fact)}
                        className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5"
                      >
                        <Eye size={13} />
                        View
                      </button>

                      {isSuperOrAdmin && (
                        <>
                          <button 
                            onClick={() => setEditingFactory(fact)} 
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5"
                          >
                            <Edit size={13} />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to deactivate (soft delete) this factory?')) {
                                deactivateFactoryMutation.mutate(fact.id)
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-0.5"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </>
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

      {/* Edit Factory Modal */}
      {editingFactory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="text-emerald-600" size={18} />
                Edit Factory Details
              </h2>
              <button onClick={() => setEditingFactory(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit(handleEditSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Name</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.name}
                    {...registerEdit('name', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Code</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.factoryCode}
                    {...registerEdit('factoryCode')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sector Type</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.sectorType}
                    {...registerEdit('sectorType', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Type</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.factoryType}
                    {...registerEdit('factoryType')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Manufacturing Category</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.manufacturingCategory}
                    {...registerEdit('manufacturingCategory')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Head</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.factoryHead}
                    {...registerEdit('factoryHead')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    defaultValue={editingFactory.email}
                    {...registerEdit('email')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone number</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.phone}
                    {...registerEdit('phone')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Latitude</label>
                  <input
                    type="number" step="any"
                    defaultValue={editingFactory.latitude}
                    {...registerEdit('latitude', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Longitude</label>
                  <input
                    type="number" step="any"
                    defaultValue={editingFactory.longitude}
                    {...registerEdit('longitude', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Plant Area (sqm)</label>
                  <input
                    type="number" step="any"
                    defaultValue={editingFactory.buildingAreaSqm}
                    {...registerEdit('buildingAreaSqm')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Employee Staff</label>
                  <input
                    type="number"
                    defaultValue={editingFactory.employeeCount}
                    {...registerEdit('employeeCount')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Production Capacity</label>
                  <input
                    type="number" step="any"
                    defaultValue={editingFactory.annualProductionCapacity}
                    {...registerEdit('annualProductionCapacity')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sustainability Grade</label>
                  <select
                    defaultValue={editingFactory.sustainabilityGrade}
                    {...registerEdit('sustainabilityGrade')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Operational Status</label>
                  <select
                    defaultValue={editingFactory.status}
                    {...registerEdit('status', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Logo Image URL</label>
                  <input
                    type="text"
                    defaultValue={editingFactory.logoUrl}
                    {...registerEdit('logoUrl')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Address</label>
                <textarea
                  defaultValue={editingFactory.address}
                  {...registerEdit('address', { required: true })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 h-16"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={updateFactoryMutation.isLoading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
                >
                  {updateFactoryMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFactory(null)}
                  className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Register Factory Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit(handleCreateSubmitForm)} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">1. Plant Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {isManagement && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Select Owner Company</label>
                    <select
                      {...registerCreate('companyId', { required: 'Company is required' })}
                      className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-750"
                    >
                      <option value="">Choose...</option>
                      {companies?.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.legalName}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Name</label>
                  <input
                    type="text"
                    placeholder="Ohio Metal Plant"
                    {...registerCreate('name', { required: 'Name is required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Code</label>
                  <input
                    type="text"
                    placeholder="FAC-OHIO-1"
                    {...registerCreate('factoryCode')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sector Type</label>
                  <input
                    type="text"
                    placeholder="Metals"
                    {...registerCreate('sectorType', { required: 'Sector type is required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Type</label>
                  <input
                    type="text"
                    placeholder="Manufacturing"
                    {...registerCreate('factoryType')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Manufacturing Category</label>
                  <input
                    type="text"
                    placeholder="Metals"
                    {...registerCreate('manufacturingCategory')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Factory Head</label>
                  <input
                    type="text"
                    placeholder="Plant Director Name"
                    {...registerCreate('factoryHead')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="plant@company.com"
                    {...registerCreate('email')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone number</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    {...registerCreate('phone')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Latitude</label>
                  <input
                    type="number" step="any"
                    placeholder="12.9716"
                    {...registerCreate('latitude', { required: 'Required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Longitude</label>
                  <input
                    type="number" step="any"
                    placeholder="77.5946"
                    {...registerCreate('longitude', { required: 'Required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Plant Area (sqm)</label>
                  <input
                    type="number" step="any"
                    placeholder="5000"
                    {...registerCreate('buildingAreaSqm')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Employee Staff</label>
                  <input
                    type="number"
                    placeholder="150"
                    {...registerCreate('employeeCount')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Production Capacity</label>
                  <input
                    type="number" step="any"
                    placeholder="50000"
                    {...registerCreate('annualProductionCapacity')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sustainability Grade</label>
                  <select
                    defaultValue="Gold"
                    {...registerCreate('sustainabilityGrade')}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-750"
                  >
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Certified">Certified</option>
                  </select>
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
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Address</label>
                <textarea
                  placeholder="Plot 12, Industrial zone..."
                  {...registerCreate('address', { required: 'Address is required' })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 h-16"
                />
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pt-2 pb-1">2. Initial Baseline Targets</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Baseline Year</label>
                  <input
                    type="number"
                    defaultValue="2022"
                    {...registerCreate('baselineYear', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Electricity (kWh)</label>
                  <input
                    type="number"
                    placeholder="150000"
                    {...registerCreate('electricityConsumptionKwh', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Water (kL)</label>
                  <input
                    type="number"
                    placeholder="8000"
                    {...registerCreate('waterConsumptionKl', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Waste (MT)</label>
                  <input
                    type="number"
                    placeholder="300"
                    {...registerCreate('wasteGeneratedMt', { required: true })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={createFactoryMutation.isLoading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50"
                >
                  {createFactoryMutation.isLoading ? 'Registering...' : 'Register Plant'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

export default FactoriesPage
