import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  ArrowLeft, 
  ChevronRight, 
  Bookmark, 
  Share2, 
  Download, 
  Clock, 
  Calendar, 
  User, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  FileText,
  BookmarkCheck,
  ChevronLeft
} from 'lucide-react'

const STANDARDS_DB = {
  "1": {
    id: 1,
    title: "ISO 14001:2015 Environmental Management Guidelines",
    category: "ISO",
    categoryType: "ISO Standards",
    author: "International Organization for Standardization",
    publishedDate: "2015-09-15",
    version: "v2015",
    readingTime: 8,
    complianceScore: 92,
    downloadStatus: "Downloaded",
    aiSummary: "The international standard for establishing a rigorous Environmental Management System (EMS). It provides structured criteria to align corporate operations with environmental preservation goals.",
    highlights: [
      "Requires strong leadership commitment and policy integration",
      "Focuses on lifecycle perspective mapping",
      "Provides tools to mitigate environmental hazards and track risks"
    ],
    auditorComments: "Ensure Q3 baseline audits are executed before annual targets are signed off.",
    sections: {
      "Executive Summary": "ISO 14001:2015 provides a framework for organizations to design and implement an environmental management system (EMS) to improve environmental performance, fulfill compliance obligations, and achieve environmental objectives.",
      "Introduction": "Environmental management has become a critical strategic goal. This standard guides organizations in balancing ecological preservation with socio-economic growth.",
      "Scope": "Applicable to any organization, regardless of size, type, or sector, aiming to manage its environmental footprints systematically.",
      "Objectives": "1. Enhance environmental performance.\n2. Fulfill compliance obligations.\n3. Achieve environmental targets.",
      "Requirements": "Establish, implement, maintain, and continually improve an environmental management system. Top management must establish an environmental policy committed to pollution prevention.",
      "Implementation Guidelines": "1. Define EMS scope.\n2. Secure leadership commitment.\n3. Establish an environmental policy.\n4. Plan aspect identification and hazard mitigation.",
      "Compliance Checklist": "[✓] Environmental Policy Established\n[✓] Risks & Opportunities Register Updated\n[✓] Resources and Training Allocated\n[✓] Internal Audit Program Defined",
      "Best Practices": "Integrate real-time carbon and water metering systems to streamline monthly EMS audits and dashboard logs.",
      "Industry Examples": "SteelCorp Chennai optimized its PM2.5 scrubber loading by 98% following ISO 14001 guidelines.",
      "Key Takeaways": "Leadership alignment and lifecycle-based risk assessments are the cornerstones of a successful ISO 14001 EMS.",
      "References": "ISO 14001:2015 Standard Official Documentation, SEBI BRSR Guidance Notes."
    },
    relatedIds: [3, 5]
  },
  "2": {
    id: 2,
    title: "BRSR Reporting Framework - SEBI Guidance Note",
    category: "BRSR",
    categoryType: "BRSR Guidelines",
    author: "Securities and Exchange Board of India (SEBI)",
    publishedDate: "2021-05-10",
    version: "v2.0",
    readingTime: 12,
    complianceScore: 88,
    downloadStatus: "Downloaded",
    aiSummary: "SEBI guidance detailing sustainability reporting rules for Indian listed entities. It aligns financial disclosures with ESG parameters.",
    highlights: [
      "Mandatory reporting of Scope 1 & 2 carbon footprints",
      "Nine core principles of responsible business conduct",
      "Voluntary leadership indicators for advanced ESG tracking"
    ],
    auditorComments: "Check board diversity logs and stakeholder grievance details before final submission.",
    sections: {
      "Executive Summary": "The Business Responsibility and Sustainability Report (BRSR) was introduced to establish a transparent link between corporate ESG performance and investment decisions in India.",
      "Introduction": "BRSR replaces the earlier Business Responsibility Report (BRR) to provide structured quantitative disclosures of ESG indicators.",
      "Scope": "Mandatory for the top 1000 listed entities by market capitalization on Indian stock exchanges.",
      "Objectives": "Enable investors to make informed decisions by comparing corporate ESG performance objectively.",
      "Requirements": "Report on nine core principles of responsible business conduct (NGRBC) covering ethics, human rights, environment, and consumer values.",
      "Implementation Guidelines": "Compile data across essential indicators (mandatory) and leadership indicators (optional but recommended for market leaders).",
      "Compliance Checklist": "[✓] Nine Principles Outlined\n[✓] Board Approval Signed Off\n[✓] Essential Indicators Compiled\n[✓] Stakeholder Complaints Logged",
      "Best Practices": "Link local ESG collection spreadsheets directly to the central dashboard to streamline data collation.",
      "Industry Examples": "Eco Cement Ltd reduced reporting cycles by 40% using automated BRSR collection workflows.",
      "Key Takeaways": "Standardization of ESG reporting brings India's top corporates on par with international reporting metrics.",
      "References": "SEBI BRSR Guidance Notes, GRI Standards Alignment Mapping."
    },
    relatedIds: [1, 3]
  },
  "3": {
    id: 3,
    title: "Global Reporting Initiative (GRI) 305: Emissions Standard",
    category: "GRI",
    categoryType: "GRI Standards",
    author: "GRI Global Board",
    publishedDate: "2016-10-15",
    version: "v305",
    readingTime: 10,
    complianceScore: 95,
    downloadStatus: "Downloaded",
    aiSummary: "The international benchmark for measuring and reporting greenhouse gas (GHG) emissions, covering Scope 1, Scope 2, and Scope 3 footprints.",
    highlights: [
      "Covers direct, energy-indirect, and other indirect emissions",
      "Mandates detailed carbon intensity index computations",
      "Requires reporting of ozone-depleting substances (ODS)"
    ],
    auditorComments: "Verify all indirect Scope 3 supplier logistics emission factors are correctly modeled.",
    sections: {
      "Executive Summary": "GRI 305 addresses emissions into the air, including greenhouse gases (GHG), ozone-depleting substances, and other air pollutants.",
      "Introduction": "Emissions are a primary driver of global climate change. This standard enables organizations to track and declare their total emissions profile.",
      "Scope": "Organizations of all sizes and sectors seeking to disclose greenhouse gas emissions.",
      "Objectives": "1. Provide transparent emissions metrics.\n2. Support climate impact reporting.",
      "Requirements": "Disclose Scope 1 emissions, Scope 2 emissions, emissions intensity metrics, and emissions reductions targets.",
      "Implementation Guidelines": "Define the greenhouse gas boundary (equity share or control approach) before executing consumption tallies.",
      "Compliance Checklist": "[✓] Scope 1 Direct Emissions Computed\n[✓] Scope 2 Indirect Grid Purchases Calculated\n[✓] Reduction Base Year Set\n[✓] Ozone Depleting Substances Tracked",
      "Best Practices": "Conduct quarterly internal energy and emissions audits to verify baseline figures before public disclosure.",
      "Industry Examples": "GreenTextiles Tiruppur used GRI 305 to track and reduce dye-house emissions by 18% in FY25.",
      "Key Takeaways": "Accurate boundary definitions are critical for correct Scope 1 & 2 carbon calculations.",
      "References": "GRI Standards Official Site, GHG Protocol Corporate Standard."
    },
    relatedIds: [1, 2]
  },
  "4": {
    id: 4,
    title: "GreenCo Sustainability Rating System Manual",
    category: "GreenCo",
    categoryType: "GreenCo Framework",
    author: "Confederation of Indian Industry (CII)",
    publishedDate: "2024-01-20",
    version: "v3.0",
    readingTime: 15,
    complianceScore: 90,
    downloadStatus: "Downloaded",
    aiSummary: "The CII rating framework for evaluating companies on environmental friendliness. Evaluates firms out of 1000 points across 10 key ecological pillars.",
    highlights: [
      "10 core pillars including water, waste, energy, and life cycle",
      "Rating levels from Certified, Bronze, Silver, Gold, to Platinum",
      "Focuses on product stewardship and green supply chain indices"
    ],
    auditorComments: "Verify renewable energy generation figures to secure Silver/Gold level compliance.",
    sections: {
      "Executive Summary": "GreenCo Rating facilitates Indian industries to green their products, activities, and services, offering a path to world-class environmental status.",
      "Introduction": "GreenCo provides a holistic model to measure green performance across carbon footprint, water stewardship, waste management, and green supply chains.",
      "Scope": "Applicable to manufacturing facilities and service sectors in India.",
      "Objectives": "1. Assess environmental performance systematically.\n2. Drive green innovations and cost reductions.",
      "Requirements": "Excel across 10 pillars: Energy, Water, Carbon, Waste, Renewable Energy, Green Supply Chain, Material Conservation, Life Cycle Assessment, Ventilation, and Green Cover.",
      "Implementation Guidelines": "Complete the self-assessment wizard, compile utility evidence, schedule site audits, and review final ratings scores.",
      "Compliance Checklist": "[✓] Water Recycling Index > 60%\n[✓] Renewable Capacity Metric Verified\n[✓] Life Cycle Assessment Initiated\n[✓] Green Cover Area Mapped",
      "Best Practices": "Establish a dedicated GreenCo champion team on-site to coordinate compliance documentation and audits.",
      "Industry Examples": "Coimbatore Eco Cement achieved Gold rating (860 pts) by optimizing its water recycle loops.",
      "Key Takeaways": "Holistic resource conservation yields both ecological benefits and long-term operating cost reductions.",
      "References": "CII Sohrabji Godrej Green Business Centre Rating Guidelines."
    },
    relatedIds: [1, 5]
  },
  "5": {
    id: 5,
    title: "ISO 50001 Energy Management Standard Guidelines",
    category: "ISO",
    categoryType: "ISO Standards",
    author: "International Organization for Standardization",
    publishedDate: "2018-08-21",
    version: "v2018",
    readingTime: 7,
    complianceScore: 94,
    downloadStatus: "Downloaded",
    aiSummary: "The definitive global standard for establishing, implementing, maintaining, and improving an Energy Management System (EnMS).",
    highlights: [
      "Enables systematic tracking of energy performance and efficiency",
      "Requires establishing concrete Energy Baselines (EnB)",
      "Focuses on identifying Energy Performance Indicators (EnPI)"
    ],
    auditorComments: "Ensure all factory boiler efficiencies are logged under Q2 performance logs.",
    sections: {
      "Executive Summary": "ISO 50001:2018 specifies requirements for establishing, implementing, maintaining, and improving an energy management system.",
      "Introduction": "Energy usage is a major driver of corporate operational costs and greenhouse gas emissions. Managing energy systematically yields high returns.",
      "Scope": "Applicable to organizations with significant energy consumption, regardless of sector or size.",
      "Objectives": "1. Reduce energy consumption.\n2. Lower operating expenses.\n3. Reduce energy-related carbon footprints.",
      "Requirements": "Establish energy baselines, identify energy performance indicators, set objectives, and perform regular energy performance audits.",
      "Implementation Guidelines": "Conduct an energy review to identify areas of significant energy use (SEUs) and plan efficiency projects.",
      "Compliance Checklist": "[✓] Energy Review Completed\n[✓] Energy Baselines Defined\n[✓] EnPIs Selected and Mapped\n[✓] Power Metering Calibrated",
      "Best Practices": "Deploy smart sub-meters across all high-load production lines to track real-time efficiency variations.",
      "Industry Examples": "SolarTech Bengaluru reduced boiler fuel consumption by 18% after implementing ISO 50001 standards.",
      "Key Takeaways": "Continuous monitoring of significant energy uses (SEUs) is critical for sustainable energy reductions.",
      "References": "ISO 50001 Official Standard Specification Sheet."
    },
    relatedIds: [1, 4]
  },
  "6": {
    id: 6,
    title: "ISO 45001 Occupational Health and Safety Standard",
    category: "ISO",
    categoryType: "ISO Standards",
    author: "International Organization for Standardization",
    publishedDate: "2018-03-12",
    version: "v2018",
    readingTime: 9,
    complianceScore: 96,
    downloadStatus: "Downloaded",
    aiSummary: "The global benchmark standard specifying requirements for occupational health and safety (OH&S) management systems.",
    highlights: [
      "Focuses on hazard identification and risk elimination",
      "Requires active worker consultation and participation",
      "Promotes zero-incident safety cultures"
    ],
    auditorComments: "Verify supervisor training logs and floor hazard checklists are updated.",
    sections: {
      "Executive Summary": "ISO 45001:2018 enables organizations to provide safe and healthy workplaces by preventing work-related injury and ill health.",
      "Introduction": "Worker safety is a foundational aspect of corporate social responsibility (CSR) and operational resilience.",
      "Scope": "Organizations seeking to establish a rigorous health and safety management system.",
      "Objectives": "1. Eliminate occupational hazards.\n2. Prevent workplace accidents.\n3. Drive worker participation in safety programs.",
      "Requirements": "Identify health and safety risks, implement operational control measures, and conduct regular safety training.",
      "Implementation Guidelines": "Form health and safety committees, run emergency response drills, and log all near-miss incidents.",
      "Compliance Checklist": "[✓] Safety Policy Disclosed\n[✓] Hazard Risk Register Active\n[✓] PPE Distribution Logs Updated\n[✓] Fire Drills Audited",
      "Best Practices": "Run monthly interactive toolbox talks with shift operators to raise hazard identification awareness.",
      "Industry Examples": "Smart Chemicals Pune logged 365 incident-free operating days after adopting ISO 45001 guidance.",
      "Key Takeaways": "Active worker involvement is essential for identifying and mitigating workplace hazards.",
      "References": "ISO 45001 Official standard notes."
    },
    relatedIds: [1, 4]
  }
}

function ResearchStandardPage() {
  const { standardId } = useParams()
  const navigate = useNavigate()
  
  const standard = STANDARDS_DB[standardId] || STANDARDS_DB["1"]
  const [activeSection, setActiveSection] = useState("Executive Summary")
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Auto-scroll to top when standardId changes
  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveSection("Executive Summary")
    setIsBookmarked(false)
  }, [standardId])

  const handleShare = () => {
    try {
      const shareUrl = window.location.href
      navigator.clipboard.writeText(shareUrl)
      toast.success("Standard reference link copied to clipboard!")
    } catch {
      toast.error("Failed to copy link.")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Bookmark removed." : "Standard bookmarked successfully!")
  }

  const handleDownload = () => {
    toast.success(`${standard.title} offline pack downloaded successfully!`)
  }

  const sectionKeys = Object.keys(standard.sections)
  
  // Previous/Next logic
  const currentId = parseInt(standardId) || 1
  const prevId = currentId > 1 ? currentId - 1 : null
  const nextId = currentId < 6 ? currentId + 1 : null

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Link to="/dashboard" className="hover:text-slate-650 transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link to="/research-hub" className="hover:text-slate-650 transition-colors">Research Hub</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 truncate max-w-[300px]">{standard.title}</span>
      </nav>

      {/* Header Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/research-hub')}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-550 transition-colors cursor-pointer"
            title="Back to Research Hub"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="text-emerald-600" size={22} />
              {standard.title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 uppercase tracking-wider font-bold">
                {standard.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Published: {standard.publishedDate}
              </span>
              <span className="flex items-center gap-1 font-mono">
                Version: {standard.version}
              </span>
              <span className="flex items-center gap-1">
                <User size={13} />
                Org: {standard.author}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 border-t border-slate-100 pt-3 lg:border-0 lg:pt-0">
          <button 
            onClick={handleBookmark}
            className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-550 border-amber-600 text-white shadow-md' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Share2 size={14} />
            Share
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Download size={14} />
            {standard.downloadStatus}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Index Navigation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Document Index</h3>
          <div className="space-y-1">
            {sectionKeys.map(key => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === key 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className="truncate">{key}</span>
                {activeSection === key && <ChevronRight size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Reading Canvas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2 min-h-[480px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">{activeSection}</h2>
              <span className="text-[10px] font-mono font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded uppercase">Section {sectionKeys.indexOf(activeSection) + 1} of {sectionKeys.length}</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed font-semibold whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-150">
              {standard.sections[activeSection]}
            </div>
          </div>

          {/* Section Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100 text-xs font-bold mt-6">
            <button
              onClick={() => {
                const idx = sectionKeys.indexOf(activeSection)
                if (idx > 0) setActiveSection(sectionKeys[idx - 1])
              }}
              disabled={sectionKeys.indexOf(activeSection) === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Prev Section
            </button>
            <button
              onClick={() => {
                const idx = sectionKeys.indexOf(activeSection)
                if (idx < sectionKeys.length - 1) setActiveSection(sectionKeys[idx + 1])
              }}
              disabled={sectionKeys.indexOf(activeSection) === sectionKeys.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg disabled:opacity-40 cursor-pointer"
            >
              Next Section
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* AI Executive Summary Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-600 animate-pulse" />
              AI Summary & Insights
            </h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              {standard.aiSummary}
            </p>
          </div>

          {/* Important Highlights checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              Important Highlights
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              {standard.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black shrink-0 mt-0.5">●</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Score & Time info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Clock size={16} className="text-amber-600" />
              Metrics & Reading
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-bold">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Reading Time</span>
                <span className="text-slate-800 text-base font-black">{standard.readingTime} min</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Compliance Score</span>
                <span className="text-emerald-700 text-base font-black">{standard.complianceScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Previous / Next Standard & Related Standards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-4">
          {prevId ? (
            <Link 
              to={`/research-hub/standards/${prevId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all"
            >
              <ChevronLeft size={16} />
              Previous Standard
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextId ? (
            <Link 
              to={`/research-hub/standards/${nextId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all"
            >
              Next Standard
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">Related Standards Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standard.relatedIds.map(rid => {
              const rel = STANDARDS_DB[rid]
              if (!rel) return null
              return (
                <Link 
                  key={rel.id}
                  to={`/research-hub/standards/${rel.id}`}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="text-emerald-600 shrink-0" size={18} />
                    <div className="truncate space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 truncate">{rel.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{rel.categoryType}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400 shrink-0" size={16} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResearchStandardPage
