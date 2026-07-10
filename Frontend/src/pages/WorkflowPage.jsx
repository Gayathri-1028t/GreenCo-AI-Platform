import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import { ArrowLeft, Clock, MessageSquare, ArrowRightLeft, Shield } from 'lucide-react'

const WORKFLOW_STEPS = [
  { code: 'DRAFT', label: 'Draft' },
  { code: 'SUBMITTED', label: 'Submitted' },
  { code: 'UNDER_TECHNICAL_REVIEW', label: 'Technical Review' },
  { code: 'SITE_AUDIT', label: 'Site Audit' },
  { code: 'APPROVED', label: 'Approved' }
]

function WorkflowPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const { register, handleSubmit, reset } = useForm()

  // Determine user permissions for transition control
  const isManagement = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR', 'ROLE_GREENCO_ASSESSOR'].includes(role)
  )

  // 1. Fetch assessment summary
  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      const response = await api.get(`/assessments/${id}`)
      return response.data.data
    }
  })

  // 2. Fetch transition history logs
  const { data: history, isLoading } = useQuery({
    queryKey: ['workflow-history', id],
    queryFn: async () => {
      const response = await api.get(`/workflow/assessments/${id}/history`)
      return response.data.data
    }
  })

  // 3. Transition mutation
  const transitionMutation = useMutation({
    mutationFn: async ({ toStatus, comment }) => {
      return api.post(`/workflow/assessments/${id}/transition`, { toStatus, comment })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment'])
      queryClient.invalidateQueries(['workflow-history'])
      toast.success('Assessment transitioned successfully!')
      reset()
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to transition assessment status'
      toast.error(msg)
    }
  })

  const onSubmit = (formData) => {
    transitionMutation.mutate({
      toStatus: formData.toStatus,
      comment: formData.comment
    })
  }

  if (isLoading || !assessment) {
    return <div className="text-center text-slate-500 p-8">Loading workflow history...</div>
  }

  // Determine available next states to control select choices dynamically
  const currentStatus = assessment.status
  let nextStates = []
  if (currentStatus === 'SUBMITTED') {
    nextStates = [{ code: 'UNDER_TECHNICAL_REVIEW', label: 'Technical Review' }]
  } else if (currentStatus === 'UNDER_TECHNICAL_REVIEW') {
    nextStates = [{ code: 'SITE_AUDIT', label: 'Site Audit' }]
  } else if (currentStatus === 'SITE_AUDIT') {
    nextStates = [
      { code: 'APPROVED', label: 'Approve & Certify' },
      { code: 'REJECTED', label: 'Reject Application' }
    ]
  }

  const activeStepIndex = WORKFLOW_STEPS.findIndex(s => s.code === currentStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflow State Tracker</h1>
            <p className="mt-1 text-slate-500 text-sm">Plant: <span className="font-semibold text-slate-700">{assessment.factoryName}</span> | Version: {assessment.ratingVersion}</p>
          </div>
        </div>
      </div>

      {/* State Machine Progress Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIndex || currentStatus === 'APPROVED'
            const isActive = step.code === currentStatus
            return (
              <div key={step.code} className="flex items-center flex-1 min-w-[120px]">
                <div className="flex flex-col items-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all border ${isCompleted ? 'bg-emerald-600 text-white border-emerald-600' : isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {idx + 1}
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>{step.label}</span>
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className={`hidden md:block h-0.5 flex-1 mx-2 ${idx < activeStepIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Log / History Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-slate-400" size={20} />
            Transition Audit Trail
          </h2>

          {history?.length === 0 ? (
            <div className="text-slate-400 text-sm p-4 text-center">No transitions logged yet.</div>
          ) : (
            <div className="relative border-l-2 border-slate-100 pl-6 space-y-8 ml-3">
              {history?.map((log) => (
                <div key={log.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-850">{log.assignedToName}</span>
                      <span className="text-slate-400">transitioned state</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold mt-0.5">
                      <span className="text-slate-500">{log.fromStatus}</span>
                      <span className="text-slate-300">&rarr;</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{log.toStatus}</span>
                    </div>
                    {log.comment && (
                      <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2">
                        <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{log.comment}</span>
                      </p>
                    )}
                    <span className="block text-[10px] text-slate-400 pt-1 font-semibold">
                      {new Date(log.transitionDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transition Controls Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 h-fit lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightLeft className="text-slate-400" size={20} />
            Transition Controller
          </h2>

          {isManagement && nextStates.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Select Target State</label>
                <select
                  {...register('toStatus', { required: 'Target state is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
                >
                  <option value="">Select state...</option>
                  {nextStates.map(st => (
                    <option key={st.code} value={st.code}>{st.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Review/Transition Comment</label>
                <textarea
                  rows={4}
                  {...register('comment')}
                  placeholder="Provide audit feedback, verification notes, or site audit comments..."
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={transitionMutation.isLoading}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
              >
                {transitionMutation.isLoading ? 'Transitioning...' : 'Transition Status'}
              </button>
            </form>
          ) : !isManagement ? (
            <div className="bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-lg flex items-start gap-3">
              <Shield className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm">Only GreenCo coordinators or assessors can transition states. Company operators can view history reports only.</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-lg flex items-start gap-3">
              <Shield className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm">The assessment has reached a terminal state ({currentStatus}) and cannot be transitioned further.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkflowPage
