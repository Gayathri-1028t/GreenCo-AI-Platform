import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import { ArrowLeft, Clock, MessageSquare, ArrowRightLeft, Shield, Users, ListFilter, ClipboardCheck, CheckSquare, Calendar, Award } from 'lucide-react'

const WORKFLOW_STEPS = [
  { code: 'DRAFT', label: 'Draft' },
  { code: 'SUBMITTED', label: 'Submitted' },
  { code: 'TECHNICAL_REVIEW', label: 'Technical Review' },
  { code: 'SITE_AUDIT', label: 'Site Audit' },
  { code: 'MANAGEMENT_APPROVAL', label: 'Management Approval' },
  { code: 'CERTIFICATION', label: 'Certification' },
  { code: 'COMPLETED', label: 'Completed' }
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
  if (currentStatus === 'DRAFT') {
    nextStates = [{ code: 'SUBMITTED', label: 'Submitted' }]
  } else if (currentStatus === 'SUBMITTED') {
    nextStates = [{ code: 'TECHNICAL_REVIEW', label: 'Technical Review' }]
  } else if (currentStatus === 'TECHNICAL_REVIEW') {
    nextStates = [{ code: 'SITE_AUDIT', label: 'Site Audit' }]
  } else if (currentStatus === 'SITE_AUDIT') {
    nextStates = [{ code: 'MANAGEMENT_APPROVAL', label: 'Management Approval' }]
  } else if (currentStatus === 'MANAGEMENT_APPROVAL') {
    nextStates = [{ code: 'CERTIFICATION', label: 'Certification' }]
  } else if (currentStatus === 'CERTIFICATION') {
    nextStates = [
      { code: 'COMPLETED', label: 'Completed' },
      { code: 'REJECTED', label: 'Reject Application' }
    ]
  }

  const activeStepIndex = WORKFLOW_STEPS.findIndex(s => s.code === currentStatus)

  // Demo Transition Audit Trail (at least 15 logs)
  const demoTransitionTrail = [
    { dateTime: '10 Jul 2026 09:00', user: 'Anjali Sharma', role: 'Company Manager', fromState: 'None', toState: 'Draft', action: 'Initialize assessment', remarks: 'Started self-assessment framework.' },
    { dateTime: '10 Jul 2026 11:30', user: 'Anjali Sharma', role: 'Company Manager', fromState: 'Draft', toState: 'Draft', action: 'Upload initial energy log', remarks: 'Added Q2 power billing summaries.' },
    { dateTime: '11 Jul 2026 10:15', user: 'Anjali Sharma', role: 'Company Manager', fromState: 'Draft', toState: 'Draft', action: 'Water recycling log', remarks: 'Uploaded wastewater treatment efficiency logs.' },
    { dateTime: '12 Jul 2026 09:30', user: 'Ramesh Krishnan', role: 'System Admin', fromState: 'Draft', toState: 'Submitted', action: 'Submit application', remarks: 'Assessment submitted for review.' },
    { dateTime: '12 Jul 2026 10:15', user: 'Vijay Prasad', role: 'Technical Reviewer', fromState: 'Submitted', toState: 'Technical Review', action: 'Assign technical audit', remarks: 'Technical validation completed.' },
    { dateTime: '12 Jul 2026 10:30', user: 'Vijay Prasad', role: 'Technical Reviewer', fromState: 'Technical Review', toState: 'Technical Review', action: 'Verify energy audit', remarks: 'Energy efficiency documentation verified.' },
    { dateTime: '12 Jul 2026 11:15', user: 'Vijay Prasad', role: 'Technical Reviewer', fromState: 'Technical Review', toState: 'Technical Review', action: 'Verify carbon offsets', remarks: 'Carbon emission values validated.' },
    { dateTime: '12 Jul 2026 12:00', user: 'Vijay Prasad', role: 'Technical Reviewer', fromState: 'Technical Review', toState: 'Technical Review', action: 'Verify water logs', remarks: 'Water consumption records verified.' },
    { dateTime: '12 Jul 2026 14:00', user: 'Vijay Prasad', role: 'Technical Reviewer', fromState: 'Technical Review', toState: 'Technical Review', action: 'Verify waste diversion', remarks: 'Waste management evidence accepted.' },
    { dateTime: '12 Jul 2026 14:45', user: 'Satish Kumar', role: 'Lead Auditor', fromState: 'Technical Review', toState: 'Site Audit', action: 'Initiate field audit', remarks: 'Site audit scheduled.' },
    { dateTime: '12 Jul 2026 16:30', user: 'Satish Kumar', role: 'Lead Auditor', fromState: 'Site Audit', toState: 'Site Audit', action: 'Field emission check', remarks: 'Boiler combustion check completed.' },
    { dateTime: '12 Jul 2026 17:15', user: 'Satish Kumar', role: 'Lead Auditor', fromState: 'Site Audit', toState: 'Site Audit', action: 'Field waste audit', remarks: 'Hazardous store physical inspection passed.' },
    { dateTime: '13 Jul 2026 09:00', user: 'Priya Patel', role: 'Sustainability Manager', fromState: 'Site Audit', toState: 'Management Approval', action: 'Management signoff', remarks: 'Director dashboard signoff submitted.' },
    { dateTime: '13 Jul 2026 10:00', user: 'Priya Patel', role: 'Sustainability Manager', fromState: 'Management Approval', toState: 'Certification', action: 'Certificate generation', remarks: 'Assigned registration GC-2026-10182.' },
    { dateTime: '13 Jul 2026 11:20', user: 'Satish Kumar', role: 'Lead Auditor', fromState: 'Certification', toState: 'Completed', action: 'Close rating cycle', remarks: 'All compliance requirements satisfied.' }
  ]

  // Demo Timeline with timestamps
  const timelineStages = [
    { code: 'DRAFT', label: 'Draft', timestamp: '10 Jul 2026 09:00' },
    { code: 'SUBMITTED', label: 'Submitted', timestamp: '12 Jul 2026 09:30' },
    { code: 'TECHNICAL_REVIEW', label: 'Technical Review', timestamp: '12 Jul 2026 10:15' },
    { code: 'SITE_AUDIT', label: 'Site Audit', timestamp: '12 Jul 2026 14:45' },
    { code: 'MANAGEMENT_APPROVAL', label: 'Management Approval', timestamp: '13 Jul 2026 09:00' },
    { code: 'CERTIFICATION', label: 'Certification', timestamp: '13 Jul 2026 10:00' },
    { code: 'COMPLETED', label: 'Completed', timestamp: '13 Jul 2026 11:20' }
  ]

  // Demo Activity Feed (at least 20 activities)
  const activityFeed = [
    { time: '12 Jul 2026 20:30', user: 'Anjali Sharma', activity: 'Evidence uploaded', details: 'Q2 Energy Audit Report.pdf' },
    { time: '12 Jul 2026 20:15', user: 'System', activity: 'AI OCR completed', details: 'Parsed boiler efficiency log with 99.4% accuracy' },
    { time: '12 Jul 2026 19:45', user: 'System', activity: 'Carbon score recalculated', details: 'Scope 1 emissions updated to 1,240 MT' },
    { time: '12 Jul 2026 19:30', user: 'System', activity: 'Risk assessment generated', details: 'Evaluated factory risk level as Low' },
    { time: '12 Jul 2026 18:00', user: 'Vijay Prasad', activity: 'Document approved', details: 'Water management billing verification sheet' },
    { time: '12 Jul 2026 17:30', user: 'Satish Kumar', activity: 'Certificate generated', details: 'GC-2026-10182 (Gold Grade)' },
    { time: '12 Jul 2026 16:15', user: 'Anjali Sharma', activity: 'Evidence uploaded', details: 'Hazardous waste store photo.jpg' },
    { time: '12 Jul 2026 15:45', user: 'System', activity: 'AI OCR completed', details: 'Parsed water utility bills' },
    { time: '12 Jul 2026 15:10', user: 'System', activity: 'Carbon score recalculated', details: 'Adjusted for renewable solar offsets' },
    { time: '12 Jul 2026 14:00', user: 'Vijay Prasad', activity: 'Document approved', details: 'Renewable purchase agreement.pdf' },
    { time: '12 Jul 2026 13:30', user: 'Anjali Sharma', activity: 'Evidence uploaded', details: 'Municipal waste manifest sheet' },
    { time: '12 Jul 2026 12:45', user: 'System', activity: 'AI OCR completed', details: 'Parsed solar generator logs' },
    { time: '12 Jul 2026 11:30', user: 'System', activity: 'Risk assessment generated', details: 'Updated water dependency index' },
    { time: '12 Jul 2026 11:00', user: 'Vijay Prasad', activity: 'Document approved', details: 'Rainwater harvesting blueprint' },
    { time: '12 Jul 2026 10:15', user: 'Anjali Sharma', activity: 'Evidence uploaded', details: 'Stack emission audit checklist' },
    { time: '12 Jul 2026 09:30', user: 'System', activity: 'Carbon score recalculated', details: 'Fugitive gas correction applied' },
    { time: '12 Jul 2026 09:00', user: 'Vijay Prasad', activity: 'Document approved', details: 'Furnace insulation certificate' },
    { time: '11 Jul 2026 17:00', user: 'Anjali Sharma', activity: 'Evidence uploaded', details: 'Employee safety training log' },
    { time: '11 Jul 2026 16:30', user: 'System', activity: 'AI OCR completed', details: 'Parsed training attendance sheets' },
    { time: '11 Jul 2026 15:00', user: 'Vijay Prasad', activity: 'Document approved', details: 'ISO 14001 certification copy' }
  ]

  const getPreviousState = (status) => {
    switch (status) {
      case 'DRAFT': return 'None';
      case 'SUBMITTED': return 'Draft';
      case 'TECHNICAL_REVIEW': return 'Submitted';
      case 'SITE_AUDIT': return 'Technical Review';
      case 'MANAGEMENT_APPROVAL': return 'Site Audit';
      case 'CERTIFICATION': return 'Management Approval';
      case 'COMPLETED': return 'Certification';
      default: return 'Draft';
    }
  }

  const getResponsibleRole = (status) => {
    switch (status) {
      case 'DRAFT': return 'Company Manager';
      case 'SUBMITTED': return 'Sustainability Manager';
      case 'TECHNICAL_REVIEW': return 'Technical Reviewer';
      case 'SITE_AUDIT': return 'Lead Auditor';
      case 'MANAGEMENT_APPROVAL': return 'Sustainability Manager';
      case 'CERTIFICATION': return 'Lead Auditor';
      case 'COMPLETED': return 'Lead Auditor';
      default: return 'Lead Auditor';
    }
  }

  const getApprovalStatus = (status) => {
    if (status === 'COMPLETED' || status === 'APPROVED') return 'Approved & Closed';
    if (status === 'DRAFT') return 'Not Submitted';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending Review';
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflow State Tracker</h1>
            <p className="mt-1 text-slate-500 text-sm">Plant: <span className="font-semibold text-slate-700">{assessment.factoryName}</span> | Version: {assessment.ratingVersion}</p>
          </div>
        </div>
      </div>

      {/* State Machine Progress Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIndex || currentStatus === 'COMPLETED' || currentStatus === 'APPROVED'
            const isActive = step.code === currentStatus
            const stageInfo = timelineStages.find(s => s.code === step.code)
            const stageTime = stageInfo ? stageInfo.timestamp : ''
            return (
              <div key={step.code} className="flex items-center flex-1 min-w-[120px]">
                <div className="flex flex-col items-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${isCompleted ? 'bg-emerald-600 text-white border-emerald-600' : isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {idx + 1}
                  </div>
                  <span className={`mt-2 text-[11px] font-bold text-center ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
                  {stageTime && <span className="text-[9px] text-slate-400 mt-0.5 font-medium">{stageTime}</span>}
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className={`hidden lg:block h-0.5 flex-1 mx-1 ${idx < activeStepIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Audit Log & Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Transition Audit Trail */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="text-emerald-600" size={18} />
                Transition Audit Trail
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{demoTransitionTrail.length} records</span>
            </div>
            
            <div className="overflow-x-auto scrollbar-thin">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50/70">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Previous State</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">New State</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action Performed</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {demoTransitionTrail.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/45 text-xs transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-500">{log.dateTime}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-850">{log.user}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-500">{log.role}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{log.fromState}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-emerald-700">{log.toState}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 font-semibold">{log.action}</td>
                      <td className="px-4 py-3.5 text-slate-500 italic max-w-xs truncate" title={log.remarks}>{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ListFilter className="text-emerald-600" size={18} />
                Recent System Activities
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{activityFeed.length} logged</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
              {activityFeed.map((act, index) => (
                <div key={index} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-150 flex justify-between items-start gap-3 hover:shadow-sm transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-800">{act.activity}</span>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-semibold uppercase">{act.user}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{act.details}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controller & Users */}
        <div className="space-y-6">
          
          {/* Transition Controller */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ArrowRightLeft className="text-emerald-600" size={18} />
              Transition Controller
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Current State</span>
                <span className="font-bold text-slate-800">{currentStatus}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Next Possible State</span>
                <span className="font-bold text-emerald-700">{nextStates.map(s => s.label).join(' / ') || 'None (Completed)'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Previous State</span>
                <span className="font-bold text-slate-800">{getPreviousState(currentStatus)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Responsible Role</span>
                <span className="font-bold text-slate-800">{getResponsibleRole(currentStatus)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 col-span-2">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Last Modified Date</span>
                <span className="font-bold text-slate-800">12 Jul 2026 14:45</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 col-span-2">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Approval Status</span>
                <span className={`inline-flex px-2 py-0.5 rounded font-black text-[10px] uppercase border ${
                  getApprovalStatus(currentStatus).includes('Approved') 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>{getApprovalStatus(currentStatus)}</span>
              </div>
            </div>

            {isManagement && nextStates.length > 0 ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Select Target State</label>
                  <select
                    {...register('toStatus', { required: 'Target state is required' })}
                    className="mt-1.5 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  >
                    <option value="">Select state...</option>
                    {nextStates.map(st => (
                      <option key={st.code} value={st.code}>{st.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Review/Transition Comment</label>
                  <textarea
                    rows={3}
                    {...register('comment')}
                    placeholder="Provide audit feedback, verification notes, or site audit comments..."
                    className="mt-1.5 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={transitionMutation.isLoading}
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {transitionMutation.isLoading ? 'Transitioning...' : 'Transition Status'}
                </button>
              </form>
            ) : !isManagement ? (
              <div className="bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-lg flex items-start gap-3">
                <Shield className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] leading-relaxed">Only GreenCo coordinators or assessors can transition states. Company operators can view history reports only.</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-lg flex items-start gap-3">
                <Shield className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] leading-relaxed">The assessment has reached completed state ({currentStatus}) and cannot be transitioned further.</p>
              </div>
            )}
          </div>

          {/* Assigned Users */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="text-emerald-600" size={18} />
              Assigned Workflow Roles
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">System Admin</span>
                <span className="font-bold text-slate-850">Ramesh Krishnan</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Sustainability Manager</span>
                <span className="font-bold text-slate-850">Priya Patel</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Technical Reviewer</span>
                <span className="font-bold text-slate-850">Vijay Prasad</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Lead Auditor</span>
                <span className="font-bold text-slate-850">Satish Kumar</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Company Manager</span>
                <span className="font-bold text-slate-850">Anjali Sharma</span>
              </div>
            </div>
          </div>

          {/* Reviewer Comments Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="text-emerald-600" size={18} />
              Reviewer Comments
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700">Vijay Prasad</span>
                  <span className="text-[9px] text-slate-400 font-semibold">12 Jul 2026 10:30</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"Energy efficiency documentation verified."</p>
              </div>
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700">Vijay Prasad</span>
                  <span className="text-[9px] text-slate-400 font-semibold">12 Jul 2026 11:15</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"Carbon emission values validated."</p>
              </div>
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700">Vijay Prasad</span>
                  <span className="text-[9px] text-slate-400 font-semibold">12 Jul 2026 14:00</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"Waste management evidence accepted."</p>
              </div>
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700">Vijay Prasad</span>
                  <span className="text-[9px] text-slate-400 font-semibold">12 Jul 2026 12:00</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"Water consumption records verified."</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default WorkflowPage
