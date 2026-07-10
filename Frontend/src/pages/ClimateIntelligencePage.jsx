import { useState } from 'react'
import { 
  CloudRain, 
  Search, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  Map, 
  Activity, 
  Cpu, 
  Compass, 
  Droplet 
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
  Legend
} from 'recharts'

export default function ClimateIntelligencePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRisk, setSelectedRisk] = useState('')

  // Seed risk data per factory site
  const [sites, setSites] = useState([
    { id: 1, name: 'SteelCorp Industries Plant 1', location: 'Coimbatore, TN', aqIndex: 78, waterStress: 'HIGH', floodRisk: 'LOW', heatwaveRisk: 'MEDIUM', vulnerability: 62 },
    { id: 2, name: 'Chennai Metallurgy Works', location: 'Chennai, TN', aqIndex: 145, waterStress: 'EXTREME', floodRisk: 'HIGH', heatwaveRisk: 'HIGH', vulnerability: 84 },
    { id: 3, name: 'Coimbatore Textiles Block B', location: 'Coimbatore, TN', aqIndex: 52, waterStress: 'MEDIUM', floodRisk: 'MEDIUM', heatwaveRisk: 'LOW', vulnerability: 45 },
    { id: 4, name: 'GreenSteel Foundry', location: 'Tumkur, KA', aqIndex: 88, waterStress: 'HIGH', floodRisk: 'LOW', heatwaveRisk: 'HIGH', vulnerability: 58 },
    { id: 5, name: 'Salem Rolling Mills', location: 'Salem, TN', aqIndex: 110, waterStress: 'HIGH', floodRisk: 'LOW', heatwaveRisk: 'HIGH', vulnerability: 70 }
  ])

  // Climate Risk trend metrics 2026-2030 (AI Projection models)
  const trendData = [
    { year: '2026', temperatureRisk: 65, precipitationRisk: 42, waterScarcity: 60 },
    { year: '2027', temperatureRisk: 68, precipitationRisk: 48, waterScarcity: 64 },
    { year: '2028', temperatureRisk: 72, precipitationRisk: 40, waterScarcity: 70 },
    { year: '2029', temperatureRisk: 75, precipitationRisk: 55, waterScarcity: 73 },
    { year: '2030', temperatureRisk: 81, precipitationRisk: 62, waterScarcity: 79 }
  ]

  // Regional AQI chart data
  const aqiData = sites.map(s => ({
    name: s.name.substring(0, 12) + '...',
    AQI: s.aqIndex,
    Vulnerability: s.vulnerability
  }))

  const filteredSites = sites.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = !selectedRisk || 
                        s.waterStress === selectedRisk || 
                        s.floodRisk === selectedRisk || 
                        s.heatwaveRisk === selectedRisk
    return matchesSearch && matchesRisk
  })

  // Selected site for details / AI recommendations
  const [selectedSite, setSelectedSite] = useState(sites[0])

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CloudRain className="text-emerald-500 fill-emerald-50" size={24} />
            Climate Impact Intelligence
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Analyze weather hazards, air quality index metrics, and project resilience scores across manufacturing assets.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Vulnerability score</p>
          <p className="text-lg font-black text-rose-600 mt-0.5">63.8 / 100</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Water Stress Site</p>
          <p className="text-lg font-black text-slate-800 mt-0.5 truncate px-1">Chennai Works</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Peak AQI</p>
          <p className="text-lg font-black text-amber-600 mt-0.5">145 (Unhealthy)</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Risk Sites</p>
          <p className="text-lg font-black text-blue-600 mt-0.5">2 Assets</p>
        </div>
      </div>

      {/* Two Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left column: Risks comparison, Charts & Maps (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          
          {/* Recharts hazard trends */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* Risk Index Multi-Decade Line Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-6 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-500" />
                  Hazards Risk Projection (2026-2030)
                </h3>
                <p className="text-[10px] text-slate-400">AI prediction curve of thermal heatwave and scarcity indices.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scarcityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="waterScarcity" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#scarcityGrad)" name="Water Scarcity Risk" />
                    <Area type="monotone" dataKey="temperatureRisk" stroke="#f59e0b" strokeWidth={2} fill="none" name="Heat Index Risk" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AQI vs Vulnerability bar chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-4 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} className="text-blue-500" />
                  Air Quality & Vulnerability Comparison
                </h3>
                <p className="text-[10px] text-slate-400">Comparing AQI level vs regional exposure index.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aqiData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="AQI" fill="#3b82f6" radius={[4, 4, 0, 0]} name="AQI" />
                    <Bar dataKey="Vulnerability" fill="#a855f7" radius={[4, 4, 0, 0]} name="Vulnerability %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Search bar and Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search factory region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
              />
            </div>
            
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600"
            >
              <option value="">All Risk Levels</option>
              <option value="EXTREME">Extreme Scarcity</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Regional comparison table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50/40">
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3 text-center">AQI</th>
                    <th className="px-6 py-3 text-center">Water Stress</th>
                    <th className="px-6 py-3 text-center">Flood Hazard</th>
                    <th className="px-6 py-3 text-center">Heat Index</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredSites.map(s => (
                    <tr 
                      key={s.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        selectedSite.id === s.id ? 'bg-slate-50' : ''
                      }`}
                      onClick={() => setSelectedSite(s)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-extrabold text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.aqIndex > 100 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          s.aqIndex > 75 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {s.aqIndex} AQI
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          s.waterStress === 'EXTREME' ? 'bg-red-100 text-red-800' :
                          s.waterStress === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {s.waterStress}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-500">{s.floodRisk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-500">{s.heatwaveRisk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-emerald-600 font-bold">
                        Inspect
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: AI recommendations & Risk Heatmap widget (30%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* AI recommendations widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu size={18} className="text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">AI Resilience Engine</h3>
                <p className="text-[9px] text-slate-400">Mitigation plans for {selectedSite.name.substring(0,18)}...</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Water Stress mitigation</span>
                  <span className="text-rose-600">Priority High</span>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  Deploy dry-cooling condensers and localized stormwater recapture tanks. Cut overall groundwater draw by 40%.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Heatwave mitigation</span>
                  <span className="text-amber-600">Priority Medium</span>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  Apply cool-roof thermal coatings and optimize shift hours to match daytime peak grid heat loads.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Flood hazard plan</span>
                  <span className="text-slate-400">Priority Low</span>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  Establish retaining containment borders around Q3 flood line margins. Ensure fuel backups are raised 1m.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Risk Exposure Index Map Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={15} className="text-indigo-650" />
                Vulnerability Exposure Map
              </h3>
              <p className="text-[10px] text-slate-400">Comparing regional weather stress index mapping.</p>
            </div>

            <div className="space-y-3">
              {sites.map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[150px]">
                    <p className="font-bold text-slate-800 truncate">{s.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{s.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${s.vulnerability}%` }}></div>
                    </div>
                    <span className="font-black text-indigo-750 text-[10px]">{s.vulnerability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
