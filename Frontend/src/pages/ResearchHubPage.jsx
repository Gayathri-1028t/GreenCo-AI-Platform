import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Cpu, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  Video, 
  CheckCircle,
  HelpCircle,
  FolderOpen,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react'
import { toast } from 'react-toastify'

// ----------------------------------------------------
// Robust Class-Based Error Boundary Component
// ----------------------------------------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Research Hub Component Error Boundary caught a crash:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-center space-y-3 shadow-inner my-2">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-rose-800 font-extrabold text-xs uppercase tracking-wider">Section Load Error</h3>
          <p className="text-[11px] text-rose-650 font-medium leading-relaxed">
            The AI engine or rendering thread encountered an issue parsing this section.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer"
          >
            Reload Section
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ----------------------------------------------------
// Seed Database of Articles with Rich ESG Content
// ----------------------------------------------------
const articlesData = [
  {
    id: 1,
    title: 'ISO 14001:2015 Environmental Management Guidelines',
    category: 'ISO Standards',
    categoryType: 'ISO',
    author: 'Global Standard Organization',
    date: '2026-03-10',
    readingTime: 8,
    filename: 'iso14001.pdf',
    keywords: ['environment', 'iso', 'management', 'policy', 'compliance'],
    toc: ['Introduction', 'Scope & Application', 'Policy Requirements', 'Planning & Risk Actions', 'Performance Evaluation'],
    content: [
      {
        heading: 'Introduction',
        text: 'ISO 14001:2015 specifies the requirements for an environmental management system that an organization can use to enhance its environmental performance. It is intended for use by organizations seeking to manage environmental responsibilities in a systematic manner that contributes to the environmental pillar of sustainability.'
      },
      {
        heading: 'Scope & Application',
        text: 'Applicable to any organization, regardless of size, type and nature, and applies to the environmental aspects of its activities, products and services that the organization determines it can either control or influence considering a life cycle perspective.'
      },
      {
        heading: 'Policy Requirements',
        text: 'Top management must establish, implement and maintain an environmental policy that, within the defined scope of its environmental management system, is appropriate to the purpose and context of the organization. It must include commitments to protection of the environment, prevention of pollution, and compliance obligations.'
      },
      {
        heading: 'Planning & Risk Actions',
        text: 'Organizations must plan actions to address environmental aspects, compliance obligations, and risks identified. The plan must establish environmental objectives at relevant functions and levels, specifying what will be done, what resources will be required, who will be responsible, when it will be completed and how results will be evaluated.'
      },
      {
        heading: 'Performance Evaluation',
        text: 'The organization must monitor, measure, analyze and evaluate its environmental performance. It must determine what needs to be monitored, the methods for monitoring, and the criteria against which environmental performance will be evaluated. Internal audits must be conducted at planned intervals.'
      }
    ],
    aiSummary: {
      executiveSummary: 'This document details the core framework for establishing a world-class Environmental Management System (EMS). It provides structured criteria to align corporate strategy with environmental preservation targets.',
      keyTakeaways: [
        'Requires strong leadership commitment and environmental policy integration.',
        'Focuses on life-cycle perspective mapping for resource extraction to disposal.',
        'Provides tools to identify compliance gaps and mitigate environmental hazards.'
      ],
      complianceHighlights: [
        'Mandatory compliance obligation register tracking.',
        'Documented evidence of internal audits and review logs.',
        'Quantified carbon and water metrics tracking.'
      ],
      recommendations: [
        'Conduct Q3 baseline audit before finalizing annual targets.',
        'Establish secondary review boards for supplier environmental tracking.'
      ],
      riskFactors: [
        'Failing to track indirect Scope 3 supplier logistics emission factors.',
        'Inadequate training logs for floor supervisors handling bio-waste.'
      ],
      bestPractices: [
        'Store EMS policy logs on accessible platform dashboards.',
        'Integrate real-time carbon meters to streamline monthly audit checks.'
      ]
    },
    relatedIds: [2, 3],
    diagramLabel: 'ISO 14001 Continuous Improvement Loop'
  },
  {
    id: 2,
    title: 'BRSR Reporting Framework - SEBI Guidance Note',
    category: 'BRSR Guidelines',
    categoryType: 'BRSR',
    author: 'Securities and Exchange Board of India',
    date: '2026-04-18',
    readingTime: 12,
    filename: 'brsr-guidelines.pdf',
    keywords: ['sebi', 'brsr', 'india', 'governance', 'social', 'report'],
    toc: ['Context of BRSR', 'Nine Core Principles', 'Essential vs Leadership Indicators', 'Environmental Disclosures', 'Governance Matrix'],
    content: [
      {
        heading: 'Context of BRSR',
        text: 'The Business Responsibility and Sustainability Report (BRSR) was introduced by SEBI to establish a robust link between corporate ESG performance and investment decisions. It seeks to bring sustainability reporting at par with financial reporting.'
      },
      {
        heading: 'Nine Core Principles',
        text: 'BRSR is structured around nine principles of the National Guidelines on Responsible Business Conduct (NGRBC). These cover ethics, product safety, employee wellbeing, stakeholder interests, human rights, environmental protection, policy advocacy, inclusive growth, and consumer value.'
      },
      {
        heading: 'Essential vs Leadership Indicators',
        text: 'Disclosures are divided into Essential Indicators (which are mandatory for all top 1000 listed entities) and Leadership Indicators (which are voluntary but show advanced ESG positioning, such as Scope 3 emissions reporting).'
      },
      {
        heading: 'Environmental Disclosures',
        text: 'Companies must report key environmental parameters: electricity usage, water withdrawal by source, water consumption intensity, Scope 1 and Scope 2 GHG emissions, waste generation quantities, and recycling metrics.'
      },
      {
        heading: 'Governance Matrix',
        text: 'Requires reporting on anti-corruption policies, board diversity, details of stakeholder complaints, supplier audits on ESG criteria, and customer safety mechanisms.'
      }
    ],
    aiSummary: {
      executiveSummary: 'Guidance note detailing compliance reporting rules for Indian listed entities. It details data standards for emissions, employee safety, and CSR governance metrics.',
      keyTakeaways: [
        'Establishes standardized sustainability audit formats on par with financial reporting.',
        'Forces reporting of Scope 1 & 2 carbon footprints and water intake sources.',
        'Promotes transparent governance via board diversity and stakeholder grievance disclosures.'
      ],
      complianceHighlights: [
        'Mandatory disclosures for top 1000 listed firms on NSE and BSE.',
        'Sign-off required by corporate company board secretaries.',
        'Audit trail verification of environmental inputs.'
      ],
      recommendations: [
        'Establish automated data logs for electricity bills to eliminate manual input errors.',
        'Initiate supplier ESG code of conduct programs.'
      ],
      riskFactors: [
        'Under-reporting of contractual floor-worker safety incidents.',
        'Failing to detail regional water stress zones for factory assets.'
      ],
      bestPractices: [
        'Align BRSR templates with global GRI reporting indices.',
        'Review quarterly reports prior to fiscal year-end board submissions.'
      ]
    },
    relatedIds: [1, 3],
    diagramLabel: 'BRSR Nine Principles Alignment Map'
  },
  {
    id: 3,
    title: 'Global Reporting Initiative (GRI) 305: Emissions Standard',
    category: 'GRI Standards',
    categoryType: 'GRI',
    author: 'GRI Global Board',
    date: '2026-01-22',
    readingTime: 10,
    filename: 'gri305.pdf',
    keywords: ['gri', 'emissions', 'carbon', 'scope', 'greenhouse'],
    toc: ['GRI 305 Overview', 'Direct Emissions (Scope 1)', 'Energy Indirect (Scope 2)', 'Other Indirect (Scope 3)', 'Emissions Reduction Targets'],
    content: [
      {
        heading: 'GRI 305 Overview',
        text: 'GRI 305 addresses emissions into air, which are the discharge of substances from a source into the atmosphere. Greenhouse gas (GHG) emissions are a major contributor to climate change and are regulated under global frameworks.'
      },
      {
        heading: 'Direct Emissions (Scope 1)',
        text: 'Reporting requirements for Scope 1 greenhouse gas emissions. These are direct emissions from sources owned or controlled by the organization, such as combustion of fuel in boilers, furnaces, and vehicles.'
      },
      {
        heading: 'Energy Indirect (Scope 2)',
        text: 'Reporting requirements for Scope 2 emissions, which are emissions that result from the generation of purchased or acquired electricity, heating, cooling, or steam consumed by the organization.'
      },
      {
        heading: 'Other Indirect (Scope 3)',
        text: 'Guidance on Scope 3 emissions. These are all other indirect emissions (not included in Scope 2) that occur in the value chain of the reporting organization, including both upstream and downstream activities.'
      },
      {
        heading: 'Emissions Reduction Targets',
        text: 'Organizations must report progress toward reduction targets, the baseline year selected, the gases included in the calculation, and the exact methodologies used for emissions offsets.'
      }
    ],
    aiSummary: {
      executiveSummary: 'Global benchmark standard detailing greenhouse gas (GHG) reporting disclosures. It defines strict rules for classifying and auditing carbon footprint statistics.',
      keyTakeaways: [
        'Defines Scope 1 (Direct), Scope 2 (Indirect), and Scope 3 (Value Chain) emissions.',
        'Requires baseline-year comparisons to validate carbon reduction claims.',
        'Provides standard conversion factors (CO2, CH4, N2O) for calculating output.'
      ],
      complianceHighlights: [
        'Mandatory declaration of calculation methodologies (GHG Protocol).',
        'Breakdown of emissions by facility, state, and gas type.',
        'Verification of carbon credit purchases and offsets.'
      ],
      recommendations: [
        'Migrate to cloud-based utility meters to capture raw Scope 2 electricity factors.',
        'Include third-party logistics emission reports in annual reviews.'
      ],
      riskFactors: [
        'Using outdated grid emission baseline factors.',
        'Double counting emissions inside multi-factory shared industrial areas.'
      ],
      bestPractices: [
        'Establish annual emission goals aligned with Science-Based Targets (SBTi).',
        'Deploy continuous sensor devices in blast furnaces for direct Scope 1 audit data.'
      ]
    },
    relatedIds: [2, 4],
    diagramLabel: 'GRI Scope 1, 2, and 3 Classification Matrix'
  },
  {
    id: 4,
    title: 'CSRD Directive Overview & Supply Chain Audits',
    category: 'CSRD Directive',
    categoryType: 'CSRD',
    author: 'European ESG Commission',
    date: '2026-05-02',
    readingTime: 11,
    filename: 'csrd-framework.pdf',
    keywords: ['csrd', 'europe', 'supply chain', 'audit', 'directive'],
    toc: ['Introduction to CSRD', 'Double Materiality Concept', 'Reporting Standards (ESRS)', 'Supply Chain Impact', 'Third-Party Assurance'],
    content: [
      {
        heading: 'Introduction to CSRD',
        text: 'The Corporate Sustainability Reporting Directive (CSRD) is a new European Union regulation that significantly expands the sustainability reporting rules for businesses operating inside or trading with the EU.'
      },
      {
        heading: 'Double Materiality Concept',
        text: 'CSRD enforces double materiality. This means firms must report on how sustainability issues affect their business development (outside-in impact) AND how their operations impact the environment and society (inside-out impact).'
      },
      {
        heading: 'Reporting Standards (ESRS)',
        text: 'Reporting must comply with European Sustainability Reporting Standards (ESRS) which cover environmental topics (E1 climate, E2 pollution, E3 water, E4 biodiversity, E5 resource use) alongside social and governance standards.'
      },
      {
        heading: 'Supply Chain Impact',
        text: 'Non-EU suppliers (such as Indian manufacturing partners) must provide certified carbon footprints and labor safety logs to EU buyers, making CSRD compliance vital for international trade.'
      },
      {
        heading: 'Third-Party Assurance',
        text: 'Enforces mandatory independent third-party audits of sustainability reports, ensuring sustainability data meets the same reliability standard as financial balance sheets.'
      }
    ],
    aiSummary: {
      executiveSummary: 'EU Directive bringing sustainability reports to the level of financial reports, introducing double materiality and third-party audit requirements for trading companies.',
      keyTakeaways: [
        'Enforces double materiality: environmental impact AND financial sustainability risk.',
        'Applies to non-EU companies generating significant EU revenues or exporting goods.',
        'Mandates external third-party assurance for all published reports.'
      ],
      complianceHighlights: [
        'Aligns with European Sustainability Reporting Standards (ESRS).',
        'Required disclosure of transition plans to limit global warming to 1.5°C.',
        'Mandatory digital tagging (XBRL) of ESG reports.'
      ],
      recommendations: [
        'Establish direct carbon reporting pipelines for all EU-bound shipments.',
        'Perform double materiality assessments on factory resource dependencies.'
      ],
      riskFactors: [
        'Failure to supply certified Scope 1-3 reports could lead to contract cancellations with EU buyers.',
        'Fines from EU regulators for inaccurate value-chain child labor tracking.'
      ],
      bestPractices: [
        'Provide standardized CSRD-ready sheets to all international purchasers.',
        'Audit energy efficiency parameters using accredited verification firms.'
      ]
    },
    relatedIds: [1, 3],
    diagramLabel: 'CSRD Double Materiality Analysis Grid'
  },
  {
    id: 5,
    title: 'Biomass Boiler Efficiency & Safety Training SOP',
    category: 'Training Resource',
    categoryType: 'Training',
    author: 'GreenCo Operations Academy',
    date: '2026-06-15',
    readingTime: 6,
    filename: 'netzero-roadmap.pdf',
    keywords: ['biomass', 'safety', 'training', 'boiler', 'operational'],
    toc: ['Operational Overview', 'Biowaste Feed Specifications', 'Methane Pressure Controls', 'Emergency Shutdown Procedures', 'Audit Maintenance Log'],
    content: [
      {
        heading: 'Operational Overview',
        text: 'This Standard Operating Procedure (SOP) outlines the safety and efficiency guidelines for operating site biomass boilers. Biomass boilers use organic materials to generate heat, reducing reliance on fossil fuels.'
      },
      {
        heading: 'Biowaste Feed Specifications',
        text: 'Feedstocks must consist only of dry landscape clippings, verified agricultural scrap, and clean wood chips. High moisture content reduces thermal efficiency and increases emissions. Maximum moisture is capped at 15%.'
      },
      {
        heading: 'Methane Pressure Controls',
        text: 'Methane and gas accumulation pressures must be monitored hourly. Operating pressures must stay between 1.2 and 1.8 bar. Any spike beyond 2.0 bar must trigger automated pressure release valves.'
      },
      {
        heading: 'Emergency Shutdown Procedures',
        text: 'In case of fire backdrafts or pressure failure: (1) Cut biowaste feed screw immediately, (2) Engage primary nitrogen smothering grid, (3) Sound facility evacuation siren, and (4) Alert fire safety coordinator.'
      },
      {
        heading: 'Audit Maintenance Log',
        text: 'Daily logs must record: fuel consumption weight (kg), water feed temperature (°C), combustion temperature (°C), ash weight (kg), and pressure levels. Maintenance teams must inspect exhaust filters weekly.'
      }
    ],
    aiSummary: {
      executiveSummary: 'Operational SOP detailing biomass boiler parameters, biowaste fuel limits, pressure checks, safety procedures, and daily logging rules.',
      keyTakeaways: [
        'Restricts feedstock moisture levels to under 15% to maintain combustion efficiency.',
        'Defines clear pressure thresholds: normal is 1.2-1.8 bar, alarm at 2.0 bar.',
        'Establishes daily logging protocols for audit compliance.'
      ],
      complianceHighlights: [
        'Mandatory floor operator sign-offs at shift changes.',
        'Weekly particulate filter checks required for emissions logs.',
        'Compliance validation checks on nitrogen backup canisters.'
      ],
      recommendations: [
        'Install electronic warning sensors to log pressure spikes directly to the database.',
        'Train shift leaders on nitrogen smothering valves twice a year.'
      ],
      riskFactors: [
        'High biowaste moisture causing ash buildup and emissions surges.',
        'Delayed emergency reaction times due to blocked safety valves.'
      ],
      bestPractices: [
        'Display emergency SOP checklists directly on the boiler control panel.',
        'Perform annual ash thermal checks to monitor combustion efficiency.'
      ]
    },
    relatedIds: [1, 2],
    diagramLabel: 'Biomass Boiler Operational Flow Chart'
  }
]

export default function ResearchHubPage() {
  const navigate = useNavigate()
  // ----------------------------------------------------
  // State Initialization & LocalStorage Safeguards
  // ----------------------------------------------------
  const [articles, setArticles] = useState(articlesData)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'detail'
  
  // Bookmarks persisted safely in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('greenco_research_bookmarks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
      return [1, 5] // default bookmarks
    } catch {
      return [1, 5]
    }
  })

  // Recently viewed articles persisted safely in localStorage
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('greenco_research_recent')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
      return [1]
    } catch {
      return [1]
    }
  })

  // Selected article setup with strict fallback
  const [selectedArticle, setSelectedArticle] = useState(() => {
    return articlesData[0] || {
      id: 1,
      title: 'Fallback Guidelines',
      category: 'ISO Standards',
      categoryType: 'ISO',
      author: 'Global Standard Organization',
      date: '2026-03-10',
      readingTime: 5,
      filename: 'Fallback_Guidelines.pdf',
      keywords: [],
      toc: ['Introduction'],
      content: [{ heading: 'Introduction', text: 'Operational fallback guidelines.' }],
      aiSummary: {
        executiveSummary: 'Fallback summary analysis.',
        keyTakeaways: [],
        complianceHighlights: [],
        recommendations: [],
        riskFactors: [],
        bestPractices: []
      },
      relatedIds: [],
      diagramLabel: 'Continuous Loop'
    }
  })

  // Save Bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greenco_research_bookmarks', JSON.stringify(bookmarkedIds))
    } catch (e) {
      console.warn("Failed to save bookmarks to localStorage:", e)
    }
  }, [bookmarkedIds])

  // Save Recently Viewed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greenco_research_recent', JSON.stringify(recentlyViewed))
    } catch (e) {
      console.warn("Failed to save recently viewed to localStorage:", e)
    }
  }, [recentlyViewed])

  // Update selected article and record in recently viewed safely
  const handleSelectArticle = (art, mode = 'list') => {
    if (!art) return
    setSelectedArticle(art)
    setViewMode(mode)

    // Add to recently viewed, keeping last 3 items, avoiding duplicates
    setRecentlyViewed(prev => {
      const currentList = Array.isArray(prev) ? prev : []
      const filtered = currentList.filter(id => id !== art.id)
      return [art.id, ...filtered].slice(0, 3)
    })
  }

  // Toggle Bookmark safely
  const handleToggleBookmark = (id) => {
    setBookmarkedIds(prev => {
      const currentList = Array.isArray(prev) ? prev : []
      const isBookmarked = currentList.includes(id)
      const nextBookmarks = isBookmarked ? currentList.filter(bId => bId !== id) : [...currentList, id]
      toast.info(isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks')
      return nextBookmarks
    })
  }

  // Share link handler
  const handleShare = (art, e) => {
    if (e) e.stopPropagation()
    if (!art) return
    try {
      const shareUrl = `${window.location.origin}/research-hub?article=${art.id}`
      navigator.clipboard.writeText(shareUrl)
      toast.success(`Share link for ${art.title} copied to clipboard!`)
    } catch (err) {
      toast.error("Failed to copy link.")
    }
  }



  const handleReadFullStandard = (art) => {
    if (!art) return
    navigate(`/research-hub/standards/${art.id}`)
  }

  // ----------------------------------------------------
  // Scroll Progress Tracker for Detailed Article View
  // ----------------------------------------------------
  const [scrollProgress, setScrollProgress] = useState(0)
  const detailContainerRef = useRef(null)

  const handleScroll = () => {
    if (detailContainerRef.current) {
      const element = detailContainerRef.current
      const totalHeight = element.scrollHeight - element.clientHeight
      if (totalHeight > 0) {
        const scrolled = (element.scrollTop / totalHeight) * 100
        setScrollProgress(scrolled)
      }
    }
  }

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false)

  // ----------------------------------------------------
  // Filter & Search Logic with Robust Safeguards
  // ----------------------------------------------------
  const filteredArticles = (articles || []).filter(art => {
    if (!art) return false
    const matchesSearch = (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (art.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (art.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (art.keywords || []).some(k => (k || '').toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Category dropdown filter
    const matchesCategory = !selectedCategory || 
                            (selectedCategory === 'ISO' && art.categoryType === 'ISO') ||
                            (selectedCategory === 'BRSR' && art.categoryType === 'BRSR') ||
                            (selectedCategory === 'GRI' && art.categoryType === 'GRI') ||
                            (selectedCategory === 'CSRD' && art.categoryType === 'CSRD') ||
                            (selectedCategory === 'Training' && art.categoryType === 'Training') ||
                            (selectedCategory === 'Environmental' && ['ISO Standards', 'GRI Standards'].includes(art.category)) ||
                            (selectedCategory === 'Governance' && art.category === 'BRSR Guidelines')
    
    const matchesBookmark = !showOnlyBookmarks || (bookmarkedIds || []).includes(art.id)
    return matchesSearch && matchesCategory && matchesBookmark
  })

  return (
    <div className="space-y-6">
      
      {/* ----------------------------------------------------
          LISTING VIEW MODE
         ---------------------------------------------------- */}
      {viewMode === 'list' && (
        <>
          {/* Header */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="text-emerald-500 fill-emerald-50" size={24} />
                ESG Research & Knowledge Hub
              </h1>
              <p className="mt-1 text-slate-500 text-sm">
                Access compliance policies, ISO certifications, BRSR standards, training SOPs, and AI executive summaries.
              </p>
            </div>
          </div>

          {/* KPI Statistics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indexed Documents</p>
              <p className="text-lg font-black text-slate-850 mt-0.5">{articles.length} Standards</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bookmarked Files</p>
              <p className="text-lg font-black text-indigo-650 mt-0.5">{(bookmarkedIds || []).length} Pinned</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Training SOPs</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">1 Completed</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Synopses Available</p>
              <p className="text-lg font-black text-purple-650 mt-0.5">5 Summaries</p>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
            
            {/* Left Library Section (70%) */}
            <div className="xl:col-span-7 space-y-6 min-w-0">
              
              {/* Search & Category Filter bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by title, category, author, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600"
                  >
                    <option value="">All Standards</option>
                    <option value="ISO">ISO</option>
                    <option value="BRSR">BRSR</option>
                    <option value="GRI">GRI</option>
                    <option value="CSRD">CSRD</option>
                    <option value="Training">Training</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Governance">Governance</option>
                  </select>

                  <button
                    onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      showOnlyBookmarks 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark size={14} className={showOnlyBookmarks ? 'fill-indigo-600 text-indigo-650' : ''} />
                    Bookmarks
                  </button>
                </div>
              </div>

              {/* Library Cards list */}
              <ErrorBoundary>
                <div className="space-y-4">
                  {filteredArticles.length === 0 ? (
                    <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-200 shadow-sm">
                      <FolderOpen className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="font-semibold text-slate-700 text-xs">No research articles match your filters</p>
                    </div>
                  ) : (
                    filteredArticles.map(art => {
                      if (!art) return null
                      const isBookmarked = (bookmarkedIds || []).includes(art.id)
                      return (
                        <div
                          key={art.id}
                          onClick={() => handleSelectArticle(art)}
                          className={`bg-white p-5 rounded-2xl border shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md transition-all duration-150 ${
                            selectedArticle.id === art.id ? 'ring-2 ring-emerald-500/10 border-emerald-500' : 'border-slate-200'
                          }`}
                        >
                          <div className="space-y-2 flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                {art.category || 'General'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold">{art.date}</span>
                              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5">
                                <Clock size={10} />
                                {art.readingTime || 5} min
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm leading-snug truncate hover:text-emerald-600 transition-colors">
                              {art.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{art.summary}</p>
                            <p className="text-[10px] text-slate-400 font-bold">Issued by: {art.author}</p>
                            
                            {/* Card Action Links */}
                            <div className="flex flex-wrap items-center gap-3 pt-2.5 text-[10px] font-bold text-slate-500 border-t border-slate-50 mt-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSelectArticle(art, 'detail'); }}
                                className="hover:text-emerald-600 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                View Details
                              </button>
                              <span className="text-slate-350">|</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleReadFullStandard(art); }}
                                className="hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Read PDF"
                              >
                                Read Full Standard
                              </button>
                              <span className="text-slate-355">|</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleShare(art, e); }}
                                className="hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Share Link"
                              >
                                Share
                              </button>
                              <span className="text-slate-355">|</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSelectArticle(art, 'list'); }}
                                className="hover:text-purple-650 transition-colors cursor-pointer"
                                title="Summarize"
                              >
                                AI Summary
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0 self-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleBookmark(art.id); }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition-colors bg-white cursor-pointer"
                              title="Bookmark"
                            >
                              <Bookmark size={14} className={isBookmarked ? 'fill-indigo-600 text-indigo-650' : ''} />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ErrorBoundary>

            </div>

            {/* Right Column - AI Summarizer & Bookmarks (30%) */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* AI Summarizer widget */}
              <ErrorBoundary>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Cpu size={18} className="text-purple-650" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">AI Executive Summarizer</h3>
                      <p className="text-[9px] text-slate-400">Highlights for selected standard.</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-[11px] font-semibold text-slate-650 leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Selected Standard</span>
                      <h4 className="text-slate-800 font-extrabold text-xs">{selectedArticle?.title || 'No standard selected'}</h4>
                    </div>

                    <div className="p-3 bg-purple-500/[0.02] border border-purple-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1 text-purple-800 font-extrabold uppercase text-[9px]">
                        <Sparkles size={11} className="animate-pulse" />
                        Executive Summary
                      </div>
                      <p className="leading-relaxed">{selectedArticle?.aiSummary?.executiveSummary || 'Summary empty.'}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Key Takeaways</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                        {(selectedArticle?.aiSummary?.keyTakeaways || []).slice(0, 2).map((takeaway, index) => (
                          <li key={index}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleReadFullStandard(selectedArticle)}
                      disabled={!selectedArticle}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-[10px] font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer select-none disabled:opacity-50"
                    >
                      Read Full Standard
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </ErrorBoundary>

              {/* Bookmarks locker */}
              <ErrorBoundary>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Bookmark size={15} className="text-indigo-650" />
                      Pinned Bookmarks
                    </h3>
                    <p className="text-[10px] text-slate-400">Quick access checklist.</p>
                  </div>

                  <div className="space-y-2.5">
                    {(!bookmarkedIds || bookmarkedIds.length === 0) ? (
                      <p className="text-center text-[10px] text-slate-400 py-2">No bookmarks pinned yet</p>
                    ) : (
                      articles
                        .filter(a => (bookmarkedIds || []).includes(a?.id))
                        .map(a => {
                          if (!a) return null
                          return (
                            <div 
                              key={a.id} 
                              onClick={() => handleSelectArticle(a)}
                              className="flex justify-between items-center text-xs border-b border-slate-100 pb-2 cursor-pointer group"
                            >
                              <span className="font-bold text-slate-800 truncate max-w-[170px] group-hover:text-emerald-600 transition-colors">
                                {a.title}
                              </span>
                              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          )
                        })
                    )}
                  </div>
                </div>
              </ErrorBoundary>

            </div>

          </div>
        </>
      )}

      {/* ----------------------------------------------------
          DETAILED VIEWER VIEW MODE
         ---------------------------------------------------- */}
      {viewMode === 'detail' && selectedArticle && (
        <div className="space-y-6">
          
          {/* Scroll progress bar */}
          <div className="fixed top-16 left-0 right-0 h-1 bg-slate-150 z-50">
            <div className="bg-emerald-500 h-full transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
          </div>

          {/* Detail Header bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-55 hover:bg-slate-150 text-slate-650 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Library
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleBookmark(selectedArticle.id)}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  (bookmarkedIds || []).includes(selectedArticle.id)
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Bookmark size={14} className={(bookmarkedIds || []).includes(selectedArticle.id) ? 'fill-indigo-600 text-indigo-650' : ''} />
                {(bookmarkedIds || []).includes(selectedArticle.id) ? 'Bookmarked' : 'Pin Bookmark'}
              </button>
            </div>
          </div>

          {/* Main Detail Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
            
            {/* Left Side: Article Content & TOC (70%) */}
            <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Header section */}
              <div className="border-b border-slate-100 pb-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-black uppercase tracking-wider border border-slate-200">
                    {selectedArticle.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={12} />
                    {selectedArticle.readingTime || 5} min read
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h1>
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold pt-1">
                  <span>Author: {selectedArticle.author}</span>
                  <span>Published: {selectedArticle.date}</span>
                </div>
              </div>

              {/* Table of contents and Diagram Section */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 border-b border-slate-100 pb-6">
                
                {/* Clickable TOC (40%) */}
                <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5 text-xs font-bold text-slate-600">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Table of Contents</span>
                  <div className="space-y-2">
                    {(selectedArticle.toc || []).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 hover:text-emerald-600 transition-colors cursor-pointer">
                        <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-550 shrink-0 font-bold">{idx + 1}</span>
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Diagram block (60%) */}
                <div className="lg:col-span-6 bg-slate-900 text-slate-200 p-4 rounded-xl flex flex-col justify-between h-[160px] border border-slate-950 relative overflow-hidden group">
                  <div className="absolute right-3 top-3 text-indigo-500/10">
                    <Award size={80} />
                  </div>
                  <div>
                    <span className="text-[8px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-black uppercase tracking-wider">Compliance Workflow</span>
                    <h5 className="font-extrabold text-xs text-white mt-1.5">{selectedArticle.diagramLabel || 'Framework Map'}</h5>
                  </div>
                  {/* Styled visual diagram details */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mt-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Assess</span>
                    </div>
                    <ArrowRight size={10} />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>Analyze</span>
                    </div>
                    <ArrowRight size={10} />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>Audit Check</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Full Article Content scrollable body */}
              <div 
                ref={detailContainerRef}
                onScroll={handleScroll}
                className="space-y-6 text-sm text-slate-650 leading-relaxed font-semibold max-h-[400px] overflow-y-auto pr-2 scrollbar-thin border-b border-slate-100 pb-6"
              >
                {(selectedArticle.content || []).map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-extrabold text-slate-850 text-base">{sec.heading}</h3>
                    <p className="font-normal text-slate-500 leading-normal">{sec.text}</p>
                  </div>
                ))}
              </div>

              {/* Related articles block */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Related Standards & Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articlesData
                    .filter(a => (selectedArticle.relatedIds || []).includes(a?.id))
                    .map(rel => (
                      <div 
                        key={rel.id} 
                        onClick={() => handleSelectArticle(rel, 'detail')}
                        className="p-3 bg-slate-50 border border-slate-150 rounded-xl hover:bg-slate-100/50 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div className="truncate max-w-[200px] pr-2">
                          <p className="font-bold text-slate-800 truncate text-xs">{rel.title}</p>
                          <p className="text-[8px] text-slate-400 font-bold">{rel.category}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Right Side: AI summary details locker & Recently Viewed (30%) */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Detailed AI executive summarizer */}
              <ErrorBoundary>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Cpu size={18} className="text-purple-650 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">AI Executive Summarizer</h3>
                      <p className="text-[9px] text-slate-400">Brief highlights for selected standard.</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-[11px] font-semibold text-slate-650 leading-relaxed">
                    <div className="p-3 bg-purple-500/[0.02] border border-purple-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1 text-purple-800 font-extrabold uppercase text-[9px]">
                        <Sparkles size={11} className="animate-pulse" />
                        Executive Summary
                      </div>
                      <p>{selectedArticle.aiSummary?.executiveSummary || 'Summary empty.'}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Key Takeaways</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                        {(selectedArticle.aiSummary?.keyTakeaways || []).map((takeaway, index) => (
                          <li key={index}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Compliance Highlights</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                        {(selectedArticle.aiSummary?.complianceHighlights || []).map((hl, index) => (
                          <li key={index}>{hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl space-y-2">
                      <div className="text-rose-800 font-extrabold uppercase text-[9px]">
                        Risk Factors
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                        {(selectedArticle.aiSummary?.riskFactors || []).map((rf, index) => (
                          <li key={index}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ErrorBoundary>

              {/* Recently viewed locker */}
              <ErrorBoundary>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={15} className="text-slate-500" />
                      Recently Viewed
                    </h3>
                    <p className="text-[10px] text-slate-400">Last read compliance documents.</p>
                  </div>

                  <div className="space-y-2.5">
                    {articlesData
                      .filter(a => (recentlyViewed || []).includes(a?.id))
                      .map(a => {
                        if (!a) return null
                        return (
                          <div 
                            key={a.id} 
                            onClick={() => handleSelectArticle(a, 'detail')}
                            className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 cursor-pointer group"
                          >
                            <span className="font-bold text-slate-800 truncate max-w-[170px] group-hover:text-emerald-600 transition-colors">
                              {a.title}
                            </span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )
                      })}
                  </div>
                </div>
              </ErrorBoundary>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
