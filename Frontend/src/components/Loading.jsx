import { Loader2 } from 'lucide-react'

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-3">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
      <p className="text-slate-500 font-medium text-sm animate-pulse">Loading platform assets...</p>
    </div>
  )
}

export default Loading
