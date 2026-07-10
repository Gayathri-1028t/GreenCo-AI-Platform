import { useState } from 'react'
import { 
  TrendingUp, 
  Search, 
  DollarSign, 
  Percent, 
  PieChart, 
  Sliders, 
  Activity, 
  Cpu, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Sparkles
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
import { toast } from 'react-toastify'

export default function InvestmentPlannerPage() {
  const [budgetLimit, setBudgetLimit] = useState(120000)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock Investment Opportunities
  const [opportunities, setOpportunities] = useState([
    { id: 1, name: 'Blast Furnace Hydrogen burner swapout', cost: 65000, savings: 22000, carbonSaved: 1850, waterSaved: 0, priority: 92, selected: true },
    { id: 2, name: 'Smart cooling tower retention loops', cost: 18000, savings: 6500, carbonSaved: 150, waterSaved: 4500, priority: 88, selected: true },
    { id: 3, name: 'AI smart compressor load controller', cost: 12000, savings: 4000, carbonSaved: 380, waterSaved: 0, priority: 85, selected: true },
    { id: 4, name: 'Biomass organic food digester unit', cost: 8500, savings: 2800, carbonSaved: 95, waterSaved: 200, priority: 72, selected: true },
    { id: 5, name: 'Rooftop solar concentrator arrays', cost: 45000, savings: 13000, carbonSaved: 1100, waterSaved: 0, priority: 78, selected: false },
    { id: 6, name: 'Reverse osmosis wastewater recycling', cost: 35000, savings: 9800, carbonSaved: 80, waterSaved: 8000, priority: 80, selected: false }
  ])

  // Toggle selection
  const handleToggleSelect = (id) => {
    setOpportunities(prev => prev.map(op => {
      if (op.id === id) {
        // If cost exceeds budget when selecting, show warning
        const nextSelected = !op.selected
        if (nextSelected) {
          const currentTotalCost = prev.filter(o => o.selected).reduce((sum, o) => sum + o.cost, 0)
          if (currentTotalCost + op.cost > budgetLimit) {
            toast.warn('This project exceeds your allocated CapEx budget limit!')
          }
        }
        return { ...op, selected: nextSelected }
      }
      return op
    }))
  }

  // Totals calculations
  const selectedCost = opportunities.filter(o => o.selected).reduce((sum, o) => sum + o.cost, 0)
  const selectedSavings = opportunities.filter(o => o.selected).reduce((sum, o) => sum + o.savings, 0)
  const selectedCarbon = opportunities.filter(o => o.selected).reduce((sum, o) => sum + o.carbonSaved, 0)
  const selectedWater = opportunities.filter(o => o.selected).reduce((sum, o) => sum + o.waterSaved, 0)

  // Recharts forecast chart data
  const forecastData = [
    { year: '2026', baseline: 12000, optimized: 12000 - selectedCarbon * 0.2 },
    { year: '2027', baseline: 12100, optimized: 12100 - selectedCarbon * 0.4 },
    { year: '2028', baseline: 12200, optimized: 12200 - selectedCarbon * 0.6 },
    { year: '2029', baseline: 12250, optimized: 12250 - selectedCarbon * 0.8 },
    { year: '2030', baseline: 12300, optimized: 12300 - selectedCarbon }
  ]

  const filteredOps = opportunities.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="text-emerald-500 fill-emerald-50" size={24} />
            Sustainability Investment Planner
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Allocate green capital, evaluate ROI metrics, and project emission saving trajectories based on budget constraints.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CapEx Budget Limit</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">${budgetLimit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Allocation</p>
          <p className={`text-lg font-black mt-0.5 ${selectedCost > budgetLimit ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
            ${selectedCost.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Annual ROI</p>
          <p className="text-lg font-black text-indigo-650 mt-0.5">
            ${selectedSavings.toLocaleString()}/yr ({selectedCost > 0 ? Math.round((selectedSavings / selectedCost) * 100) : 0}%)
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forecasted Carbon Offset</p>
          <p className="text-lg font-black text-rose-600 mt-0.5">-{selectedCarbon.toLocaleString()} MT</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payback Period</p>
          <p className="text-lg font-black text-blue-600 mt-0.5">
            {selectedSavings > 0 ? (selectedCost / selectedSavings).toFixed(1) : 0} yrs
          </p>
        </div>
      </div>

      {/* Two Column Planner Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left Column (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          
          {/* Carbon Trajectory Forecast and Allocation breakdown charts */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* Emissions forecast chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-6 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-500" />
                  Emissions Reductions Forecast (MT CO2e)
                </h3>
                <p className="text-[10px] text-slate-400">Projected emissions curve comparing baseline vs planned CapEx optimization.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[5000, 13000]} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#optGrad)" name="Optimized Path" />
                    <Area type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5} fill="none" name="Business As Usual" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Allocation breakdown bar chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-4 flex flex-col h-[300px]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart size={14} className="text-indigo-500" />
                  Project CapEx Allocation ($)
                </h3>
                <p className="text-[10px] text-slate-400">Budget requirements per selected asset upgrade.</p>
              </div>
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={opportunities.filter(o => o.selected)} 
                    margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} tickFormatter={n => n.substring(0, 8) + '...'} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} name="Required CapEx ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Investment Opportunities Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={15} className="text-indigo-600" />
                  CapEx Priority Matrix
                </h3>
                <p className="text-[10px] text-slate-400">Select opportunities to automatically build your optimization plan.</p>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold w-48"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50/40">
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Select</th>
                    <th className="px-6 py-3">Opportunity Brief</th>
                    <th className="px-6 py-3 text-center">Cost</th>
                    <th className="px-6 py-3 text-center">Est. Savings</th>
                    <th className="px-6 py-3 text-center">Carbon Offset</th>
                    <th className="px-6 py-3 text-right">Priority Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredOps.map(op => (
                    <tr 
                      key={op.id} 
                      className={`hover:bg-slate-50/30 transition-colors cursor-pointer ${
                        op.selected ? 'bg-emerald-500/[0.02]' : ''
                      }`}
                      onClick={() => handleToggleSelect(op.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={op.selected}
                          onChange={() => {}} // toggles on row click
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-extrabold text-slate-800">{op.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{op.waterSaved > 0 ? `Water saved: ${op.waterSaved} kL` : 'Thermal efficiency upgrade'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-800">${op.cost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-emerald-650">${op.savings.toLocaleString()}/yr</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-rose-600">-{op.carbonSaved} MT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          op.priority >= 85 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {op.priority} Index
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column - Slider & AI recommendations (30%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Budget Limit Configurator slider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={15} className="text-indigo-650" />
                CapEx Cap Controls
              </h3>
              <p className="text-[10px] text-slate-400">Adjust total spending capacity to match Q3 budget limits.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Allocated Limit:</span>
                <span className="text-indigo-650 font-black">${budgetLimit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="250000"
                step="5000"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                <span>$50k Min</span>
                <span>$250k Max</span>
              </div>
            </div>
          </div>

          {/* AI optimization recommendations */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu size={18} className="text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">AI Portfolio Optimizer</h3>
                <p className="text-[9px] text-slate-400">Recommendations based on selected items.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-[11px] font-semibold text-slate-650 leading-relaxed">
              <div className="p-3 bg-purple-500/[0.03] border border-purple-500/10 rounded-xl space-y-1">
                <div className="flex items-center gap-1 text-purple-800 font-extrabold uppercase text-[9px]">
                  <Sparkles size={11} className="animate-pulse" />
                  Highest Carbon ROI
                </div>
                <p>
                  Focus allocation on <strong className="text-slate-800">Blast Furnace burner swapout</strong>. Gives a reduction of <strong className="text-rose-600">1,850 MT</strong> at a cost effectiveness of $35 per MT.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <div className="text-slate-500 font-extrabold uppercase text-[9px]">
                  Resource Balance
                </div>
                <p>
                  Add <strong className="text-slate-800">Smart cooling tower retention loops</strong> to balance emissions with fresh water conservation. Unlocks <strong className="text-cyan-600">4,500 kL</strong> recycling savings.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
