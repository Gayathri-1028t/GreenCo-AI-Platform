import { useState } from 'react'
import { 
  Lightbulb, 
  Plus, 
  Search, 
  ThumbsUp, 
  Check, 
  X, 
  Calendar, 
  Droplet, 
  Sparkles,
  Cpu,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  User,
  Activity,
  ArrowUpRight,
  Filter
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'

function InnovationLabPage() {
  const { user } = useAuthStore()
  const isCoordinator = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR'].includes(role)
  )

  // Seed initial mock data
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Green Hydrogen Furnace Blend',
      description: 'Inject 15% green hydrogen into natural gas blast furnaces to lower thermal carbon intensity.',
      category: 'Carbon Reduction',
      cost: 45000,
      annualSavings: 15000,
      carbonSavings: 1200,
      waterSavings: 0,
      feasibility: 82,
      votes: 24,
      voted: false,
      status: 'APPROVED',
      submittedBy: 'karan.sharma@steelcorp.com',
      date: '2026-07-08',
      timeline: 12
    },
    {
      id: 2,
      title: 'Rainwater Retention & Cooling Loop',
      description: 'Capture site runoff to replenish cooling tower reservoirs, reducing municipal fresh water load.',
      category: 'Water Conservation',
      cost: 18000,
      annualSavings: 6500,
      carbonSavings: 150,
      waterSavings: 4500,
      feasibility: 94,
      votes: 18,
      voted: false,
      status: 'APPROVED',
      submittedBy: 'priya.nair@greengrid.org',
      date: '2026-07-05',
      timeline: 6
    },
    {
      id: 3,
      title: 'AI Smart Ventilation Grid',
      description: 'Deploy real-time ventilation controls linked to occupancy sensors to trim idle compressor runtimes.',
      category: 'Energy Efficiency',
      cost: 12000,
      annualSavings: 4000,
      carbonSavings: 380,
      waterSavings: 0,
      feasibility: 88,
      votes: 31,
      voted: false,
      status: 'SUBMITTED',
      submittedBy: 'arjun.patel@steelcorp.com',
      date: '2026-07-09',
      timeline: 4
    },
    {
      id: 4,
      title: 'Zero-Waste Bio-Digester',
      description: 'Convert cafeteria organic scrap and landscape clippings into localized methane cooking fuel.',
      category: 'Waste Reduction',
      cost: 8500,
      annualSavings: 2800,
      carbonSavings: 95,
      waterSavings: 200,
      feasibility: 76,
      votes: 9,
      voted: false,
      status: 'SUBMITTED',
      submittedBy: 'staff.greenco@greenco.org',
      date: '2026-07-02',
      timeline: 3
    },
    {
      id: 5,
      title: 'Roof-Mounted Solar Concentrators',
      description: 'Install reflective parabolic troughs on warehouse roofs to directly generate industrial process steam.',
      category: 'Energy Efficiency',
      cost: 65000,
      annualSavings: 22000,
      carbonSavings: 1850,
      waterSavings: 0,
      feasibility: 68,
      votes: 42,
      voted: false,
      status: 'SUBMITTED',
      submittedBy: 'amit.verma@solartech.com',
      date: '2026-07-10',
      timeline: 18
    }
  ])

  // Lab recent activities timeline feed
  const [activities, setActivities] = useState([
    { id: 1, type: 'SUBMIT', user: 'Amit Verma', target: 'Roof-Mounted Solar Concentrators', time: '2 hours ago' },
    { id: 2, type: 'VOTE', user: 'Sanjay Sen', target: 'AI Smart Ventilation Grid', time: '4 hours ago' },
    { id: 3, type: 'APPROVE', user: 'Sustainability Coordinator', target: 'Rainwater Retention & Cooling Loop', time: '1 day ago' },
    { id: 4, type: 'SUBMIT', user: 'Arjun Patel', target: 'AI Smart Ventilation Grid', time: '1 day ago' },
    { id: 5, type: 'APPROVE', user: 'Sustainability Coordinator', target: 'Green Hydrogen Furnace Blend', time: '2 days ago' }
  ])

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // New Idea form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Carbon Reduction')
  const [newCost, setNewCost] = useState('')
  const [newSavings, setNewSavings] = useState('')
  const [newCarbon, setNewCarbon] = useState('')
  const [newWater, setNewWater] = useState('')
  const [newTimeline, setNewTimeline] = useState('')

  // Simulated chart data: Projected cumulative carbon savings trajectory
  const chartData = [
    { month: 'Jul 26', baseline: 0, projected: 1350 },
    { month: 'Aug 26', baseline: 0, projected: 1550 },
    { month: 'Sep 26', baseline: 0, projected: 1900 },
    { month: 'Oct 26', baseline: 0, projected: 2450 },
    { month: 'Nov 26', baseline: 0, projected: 3100 },
    { month: 'Dec 26', baseline: 0, projected: 3880 }
  ]

  // Category breakdown chart data
  const categoryData = [
    { name: 'Carbon', count: ideas.filter(i => i.category === 'Carbon Reduction').length, fill: '#ef4444' },
    { name: 'Water', count: ideas.filter(i => i.category === 'Water Conservation').length, fill: '#06b6d4' },
    { name: 'Energy', count: ideas.filter(i => i.category === 'Energy Efficiency').length, fill: '#eab308' },
    { name: 'Waste', count: ideas.filter(i => i.category === 'Waste Reduction').length, fill: '#a855f7' }
  ]

  // Interactive feasibility score calculator
  const calcFeasibility = (cost) => {
    if (!cost) return 85
    const numericCost = parseFloat(cost)
    return Math.max(45, Math.min(98, Math.round(95 - (numericCost / 1200))))
  }

  // Handle idea submission
  const handleAddIdea = (e) => {
    e.preventDefault()
    if (!newTitle || !newDesc || !newCost) {
      toast.error('Please enter title, description, and budget cost.')
      return
    }

    const costVal = parseFloat(newCost) || 0
    const savingsVal = parseFloat(newSavings) || 0
    const carbonVal = parseFloat(newCarbon) || 0

    const newIdea = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      cost: costVal,
      annualSavings: savingsVal,
      carbonSavings: carbonVal,
      waterSavings: parseFloat(newWater) || 0,
      feasibility: calcFeasibility(costVal),
      votes: 1,
      voted: true,
      status: 'SUBMITTED',
      submittedBy: user?.email || 'anonymous@greenco.org',
      date: new Date().toISOString().split('T')[0],
      timeline: parseInt(newTimeline) || 6
    }

    setIdeas([newIdea, ...ideas])
    setActivities([
      { id: Date.now(), type: 'SUBMIT', user: user?.firstName || 'Representative', target: newTitle, time: 'Just now' },
      ...activities
    ])

    toast.success('Innovation idea submitted successfully!')
    setIsModalOpen(false)

    // Reset Form
    setNewTitle('')
    setNewDesc('')
    setNewCategory('Carbon Reduction')
    setNewCost('')
    setNewSavings('')
    setNewCarbon('')
    setNewWater('')
    setNewTimeline('')
  }

  // Handle voting
  const handleVote = (id) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        const updatedVoted = !idea.voted
        const updatedVotes = updatedVoted ? idea.votes + 1 : idea.votes - 1

        if (updatedVoted) {
          setActivities(act => [
            { id: Date.now(), type: 'VOTE', user: user?.firstName || 'Representative', target: idea.title, time: 'Just now' },
            ...act
          ])
        }

        return {
          ...idea,
          votes: updatedVotes,
          voted: updatedVoted
        }
      }
      return idea
    }))
  }

  // Handle status approvals (Coordinators)
  const handleUpdateStatus = (id, newStatus) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        setActivities(act => [
          { id: Date.now(), type: newStatus === 'APPROVED' ? 'APPROVE' : 'REJECT', user: 'Sustainability Coordinator', target: idea.title, time: 'Just now' },
          ...act
        ])
        return { ...idea, status: newStatus }
      }
      return idea
    }))
    toast.success(`Idea status updated to ${newStatus}`)
  }

  // Aggregated calculations
  const approvedCount = ideas.filter(i => i.status === 'APPROVED').length
  const pendingCount = ideas.filter(i => i.status === 'SUBMITTED').length
  const totalCarbonSavings = ideas
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.carbonSavings, 0)
  const totalCostApproved = ideas
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.cost, 0)
  const averageFeasibility = ideas.length > 0 
    ? Math.round(ideas.reduce((sum, i) => sum + i.feasibility, 0) / ideas.length)
    : 0

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          idea.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || idea.category === selectedCategory
    const matchesStatus = !selectedStatus || idea.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="text-amber-500 fill-amber-50" size={24} />
            Sustainability Innovation Lab
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Review, submit, and collaborate on localized resource conservation ideas powered by AI feasibility forecasting.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/10 cursor-pointer"
        >
          <Plus size={14} />
          Submit Innovation Idea
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Review</p>
          <p className="text-lg font-black text-amber-600 mt-0.5">{pendingCount} Ideas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Projects</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">{approvedCount} Projects</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Est. Carbon Reduction</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{(totalCarbonSavings).toLocaleString()} MT</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg AI Feasibility</p>
          <p className="text-lg font-black text-purple-650 mt-0.5">{averageFeasibility}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Budget Capital</p>
          <p className="text-lg font-black text-blue-650 mt-0.5">${totalCostApproved.toLocaleString()}</p>
        </div>
      </div>

      {/* Two Column Layout: Main Content vs Pipeline & Activities Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left Column (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          
          {/* Recharts Trajectory & Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Carbon Savings Trajectory Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-6 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={14} className="text-emerald-500" />
                  Estimated Carbon Reduction Trajectory (MT CO2e)
                </h3>
                <p className="text-[10px] text-slate-400">Cumulative forecast from approved lab ideas over the next 6 months.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProjected)" name="Projected Reduction" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-4 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={14} className="text-indigo-500" />
                  Ideas by Category
                </h3>
                <p className="text-[10px] text-slate-400">Distribution of proposed ideas across sectors.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} width={45} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search submitted ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-semibold"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650"
              >
                <option value="">All Sectors</option>
                <option value="Carbon Reduction">Carbon</option>
                <option value="Water Conservation">Water</option>
                <option value="Energy Efficiency">Energy</option>
                <option value="Waste Reduction">Waste</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Reviewing</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Submitted Ideas List */}
          <div className="space-y-4">
            {filteredIdeas.length === 0 ? (
              <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-200 shadow-sm">
                <Lightbulb className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="font-semibold text-slate-700 text-xs">No ideas match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIdeas.map((idea) => {
                  const roiPercent = idea.cost > 0 ? Math.round((idea.annualSavings / idea.cost) * 100) : 0
                  return (
                    <div 
                      key={idea.id} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            idea.category === 'Carbon Reduction' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            idea.category === 'Water Conservation' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                            idea.category === 'Energy Efficiency' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {idea.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            idea.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' :
                            idea.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {idea.status === 'SUBMITTED' ? 'EVALUATION' : idea.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{idea.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{idea.description}</p>
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* Financial and Environmental metrics */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] font-medium text-slate-600">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">CapEx Cost</span>
                            <span className="text-slate-800 font-bold">${idea.cost.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">Savings / ROI</span>
                            <span className="text-slate-850 font-bold">${idea.annualSavings.toLocaleString()} ({roiPercent}%)</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">Carbon Impact</span>
                            <span className="text-rose-600 font-bold">-{idea.carbonSavings} MT CO2e</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">Water Recycle</span>
                            <span className="text-cyan-600 font-bold">{idea.waterSavings > 0 ? `${idea.waterSavings} kL` : 'N/A'}</span>
                          </div>
                        </div>

                        {/* AI feasibility and voting */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                            <Cpu size={12} className="text-purple-500 animate-pulse" />
                            <span>Feasibility: {idea.feasibility}%</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVote(idea.id)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors cursor-pointer text-[10px] font-bold ${
                                idea.voted 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                              }`}
                            >
                              <ThumbsUp size={10} className={idea.voted ? 'fill-emerald-600' : ''} />
                              <span>{idea.votes}</span>
                            </button>

                            {isCoordinator && idea.status === 'SUBMITTED' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateStatus(idea.id, 'APPROVED')}
                                  className="p-1 hover:bg-emerald-50 border border-slate-200 text-emerald-600 rounded cursor-pointer"
                                  title="Approve"
                                >
                                  <Check size={11} />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(idea.id, 'REJECTED')}
                                  className="p-1 hover:bg-rose-50 border border-slate-200 text-rose-600 rounded cursor-pointer"
                                  title="Reject"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (30% Sidebar) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Pipeline stages widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={15} className="text-emerald-600" />
                Innovation Pipeline Stages
              </h3>
              <p className="text-[10px] text-slate-400">Total ideas tracked in the pipeline.</p>
            </div>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Under Evaluation</span>
                  <span>{ideas.filter(i => i.status === 'SUBMITTED').length}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${(ideas.filter(i => i.status === 'SUBMITTED').length / ideas.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Approved Projects</span>
                  <span>{ideas.filter(i => i.status === 'APPROVED').length}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${(ideas.filter(i => i.status === 'APPROVED').length / ideas.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Rejected / On Hold</span>
                  <span>{ideas.filter(i => i.status === 'REJECTED').length}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-400 h-full" 
                    style={{ width: `${(ideas.filter(i => i.status === 'REJECTED').length / ideas.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Recent activities timeline widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={15} className="text-indigo-600" />
                Lab Event Logs
              </h3>
              <p className="text-[10px] text-slate-400">Activity trail from green representatives and coordinators.</p>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-2.5 pl-3.5 border-l border-slate-150 relative py-1 text-[11px]">
                  <span className={`absolute -left-[4px] top-2 w-2 h-2 rounded-full ${
                    act.type === 'SUBMIT' ? 'bg-amber-400' :
                    act.type === 'APPROVE' ? 'bg-emerald-500' :
                    act.type === 'VOTE' ? 'bg-blue-400' :
                    'bg-slate-400'
                  }`} />
                  <div className="space-y-0.5">
                    <p className="text-slate-800 font-bold">
                      {act.user}{' '}
                      <span className="font-normal text-slate-500">
                        {act.type === 'SUBMIT' ? 'proposed' : 
                         act.type === 'APPROVE' ? 'approved' :
                         act.type === 'VOTE' ? 'voted on' :
                         'modified'}
                      </span>{' '}
                      {act.target}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SUBMIT IDEA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="text-amber-500 fill-amber-50" size={18} />
                Propose Sustainability Idea
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Idea Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Smart Loop Cooling Reservoir"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Summarize the concept and expected sustainability impact..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600"
                  >
                    <option value="Carbon Reduction">Carbon Reduction</option>
                    <option value="Water Conservation">Water Conservation</option>
                    <option value="Energy Efficiency">Energy Efficiency</option>
                    <option value="Waste Reduction">Waste Reduction</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timeline (Months)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 6"
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Budget Cost ($)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-855"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Est. Savings ($/yr)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 5000"
                    value={newSavings}
                    onChange={(e) => setNewSavings(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-855"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Carbon Savings (MT)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 120"
                    value={newCarbon}
                    onChange={(e) => setNewCarbon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-855"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Water Recycled (kL)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 1000"
                    value={newWater}
                    onChange={(e) => setNewWater(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-855"
                  />
                </div>
              </div>

              {/* Dynamic calculations display */}
              {newCost && (
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 text-[10px] font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Payback Period:</span>
                    <span className="font-bold text-slate-800">
                      {newSavings > 0 ? (newCost / newSavings).toFixed(1) : 'N/A'} yrs
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-purple-700">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} className="animate-pulse" />
                      Simulated AI Feasibility:
                    </span>
                    <span className="font-black">{calcFeasibility(newCost)}%</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer select-none"
              >
                Submit Idea
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InnovationLabPage
