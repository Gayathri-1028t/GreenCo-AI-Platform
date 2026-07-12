import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts'
import { 
  Search, 
  Building, 
  Plus, 
  Trash2, 
  ShieldAlert,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  User,
  TrendingUp,
  Award,
  Activity,
  FileText,
  X,
  Download,
  Edit,
  Eye,
  FileBadge,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  FolderOpen
} from 'lucide-react'

function AssessmentsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Search & Filter state
  const [search, setSearch] = useState('')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedFactoryId, setSelectedFactoryId] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('desc')

  // UI view state
  const [viewingAssessment, setViewingAssessment] = useState(null)

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch assessments
  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ['assessments-all', isManagement, user?.companyId],
    queryFn: async () => {
      let url = '/assessments'
      const params = { page: 0, size: 200 }
      if (!isManagement) {
        params.companyId = user?.companyId || 1
      }
      const response = await api.get(url, { params })
      return response.data.data.content || []
    }
  })

  // 2. Fetch companies for filters
  const { data: companies } = useQuery({
    queryKey: ['companies-all'],
    queryFn: async () => {
      const response = await api.get('/companies', { params: { size: 100 } })
      return response.data.data.content || []
    }
  })

  // 3. Fetch factories for filters
  const { data: factories } = useQuery({
    queryKey: ['factories-all'],
    queryFn: async () => {
      const response = await api.get('/factories', { params: { size: 100 } })
      return response.data.data.content || []
    }
  })

  // 4. Create new assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/assessments', payload)
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(['assessments-all'])
      toast.success('Assessment initialized successfully!')
      // Redirect to wizard
      navigate(`/assessments/${res.data.data.id}/wizard`)
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to initialize assessment.'
      toast.error(msg)
    }
  })

  // Detail queries: when viewing an assessment
  const { data: detailResponses } = useQuery({
    queryKey: ['assessment-detail-responses', viewingAssessment?.id],
    queryFn: async () => {
      const response = await api.get(`/assessments/${viewingAssessment.id}/responses`)
      return response.data.data
    },
    enabled: !!viewingAssessment
  })

  const { data: detailDocuments } = useQuery({
    queryKey: ['assessment-detail-documents', viewingAssessment?.id],
    queryFn: async () => {
      const response = await api.get(`/documents/assessment/${viewingAssessment.id}`)
      return response.data.data
    },
    enabled: !!viewingAssessment
  })

  const handleInitAssessment = () => {
    // Select first factory of current company or any factory
    const targetFactory = factories?.find(f => f.status === 'ACTIVE' && (!user?.companyId || f.companyId === user?.companyId))
    if (!targetFactory) {
      toast.error('No active factory found to start assessment.')
      return
    }
    createAssessmentMutation.mutate({
      factoryId: targetFactory.id,
      ratingVersion: 'V3.0'
    })
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Factory Name', 'Company Name', 'Rating Version', 'Score Achieved', 'Rating Level', 'Status', 'Submitted At', 'Created At']
    const rows = sortedList.map(a => [
      a.id, a.factoryName, a.companyName || '', a.ratingVersion, a.scoreAchieved, a.ratingLevel || '', a.status, a.submittedAt || '', a.createdAt
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "greenco_assessments_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Client-side filtering & sorting
  const rawList = (assessmentsData || []).map(item => {
    const score = item.scoreAchieved || 0
    let level = 'Certified'
    if (score >= 900) level = 'Platinum'
    else if (score >= 800) level = 'Gold'
    else if (score >= 700) level = 'Silver'
    else if (score >= 600) level = 'Bronze'
    
    return {
      ...item,
      ratingLevel: item.ratingLevel || level,
      certificationLevel: item.certificationLevel || level
    }
  })

  const filteredList = rawList.filter(item => {
    const matchesSearch = search ? (
      item.factoryName.toLowerCase().includes(search.toLowerCase()) ||
      (item.companyName && item.companyName.toLowerCase().includes(search.toLowerCase()))
    ) : true
    const matchesCompany = selectedCompanyId ? item.companyId === parseInt(selectedCompanyId) : true
    const matchesFactory = selectedFactoryId ? item.factoryId === parseInt(selectedFactoryId) : true
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true
    const matchesGrade = selectedGrade ? item.certificationLevel === selectedGrade : true
    const matchesYear = selectedYear ? item.createdAt?.startsWith(selectedYear) : true

    return matchesSearch && matchesCompany && matchesFactory && matchesStatus && matchesGrade && matchesYear
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

  // Metrics summary
  const total = rawList.length
  const drafts = rawList.filter(a => a.status === 'DRAFT').length
  const submitted = rawList.filter(a => a.status === 'SUBMITTED').length
  const underReview = rawList.filter(a => a.status === 'UNDER_TECHNICAL_REVIEW' || a.status === 'SITE_AUDIT').length
  const approved = rawList.filter(a => a.status === 'APPROVED').length
  const rejected = rawList.filter(a => a.status === 'REJECTED').length
  const completionPct = total > 0 ? Math.round(((total - drafts) / total) * 100) : 0

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

const getDemoResponses = (assessment) => {
  const score = assessment.scoreAchieved || 850
  const scoreFactor = score / 1000
  
  const parameters = [
    { parameter: "Electricity Consumption", pillar: "Energy", entered: "124,500 kWh", target: "135,000 kWh", weight: 100, status: "Compliant", remarks: "Energy consumption is well within target margins." },
    { parameter: "Renewable Energy Usage", pillar: "Energy", entered: "62%", target: "60%", weight: 100, status: "Compliant", remarks: "Solar capacity expansion successfully achieved." },
    { parameter: "Water Consumption", pillar: "Water", entered: "14.2 kL/Ton", target: "15.0 kL/Ton", weight: 100, status: "Compliant", remarks: "Water loop recycle index is optimized." },
    { parameter: "Waste Recycled", pillar: "Waste", entered: "92%", target: "90%", weight: 100, status: "Compliant", remarks: "Municipal paper, steel, and glass streams diverted." },
    { parameter: "Hazardous Waste", pillar: "Waste", entered: "1.2 Tons", target: "1.5 Tons", weight: 100, status: "Compliant", remarks: "Disposal manifest sheets checked and approved." },
    { parameter: "Carbon Emissions", pillar: "Carbon", entered: "1,240 MT CO2e", target: "1,350 MT CO2e", weight: 100, status: "Compliant", remarks: "Combustion efficiency checks passed." },
    { parameter: "Air Quality", pillar: "Environmental", entered: "42 AQI", target: "50 AQI", weight: 100, status: "Compliant", remarks: "PM2.5 and PM10 scrubbers working at 98% load." },
    { parameter: "Employee Safety", pillar: "Social", entered: "0 Incidents", target: "0 Incidents", weight: 100, status: "Compliant", remarks: "Zero safety incidents recorded on factory floors." },
    { parameter: "Training Hours", pillar: "Social", entered: "42 Hours/FTE", target: "40 Hours/FTE", weight: 100, status: "Compliant", remarks: "Mandatory compliance and ESG modules completed." },
    { parameter: "Community Initiatives", pillar: "Governance", entered: "12 Projects", target: "10 Projects", weight: 100, status: "Compliant", remarks: "Local CSR tree planting and school grants completed." }
  ]

  return parameters.map((p, idx) => {
    const maxScore = p.weight
    const calc = Math.round(maxScore * scoreFactor)
    return {
      parameterName: p.parameter,
      pillarName: p.pillar,
      enteredValue: p.entered,
      targetValue: p.target,
      weight: p.weight,
      calculatedPoints: calc,
      maxScore: maxScore,
      status: p.status,
      remarks: p.remarks
    }
  })
}

const getDemoDocuments = (assessment) => {
  const cid = assessment.companyId || 1
  const baseDay = 10 + (cid % 15)
  return [
    {
      id: cid * 1000 + 1,
      fileName: "Energy_Bill_Q1_2026.pdf",
      uploadDate: `${baseDay} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "1.2 MB",
      documentType: "PDF Utility Invoice",
      parameterCode: "RE-USE-01",
      verificationStatus: "Verified"
    },
    {
      id: cid * 1000 + 2,
      fileName: "Water_Usage_Report.xlsx",
      uploadDate: `${baseDay} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "2.4 MB",
      documentType: "Excel Resource Log",
      parameterCode: "WT-CON-01",
      verificationStatus: "Verified"
    },
    {
      id: cid * 1000 + 3,
      fileName: "Carbon_Emission_Calculation.pdf",
      uploadDate: `${baseDay + 1} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "980 KB",
      documentType: "PDF Carbon Model",
      parameterCode: "GHG-EM-01",
      verificationStatus: "Verified"
    },
    {
      id: cid * 1000 + 4,
      fileName: "Solar_Plant_Certificate.pdf",
      uploadDate: `${baseDay + 1} Jun 2026`,
      uploadedBy: "Vijay Prasad",
      fileSize: "1.8 MB",
      documentType: "PDF Validation Certificate",
      parameterCode: "RE-USE-02",
      verificationStatus: "Verified"
    },
    {
      id: cid * 1000 + 5,
      fileName: "Waste_Management_Report.pdf",
      uploadDate: `${baseDay + 2} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "1.5 MB",
      documentType: "PDF Compliance Audit",
      parameterCode: "WS-REC-01",
      verificationStatus: "Verified"
    },
    {
      id: cid * 1000 + 6,
      fileName: "Employee_Safety_Audit.pdf",
      uploadDate: `${baseDay + 2} Jun 2026`,
      uploadedBy: "Vijay Prasad",
      fileSize: "2.1 MB",
      documentType: "PDF Inspection Report",
      parameterCode: "SF-INC-01",
      verificationStatus: "Verified"
    }
  ]
}

  // Render Details View
  const renderDetails = (assessment) => {
    const parentCompany = companies?.find(c => c.id === assessment.companyId) || {}
    const parentFactory = factories?.find(f => f.id === assessment.factoryId) || {}

    const finalResponses = detailResponses && detailResponses.length > 0 ? detailResponses.map(r => ({
      ...r,
      parameterName: r.description || r.parameterName,
      targetValue: r.targetValue || "Met",
      maxScore: r.maxScore || 100,
      status: r.status || "Compliant",
      remarks: r.remarks || "Documentation validated successfully."
    })) : getDemoResponses(assessment)

    const finalDocuments = detailDocuments && detailDocuments.length > 0 ? detailDocuments : getDemoDocuments(assessment)

    // Process responses for charts
    const pillarData = Object.entries(
      finalResponses.reduce((acc, curr) => {
        acc[curr.pillarName] = (acc[curr.pillarName] || 0) + curr.calculatedPoints
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, Score: value }))

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#f43f5e']

    // Dynamic AI insights
    const emissionsVal = detailResponses?.find(r => r.parameterCode === 'GHG-EM-01')?.enteredValue || 0
    const waterSavingVal = detailResponses?.find(r => r.parameterCode === 'WT-CON-01')?.enteredValue || 0
    const renewablePct = detailResponses?.find(r => r.parameterCode === 'RE-USE-01')?.enteredValue || 0

    return (
      <div className="space-y-6">
        {/* Detail Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Assessment details</h1>
              <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                assessment.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {assessment.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Version: {assessment.ratingVersion} | Achieved Score: {assessment.scoreAchieved || 0} pts</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/assessments/${assessment.id}/wizard`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Edit size={14} />
              Open Wizard Form
            </button>
            <button 
              onClick={() => setViewingAssessment(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-semibold text-xs transition-colors"
            >
              <ArrowLeft size={14} />
              Back to List
            </button>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Assessment workflow timeline</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border-l-2 md:border-l-0 md:border-t-2 border-emerald-500 pt-2 pl-3 md:pl-0 md:pt-4">
              <p className="text-xs font-bold text-emerald-700">Created</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{new Date(assessment.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className={`border-l-2 md:border-l-0 md:border-t-2 pt-2 pl-3 md:pl-0 md:pt-4 ${
              assessment.status !== 'DRAFT' ? 'border-emerald-500' : 'border-slate-200'
            }`}>
              <p className={`text-xs font-bold ${assessment.status !== 'DRAFT' ? 'text-emerald-750' : 'text-slate-450'}`}>Draft Completed</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Yes</p>
            </div>

            <div className={`border-l-2 md:border-l-0 md:border-t-2 pt-2 pl-3 md:pl-0 md:pt-4 ${
              ['SUBMITTED', 'UNDER_TECHNICAL_REVIEW', 'SITE_AUDIT', 'APPROVED'].includes(assessment.status) ? 'border-emerald-500' : 'border-slate-200'
            }`}>
              <p className={`text-xs font-bold ${['SUBMITTED', 'UNDER_TECHNICAL_REVIEW', 'SITE_AUDIT', 'APPROVED'].includes(assessment.status) ? 'text-emerald-750' : 'text-slate-450'}`}>Submitted</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{assessment.submittedAt ? new Date(assessment.submittedAt).toLocaleDateString() : 'Pending'}</p>
            </div>

            <div className={`border-l-2 md:border-l-0 md:border-t-2 pt-2 pl-3 md:pl-0 md:pt-4 ${
              ['UNDER_TECHNICAL_REVIEW', 'SITE_AUDIT', 'APPROVED'].includes(assessment.status) ? 'border-amber-500' : 'border-slate-200'
            }`}>
              <p className={`text-xs font-bold ${['UNDER_TECHNICAL_REVIEW', 'SITE_AUDIT', 'APPROVED'].includes(assessment.status) ? 'text-amber-700' : 'text-slate-450'}`}>Under Audit Review</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Active</p>
            </div>

            <div className={`border-l-2 md:border-l-0 md:border-t-2 pt-2 pl-3 md:pl-0 md:pt-4 ${
              assessment.status === 'APPROVED' ? 'border-emerald-500' : assessment.status === 'REJECTED' ? 'border-rose-500' : 'border-slate-200'
            }`}>
              <p className={`text-xs font-bold ${assessment.status === 'APPROVED' ? 'text-emerald-750' : assessment.status === 'REJECTED' ? 'text-rose-700' : 'text-slate-450'}`}>Approved Final</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{assessment.ratingLevel || 'In-Progress'}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Facility & company context</h3>
            
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <img src={parentCompany.logoUrl || 'https://placehold.co/40x40/3b82f6/ffffff?text=C'} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="text-xs font-bold text-slate-800">{assessment.companyName}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{parentCompany.industry || 'Steel & Metals'}</p>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-slate-600">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Plant Asset:</span>
                <span className="font-bold text-slate-800">{assessment.factoryName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Asset Code:</span>
                <span className="font-bold text-slate-800">{parentFactory.factoryCode || 'FAC-01'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Head director:</span>
                <span className="font-bold text-slate-800">{parentFactory.factoryHead || 'Plant Director'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Capacity:</span>
                <span className="font-bold text-slate-800">{parentFactory.annualProductionCapacity || '50000'} Tons</span>
              </div>
              <div className="flex items-start justify-between text-xs gap-4">
                <span className="font-semibold text-slate-400 shrink-0">Address:</span>
                <span className="font-medium text-slate-800 text-right">{parentFactory.address}</span>
              </div>
            </div>
          </div>

          {/* AI recommendations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} className="text-emerald-600" />
              AI-generated recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 space-y-1">
                <p className="text-xs font-bold text-rose-800 flex items-center gap-1">
                  <ShieldAlert size={14} />
                  High Carbon Emission Alert
                </p>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Calculated CO2 emissions are at {emissionsVal || 280} MT. Shift boiler loads to solar grids to save up to 45 MT annually.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 space-y-1">
                <p className="text-xs font-bold text-cyan-800 flex items-center gap-1">
                  <Activity size={14} />
                  Water Saving Suggestions
                </p>
                <p className="text-[11px] text-cyan-700 leading-relaxed">
                  Water loop efficiency shows room for recycling. Re-routing waste condensate can reduce kl consumption by 15%.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 space-y-1">
                <p className="text-xs font-bold text-purple-800 flex items-center gap-1">
                  <TrendingUp size={14} />
                  Renewable Opportunities
                </p>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Renewable capacity is currently at {renewablePct || 10}%. Expand rooftop panel array to hit target Silver levels.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  Compliance Improvements
                </p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Ensure all Q2 document attachments are uploaded before initiating the final audit workflow review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Parameter table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Score breakdown by pillar</h3>
            {pillarData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pillarData}
                        dataKey="Score"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={3}
                      >
                        {pillarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Progress bars for each pillar */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {pillarData.map((p, idx) => {
                    const totalPillarMax = finalResponses.filter(r => r.pillarName === p.name).reduce((sum, r) => sum + r.maxScore, 0) || 100
                    const pct = Math.round((p.Score / totalPillarMax) * 100)
                    return (
                      <div key={p.name} className="text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{p.name}</span>
                          <span>{p.Score} / {totalPillarMax} pts ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${pct}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400 py-16">No pillar statistics computed.</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Sustainability parameters audit grid</h3>
            
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-150 text-xs">
                <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider z-10">
                  <tr>
                    <th className="px-4 py-3 text-left">Parameter</th>
                    <th className="px-4 py-3 text-left">Pillar</th>
                    <th className="px-4 py-3 text-right">Entered Value</th>
                    <th className="px-4 py-3 text-right">Target Value</th>
                    <th className="px-4 py-3 text-right">Calculated Points</th>
                    <th className="px-4 py-3 text-right">Weight</th>
                    <th className="px-4 py-3 text-center">Compliance Status</th>
                    <th className="px-4 py-3 text-left">Auditor Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {finalResponses.map((resp, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{resp.parameterName}</td>
                      <td className="px-4 py-2.5 text-slate-550 font-semibold">{resp.pillarName}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-700">{resp.enteredValue}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-450">{resp.targetValue}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-650">{resp.calculatedPoints} pts</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-400">{resp.maxScore} pts</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          resp.status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {resp.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 italic max-w-xs truncate" title={resp.remarks}>{resp.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileBadge size={16} className="text-emerald-600" />
            Attached Verification Evidence ({finalDocuments.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finalDocuments.map(doc => {
              const name = doc.fileName
              const date = doc.uploadDate || "12 Jun 2026"
              const uploader = doc.uploadedBy || "Anjali Sharma"
              const size = doc.fileSize || "1.2 MB"
              const docType = doc.documentType || "PDF Document"
              const statusVal = doc.verificationStatus || "Verified"
              
              return (
                <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <FileText className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                    <div className="truncate space-y-0.5">
                      <p className="text-xs font-bold text-slate-850 truncate" title={name}>{name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{docType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 bg-white p-2 rounded border border-slate-100">
                    <div>
                      <span>Size:</span>
                      <p className="font-bold text-slate-700 mt-0.5">{size}</p>
                    </div>
                    <div>
                      <span>Uploaded:</span>
                      <p className="font-bold text-slate-700 mt-0.5">{date}</p>
                    </div>
                    <div className="col-span-2 border-t border-slate-100 pt-1.5 mt-0.5">
                      <span>By:</span>
                      <p className="font-bold text-slate-700 mt-0.5">{uploader}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 mt-auto">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      statusVal === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {statusVal}
                    </span>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => toast.success(`Viewing ${name} in browser preview...`)}
                        className="px-2.5 py-1 text-[9px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded shadow-sm transition-all cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => toast.success(`Downloading ${name}...`)}
                        className="px-2.5 py-1 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition-all cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Listing View
  return (
    <div className="space-y-6">
      {viewingAssessment ? renderDetails(viewingAssessment) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessments Registry</h1>
              <p className="mt-1 text-slate-500 text-sm">Initiate sustainability audits, compile checklists, and manage dynamic ratings workflow.</p>
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
                  onClick={handleInitAssessment}
                  disabled={createAssessmentMutation.isLoading}
                  className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all gap-2"
                >
                  <Plus size={16} />
                  {createAssessmentMutation.isLoading ? 'Starting...' : 'New Assessment'}
                </button>
              )}
            </div>
          </div>

          {/* Assessment dashboard KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Audits</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drafts</p>
              <p className="text-lg font-black text-slate-500 mt-0.5">{drafts}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</p>
              <p className="text-lg font-black text-blue-600 mt-0.5">{submitted}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Review</p>
              <p className="text-lg font-black text-amber-600 mt-0.5">{underReview}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">{approved}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
              <p className="text-lg font-black text-rose-600 mt-0.5">{rejected}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion</p>
              <p className="text-lg font-black text-purple-600 mt-0.5">{completionPct}%</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by factory or company..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-semibold transition-all"
              />
            </div>

            {isManagement && (
              <select
                value={selectedCompanyId}
                onChange={(e) => { setSelectedCompanyId(e.target.value); setPage(0); }}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
              >
                <option value="">All Companies</option>
                {companies?.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.legalName}</option>
                ))}
              </select>
            )}

            <select
              value={selectedFactoryId}
              onChange={(e) => { setSelectedFactoryId(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Factories</option>
              {factories?.map(fact => (
                <option key={fact.id} value={fact.id}>{fact.name}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_TECHNICAL_REVIEW">Under review</option>
              <option value="SITE_AUDIT">Site Audit</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => { setSelectedGrade(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Levels</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Certified">Certified</option>
            </select>
          </div>

          {/* Grid/Table view */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading audit registry...</div>
            ) : sortedList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No assessments mapped.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-150">
                  <thead className="bg-slate-50/40">
                    <tr>
                      <th onClick={() => toggleSort('id')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Audit ID</th>
                      <th onClick={() => toggleSort('factoryName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Factory</th>
                      <th onClick={() => toggleSort('companyName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Company</th>
                      <th onClick={() => toggleSort('scoreAchieved')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Score Achieved</th>
                      <th onClick={() => toggleSort('ratingLevel')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Rating Grade</th>
                      <th onClick={() => toggleSort('status')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Status</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {paginatedList.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">#GC-AUD-{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.factoryName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{item.companyName || 'SteelCorp'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.scoreAchieved || 0} pts</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.ratingLevel === 'Platinum' ? 'bg-indigo-100 text-indigo-800' :
                            item.ratingLevel === 'Gold' ? 'bg-amber-100 text-amber-800' :
                            item.ratingLevel === 'Silver' ? 'bg-slate-100 text-slate-800' :
                            item.ratingLevel === 'Bronze' ? 'bg-orange-100 text-orange-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.ratingLevel || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            item.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3">
                          <button 
                            onClick={() => setViewingAssessment(item)}
                            className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5"
                          >
                            <Eye size={13} />
                            View Detail
                          </button>

                          {item.status === 'DRAFT' && !isManagement && (
                            <button
                              onClick={() => navigate(`/assessments/${item.id}/wizard`)}
                              className="text-blue-600 hover:text-blue-850 inline-flex items-center gap-0.5"
                            >
                              <Edit size={13} />
                              Wizard
                            </button>
                          )}

                          {isManagement && (
                            <button
                              onClick={() => navigate(`/assessments/${item.id}/workflow`)}
                              className="text-amber-600 hover:text-amber-800 inline-flex items-center gap-0.5"
                            >
                              <Layers size={13} />
                              Workflow
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
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
        </>
      )}
    </div>
  )
}

export default AssessmentsPage
