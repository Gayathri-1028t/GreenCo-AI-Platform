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

function CompanyDetailsPage() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch Company metadata
  const { data: company, isLoading: isCompanyLoading, error: companyError } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const response = await api.get(`/companies/${companyId}`)
      return response.data?.data
    },
    enabled: !!companyId
  })

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
  const { data: certificates, isLoading: isCertsLoading } = useQuery({
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
  const { data: assessments, isLoading: isAssessmentsLoading } = useQuery({
    queryKey: ['companyAssessments', companyId],
    queryFn: async () => {
      const response = await api.get('/assessments', {
        params: { companyId, page: 0, size: 100 }
      })
      return response.data?.data?.content || []
    },
    enabled: !!companyId
  })

  const isLoading = isCompanyLoading || isFactoriesLoading || isCertsLoading || isAssessmentsLoading

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-sm font-semibold text-slate-500">Loading organization details...</p>
      </div>
    )
  }

  if (companyError || !company) {
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
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileBadge size={16} className="text-rose-600" />
            Compliance Certificates ({Array.isArray(certificates) ? certificates.length : 0})
          </h3>
          {!Array.isArray(certificates) || certificates.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No certificates issued yet.</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {certificates.map(cert => (
                <div key={cert.id} className="flex items-start gap-3 pl-3 border-l border-slate-200 relative py-1">
                  <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{cert.certificateNumber}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block">Issue: {new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{cert.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assessment History Ledger */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} className="text-emerald-600" />
          Sustainability Assessment History
        </h3>
        
        {!Array.isArray(assessments) || assessments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No assessments initialized yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5">Year</th>
                  <th>Factory</th>
                  <th>ESG Score</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {assessments.map(ass => {
                  const yr = ass.createdAt ? new Date(ass.createdAt).getFullYear().toString() : '2026'
                  const pct = ass.scoreAchieved ? Math.round((ass.scoreAchieved / 1000) * 100) : 0
                  return (
                    <tr key={ass.id}>
                      <td className="py-3 font-bold text-slate-850">{yr}</td>
                      <td>{ass.factoryName || 'Plant Asset'}</td>
                      <td className="font-semibold">{pct}%</td>
                      <td className="font-bold text-slate-800">{ass.ratingLevel || 'N/A'}</td>
                      <td>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          ass.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : ass.status === 'SUBMITTED' 
                            ? 'bg-blue-100 text-blue-800'
                            : ass.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ass.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="text-slate-400 font-semibold">{new Date(ass.updatedAt || ass.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyDetailsPage
