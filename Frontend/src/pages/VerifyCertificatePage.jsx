import { useState } from 'react'
import api from '../services/api'
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Building2, 
  MapPin, 
  Award, 
  Calendar,
  Lock,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

function VerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!certNumber.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Direct call to public endpoint
      const response = await api.get(`/certificates/verify/${certNumber.trim()}`)
      setResult(response.data.data)
    } catch (err) {
      console.error(err)
      setError('Verification Failed: No certificate matching this serial number could be found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand */}
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl mx-auto border-2 border-emerald-500">
            GC
          </div>
          <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900 uppercase">GreenCo Certification Registry</h2>
          <p className="mt-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">Public Verification Gateway</p>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Certificate Serial Code</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  required
                  placeholder="E.g. GC-2026-38492"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              {loading ? 'Verifying...' : 'Query Blockchain Registry'}
            </button>
          </form>

          {/* Error View */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-650 flex items-start gap-3">
              <ShieldAlert className="shrink-0 mt-0.5" size={18} />
              <div className="text-[11px] font-semibold leading-normal">{error}</div>
            </div>
          )}

          {/* Success Result View */}
          {result && (
            <div className="space-y-5 border-t border-slate-100 pt-5">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                result.status === 'ACTIVE' 
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                  : 'border-rose-200 bg-rose-50 text-rose-650'
              }`}>
                {result.status === 'ACTIVE' ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Certificate {result.status === 'ACTIVE' ? 'Valid' : result.status === 'EXPIRED' ? 'Expired' : 'Revoked'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Verified on-chain ledger records.</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Building2 size={14} className="text-slate-500" />
                  <span className="font-bold text-slate-800">{result.companyName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="font-semibold text-slate-700">{result.factoryName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={14} className="text-slate-500" />
                  <span className="font-bold text-slate-800">ESG Level: {result.ratingLevel} ({result.scoreAchieved?.toFixed(1)} pts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span>Validity: {result.issueDate} to {result.expiryDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-bold uppercase tracking-wider">
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 font-semibold uppercase tracking-widest">
        &copy; 2026 GreenCo Inc. All rights reserved.
      </div>
    </div>
  )
}

export default VerifyCertificatePage
