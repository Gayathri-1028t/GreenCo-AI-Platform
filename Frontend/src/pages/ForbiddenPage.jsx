import { Link } from 'react-router-dom'

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">403 - Forbidden</h1>
      <p className="mt-2 text-slate-600 text-center">You do not have permissions to access this dashboard.</p>
      <Link 
        to="/dashboard"
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}

export default ForbiddenPage
