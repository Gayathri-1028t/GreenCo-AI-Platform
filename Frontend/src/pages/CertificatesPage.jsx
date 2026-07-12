import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { 
  Award, 
  FileDown, 
  ShieldCheck, 
  Calendar, 
  Search,
  Building,
  Building2,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Activity,
  Layers,
  FileText,
  Printer,
  FileBadge,
  Eye,
  QrCode,
  ShieldAlert
} from 'lucide-react'
import { toast } from 'react-toastify'

const BADGE_THEMES = {
  Platinum: 'from-slate-700 to-slate-900 text-slate-100 border-slate-600',
  Gold: 'from-amber-400 to-yellow-600 text-yellow-950 border-amber-500',
  Silver: 'from-slate-350 to-slate-500 text-slate-900 border-slate-400',
  Bronze: 'from-orange-400 to-orange-600 text-orange-950 border-orange-500',
  Certified: 'from-emerald-400 to-emerald-650 text-emerald-950 border-emerald-500'
}

function CertificatesPage() {
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('desc')

  // UI state variables
  const [viewingCert, setViewingCert] = useState(null)

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch certificates list
  const { data: certificatesData, isLoading } = useQuery({
    queryKey: ['certificates-list', isManagement, user?.companyId],
    queryFn: async () => {
      const params = { page: 0, size: 200 }
      if (!isManagement) {
        params.companyId = user?.companyId || 1
      }
      const response = await api.get('/certificates', { params })
      return response.data.data.content || []
    }
  })

  // 2. Fetch companies list for filters
  const { data: companies } = useQuery({
    queryKey: ['companies-filter-certs'],
    queryFn: async () => {
      const response = await api.get('/companies', { params: { size: 100 } })
      return response.data.data.content || []
    },
    enabled: isManagement
  })

  const rawList = certificatesData || []

  // Client-side filtering & sorting
  const filteredList = rawList.filter(cert => {
    const matchesSearch = search ? (
      cert.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      cert.companyName.toLowerCase().includes(search.toLowerCase()) ||
      cert.factoryName.toLowerCase().includes(search.toLowerCase())
    ) : true
    const matchesCompany = selectedCompanyId ? cert.companyName === companies?.find(c => c.id === parseInt(selectedCompanyId))?.legalName : true
    const matchesStatus = selectedStatus ? cert.status === selectedStatus : true
    const matchesGrade = selectedGrade ? cert.ratingLevel === selectedGrade : true

    return matchesSearch && matchesCompany && matchesStatus && matchesGrade
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



  const handlePrintCertificate = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Certificate Number', 'Company', 'Factory', 'ESG Level', 'Score Achieved', 'Issue Date', 'Expiry Date', 'Status']
    const rows = sortedList.map(c => [
      c.id, c.certificateNumber, c.companyName, c.factoryName, c.ratingLevel, c.scoreAchieved, c.issueDate, c.expiryDate, c.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "greenco_certificates_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  // Dashboard Stats Calculations
  const totalCount = rawList.length
  const activeCount = rawList.filter(c => c.status === 'ACTIVE').length
  const expiredCount = rawList.filter(c => c.status === 'EXPIRED').length
  const pendingCount = rawList.filter(c => c.status === 'PENDING').length
  const suspendedCount = rawList.filter(c => c.status === 'SUSPENDED' || c.status === 'REVOKED').length
  const avgEsgScore = totalCount > 0 ? Math.round(rawList.reduce((acc, curr) => acc + curr.scoreAchieved, 0) / totalCount) : 0

  // Render Details View
  const renderDetails = (cert) => {
    const badgeTheme = BADGE_THEMES[cert.ratingLevel] || 'from-slate-200 to-slate-350'
    const verificationUrl = `${window.location.origin}/verify?code=${cert.certificateNumber}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`

    return (
      <div className="space-y-6">
        {/* Detail Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Certificate ledger profile</h1>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                cert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {cert.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{cert.companyName} | Serial: {cert.certificateNumber}</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrintCertificate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Printer size={14} />
              Print Certificate
            </button>
            <button 
              onClick={() => setViewingCert(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-semibold text-xs transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Registry
            </button>
          </div>
        </div>

        {/* 2-Column profile details vs Digital Framed Certificate display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Certificate metadata profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:hidden">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Audit & compliance context</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-400">Company Name</span>
                  <p className="font-bold text-slate-800 mt-0.5">{cert.companyName}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Factory Name</span>
                  <p className="font-bold text-slate-800 mt-0.5">{cert.factoryName}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">ESG score achieved</span>
                  <p className="font-bold text-slate-800 mt-0.5">{cert.scoreAchieved?.toFixed(1)} / 1000 pts</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Sustainability Level</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{cert.ratingLevel}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Issued On</span>
                  <p className="font-bold text-slate-800 mt-0.5">{cert.issueDate}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Expiry Date</span>
                  <p className="font-bold text-slate-800 mt-0.5">{cert.expiryDate}</p>
                </div>
              </div>
            </div>

            {/* Simulated efficiencies breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-600" />
                Resource Conservation Metrics
              </h3>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Carbon Saved</span>
                  <span className="text-sm font-black text-rose-600 mt-1 block">18.2%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Water Loop</span>
                  <span className="text-sm font-black text-cyan-600 mt-1 block">22.4%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Energy Eff.</span>
                  <span className="text-sm font-black text-blue-600 mt-1 block">15.8%</span>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <p className="font-bold text-slate-700">Digital verification details</p>
              <p className="text-slate-450 leading-relaxed">This digital certificate has been locked with a verification token. Use the public validator gateway to verify the certification validity state.</p>
              <div className="flex items-center space-x-2 pt-2">
                <QrCode size={36} className="text-slate-700" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 block">Verification Token</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{cert.certificateNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Digital Framed Certificate display */}
          <div className="bg-amber-50/15 border-8 border-double border-yellow-600 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative max-w-lg mx-auto print:border-yellow-600 print:shadow-none print:m-0">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 text-yellow-600 font-bold opacity-30 text-lg">✦</div>
            <div className="absolute top-2 right-2 text-yellow-600 font-bold opacity-30 text-lg">✦</div>
            <div className="absolute bottom-2 left-2 text-yellow-600 font-bold opacity-30 text-lg">✦</div>
            <div className="absolute bottom-2 right-2 text-yellow-600 font-bold opacity-30 text-lg">✦</div>

            {/* CII GreenCo Header */}
            <div className="space-y-1">
              <p className="text-emerald-700 font-black text-base tracking-widest uppercase">CII Green Business Centre</p>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Confederation of Indian Industry</p>
            </div>

            <div className="border-b border-slate-200/50 my-2"></div>

            {/* Certificate Title */}
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-black text-slate-850 tracking-tight italic">GreenCo Rating Certificate</h2>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">This is to certify that the facility of</p>
            </div>

            {/* Recipient details */}
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 tracking-tight">{cert.companyName}</p>
              <p className="text-xs font-bold text-slate-600">{cert.factoryName}</p>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal max-w-sm mx-auto">has successfully complied with the GreenCo rating framework guidelines and achievements matrix, scoring high-efficiency results across water, energy, and zero-waste categories.</p>

            {/* Achievement Grade Badge */}
            <div className="py-2.5 px-6 bg-slate-900 text-white rounded-2xl w-fit mx-auto border-2 border-yellow-500 shadow-md">
              <p className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Sustainability Grade Level</p>
              <p className="text-lg font-black tracking-widest uppercase mt-0.5">{cert.ratingLevel}</p>
            </div>

            {/* Validity details & QR validation code */}
            <div className="flex justify-between items-end pt-6 border-t border-slate-200/50 mt-4">
              <div className="text-left space-y-1 text-[9px] text-slate-500">
                <p>Certificate serial: <strong className="text-slate-800 font-mono">{cert.certificateNumber}</strong></p>
                <p>Issued on: <strong className="text-slate-800">{cert.issueDate}</strong></p>
                <p>Valid until: <strong className="text-slate-800">{cert.expiryDate}</strong></p>
              </div>

              {/* Digital signature placeholder */}
              <div className="text-center space-y-1">
                <div className="w-24 h-8 border-b border-slate-300 font-serif text-[10px] text-slate-400 flex items-end justify-center pb-0.5 italic">GreenCo Board</div>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Validated Signatory</p>
              </div>

              <div className="text-center space-y-1">
                <img src={qrCodeUrl} alt="Verification QR" className="w-16 h-16 border border-slate-200 bg-white p-1 rounded" />
                <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Verify Legitimacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Registry Listing View
  return (
    <div className="space-y-6">
      {viewingCert ? renderDetails(viewingCert) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Certification Ledger</h1>
              <p className="mt-1 text-slate-500 text-sm">Verify and inspect active ratings certificates issued for validated facilities.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all shadow-sm"
              >
                <FileDown size={14} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Certificate Dashboard KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Issued</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{totalCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">{activeCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired</p>
              <p className="text-lg font-black text-rose-600 mt-0.5">{expiredCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approval</p>
              <p className="text-lg font-black text-amber-600 mt-0.5">{pendingCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{suspendedCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg ESG score</p>
              <p className="text-lg font-black text-purple-650 mt-0.5">{avgEsgScore || 0} pts</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by serial number, factory or company..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-semibold transition-all"
              />
            </div>

            {isManagement && (
              <select
                value={selectedCompanyId}
                onChange={(e) => { setSelectedCompanyId(e.target.value); setPage(0); }}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650 transition-all"
              >
                <option value="">All Companies</option>
                {companies?.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.legalName}</option>
                ))}
              </select>
            )}

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => { setSelectedGrade(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650 transition-all"
            >
              <option value="">All Levels</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Certified">Certified</option>
            </select>
          </div>

          {/* Enterprise Certificate Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading ledger registry...</div>
            ) : sortedList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No certificates issued.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-150">
                  <thead className="bg-slate-50/40">
                    <tr>
                      <th onClick={() => toggleSort('certificateNumber')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Certificate Number</th>
                      <th onClick={() => toggleSort('companyName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Company</th>
                      <th onClick={() => toggleSort('factoryName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Factory</th>
                      <th onClick={() => toggleSort('scoreAchieved')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">ESG Rating</th>
                      <th onClick={() => toggleSort('ratingLevel')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Grade Level</th>
                      <th onClick={() => toggleSort('issueDate')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Validity Range</th>
                      <th onClick={() => toggleSort('status')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Status</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {paginatedList.map(cert => (
                      <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-mono text-slate-900">{cert.certificateNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{cert.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{cert.factoryName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{cert.scoreAchieved?.toFixed(1)} pts</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            cert.ratingLevel === 'Platinum' ? 'bg-indigo-100 text-indigo-800' :
                            cert.ratingLevel === 'Gold' ? 'bg-amber-100 text-amber-800' :
                            cert.ratingLevel === 'Silver' ? 'bg-slate-100 text-slate-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {cert.ratingLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{cert.issueDate} to {cert.expiryDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            cert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3">
                          <button 
                            onClick={() => setViewingCert(cert)}
                            className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5"
                          >
                            <Eye size={13} />
                            View Certificate
                          </button>

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

export default CertificatesPage
