import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts'
import { 
  Building2, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  ArrowUpRight, 
  Cpu, 
  Settings, 
  Plus, 
  Award, 
  TrendingUp, 
  Zap, 
  BrainCircuit, 
  Sparkles,
  ClipboardCheck,
  ChevronRight,
  RefreshCw,
  FolderUp,
  FileBadge,
  Brain,
  MapPin,
  AlertCircle,
  Calendar,
  X,
  Activity,
  Bell,
  ShieldCheck,
  TrendingDown
} from 'lucide-react'

// Sub-component to dynamically update Leaflet viewport when bounds/centers change
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch dashboard metrics summary
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary')
      return response.data.data
    }
  })

  // 2. Fetch factories to populate start-assessment selection (for operators)
  const { data: factories } = useQuery({
    queryKey: ['my-factories'],
    queryFn: async () => {
      const companyId = user?.companyId || 1
      const response = await api.get(`/factories/company/${companyId}`)
      return response.data.data
    },
    enabled: !isManagement
  })

  // 3. Fetch all factories for map plotting (for managers/admins)
  const { data: allFactories } = useQuery({
    queryKey: ['all-factories-map'],
    queryFn: async () => {
      const response = await api.get('/factories', {
        params: { size: 100 }
      })
      return response.data.data.content
    }
  })

  // 4. Fetch assessments list
  const { data: assessmentsData, isLoading: isAssessmentsLoading } = useQuery({
    queryKey: ['dashboard-assessments'],
    queryFn: async () => {
      const response = await api.get('/assessments', {
        params: { page: 0, size: 100 }
      })
      return response.data.data
    }
  })

  // 5. Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/assessments', payload)
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(['dashboard-summary'])
      queryClient.invalidateQueries(['dashboard-assessments'])
      toast.success('Assessment initialized successfully!')
      setIsModalOpen(false)
      reset()
      navigate(`/assessments/${res.data.data.id}/wizard`)
    },
    onError: () => {
      toast.error('Failed to initialize assessment')
    }
  })

  const handleStartAssessment = (formData) => {
    createAssessmentMutation.mutate({
      factoryId: parseInt(formData.factoryId),
      ratingVersion: formData.ratingVersion
    })
  }

  // Loading skeleton layout
  if (isSummaryLoading || isAssessmentsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse p-6 flex flex-col justify-between">
          <div className="h-5 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const chartData = [
    { name: 'Completed', Count: 146 },
    { name: 'In Review', Count: 28 },
    { name: 'Pending', Count: 12 },
    { name: 'Approved', Count: 95 },
    { name: 'Rejected', Count: 8 },
    { name: 'Scheduled', Count: 15 }
  ]

  const carbonData = [
    { month: 'Jan', Emissions: 2450 },
    { month: 'Feb', Emissions: 2320 },
    { month: 'Mar', Emissions: 2150 },
    { month: 'Apr', Emissions: 2010 },
    { month: 'May', Emissions: 1880 },
    { month: 'Jun', Emissions: 1850 },
    { month: 'Jul', Emissions: 1720 },
    { month: 'Aug', Emissions: 1680 },
    { month: 'Sep', Emissions: 1610 },
    { month: 'Oct', Emissions: 1540 },
    { month: 'Nov', Emissions: 1480 },
    { month: 'Dec', Emissions: 1390 }
  ]

  const energyData = [
    { month: 'Jan', Consumption: 450 },
    { month: 'Feb', Consumption: 430 },
    { month: 'Mar', Consumption: 420 },
    { month: 'Apr', Consumption: 390 },
    { month: 'May', Consumption: 380 },
    { month: 'Jun', Consumption: 370 },
    { month: 'Jul', Consumption: 360 },
    { month: 'Aug', Consumption: 350 },
    { month: 'Sep', Consumption: 340 },
    { month: 'Oct', Consumption: 320 },
    { month: 'Nov', Consumption: 310 },
    { month: 'Dec', Consumption: 290 }
  ]

  const waterData = [
    { month: 'Jan', Usage: 85 },
    { month: 'Feb', Usage: 82 },
    { month: 'Mar', Usage: 80 },
    { month: 'Apr', Usage: 76 },
    { month: 'May', Usage: 74 },
    { month: 'Jun', Usage: 72 },
    { month: 'Jul', Usage: 70 },
    { month: 'Aug', Usage: 68 },
    { month: 'Sep', Usage: 65 },
    { month: 'Oct', Usage: 63 },
    { month: 'Nov', Usage: 60 },
    { month: 'Dec', Usage: 58 }
  ]

  const wasteData = [
    { month: 'Jan', Generated: 120, Recycled: 75 },
    { month: 'Feb', Generated: 115, Recycled: 78 },
    { month: 'Mar', Generated: 110, Recycled: 80 },
    { month: 'Apr', Generated: 105, Recycled: 82 },
    { month: 'May', Generated: 100, Recycled: 85 },
    { month: 'Jun', Generated: 98, Recycled: 86 },
    { month: 'Jul', Generated: 95, Recycled: 88 },
    { month: 'Aug', Generated: 90, Recycled: 85 },
    { month: 'Sep', Generated: 88, Recycled: 84 },
    { month: 'Oct', Generated: 85, Recycled: 82 },
    { month: 'Nov', Generated: 80, Recycled: 78 },
    { month: 'Dec', Generated: 75, Recycled: 74 }
  ]

  const certProgressData = [
    { name: 'Platinum', value: 8, color: '#0f172a' },
    { name: 'Gold', value: 15, color: '#eab308' },
    { name: 'Silver', value: 12, color: '#64748b' },
    { name: 'Bronze', value: 6, color: '#b45309' },
    { name: 'Certified', value: 10, color: '#10b981' }
  ]

  const assessmentTrendsData = [
    { month: 'Jan', Completed: 12, Initiated: 15 },
    { month: 'Feb', Completed: 14, Initiated: 18 },
    { month: 'Mar', Completed: 16, Initiated: 20 },
    { month: 'Apr', Completed: 19, Initiated: 22 },
    { month: 'May', Completed: 22, Initiated: 25 },
    { month: 'Jun', Completed: 25, Initiated: 28 },
    { month: 'Jul', Completed: 28, Initiated: 30 }
  ]

  const ongoingRatings = [
    { factory: 'SteelCorp Chennai', company: 'SteelCorp Industries', currentRating: '92%', previousRating: '85%', improvement: '+7%', status: 'Approved', lastUpdated: '2026-07-10' },
    { factory: 'Eco Cement Coimbatore', company: 'EcoBuild Construction', currentRating: '84%', previousRating: '79%', improvement: '+5%', status: 'In Review', lastUpdated: '2026-07-12' },
    { factory: 'GreenTextiles Tiruppur', company: 'Nova Textiles', currentRating: '76%', previousRating: '78%', improvement: '-2%', status: 'Pending', lastUpdated: '2026-07-09' },
    { factory: 'SolarTech Bengaluru', company: 'GreenGrid Energy', currentRating: '95%', previousRating: '90%', improvement: '+5%', status: 'Approved', lastUpdated: '2026-07-08' },
    { factory: 'Hydro Industries Hyderabad', company: 'PureWater Utilities', currentRating: '89%', previousRating: '81%', improvement: '+8%', status: 'Approved', lastUpdated: '2026-07-11' },
    { factory: 'AutoForge Pune', company: 'Apex Logistics', currentRating: '72%', previousRating: '68%', improvement: '+4%', status: 'In Review', lastUpdated: '2026-07-12' },
    { factory: 'Eco Steel Mumbai', company: 'Tata Metallurgy', currentRating: '86%', previousRating: '86%', improvement: '0%', status: 'Approved', lastUpdated: '2026-07-07' },
    { factory: 'Smart Chemicals Ahmedabad', company: 'Smart Chemicals Ltd', currentRating: '81%', previousRating: '75%', improvement: '+6%', status: 'Scheduled', lastUpdated: '2026-07-05' },
    { factory: 'Eco Plastics Delhi', company: 'Eco Plastics Corp', currentRating: '68%', previousRating: '72%', improvement: '-4%', status: 'Rejected', lastUpdated: '2026-07-01' },
    { factory: 'Green Mills Kolkata', company: 'Green Mills Group', currentRating: '79%', previousRating: '73%', improvement: '+6%', status: 'Approved', lastUpdated: '2026-07-06' }
  ]

  const recentAuditEvents = [
    { title: 'ISO 14001 Audit Completed', factory: 'SteelCorp Chennai', auditor: 'Ramesh Krishnan', status: 'Completed', date: '2026-07-12' },
    { title: 'Energy Audit Completed', factory: 'Eco Cement Coimbatore', auditor: 'Anjali Sharma', status: 'Completed', date: '2026-07-12' },
    { title: 'Waste Management Inspection', factory: 'GreenTextiles Tiruppur', auditor: 'Deepak Nair', status: 'Completed', date: '2026-07-11' },
    { title: 'Water Usage Review', factory: 'SolarTech Bengaluru', auditor: 'Satish Kumar', status: 'Completed', date: '2026-07-11' },
    { title: 'Carbon Emission Verification', factory: 'Hydro Industries Hyderabad', auditor: 'Vijay Prasad', status: 'Completed', date: '2026-07-10' },
    { title: 'Safety Compliance Audit', factory: 'AutoForge Pune', auditor: 'Karthik Rao', status: 'Completed', date: '2026-07-10' },
    { title: 'Environmental Assessment', factory: 'Eco Steel Mumbai', auditor: 'Ramesh Krishnan', status: 'Completed', date: '2026-07-09' },
    { title: 'Internal ESG Review', factory: 'Smart Chemicals Ahmedabad', auditor: 'Priya Patel', status: 'Completed', date: '2026-07-09' },
    { title: 'ISO 14001 Audit Completed', factory: 'Eco Plastics Delhi', auditor: 'Ramesh Krishnan', status: 'Completed', date: '2026-07-08' },
    { title: 'Energy Audit Completed', factory: 'Green Mills Kolkata', auditor: 'Vijay Prasad', status: 'Completed', date: '2026-07-08' },
    { title: 'Waste Management Inspection', factory: 'Visakha Industries Visakhapatnam', auditor: 'Deepak Nair', status: 'Completed', date: '2026-07-07' },
    { title: 'Water Usage Review', factory: 'Surat Metals Surat', auditor: 'Anjali Sharma', status: 'Completed', date: '2026-07-07' },
    { title: 'Carbon Emission Verification', factory: 'Giga Solar Systems Jaipur', auditor: 'Satish Kumar', status: 'Completed', date: '2026-07-06' },
    { title: 'Safety Compliance Audit', factory: 'Salem Steel Rolling Mill', auditor: 'Karthik Rao', status: 'Completed', date: '2026-07-06' },
    { title: 'Environmental Assessment', factory: 'Kochi Refinery Chemicals', auditor: 'Ramesh Krishnan', status: 'Completed', date: '2026-07-05' },
    { title: 'Internal ESG Review', factory: 'Punjab Castings Ludhiana', auditor: 'Priya Patel', status: 'Completed', date: '2026-07-05' },
    { title: 'ISO 14001 Audit Completed', factory: 'Bhilai Metallurgy Plant', auditor: 'Vijay Prasad', status: 'Completed', date: '2026-07-04' },
    { title: 'Energy Audit Completed', factory: 'Deccan Foundry Hyderabad', auditor: 'Anjali Sharma', status: 'Completed', date: '2026-07-04' },
    { title: 'Waste Management Inspection', factory: 'Western Cement Nagpur', auditor: 'Deepak Nair', status: 'Completed', date: '2026-07-03' },
    { title: 'Water Usage Review', factory: 'Kochi Refinery Chemicals', auditor: 'Satish Kumar', status: 'Completed', date: '2026-07-03' }
  ]

  const fallbackFactories = [
    { id: 1, name: 'SteelCorp Chennai', companyName: 'SteelCorp Industries', latitude: 13.0827, longitude: 80.2707, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 84 },
    { id: 2, name: 'Eco Cement Coimbatore', companyName: 'EcoBuild Construction', latitude: 11.0168, longitude: 76.9558, status: 'ACTIVE', ratingLevel: 'SILVER', sustainabilityScore: 76 },
    { id: 3, name: 'GreenTextiles Tiruppur', companyName: 'Nova Textiles', latitude: 11.1085, longitude: 77.3411, status: 'ACTIVE', ratingLevel: 'BRONZE', sustainabilityScore: 72 },
    { id: 4, name: 'SolarTech Bengaluru', companyName: 'GreenGrid Energy', latitude: 12.9716, longitude: 77.5946, status: 'ACTIVE', ratingLevel: 'PLATINUM', sustainabilityScore: 94 },
    { id: 5, name: 'Hydro Industries Hyderabad', companyName: 'PureWater Utilities', latitude: 17.3850, longitude: 78.4867, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 89 },
    { id: 6, name: 'AutoForge Pune', companyName: 'Apex Logistics', latitude: 18.5204, longitude: 73.8567, status: 'ACTIVE', ratingLevel: 'SILVER', sustainabilityScore: 74 },
    { id: 7, name: 'Eco Steel Mumbai', companyName: 'Tata Metallurgy', latitude: 19.0760, longitude: 72.8777, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 86 },
    { id: 8, name: 'Smart Chemicals Ahmedabad', companyName: 'Smart Chemicals Ltd', latitude: 23.0225, longitude: 72.5714, status: 'ACTIVE', ratingLevel: 'SILVER', sustainabilityScore: 81 },
    { id: 9, name: 'Eco Plastics Delhi', companyName: 'Eco Plastics Corp', latitude: 28.7041, longitude: 77.1025, status: 'ACTIVE', ratingLevel: 'BRONZE', sustainabilityScore: 68 },
    { id: 10, name: 'Green Mills Kolkata', companyName: 'Green Mills Group', latitude: 22.5726, longitude: 88.3639, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 79 },
    { id: 11, name: 'Visakha Industries Visakhapatnam', companyName: 'Visakha Industries', latitude: 17.6868, longitude: 83.2185, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 85 },
    { id: 12, name: 'Surat Metals Surat', companyName: 'Surat Metals Ltd', latitude: 21.1702, longitude: 72.8311, status: 'ACTIVE', ratingLevel: 'GOLD', sustainabilityScore: 83 }
  ]

  const allAssessments = assessmentsData?.content || []
  const assessments = allAssessments.slice(0, 7) // Show up to 7 rows initially

  const mapFactories = (allFactories && allFactories.length > 0) ? allFactories : fallbackFactories

  // Dynamic Map selection settings
  const getMapSettings = (factoriesList) => {
    if (!factoriesList || factoriesList.length === 0) {
      return { center: [20.5937, 78.9629], zoom: 5, isTamilNadu: false }
    }

    const states = factoriesList.map(f => {
      if (f.state) return f.state.toLowerCase()
      const addr = (f.address || '').toLowerCase()
      if (addr.includes('tamil nadu') || addr.includes(', tn') || addr.includes('chennai') || addr.includes('coimbatore')) {
        return 'tamil nadu'
      }
      return null
    })

    const allStatesResolved = states.every(s => s !== null)
    const allTamilNaduByState = allStatesResolved && states.every(s => s === 'tamil nadu')

    const allTamilNaduByCoords = factoriesList.every(f => {
      const lat = f.latitude
      const lng = f.longitude
      return lat >= 8.0 && lat <= 13.6 && lng >= 76.0 && lng <= 80.5
    })

    const isTamilNadu = allTamilNaduByState || (!allStatesResolved && allTamilNaduByCoords)

    if (isTamilNadu) {
      return { center: [11.1271, 78.6569], zoom: 8, isTamilNadu: true }
    } else {
      return { center: [20.5937, 78.9629], zoom: 5, isTamilNadu: false }
    }
  }

  const mapSettings = getMapSettings(mapFactories)

  // Map marker click popup details calculator
  const getFactoryMetrics = (fact) => {
    const factoryAssessments = allAssessments.filter(a => a.factoryId === fact.id)
    const latestAss = factoryAssessments.sort((a, b) => b.id - a.id)[0]
    
    const esgScore = latestAss ? `${latestAss.scoreAchieved.toFixed(0)} / 1000` : 'N/A'
    const lastAuditDate = latestAss 
      ? new Date(latestAss.submittedAt || latestAss.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) 
      : 'N/A'

    const isHeavyIndustry = fact.sectorType === 'Metals' || fact.sectorType === 'Chemicals'
    const multiplier = isHeavyIndustry ? 9.5 : 3.8
    const carbonVal = Math.round((fact.employeeCount || 100) * multiplier + (fact.id * 12))
    const waterVal = Math.round((fact.employeeCount || 100) * (multiplier * 1.5) + (fact.id * 25))

    let riskLevel = 'Low'
    if (carbonVal > 1000) {
      riskLevel = 'High'
    } else if (carbonVal >= 500) {
      riskLevel = 'Medium'
    }

    return {
      esgScore,
      carbonEmission: `${carbonVal.toLocaleString()} MT`,
      waterUsage: `${waterVal.toLocaleString()} KL`,
      lastAuditDate,
      riskLevel,
      location: fact.address || `${fact.latitude.toFixed(4)}, ${fact.longitude.toFixed(4)}`
    }
  }

  // Pre-calculate lists and stats for AI Insights
  const factoryMetricsList = mapFactories.map(f => ({
    factory: f,
    metrics: getFactoryMetrics(f)
  }))

  const sortedByEmission = [...factoryMetricsList].sort((a, b) => {
    const valA = parseInt(a.metrics.carbonEmission.replace(/,/g, ''))
    const valB = parseInt(b.metrics.carbonEmission.replace(/,/g, ''))
    return valB - valA
  })

  const sortedByWater = [...factoryMetricsList].sort((a, b) => {
    const valA = parseInt(a.metrics.waterUsage.replace(/,/g, ''))
    const valB = parseInt(b.metrics.waterUsage.replace(/,/g, ''))
    return valA - valB
  })

  const highestEmissionPlant = sortedByEmission[0]
  const bestWaterSaverPlant = sortedByWater[0]

  const topEsgAss = [...allAssessments].sort((a, b) => b.scoreAchieved - a.scoreAchieved)[0]
  const topEsgPerformer = topEsgAss ? {
    companyName: topEsgAss.companyName,
    factoryName: topEsgAss.factoryName,
    score: `${topEsgAss.scoreAchieved.toFixed(0)} / 1000`
  } : null

  const immediateAttentionAss = allAssessments.filter(a => a.status === 'DRAFT' || a.status === 'SUBMITTED')[0]

  const totalCarbonEmissions = factoryMetricsList.reduce((acc, curr) => {
    const val = parseInt(curr.metrics.carbonEmission.replace(/,/g, ''))
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  const totalWaterUsage = factoryMetricsList.reduce((acc, curr) => {
    const val = parseInt(curr.metrics.waterUsage.replace(/,/g, ''))
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  const approvedCount = allAssessments.filter(a => a.status === 'APPROVED').length
  const compliancePercentage = allAssessments.length > 0 
    ? `${Math.round((approvedCount / allAssessments.length) * 100)}%` 
    : 'N/A'

  // Dynamic AI suggestions based on sectors in portfolio
  const uniqueSectors = Array.from(new Set(mapFactories.map(f => f.sectorType)))
  const aiRecommendations = []
  if (uniqueSectors.includes('Metals')) {
    aiRecommendations.push('Metals: Transition electric furnaces to green hydrogen blends to cut Scope 1 peaks.')
  }
  if (uniqueSectors.includes('Chemicals')) {
    aiRecommendations.push('Chemicals: Install closed-loop vapor recovery to capture fugitive volatile organics.')
  }
  aiRecommendations.push('Portfolio: Expand on-site solar arrays to offset grid dependency during peak production.')

  const notifications = [
    { id: 1, type: 'HIGH', message: 'AI flagged 12% water charge discrepancy at Apex Logistics Plant 1.', time: '10m ago' },
    { id: 2, type: 'MEDIUM', message: 'SteelCorp Industries Plant 2 certificate expires in 45 days.', time: '2h ago' },
    { id: 3, type: 'LOW', message: 'operator2@ecobuildconstruction.com submitted rating v3.0.', time: '1d ago' }
  ]

  const upcomingAudits = [
    { id: 1, plant: 'SteelCorp Industries Plant 1', date: 'July 15, 2026', status: 'Confirmed' },
    { id: 2, plant: 'EcoBuild Construction Plant 2', date: 'July 22, 2026', status: 'Pending Review' },
    { id: 3, plant: 'GreenGrid Energy Plant 1', date: 'Aug 02, 2026', status: 'Scheduled' }
  ]

  const fallbackReviews = [
    {
      id: 'demo-pr-1',
      factoryName: 'SteelCorp Industries Plant 2',
      reviewType: 'ESG Compliance Review',
      priority: 'High',
      dueDate: 'Due Today',
      status: 'In Review'
    },
    {
      id: 'demo-pr-2',
      factoryName: 'GreenSteel Metallurgy',
      reviewType: 'Carbon Emission Verification',
      priority: 'Medium',
      dueDate: 'Due Tomorrow',
      status: 'Pending'
    },
    {
      id: 'demo-pr-3',
      factoryName: 'Nova Textiles Plant 2',
      reviewType: 'Water Usage Audit Review',
      priority: 'High',
      dueDate: 'Due in 2 days',
      status: 'Awaiting Approval'
    },
    {
      id: 'demo-pr-4',
      factoryName: 'EcoBuild Construction',
      reviewType: 'Waste Management Assessment',
      priority: 'Low',
      dueDate: 'Due in 5 days',
      status: 'Pending'
    },
    {
      id: 'demo-pr-5',
      factoryName: 'Apex Logistics',
      reviewType: 'Fleet Decarbonization Audit',
      priority: 'Medium',
      dueDate: 'Due next week',
      status: 'In Review'
    }
  ]

  const fallbackActivities = [
    {
      id: 'demo-act-1',
      time: '09:00 AM',
      description: 'Carbon emission report submitted',
      factoryName: 'SteelCorp Industries',
      status: 'Completed',
      type: 'report'
    },
    {
      id: 'demo-act-2',
      time: '10:30 AM',
      description: 'Water recycling audit started',
      factoryName: 'PureWater Utilities',
      status: 'Ongoing',
      type: 'audit'
    },
    {
      id: 'demo-act-3',
      time: '12:00 PM',
      description: 'AI sustainability score recalculated',
      factoryName: 'GreenSteel Metallurgy',
      status: 'Completed',
      type: 'ai'
    },
    {
      id: 'demo-act-4',
      time: '02:30 PM',
      description: 'Compliance inspection scheduled',
      factoryName: 'Nova Textiles',
      status: 'Scheduled',
      type: 'inspection'
    },
    {
      id: 'demo-act-5',
      time: '04:00 PM',
      description: 'Monthly ESG report generated',
      factoryName: 'Apex Logistics',
      status: 'Completed',
      type: 'report'
    },
    {
      id: 'demo-act-6',
      time: '05:30 PM',
      description: 'Solid waste disposal logs validated',
      factoryName: 'EcoBuild Construction',
      status: 'Completed',
      type: 'logs'
    }
  ]

  const backendPendingReviews = allAssessments.filter(a => 
    ['UNDER_TECHNICAL_REVIEW', 'SUBMITTED', 'SITE_AUDIT'].includes(a.status)
  ).map(a => ({
    id: `live-pr-${a.id}`,
    factoryName: a.factoryName,
    reviewType: `${a.ratingVersion} Sustainability Assessment`,
    priority: a.status === 'SITE_AUDIT' ? 'High' : 'Medium',
    dueDate: a.status === 'SITE_AUDIT' ? 'Due Today' : 'Due in 3 days',
    status: a.status === 'UNDER_TECHNICAL_REVIEW' ? 'In Review' : a.status === 'SUBMITTED' ? 'Awaiting Approval' : 'Pending'
  }))

  const pendingReviewsToDisplay = backendPendingReviews.length > 0 ? backendPendingReviews : fallbackReviews

  const backendActivities = allAssessments.filter(a => a.updatedAt != null).map(a => {
    const timeStr = new Date(a.submittedAt || a.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return {
      id: `live-act-${a.id}`,
      time: timeStr,
      description: `${a.ratingVersion} rating status updated to ${a.status.replace(/_/g, ' ')}`,
      factoryName: a.factoryName,
      status: a.status === 'APPROVED' ? 'Completed' : 'Ongoing',
      type: 'update'
    }
  })

  const activitiesToDisplay = backendActivities.length > 0 ? backendActivities : fallbackActivities

  const createCustomMarkerIcon = (riskLevel) => {
    const color = riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f97316' : '#22c55e'
    const html = `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div class="marker-pulse-effect" style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; opacity: 0.4;"></div>
        <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; border: 1.5px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
      </div>
    `
    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  const kpis = [
    { label: 'Total Companies', value: summary?.totalCompanies || 15, icon: Building2, color: 'text-emerald-600 bg-emerald-50', change: '+12% MoM' },
    { label: 'Total Factories', value: summary?.totalFactories || 32, icon: Zap, color: 'text-blue-600 bg-blue-50', change: '100% operational' },
    { label: 'Active Assessments', value: summary?.activeAssessments || 28, icon: ClipboardCheck, color: 'text-amber-600 bg-amber-50', change: 'Pending review' },
    { label: 'Completed Audits', value: 146, icon: CheckCircle, color: 'text-teal-600 bg-teal-50', change: 'Verified on-chain' },
    { label: 'AI Documents Processed', value: 684, icon: Brain, color: 'text-purple-600 bg-purple-50', change: '99.4% OCR accuracy' },
    { label: 'Average Sustainability Score', value: '87%', icon: Award, color: 'text-indigo-600 bg-indigo-50', change: 'Tier-1 compliant' },
    { label: 'Carbon Emission Reduction', value: '18%', icon: TrendingDown, color: 'text-rose-600 bg-rose-50', change: 'Target: 25%' },
    { label: 'Water Saved', value: '24%', icon: Activity, color: 'text-cyan-600 bg-cyan-50', change: 'Recycling active' },
    { label: 'Renewable Energy Usage', value: '63%', icon: Sparkles, color: 'text-yellow-600 bg-yellow-50', change: 'Solar & wind grid' }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl gap-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            Command Center Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="text-slate-350 text-sm max-w-2xl">
            Monitor real-time energy baselines, geographic assets distributions, and AI OCR invoice validation logs.
          </p>
        </div>
        {!isManagement && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 shrink-0 inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 text-sm cursor-pointer"
          >
            <Plus size={18} />
            Start New Assessment
          </button>
        )}
      </div>

      {/* Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => {
          const KpiIcon = kpi.icon
          return (
            <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex items-center space-x-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.color} shadow-inner`}>
                <KpiIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-xl font-black text-slate-800 mt-0.5">{kpi.value}</p>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5">
                  {kpi.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Row 1: Interactive Leaflet Map (70%) | AI Insights Panel (30%) */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        {/* Leaflet Map (70%) */}
        <div className="xl:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={16} className="text-emerald-600" />
                Factory Geographic Locations
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Interactive real-time OpenStreetMap tracker. Focuses automatically based on asset locations.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase">
              {mapSettings.isTamilNadu ? 'Tamil Nadu Region' : 'India National Scale'}
            </span>
          </div>

          <div className="relative flex-1 rounded-2xl overflow-hidden h-full w-full border border-slate-100 shadow-inner">
            <MapContainer
              center={mapSettings.center}
              zoom={mapSettings.zoom}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className="z-10"
            >
              <ChangeView center={mapSettings.center} zoom={mapSettings.zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapFactories.map(fact => {
                const metrics = getFactoryMetrics(fact)
                const position = [fact.latitude || 12.9716, fact.longitude || 77.5946]
                const icon = createCustomMarkerIcon(metrics.riskLevel)
                
                return (
                  <Marker key={fact.id} position={position} icon={icon}>
                    <Popup>
                      <div className="p-2 space-y-1.5 text-slate-800 font-sans min-w-[200px]">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{fact.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{metrics.location}</p>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-t border-slate-100 pt-1.5 mt-1.5 text-[10px]">
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[8px] tracking-wide">ESG Score</span>
                            <span className="font-bold text-slate-750">{metrics.esgScore}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[8px] tracking-wide">Risk Level</span>
                            <span className={`font-bold ${
                              metrics.riskLevel === 'High' ? 'text-rose-600' : metrics.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>{metrics.riskLevel}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[8px] tracking-wide">Carbon Emission</span>
                            <span className="font-bold text-slate-750">{metrics.carbonEmission}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[8px] tracking-wide">Water Usage</span>
                            <span className="font-bold text-slate-750">{metrics.waterUsage}</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-1 text-[9px] text-slate-400 font-semibold flex justify-between items-center">
                          <span>Last Audit: {metrics.lastAuditDate}</span>
                          <span className="text-emerald-600 uppercase text-[8px] tracking-wider font-bold">{fact.status}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </div>

        {/* AI Insights (30%) */}
        <div className="xl:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Brain size={16} className="text-purple-600 animate-pulse" />
              AI COPILOT INSIGHTS
            </h3>
            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {/* Top ESG Performer Card */}
            {topEsgPerformer && (
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
                <Sparkles size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Top ESG Performer</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{topEsgPerformer.companyName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {topEsgPerformer.factoryName} leads portfolio with ESG Score of {topEsgPerformer.score}.
                  </p>
                </div>
              </div>
            )}

            {/* Highest Carbon Emission Card */}
            {highestEmissionPlant && (
              <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
                <AlertCircle size={16} className="text-rose-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">Highest Emission Peak</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{highestEmissionPlant.factory.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Calculated Carbon Footprint at {highestEmissionPlant.metrics.carbonEmission}. Risk level is evaluated as <span className="text-rose-600 font-bold">{highestEmissionPlant.metrics.riskLevel}</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Best Water Saver Card */}
            {bestWaterSaverPlant && (
              <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
                <Zap size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">Best Water Saver</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{bestWaterSaverPlant.factory.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Outstanding efficiency with low calculated water charge footprint of {bestWaterSaverPlant.metrics.waterUsage}.
                  </p>
                </div>
              </div>
            )}

            {/* Immediate Attention Card */}
            {immediateAttentionAss && (
              <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Immediate Attention</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{immediateAttentionAss.factoryName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Has a rating workflow pending in <span className="text-amber-700 font-bold">{immediateAttentionAss.status}</span>. Needs reviewer technical assessment.
                  </p>
                </div>
              </div>
            )}

            {/* Compliance Status Card */}
            <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
              <ShieldCheck size={16} className="text-indigo-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">Compliance Status</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{compliancePercentage} Approved</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {approvedCount} out of {allAssessments.length} logged rating cycles have passed technical review audits.
                </p>
              </div>
            </div>

            {/* Monthly Carbon Summary Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
              <TrendingUp size={16} className="text-slate-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Monthly Carbon Summary</p>
                <p className="text-xs font-bold text-slate-750 mt-0.5">{totalCarbonEmissions.toLocaleString()} MT CO2e</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Aggregated emissions footprint across all {mapFactories.length} tracked industrial facilities.
                </p>
              </div>
            </div>

            {/* Water Usage Summary Card */}
            <div className="bg-cyan-50/40 p-4 rounded-xl border border-cyan-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
              <Activity size={16} className="text-cyan-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-cyan-800 uppercase tracking-wide">Water Usage Summary</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{totalWaterUsage.toLocaleString()} KL</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Total water withdraw consumption logged across active production plants.
                </p>
              </div>
            </div>

            {/* AI Recommendations Card */}
            {aiRecommendations.length > 0 && (
              <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100/50 flex space-x-3 items-start hover:shadow-sm transition-all duration-150">
                <Cpu size={16} className="text-purple-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wide">AI RECOMMENDATIONS</p>
                  {aiRecommendations.map((rec, idx) => (
                    <p key={idx} className="text-[10px] text-slate-600 leading-relaxed">• {rec}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Compact Factory Table (Responsive Height, max-h-[380px] on desktop, max-h-[320px] on tablet, overflow-y-auto) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Ongoing Sustainability Ratings</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{assessments.length} active</span>
        </div>
        {assessments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
            <ClipboardCheck size={40} className="text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active assessments</p>
            <p className="text-xs text-slate-400 mt-0.5">Initialize a rating workflow to track metrics.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-none md:max-h-[320px] lg:max-h-[380px] flex-1 scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-150">
              <thead className="bg-slate-50/40 sticky top-0 z-20">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Factory</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Company</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Current Rating</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Previous Rating</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Improvement %</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Last Updated</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {ongoingRatings.map((item, idx) => {
                  const assessmentId = idx + 1
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{item.factory}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{item.currentRating}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.previousRating}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        item.improvement.startsWith('+') ? 'text-emerald-600' : item.improvement.startsWith('-') ? 'text-rose-600' : 'text-slate-500'
                      }`}>{item.improvement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                          item.status === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : item.status === 'In Review' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : item.status === 'Pending'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : item.status === 'Scheduled'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-450 font-medium">{item.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3.5">
                        <Link to={`/assessments/${assessmentId}/ai`} className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-0.5">
                          <Cpu size={13} />
                          AI Gap
                        </Link>
                        <Link to={`/assessments/${assessmentId}/workflow`} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-0.5">
                          <Settings size={13} />
                          Workflow
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 3: Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Chart 1: Carbon Emissions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Carbon Emissions</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly MT CO2e</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={carbonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="Emissions" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Energy Consumption */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Energy Consumption</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly MWh</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="Consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Water Usage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Water Usage</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly kL</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Usage" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Waste Generation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Waste Generation</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Metric Tons</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Generated" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Recycled" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Certification Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Certification Progress</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Portfolios</span>
          </div>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={certProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {certProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Assessment Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-250">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Assessment Trends</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Growth</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Completed" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Initiated" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Sidebar widgets shifted into a clean multi-column grid block below */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pending Reviews Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <ClipboardCheck size={16} className="text-amber-600" />
            Pending Reviews
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {pendingReviewsToDisplay.map(review => (
              <div 
                key={review.id} 
                className={`flex gap-3 items-start p-3 rounded-xl border transition-all duration-150 border-l-4 ${
                  review.priority === 'High' 
                    ? 'border-l-rose-500 border-rose-100/50 bg-rose-500/[0.02]' 
                    : review.priority === 'Medium' 
                    ? 'border-l-amber-500 border-amber-100/50 bg-amber-500/[0.02]' 
                    : 'border-l-emerald-500 border-emerald-100/50 bg-emerald-500/[0.02]'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 leading-snug">{review.factoryName}</p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">{review.reviewType}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                      review.priority === 'High' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : review.priority === 'Medium' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {review.priority} Priority
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">{review.dueDate}</span>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase shrink-0 ${
                  review.status === 'In Review'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : review.status === 'Awaiting Approval'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Bell size={16} className="text-indigo-600" />
            Recent Notifications
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {notifications.map(n => (
              <div key={n.id} className="flex gap-2.5 items-start bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  n.type === 'HIGH' ? 'bg-rose-500 animate-pulse' : n.type === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <div className="space-y-0.5 flex-1">
                  <p className="text-[11px] font-bold text-slate-700 leading-snug">{n.message}</p>
                  <span className="text-[9px] text-slate-400 font-semibold">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Scheduled Audits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Calendar size={16} className="text-rose-600" />
            Upcoming Scheduled Audits
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {upcomingAudits.map(audit => (
              <div key={audit.id} className="flex gap-2.5 items-start bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 justify-between">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-700 leading-snug">{audit.plant}</p>
                  <span className="text-[9px] text-slate-400 font-semibold">{audit.date}</span>
                </div>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{audit.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Activity size={16} className="text-emerald-600" />
            Today's Activities
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin relative pl-4 border-l border-slate-100 ml-3 space-y-5 py-2">
            {activitiesToDisplay.map((act) => {
              let ActIcon = RefreshCw;
              if (act.type === 'report') ActIcon = FileText;
              else if (act.type === 'audit') ActIcon = ClipboardCheck;
              else if (act.type === 'ai') ActIcon = Brain;
              else if (act.type === 'inspection') ActIcon = ShieldCheck;
              else if (act.type === 'logs') ActIcon = Activity;

              return (
                <div key={act.id} className="relative flex items-start gap-3">
                  <span className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                    act.status === 'Completed'
                      ? 'bg-emerald-500 text-white'
                      : act.status === 'Ongoing'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}>
                    <ActIcon size={8} />
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold">{act.time}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        act.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : act.status === 'Ongoing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 leading-snug">{act.description}</p>
                    <p className="text-[9px] text-slate-500 font-semibold">{act.factoryName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Logs Trail */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 md:col-span-2 xl:col-span-2 flex flex-col h-[380px]">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Activity size={16} className="text-emerald-600" />
            Recent Audit Events
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {recentAuditEvents.map((event, index) => (
              <div key={index} className="flex gap-3 pl-3 border-l border-slate-200 relative py-0.5 justify-between items-start">
                <span className="absolute -left-[3.5px] top-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div className="space-y-0.5 flex-1">
                  <p className="text-[11px] font-bold text-slate-800 leading-snug">{event.title}</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Factory: <span className="font-semibold text-slate-700">{event.factory}</span> | Auditor: <span className="font-semibold text-slate-700">{event.auditor}</span>
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold">{event.date}</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-bold uppercase shrink-0">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="text-emerald-600" size={18} />
                Start Sustainability Rating
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {factories?.length === 0 ? (
              <div className="text-slate-500 text-center text-xs p-6 space-y-2">
                <Building2 className="text-slate-350 mx-auto" size={32} />
                <p className="font-semibold text-slate-700">No factory plant registered</p>
                <p>Please register a factory asset in your settings before starting a self-assessment.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleStartAssessment)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Select Production Plant</label>
                  <select
                    {...register('factoryId', { required: 'Plant is required' })}
                    className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                  >
                    <option value="">Choose a plant...</option>
                    {factories?.map(fact => (
                      <option key={fact.id} value={fact.id}>{fact.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Rating Framework Version</label>
                  <select
                    {...register('ratingVersion', { required: 'Version is required' })}
                    className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                  >
                    <option value="v3.0">GreenCo Rating v3.0 (Latest)</option>
                    <option value="v2.5">GreenCo Rating v2.5</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={createAssessmentMutation.isLoading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {createAssessmentMutation.isLoading ? 'Initializing...' : 'Initialize Rating Workflow'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
