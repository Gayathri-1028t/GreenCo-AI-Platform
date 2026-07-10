import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FileDown, Calendar, Percent, Flame, Compass, RefreshCw } from 'lucide-react'

function ReportsPage() {
  const { user } = useAuthStore()
  const [selectedFactoryId, setSelectedFactoryId] = useState('')

  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch factories list
  const { data: factories } = useQuery({
    queryKey: ['report-factories', isManagement],
    queryFn: async () => {
      if (isManagement) {
        const response = await api.get('/factories')
        return response.data.data.content
      } else {
        const companyId = user?.companyId || 1
        const response = await api.get(`/factories/company/${companyId}`)
        return response.data.data
      }
    }
  })

  // Set default selected factory when factories are loaded
  useEffect(() => {
    if (factories && factories.length > 0 && !selectedFactoryId) {
      setSelectedFactoryId(factories[0].id)
    }
  }, [factories, selectedFactoryId])

  // 2. Fetch report metrics for selected factory
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['report-metrics', selectedFactoryId],
    queryFn: async () => {
      const response = await api.get(`/reports/facility/${selectedFactoryId}`)
      return response.data.data
    },
    enabled: !!selectedFactoryId
  })

  const handleExportCsv = () => {
    if (selectedFactoryId) {
      window.open(`http://localhost:8080/api/v1/reports/facility/${selectedFactoryId}/export`, '_blank')
    }
  }

  // Format Recharts comparative consumption data models
  const consumptionChartData = reportData ? [
    {
      name: 'Electricity (kWh x10)',
      Baseline: reportData.electricityBaselineKwh / 10,
      Actual: reportData.electricityActualKwh / 10
    },
    {
      name: 'Water (kL)',
      Baseline: reportData.waterBaselineKl,
      Actual: reportData.waterActualKl
    },
    {
      name: 'Waste (MT x10)',
      Baseline: reportData.wasteBaselineMt * 10,
      Actual: reportData.wasteActualMt * 10
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ESG Environmental Reports</h1>
          <p className="mt-1 text-slate-500 text-sm">Review baseline comparison summaries, carbon offsets metrics, and export auditing sheets.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector */}
          <select
            value={selectedFactoryId}
            onChange={(e) => setSelectedFactoryId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
          >
            {factories?.map(fact => (
              <option key={fact.id} value={fact.id}>{fact.name}</option>
            ))}
          </select>

          <button
            onClick={handleExportCsv}
            disabled={!selectedFactoryId}
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all gap-2 text-sm disabled:opacity-50"
          >
            <FileDown size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 p-8">Loading ESG report metrics...</div>
      ) : !reportData ? (
        <div className="bg-slate-100 p-8 rounded-xl text-center text-slate-500">
          No report parameters available for the selected plant.
        </div>
      ) : (
        <>
          {/* Executive ESG Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-800">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">CO2 Avoided (MT)</p>
                <p className="text-2xl font-bold text-slate-800">{reportData.co2EmissionsReducedMt} MT</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800">
                <Percent size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Electricity Saved</p>
                <p className="text-2xl font-bold text-slate-800">{reportData.electricitySavedPct}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Water Recycled</p>
                <p className="text-2xl font-bold text-slate-800">{reportData.waterSavedPct}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-800">
                <Compass size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Waste Coped</p>
                <p className="text-2xl font-bold text-slate-800">{reportData.wasteSavedPct}%</p>
              </div>
            </div>
          </div>

          {/* Comparative Graphs */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="text-slate-400" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Comparative Consumption (Baseline vs Actual)</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportsPage
