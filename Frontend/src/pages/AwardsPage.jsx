import { useState } from 'react'
import { 
  Trophy, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  UserCheck, 
  Flame, 
  Droplet, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  Star, 
  Medal, 
  Users,
  ChevronRight,
  TrendingDown
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'

function AwardsPage() {
  // Mock Leaderboard Data
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'SteelCorp Industries Plant 1', location: 'Tamil Nadu', score: 94.8, awards: 6, trend: 'up' },
    { rank: 2, name: 'Coimbatore Textiles Block B', location: 'Tamil Nadu', score: 91.2, awards: 4, trend: 'up' },
    { rank: 3, name: 'Chennai Metallurgy Works', location: 'Tamil Nadu', score: 88.5, awards: 3, trend: 'down' },
    { rank: 4, name: 'GreenSteel Foundry', location: 'Karnataka', score: 86.4, awards: 3, trend: 'up' },
    { rank: 5, name: 'Salem Rolling Mills', location: 'Tamil Nadu', score: 84.1, awards: 2, trend: 'up' }
  ])

  // Mock Badges Locker
  const badges = [
    { id: 1, title: 'Net-Zero Pioneer', desc: 'Achieved complete carbon offset verification.', count: 4, tier: 'Platinum', color: 'from-indigo-500 to-purple-600' },
    { id: 2, title: 'Water Recycling Elite', desc: 'Recycled over 85% of total site runoff.', count: 8, tier: 'Gold', color: 'from-blue-500 to-cyan-500' },
    { id: 3, title: 'Zero Landfill Champion', desc: 'Diverted 95% of industrial waste from landfill.', count: 6, tier: 'Gold', color: 'from-emerald-500 to-teal-500' },
    { id: 4, title: 'Renewable Powerhouse', desc: 'Ran factory entirely on solar concentrators.', count: 3, tier: 'Platinum', color: 'from-amber-500 to-orange-500' }
  ]

  // Historical Awards Log
  const [history, setHistory] = useState([
    { id: 1, title: 'Factory of the Month', recipient: 'SteelCorp Industries Plant 1', category: 'Efficiency', date: 'June 2026', notes: 'Recorded a 22% reduction in electricity demand via AI grid tuning.' },
    { id: 2, title: 'Green Employee', recipient: 'Amit Sharma (QA Lead)', category: 'Individual', date: 'June 2026', notes: 'Spearheaded cafeteria biogas waste digester layout.' },
    { id: 3, title: 'Water Champion', recipient: 'Coimbatore Textiles Block B', category: 'Resource', date: 'May 2026', notes: 'Successfully deployed smart stormwater retention loop.' },
    { id: 4, title: 'Carbon Hero', recipient: 'Chennai Metallurgy Works', category: 'Carbon', date: 'May 2026', notes: 'Introduced hydrogen-blend furnace burners.' }
  ])

  // Recharts Chart Data: Historical ESG Progression of top 3 factories
  const chartData = [
    { name: 'Q3 25', SteelCorp: 84, Coimbatore: 78, Chennai: 82 },
    { name: 'Q4 25', SteelCorp: 88, Coimbatore: 81, Chennai: 85 },
    { name: 'Q1 26', SteelCorp: 91, Coimbatore: 86, Chennai: 87 },
    { name: 'Q2 26', SteelCorp: 94.8, Coimbatore: 91.2, Chennai: 88.5 }
  ]

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="text-amber-500 fill-amber-50" size={24} />
            ESG Awards & Recognition
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Recognizing exceptional green practices, factory emission reductions, and individual environmental stewardship.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recognitions</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{history.length + 17} Awards</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge achievements</p>
          <p className="text-lg font-black text-indigo-600 mt-0.5">21 Badges</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Leaderboard Score</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">89.1 pts</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State Rep. Leaders</p>
          <p className="text-lg font-black text-blue-600 mt-0.5">Tamil Nadu</p>
        </div>
      </div>

      {/* Spotlight Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Factory of the Month */}
        <div className="bg-gradient-to-br from-amber-500/[0.03] to-amber-500/[0.08] border border-amber-250 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all duration-200">
          <div className="absolute right-3 top-3 text-amber-500/20 group-hover:scale-110 transition-transform">
            <Trophy size={48} className="fill-amber-500/10" />
          </div>
          <span className="text-[9px] bg-amber-500/15 text-amber-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Factory of Month</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-800 text-sm">SteelCorp Plant 1</h4>
            <p className="text-[10px] text-slate-500 font-medium">Coimbatore, Tamil Nadu</p>
          </div>
          <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Achieved a Q2 peak score of <span className="text-amber-600 font-bold">94.8 pts</span>.
          </div>
        </div>

        {/* Green Employee */}
        <div className="bg-gradient-to-br from-indigo-500/[0.03] to-indigo-500/[0.08] border border-indigo-250 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all duration-200">
          <div className="absolute right-3 top-3 text-indigo-500/20 group-hover:scale-110 transition-transform">
            <UserCheck size={48} />
          </div>
          <span className="text-[9px] bg-indigo-500/15 text-indigo-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Green Employee</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-800 text-sm">Amit Sharma</h4>
            <p className="text-[10px] text-slate-500 font-medium">QA Lead, Bangalore</p>
          </div>
          <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Proposed Bio-Digester project saving <span className="text-indigo-600 font-bold">95 MT Carbon</span>.
          </div>
        </div>

        {/* Carbon Hero */}
        <div className="bg-gradient-to-br from-rose-500/[0.03] to-rose-500/[0.08] border border-rose-250 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all duration-200">
          <div className="absolute right-3 top-3 text-rose-500/20 group-hover:scale-110 transition-transform">
            <Flame size={48} />
          </div>
          <span className="text-[9px] bg-rose-500/15 text-rose-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Carbon Hero</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-800 text-sm">Chennai Smelting</h4>
            <p className="text-[10px] text-slate-500 font-medium">Chennai, Tamil Nadu</p>
          </div>
          <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Cut overall scope 1 emissions by <span className="text-rose-600 font-bold">1,200 MT CO2e</span>.
          </div>
        </div>

        {/* Water Champion */}
        <div className="bg-gradient-to-br from-cyan-500/[0.03] to-cyan-500/[0.08] border border-cyan-250 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all duration-200">
          <div className="absolute right-3 top-3 text-cyan-500/20 group-hover:scale-110 transition-transform">
            <Droplet size={48} className="fill-cyan-500/10" />
          </div>
          <span className="text-[9px] bg-cyan-500/15 text-cyan-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Water Champion</span>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-800 text-sm">Coimbatore Textiles</h4>
            <p className="text-[10px] text-slate-500 font-medium">Coimbatore, Tamil Nadu</p>
          </div>
          <div className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Recycled <span className="text-cyan-600 font-bold">4,500 kL water</span> using retention loops.
          </div>
        </div>

      </div>

      {/* Main Content Grid: Leaderboard vs Historical progression */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left Column - Leaderboard & Chart (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          
          {/* Interactive Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Medal size={15} className="text-amber-500" />
                  National Factory ESG Leaderboard
                </h3>
                <p className="text-[10px] text-slate-400">Real-time ranking of manufacturing sites by audited sustainability compliance.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50/40">
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Rank</th>
                    <th className="px-6 py-3">Factory Asset</th>
                    <th className="px-6 py-3">State</th>
                    <th className="px-6 py-3 text-center">ESG Score</th>
                    <th className="px-6 py-3 text-center">Awards Count</th>
                    <th className="px-6 py-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {leaderboard.map(fac => (
                    <tr key={fac.rank} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-black ${
                          fac.rank === 1 ? 'bg-amber-100 text-amber-800' :
                          fac.rank === 2 ? 'bg-slate-200 text-slate-850' :
                          fac.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-50 text-slate-500'
                        }`}>
                          {fac.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-bold">{fac.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-[11px]">{fac.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-850 font-bold">{fac.score.toFixed(1)} pts</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-indigo-650 font-bold">{fac.awards} Badges</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          fac.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {fac.trend === 'up' ? '▲ Improving' : '▼ Decline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical ESG progression charts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col h-[300px]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={15} className="text-emerald-500" />
                ESG Score Progression Chart (Top 3 Factories)
              </h3>
              <p className="text-[10px] text-slate-400">Quarterly progression curves display audit improvements since Q3 2025.</p>
            </div>
            <div className="flex-1 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="SteelCorp" stroke="#f59e0b" strokeWidth={2.5} name="SteelCorp Plant 1" />
                  <Line type="monotone" dataKey="Coimbatore" stroke="#06b6d4" strokeWidth={2.5} name="Coimbatore Block B" />
                  <Line type="monotone" dataKey="Chennai" stroke="#a855f7" strokeWidth={2.5} name="Chennai Works" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column - Badges Locker & History (30%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Badge Locker Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award size={15} className="text-indigo-600" />
                Achievement Badge Locker
              </h3>
              <p className="text-[10px] text-slate-400">Gamified medals earned by factories for crossing resource limits.</p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {badges.map(bg => (
                <div 
                  key={bg.id} 
                  className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex flex-col justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <Star size={16} className="fill-emerald-600/10" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-[10.5px] leading-tight line-clamp-1">{bg.title}</h5>
                    <p className="text-[8px] text-slate-400 leading-tight mt-1 line-clamp-2">{bg.desc}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200/50 py-0.5 rounded mt-2 block">
                    {bg.count} Sites Locked
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* History log timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} className="text-indigo-650" />
                Awards Log Timeline
              </h3>
              <p className="text-[10px] text-slate-400">Recent corporate award citations.</p>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {history.map(item => (
                <div key={item.id} className="pl-3.5 border-l border-slate-250 relative py-1 text-[11px]">
                  <span className="absolute -left-[4.5px] top-2 w-2 h-2 rounded-full bg-amber-400" />
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>{item.title}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-slate-800 font-extrabold">{item.recipient}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">{item.notes}</p>
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

export default AwardsPage
