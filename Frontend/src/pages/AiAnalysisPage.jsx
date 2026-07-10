import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Award, CheckCircle, AlertTriangle, Cpu, ArrowLeft } from 'lucide-react'

function AiAnalysisPage() {
  const { id } = useParams()

  // Fetch AI Gap recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations', id],
    queryFn: async () => {
      const response = await api.get(`/ai/assessments/${id}/recommendations`)
      return response.data.data
    }
  })

  // Fetch assessment details
  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      const response = await api.get(`/assessments/${id}`)
      return response.data.data
    }
  })

  if (isLoading || !assessment) {
    return <div className="text-center text-slate-500 p-8">Loading AI Gap analysis...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Gap Analysis &amp; Recommendations</h1>
              <Cpu className="text-emerald-500 shrink-0" size={24} />
            </div>
            <p className="mt-1 text-slate-500 text-sm">Plant: <span className="font-semibold text-slate-700">{assessment.factoryName}</span> | Current Score: {assessment.scoreAchieved} / 1000</p>
          </div>
        </div>
      </div>

      {/* Gap Analysis Summary */}
      {recommendations && recommendations.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-xl flex items-center gap-3">
          <CheckCircle className="text-green-600 shrink-0" size={24} />
          <div>
            <p className="font-semibold">Maximum Score Achieved</p>
            <p className="text-sm">Excellent! The plant has scored full points across all parameters. No gaps identified.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations?.map((item) => (
            <div key={item.pillarName} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Pillar Scorecard Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="text-emerald-600" size={20} />
                  <h2 className="font-bold text-slate-800">{item.pillarName}</h2>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500">Score: </span>
                  <span className="font-bold text-slate-850">{item.currentScore} / {item.maxScore}</span>
                  <span className="ml-3 inline-flex px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                    Gap: -{item.gapPoints} pts
                  </span>
                </div>
              </div>

              {/* Recommendations Advices List */}
              <div className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Mitigation Recommendations</h3>
                <ul className="space-y-3">
                  {item.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 bg-slate-55 p-3 rounded-lg border border-slate-100">
                      <AlertTriangle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-slate-700 font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AiAnalysisPage
