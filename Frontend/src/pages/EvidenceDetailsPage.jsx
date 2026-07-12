import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { toast } from 'react-toastify'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Shield, 
  Info, 
  Clock, 
  Activity, 
  MessageSquare, 
  Sparkles, 
  FileBadge,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const COMPANY_NAMES = [
  "SteelCorp Industries",
  "Eco Cement Ltd",
  "GreenTextiles Pvt Ltd",
  "SolarTech Energy",
  "Smart Chemicals Ltd",
  "Future Plastics",
  "Green Metals",
  "Hydro Industries",
  "Eco Automotive",
  "Nature Foods",
  "Blue Manufacturing",
  "Sunrise Paper Mills",
  "Eco Electronics",
  "Clean Packaging Ltd",
  "Vision Engineering"
]

const getDemoDocuments = (assessmentId) => {
  const cid = parseInt(assessmentId) || 1
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
      verificationStatus: "Verified",
      category: "Energy Conservation",
      approvalStatus: "Approved",
      version: "v1.0",
      auditor: "Satish Kumar",
      pillar: "Energy"
    },
    {
      id: cid * 1000 + 2,
      fileName: "Water_Usage_Report.xlsx",
      uploadDate: `${baseDay} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "2.4 MB",
      documentType: "Excel Resource Log",
      parameterCode: "WT-CON-01",
      verificationStatus: "Verified",
      category: "Water Management",
      approvalStatus: "Approved",
      version: "v1.2",
      auditor: "Satish Kumar",
      pillar: "Water"
    },
    {
      id: cid * 1000 + 3,
      fileName: "Carbon_Emission_Calculation.pdf",
      uploadDate: `${baseDay + 1} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "980 KB",
      documentType: "PDF Carbon Model",
      parameterCode: "GHG-EM-01",
      verificationStatus: "Verified",
      category: "Carbon Footprint",
      approvalStatus: "Approved",
      version: "v1.0",
      auditor: "Satish Kumar",
      pillar: "Carbon"
    },
    {
      id: cid * 1000 + 4,
      fileName: "Solar_Plant_Certificate.pdf",
      uploadDate: `${baseDay + 1} Jun 2026`,
      uploadedBy: "Vijay Prasad",
      fileSize: "1.8 MB",
      documentType: "PDF Validation Certificate",
      parameterCode: "RE-USE-02",
      verificationStatus: "Verified",
      category: "Renewable Integration",
      approvalStatus: "Approved",
      version: "v2.1",
      auditor: "Satish Kumar",
      pillar: "Energy"
    },
    {
      id: cid * 1000 + 5,
      fileName: "Waste_Management_Report.pdf",
      uploadDate: `${baseDay + 2} Jun 2026`,
      uploadedBy: "Anjali Sharma",
      fileSize: "1.5 MB",
      documentType: "PDF Compliance Audit",
      parameterCode: "WS-REC-01",
      verificationStatus: "Verified",
      category: "Waste Loop",
      approvalStatus: "Approved",
      version: "v1.1",
      auditor: "Satish Kumar",
      pillar: "Waste"
    },
    {
      id: cid * 1000 + 6,
      fileName: "Employee_Safety_Audit.pdf",
      uploadDate: `${baseDay + 2} Jun 2026`,
      uploadedBy: "Vijay Prasad",
      fileSize: "2.1 MB",
      documentType: "PDF Inspection Report",
      parameterCode: "SF-INC-01",
      verificationStatus: "Verified",
      category: "Occupational Safety",
      approvalStatus: "Approved",
      version: "v1.0",
      auditor: "Satish Kumar",
      pillar: "Social"
    }
  ]
}

const getFallbackAssessment = (assId) => {
  const aid = parseInt(assId) || 1
  const compId = Math.floor(aid / 100) || 1
  const idx = aid % 100 || 1
  
  const companyName = COMPANY_NAMES[compId - 1] || COMPANY_NAMES[0]
  
  const names = [
    "Annual Sustainability Assessment 2026",
    "Quarterly ESG Assessment",
    "Water Efficiency Audit",
    "Carbon Emission Audit",
    "Renewable Energy Compliance Review"
  ]
  const versions = ["V3.0", "V2.1", "V1.8", "V2.0", "V1.5"]
  const statuses = ["APPROVED", "COMPLETED", "COMPLETED", "APPROVED", "APPROVED"]
  const scores = [910, 860, 880, 820, 940]
  const carbonRatings = ["A++", "A+", "A+", "A", "A++"]
  const grades = ["Platinum", "Gold", "Gold", "Silver", "Platinum"]

  const name = names[idx - 1] || names[0]
  const version = versions[idx - 1] || versions[0]
  const status = statuses[idx - 1] || statuses[0]
  const score = scores[idx - 1] || scores[0]
  const carbon = carbonRatings[idx - 1] || carbonRatings[0]
  const grade = grades[idx - 1] || grades[0]

  return {
    id: aid,
    companyId: compId,
    companyName: companyName,
    factoryName: `${companyName} Chennai Plant 1`,
    ratingVersion: version,
    status: status,
    scoreAchieved: score,
    carbonRating: carbon,
    ratingLevel: grade,
    createdAt: "2026-06-10T10:00:00Z"
  }
}

function EvidenceDetailsPage() {
  const { assessmentId, evidenceId } = useParams()
  const navigate = useNavigate()

  // 1. Fetch assessment summary
  const { data: rawAssessment, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      const response = await api.get(`/assessments/${assessmentId}`)
      return response.data.data
    },
    retry: false
  })

  const assessment = rawAssessment || getFallbackAssessment(assessmentId)
  const docs = getDemoDocuments(assessmentId)
  const doc = docs.find(d => d.id === parseInt(evidenceId)) || docs[0]

  const isExcel = doc.fileName.endsWith('.xlsx') || doc.fileName.endsWith('.xls')
  const baseDay = 10 + (parseInt(assessmentId) % 15)

  if (isAssessmentLoading) {
    return <div className="text-center text-slate-500 p-8">Loading evidence details...</div>
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Link to="/dashboard" className="hover:text-slate-650 transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link to="/assessments" className="hover:text-slate-650 transition-colors">Assessments</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 truncate max-w-[200px]">{assessment.factoryName}</span>
        <ChevronRight size={12} />
        <span className="text-slate-800">{doc.fileName}</span>
      </nav>

      {/* Header Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/assessments')}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-550 transition-colors cursor-pointer"
            title="Back to Registry"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FileBadge className="text-emerald-600" size={20} />
              Evidence Verification Profile
            </h1>
            <p className="mt-1 text-xs text-slate-450 font-semibold uppercase tracking-wider">Document Name: {doc.fileName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wider border border-green-200">
            {doc.verificationStatus}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider border border-blue-200">
            {doc.approvalStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preview Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Activity size={16} className="text-emerald-600" />
              Document Interactive Preview Canvas
            </h3>

            <div className="bg-slate-100 p-4 rounded-xl flex justify-center overflow-x-auto">
              {isExcel ? (
                /* Spreadsheet Preview */
                <div className="w-full bg-white border border-slate-250 rounded-xl overflow-hidden shadow-sm flex flex-col font-mono text-xs max-w-full">
                  <div className="bg-slate-50 border-b border-slate-250 px-4 py-2 text-[10px] font-semibold text-slate-450 flex justify-between items-center">
                    <span>Spreadsheet Console | File: {doc.fileName} | Active Sheet: [Water Consumption Log]</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">Verified Read-Only</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 text-center font-bold text-slate-500">
                          <th className="border border-slate-200 w-8 py-1.5 bg-slate-100"></th>
                          <th className="border border-slate-200 px-4">A</th>
                          <th className="border border-slate-200 px-4">B</th>
                          <th className="border border-slate-200 px-4">C</th>
                          <th className="border border-slate-200 px-4">D</th>
                          <th className="border border-slate-200 px-4">E</th>
                          <th className="border border-slate-200 px-4">F</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">1</td>
                          <td className="border border-slate-200 px-3 font-bold text-slate-800" colSpan={6}>CII GreenCo Sustainability Platform - Water Usage Report</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">2</td>
                          <td className="border border-slate-200 px-3 font-bold text-slate-450">Company Name</td>
                          <td className="border border-slate-200 px-3 text-slate-800 font-bold" colSpan={5}>{assessment.companyName}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">3</td>
                          <td className="border border-slate-200 px-3 font-bold text-slate-450">Plant/Asset</td>
                          <td className="border border-slate-200 px-3 text-slate-800 font-bold" colSpan={5}>{assessment.factoryName}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">4</td>
                          <td className="border border-slate-200 px-3" colSpan={6}></td>
                        </tr>
                        <tr className="bg-slate-50/70 font-bold text-slate-650 text-center">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">5</td>
                          <td className="border border-slate-200 px-2 text-left">Month</td>
                          <td className="border border-slate-200 px-2 text-right">Target (kL)</td>
                          <td className="border border-slate-200 px-2 text-right">Actual (kL)</td>
                          <td className="border border-slate-200 px-2 text-right">Recycled (kL)</td>
                          <td className="border border-slate-200 px-2 text-right">Recycle %</td>
                          <td className="border border-slate-200 px-2 text-center">Status</td>
                        </tr>
                        {[
                          ["Jan 2026", "5,500", "5,200", "1,200", "23.0%", "Compliant"],
                          ["Feb 2026", "5,500", "5,150", "1,250", "24.2%", "Compliant"],
                          ["Mar 2026", "5,500", "5,100", "1,300", "25.4%", "Compliant"],
                          ["Apr 2026", "5,500", "4,950", "1,320", "26.6%", "Compliant"],
                          ["May 2026", "5,500", "4,800", "1,400", "29.1%", "Compliant"],
                          ["Jun 2026", "5,500", "4,750", "1,450", "30.5%", "Compliant"]
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40 text-center">
                            <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">{6 + idx}</td>
                            <td className="border border-slate-200 px-2 text-left text-slate-800 font-semibold">{row[0]}</td>
                            <td className="border border-slate-200 px-2 text-right text-slate-500">{row[1]}</td>
                            <td className="border border-slate-200 px-2 text-right text-slate-850 font-bold">{row[2]}</td>
                            <td className="border border-slate-200 px-2 text-right text-slate-600">{row[3]}</td>
                            <td className="border border-slate-200 px-2 text-right text-emerald-650 font-bold">{row[4]}</td>
                            <td className="border border-slate-200 px-2 text-center"><span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-black text-[9px] uppercase">OK</span></td>
                          </tr>
                        ))}
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">12</td>
                          <td className="border border-slate-200 px-3" colSpan={6}></td>
                        </tr>
                        <tr className="hover:bg-slate-50/40 font-bold text-slate-650">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">13</td>
                          <td className="border border-slate-200 px-3 text-slate-800" colSpan={6}>Summary & KPIs</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">14</td>
                          <td className="border border-slate-200 px-3 font-semibold text-slate-450" colSpan={2}>Total Water Consumed:</td>
                          <td className="border border-slate-200 px-3 text-slate-800 font-bold" colSpan={4}>29,950 kL</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">15</td>
                          <td className="border border-slate-200 px-3 font-semibold text-slate-450" colSpan={2}>Total Water Recycled:</td>
                          <td className="border border-slate-200 px-3 text-slate-800 font-bold" colSpan={4}>7,920 kL</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="bg-slate-100 text-slate-450 text-center font-bold border border-slate-200 py-1">16</td>
                          <td className="border border-slate-200 px-3 font-semibold text-slate-450" colSpan={2}>Average Recycle Efficiency:</td>
                          <td className="border border-slate-200 px-3 text-emerald-650 font-black" colSpan={4}>26.4%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* PDF Document Preview Layout */
                <div className="bg-amber-50/15 border-8 border-double border-slate-350 p-8 w-full max-w-[210mm] shadow-lg flex flex-col justify-between text-slate-800 font-sans relative min-h-[640px]">
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 text-slate-400 font-bold opacity-30 text-lg">✦</div>
                  <div className="absolute top-2 right-2 text-slate-400 font-bold opacity-30 text-lg">✦</div>
                  <div className="absolute bottom-2 left-2 text-slate-400 font-bold opacity-30 text-lg">✦</div>
                  <div className="absolute bottom-2 right-2 text-slate-400 font-bold opacity-30 text-lg">✦</div>

                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="bg-emerald-600 text-white p-4 rounded-xl text-center space-y-1">
                      <p className="font-black text-sm tracking-widest uppercase">CII Green Business Centre</p>
                      <p className="text-[8px] font-extrabold uppercase tracking-widest opacity-80">Confederation of Indian Industry</p>
                    </div>

                    {/* Audit Context Title */}
                    <div className="text-center space-y-1 pt-2">
                      <h3 className="text-base font-serif font-black text-slate-850 tracking-tight italic border-b border-slate-200 pb-2">Verification Compliance Audit Report</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pt-1">Document Reference: {doc.fileName}</p>
                    </div>

                    {/* Info Block */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 font-medium">
                      <div>
                        <span className="text-slate-400 font-bold">Company Name:</span>
                        <p className="font-bold text-slate-800 mt-0.5">{assessment.companyName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Plant Facility:</span>
                        <p className="font-bold text-slate-800 mt-0.5">{assessment.factoryName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Audit Score:</span>
                        <p className="font-bold text-emerald-650 mt-0.5">{assessment.scoreAchieved || 850} / 1000 pts</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Review Date:</span>
                        <p className="font-bold text-slate-800 mt-0.5">July 12, 2026</p>
                      </div>
                    </div>

                    {/* Paragraph */}
                    <div className="text-[10px] text-slate-550 leading-relaxed space-y-2">
                      <p className="font-bold text-slate-700">Executive Audit Summary:</p>
                      <p>This document verifies and seals the environmental and resource compliance parameters logged under the GreenCo framework v3.0 rating index. All uploaded metering invoices, billing records, offsets declarations, and solid waste manifests have been cross-checked, physically audited, and approved by the technical desk reviewers.</p>
                    </div>

                    {/* Table */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-700 pb-1.5">Compliance Parameters Verified List:</p>
                      <table className="w-full text-left border-collapse text-[9px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold text-slate-500">
                            <th className="border border-slate-200 px-2 py-1">Pillar</th>
                            <th className="border border-slate-200 px-2 py-1">Parameter</th>
                            <th className="border border-slate-200 px-2 py-1 text-right">Target</th>
                            <th className="border border-slate-200 px-2 py-1 text-right">Actual</th>
                            <th className="border border-slate-200 px-2 py-1 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-slate-50/50">
                            <td className="border border-slate-200 px-2 py-1 font-semibold">{doc.pillar}</td>
                            <td className="border border-slate-200 px-2 py-1">{doc.category}</td>
                            <td className="border border-slate-200 px-2 py-1 text-right text-slate-500">Normal Range</td>
                            <td className="border border-slate-200 px-2 py-1 text-right font-bold text-slate-800">{doc.fileSize} log</td>
                            <td className="border border-slate-200 px-2 py-1 text-center text-green-700 font-bold">COMPLIANT</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="border border-slate-200 px-2 py-1 font-semibold">Energy</td>
                            <td className="border border-slate-200 px-2 py-1">Renewable Energy Pct</td>
                            <td className="border border-slate-200 px-2 py-1 text-right text-slate-500">60.0%</td>
                            <td className="border border-slate-200 px-2 py-1 text-right font-bold text-slate-800">62.0%</td>
                            <td className="border border-slate-200 px-2 py-1 text-center text-green-700 font-bold">COMPLIANT</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="border border-slate-200 px-2 py-1 font-semibold">Compliance</td>
                            <td className="border border-slate-200 px-2 py-1">Verification Status Log</td>
                            <td className="border border-slate-200 px-2 py-1 text-right text-slate-500">Standard</td>
                            <td className="border border-slate-200 px-2 py-1 text-right font-bold text-slate-800">Verified</td>
                            <td className="border border-slate-200 px-2 py-1 text-center text-green-700 font-bold">COMPLIANT</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-between items-center text-[9px] pt-8 border-t border-slate-200 mt-6 font-semibold">
                    <div>
                      <p className="text-slate-400">Audited By:</p>
                      <p className="font-bold text-slate-800 mt-0.5">{doc.auditor}</p>
                      <p className="text-slate-400 mt-0.5">Lead Auditor, CII GBC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Technical Signoff:</p>
                      <p className="font-bold text-slate-800 mt-0.5">Vijay Prasad</p>
                      <p className="text-slate-400 mt-0.5">Reviewer, Core Committee</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Panels */}
        <div className="space-y-6">
          {/* Document Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Info size={16} className="text-emerald-600" />
              Document Information
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Document Type</span>
                <span className="text-slate-800 font-bold">{doc.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-800 font-bold">{doc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">File Size</span>
                <span className="text-slate-800 font-bold">{doc.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Version Number</span>
                <span className="text-slate-800 font-bold">{doc.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uploaded By</span>
                <span className="text-slate-800 font-bold">{doc.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Upload Date</span>
                <span className="text-slate-800 font-bold">{doc.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-slate-800 font-bold">{doc.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Auditor Assigned</span>
                <span className="text-slate-800 font-bold">{doc.auditor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assessment ID</span>
                <span className="text-slate-800 font-mono font-bold">#{assessment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company Name</span>
                <span className="text-slate-800 font-bold">{assessment.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Factory Name</span>
                <span className="text-slate-800 font-bold">{assessment.factoryName}</span>
              </div>
            </div>
          </div>

          {/* AI Verification Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-600" />
              AI OCR Verification Summary
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-850">
                  <span>OCR Accuracy Score</span>
                  <span>99.4%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '99.4%' }} />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                <p>● Extracted Parameter Code: <span className="font-mono text-slate-800 font-bold">{doc.parameterCode}</span></p>
                <p className="mt-1">● Risk Level: <span className="text-green-700 font-bold uppercase">LOW</span></p>
                <p className="mt-1">● Verification seal validated against digital public keys.</p>
              </div>
            </div>
          </div>

          {/* Auditor Comments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-amber-600" />
              Auditor Comments
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-650">
                  <span>Vijay Prasad</span>
                  <span>{baseDay} Jun 2026</span>
                </div>
                <p className="text-xs text-slate-600 italic">"Utility log parameters checked. Metering serial numbers match perfectly."</p>
              </div>

              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-650">
                  <span>Satish Kumar</span>
                  <span>{baseDay + 1} Jun 2026</span>
                </div>
                <p className="text-xs text-slate-600 italic">"Physical audit verification completed. Compliance criteria satisfied."</p>
              </div>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-600" />
              Verification Timeline
            </h3>

            <div className="relative pl-6 space-y-4 border-l border-slate-200 text-xs font-medium text-slate-500 font-semibold">
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
                <p className="font-bold text-slate-800">Document Uploaded</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{doc.uploadDate} by {doc.uploadedBy}</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
                <p className="font-bold text-slate-800">AI OCR Validation Completed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{doc.uploadDate} by System</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
                <p className="font-bold text-slate-800">Reviewer Verify Signed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{doc.uploadDate} by Vijay Prasad</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
                <p className="font-bold text-slate-800">Auditor Verified & Closed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{doc.uploadDate} by {doc.auditor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvidenceDetailsPage
