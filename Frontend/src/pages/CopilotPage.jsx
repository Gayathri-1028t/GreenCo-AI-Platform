import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { 
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Activity,
  Send,
  MessageSquare,
  Building,
  CheckCircle,
  BarChart2,
  ShieldCheck,
  Building2,
  Loader2,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts'
import { toast } from 'react-toastify'

function CopilotPage() {
  const { user } = useAuthStore()
  const [selectedFactoryId, setSelectedFactoryId] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hello! I am your Enterprise AI Sustainability Copilot. Ask me about ESG scores, carbon emissions, pending audits, or factory compliance improvement targets.' }
  ])

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch factories list
  const { data: factories, isLoading: isFactoriesLoading } = useQuery({
    queryKey: ['factories-copilot'],
    queryFn: async () => {
      const response = await api.get('/factories', { params: { size: 100 } })
      return response.data?.data?.content || []
    }
  })

  // Set default factory selection
  useEffect(() => {
    if (Array.isArray(factories) && factories.length > 0 && !selectedFactoryId) {
      setSelectedFactoryId(factories[0].id.toString())
    }
  }, [factories, selectedFactoryId])

  const activeFactoryId = selectedFactoryId || (Array.isArray(factories) && factories.length > 0 ? factories[0].id.toString() : '')

  // 2. Fetch copilot analysis for the active factory
  const { data: copilotData, isLoading: isCopilotLoading, isRefetching } = useQuery({
    queryKey: ['copilot', activeFactoryId],
    queryFn: async () => {
      const response = await api.get(`/copilot/factory/${activeFactoryId}`)
      return response.data?.data
    },
    enabled: !!activeFactoryId
  })

  const isLoading = isFactoriesLoading || isCopilotLoading

  // AI Chat message submit handler
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', text: chatInput }
    setChatHistory(prev => [...prev, userMessage])
    setChatInput('')

    // Generate deterministic AI answers based on the loaded copilotData
    setTimeout(() => {
      let reply = "I'm analyzing the sustainability ledger. Could you rephrase your question? I can assist you with carbon footprint metrics, ESG scoring, pending audits, or certification expiry ledgers."
      const cleanInput = chatInput.toLowerCase()

      if (copilotData) {
        if (cleanInput.includes('score') || cleanInput.includes('esg') || cleanInput.includes('readiness')) {
          reply = `📈 The plant currently scores **${copilotData.sustainabilityScore}/100** on overall sustainability with an AI Readiness indicator of **${copilotData.aiReadiness}%**.`
        } 
        else if (cleanInput.includes('carbon') || cleanInput.includes('emitter') || cleanInput.includes('emissions')) {
          reply = `💨 Carbon risk is classified as **${copilotData.carbonRisk}**. Jan-Jun actual emissions average **${Math.round(copilotData.carbonForecast?.reduce((acc, curr) => acc + curr.emissions, 0) / 6)} MT CO2eq** per month.`
        } 
        else if (cleanInput.includes('swot') || cleanInput.includes('strengths') || cleanInput.includes('weakness')) {
          reply = `📋 **SWOT Summary**:\n- **Strength**: ${copilotData.strengths?.[0] || 'N/A'}\n- **Weakness**: ${copilotData.weaknesses?.[0] || 'N/A'}`
        } 
        else if (cleanInput.includes('improvement') || cleanInput.includes('suggest') || cleanInput.includes('opportunity') || cleanInput.includes('recommend')) {
          reply = `💡 **AI Recommendations for this plant**:\n` + copilotData.recommendations?.map((r, idx) => `${idx + 1}. ${r}`).join('\n')
        }
      } else {
        reply = "The assessments database is currently being synced. Let me check back in a few seconds."
      }

      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }])
    }, 600)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-sm font-semibold text-slate-500">Initializing AI Copilot models...</p>
      </div>
    )
  }

  const activeFactory = Array.isArray(factories) ? factories.find(f => f.id.toString() === activeFactoryId) : null

  if (!activeFactoryId || !copilotData) {
    return (
      <div className="bg-slate-50 border border-slate-200 text-slate-650 p-8 rounded-2xl max-w-xl mx-auto my-12 text-center space-y-4">
        <AlertTriangle className="text-amber-500 mx-auto" size={40} />
        <h2 className="text-lg font-bold text-slate-800">No Asset Data Loaded</h2>
        <p className="text-xs font-semibold">Please ensure at least one factory asset is registered in the platform registry to configure AI forecasting models.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Sustainability Copilot</h1>
            <Sparkles size={20} className="text-emerald-500 shrink-0 animate-pulse" />
          </div>
          <p className="mt-1 text-slate-500 text-sm">Automated ESG forecasting, carbon reduction analytics, and interactive data insights.</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspect Plant:</label>
          {isRefetching && <Loader2 className="animate-spin text-emerald-600" size={14} />}
          <select
            value={selectedFactoryId}
            onChange={(e) => setSelectedFactoryId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            {factories?.map(fact => (
              <option key={fact.id} value={fact.id}>{fact.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Copilot Dashboard Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sustainability Score</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{copilotData.sustainabilityScore} / 100</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Readiness</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">{copilotData.aiReadiness}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carbon Risk Index</p>
          <p className="text-lg font-black text-rose-600 mt-0.5">{copilotData.carbonRisk}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ESG Rating</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{copilotData.esgRating}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Zero Progress</p>
          <p className="text-lg font-black text-purple-650 mt-0.5">{Math.round(copilotData.netZeroProgress)}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Index</p>
          <p className="text-lg font-black text-emerald-650 mt-0.5">{copilotData.complianceIndex}</p>
        </div>
      </div>

      {/* 2-Column: Predictive Recharts vs. SWOT Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recharts predictions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={16} className="text-emerald-500" />
              ESG score forecast & reduction paths
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">AI-generated projection models compared to actual historical performance metrics.</p>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={copilotData.esgForecast} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="actual" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
                <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeDasharray="4 4" fillOpacity={0.05} fill="#6366f1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">ESG Target (2028)</span>
              <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                {Math.round(copilotData.esgForecast?.[5]?.forecast || 90)} / 100
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Carbon Trend</span>
              <span className="text-sm font-black text-rose-600 mt-0.5 block">-24.2%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">AI Pass Probability</span>
              <span className="text-sm font-black text-blue-600 mt-0.5 block">99.1%</span>
            </div>
          </div>
        </div>

        {/* SWOT Recommendation Center */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 size={16} className="text-emerald-500" />
            AI SWOT Assessment & recommendations
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 space-y-1">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Strengths (Internal)</p>
              <ul className="text-[9px] text-emerald-700 space-y-1 font-semibold list-disc pl-3">
                {copilotData.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>

            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 space-y-1">
              <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Weaknesses (Internal)</p>
              <ul className="text-[9px] text-rose-700 space-y-1 font-semibold list-disc pl-3">
                {copilotData.weaknesses?.map((w, idx) => <li key={idx}>{w}</li>)}
              </ul>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-1">
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Opportunities (External)</p>
              <ul className="text-[9px] text-blue-700 space-y-1 font-semibold list-disc pl-3">
                {copilotData.opportunities?.map((o, idx) => <li key={idx}>{o}</li>)}
              </ul>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 space-y-1">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Risks (External)</p>
              <ul className="text-[9px] text-amber-700 space-y-1 font-semibold list-disc pl-3">
                {copilotData.risks?.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Executive Summary & Recommendation Actions vs. Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive summary details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Executive AI Summary report</h3>
          
          <div className="space-y-4 text-xs font-semibold text-slate-650 leading-relaxed">
            <p>{copilotData.aiSummary}</p>
            
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Priority Mitigations</p>
              
              {copilotData.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <p className="text-slate-800 font-bold">{rec}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Priority: {idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Chat assistant panel */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850 shadow-2xl flex flex-col justify-between h-[360px] text-white">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-850 pb-2">
              <MessageSquare className="text-emerald-400 shrink-0" size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Platform Copilot</span>
            </div>

            {/* Chat conversation history list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl text-[10px] leading-relaxed font-semibold max-w-[85%] ${
                  msg.role === 'assistant' 
                    ? 'bg-slate-900 border border-slate-850 text-slate-200 mr-auto' 
                    : 'bg-emerald-600 text-white ml-auto'
                }`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-850 pt-3 mt-3">
            <input
              type="text"
              placeholder="Ask Copilot..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CopilotPage
