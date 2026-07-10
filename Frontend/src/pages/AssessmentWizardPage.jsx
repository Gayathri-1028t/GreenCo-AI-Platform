import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { toast } from 'react-toastify'
import { 
  Save, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Paperclip, 
  Trash, 
  UploadCloud,
  Building,
  Building2,
  Cpu,
  Droplet,
  Trash2,
  Flame,
  Sun,
  FileCheck,
  Eye,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

function AssessmentWizardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeStep, setActiveStep] = useState(0)

  const { register, handleSubmit, setValue, watch, trigger } = useForm({
    defaultValues: {
      'ENV-PAR-01': 0,
      'EN-EFF-01': 0,
      'WT-CON-02': 0,
      'WS-GEN-03': 0,
      'GHG-EM-01': 0,
      'RE-USE-01': 0
    }
  })

  // Watch form fields for real-time calculations
  const envVal = watch('ENV-PAR-01')
  const energyVal = watch('EN-EFF-01')
  const waterVal = watch('WT-CON-02')
  const wasteVal = watch('WS-GEN-03')
  const carbonVal = watch('GHG-EM-01')
  const renewableVal = watch('RE-USE-01')

  // 1. Fetch assessment summary
  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      const response = await api.get(`/assessments/${id}`)
      return response.data.data
    }
  })

  // 2. Fetch responses (and load them into react-hook-form)
  const { data: parameters, isLoading } = useQuery({
    queryKey: ['assessment-responses', id],
    queryFn: async () => {
      const response = await api.get(`/assessments/${id}/responses`)
      const list = response.data.data
      list.forEach(item => {
        setValue(item.parameterCode, item.enteredValue)
      })
      return list
    }
  })

  // 3. Fetch documents
  const { data: documents } = useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await api.get(`/documents/assessment/${id}`)
      return response.data.data
    }
  })

  // 4. Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (responsesList) => {
      return api.put(`/assessments/${id}/responses`, { responses: responsesList })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment'])
      queryClient.invalidateQueries(['assessment-responses'])
    },
    onError: () => {
      toast.error('Failed to auto-save draft')
    }
  })

  // 5. Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/assessments/${id}/submit`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment'])
      toast.success('Assessment submitted successfully!')
      navigate('/assessments')
    },
    onError: () => {
      toast.error('Failed to submit assessment')
    }
  })

  // 6. Upload document mutation
  const uploadDocMutation = useMutation({
    mutationFn: async ({ file, parameterCode }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('assessmentId', id)
      formData.append('parameterCode', parameterCode)
      return api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      toast.success('Document uploaded successfully!')
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to upload document.'
      toast.error(msg)
    }
  })

  // 7. Delete document mutation
  const deleteDocMutation = useMutation({
    mutationFn: async (docId) => {
      return api.delete(`/documents/${docId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      toast.success('Document removed')
    },
    onError: () => {
      toast.error('Failed to delete document')
    }
  })

  const getResponsesPayload = () => {
    return [
      { parameterCode: 'ENV-PAR-01', enteredValue: parseFloat(envVal) || 0 },
      { parameterCode: 'EN-EFF-01', enteredValue: parseFloat(energyVal) || 0 },
      { parameterCode: 'WT-CON-02', enteredValue: parseFloat(waterVal) || 0 },
      { parameterCode: 'WS-GEN-03', enteredValue: parseFloat(wasteVal) || 0 },
      { parameterCode: 'GHG-EM-01', enteredValue: parseFloat(carbonVal) || 0 },
      { parameterCode: 'RE-USE-01', enteredValue: parseFloat(renewableVal) || 0 }
    ]
  }

  // Auto save draft whenever step transitions or changes
  const handleAutoSave = () => {
    if (assessment && assessment.status === 'DRAFT') {
      saveDraftMutation.mutate(getResponsesPayload())
    }
  }

  const handleNextStep = async () => {
    // Validate fields before proceeding
    let valid = true
    if (activeStep === 2) valid = await trigger('ENV-PAR-01')
    if (activeStep === 3) valid = await trigger('EN-EFF-01')
    if (activeStep === 4) valid = await trigger('WT-CON-02')
    if (activeStep === 5) valid = await trigger('WS-GEN-03')
    if (activeStep === 6) valid = await trigger('GHG-EM-01')
    if (activeStep === 7) valid = await trigger('RE-USE-01')

    if (valid) {
      handleAutoSave()
      setActiveStep(prev => Math.min(prev + 1, 9))
    } else {
      toast.error('Please fix validation errors before proceeding.')
    }
  }

  const handlePrevStep = () => {
    handleAutoSave()
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleFileUpload = (e, parameterCode) => {
    const file = e.target.files[0]
    if (file) {
      uploadDocMutation.mutate({ file, parameterCode })
    }
  }

  const handleFinalSubmit = () => {
    if (window.confirm('Are you sure you want to submit this assessment? This will lock all values for auditor inspection.')) {
      submitAssessmentMutation.mutate()
    }
  }

  // Dynamic Real-time Calculations
  const baselineEnergy = 150000.0
  const baselineWater = 8000.0
  const baselineWaste = 300.0
  const baselineCarbon = 400.0

  const energyEfficiency = Math.max(0, Math.min(100, Math.round(((baselineEnergy - (parseFloat(energyVal) || 0)) / baselineEnergy) * 100)))
  const waterEfficiency = Math.max(0, Math.min(100, Math.round(((baselineWater - (parseFloat(waterVal) || 0)) / baselineWater) * 100)))
  const wasteEfficiency = Math.max(0, Math.min(100, Math.round(((baselineWaste - (parseFloat(wasteVal) || 0)) / baselineWaste) * 100)))
  const carbonReduction = Math.max(0, Math.min(100, Math.round(((baselineCarbon - (parseFloat(carbonVal) || 0)) / baselineCarbon) * 100)))
  
  const sustainabilityScore = Math.round((energyEfficiency + waterEfficiency + wasteEfficiency) / 3)
  const esgScore = Math.round(sustainabilityScore * 0.8 + (parseFloat(renewableVal) || 0) * 0.2)

  const steps = [
    { title: 'Company', desc: 'Selection' },
    { title: 'Factory', desc: 'Selection' },
    { title: 'Environment', desc: 'Parameters' },
    { title: 'Energy', desc: 'Consumption' },
    { title: 'Water', desc: 'Consumption' },
    { title: 'Waste', desc: 'Management' },
    { title: 'Carbon', desc: 'Emissions' },
    { title: 'Renewables', desc: 'Usage' },
    { title: 'Documents', desc: 'Upload' },
    { title: 'Review', desc: 'Submit' }
  ]

  if (isLoading || !assessment) {
    return <div className="text-center text-slate-500 p-8">Loading assessment wizard...</div>
  }

  const isLocked = assessment.status !== 'DRAFT'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessment Wizard</h1>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${isLocked ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'}`}>
              {assessment.status}
            </span>
          </div>
          <p className="mt-1 text-slate-500 text-sm">Plant: <span className="font-semibold text-slate-700">{assessment.factoryName}</span> | Version: {assessment.ratingVersion}</p>
        </div>

        <div className="flex items-center gap-3">
          {!isLocked && (
            <button
              onClick={handleAutoSave}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-350 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs shadow-sm transition-all gap-1.5"
            >
              <Save size={14} />
              Save Draft
            </button>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Lock size={14} />
              LOCKED FOR REVIEW
            </span>
          )}
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* Desktop Stepper */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-between">
            {steps.map((s, idx) => {
              const active = idx === activeStep
              const completed = idx < activeStep
              return (
                <button 
                  key={idx}
                  onClick={() => { handleAutoSave(); setActiveStep(idx); }}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all relative z-10 ${
                    active ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                    completed ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-slate-500 hidden md:block">{s.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="block md:hidden">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Step {activeStep + 1} of {steps.length}: <span className="text-emerald-600 font-extrabold uppercase">{steps[activeStep].title}</span></span>
            <span className="text-[10px] text-slate-450 font-bold">{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2.5 border border-slate-200/40 shadow-inner">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2-Column layout: Active step inputs vs. dynamic score engine sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-base uppercase tracking-wider">Step {activeStep + 1}: {steps[activeStep].title} {steps[activeStep].desc}</h2>
            <span className="text-xs text-slate-450 font-semibold">10-Step Wizard</span>
          </div>

          <form className="space-y-5">
            {/* Step 1: Company Selection */}
            {activeStep === 0 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Company details</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-lg">
                    {assessment.companyName?.substring(0, 2).toUpperCase() || 'CO'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{assessment.companyName || 'SteelCorp Industries'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Corporate Headquarters | Status: Approved</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Factory Selection */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Factory location details</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Name:</span>
                    <span className="font-bold text-slate-800">{assessment.factoryName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Rating Version:</span>
                    <span className="font-bold text-slate-800">{assessment.ratingVersion}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Environmental Parameters */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Environmental criteria score (points 0-50)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('ENV-PAR-01', { required: true, min: 0, max: 50 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Tracks compliance indicators, local environmental clearance certifications, and baseline assessments.</p>
              </div>
            )}

            {/* Step 4: Energy Consumption */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Annual electricity consumption (kWh)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('EN-EFF-01', { required: true, min: 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-semibold text-slate-400">
                  ⚡ Factory electricity baseline: <strong className="text-slate-600">{baselineEnergy} kWh</strong>
                </div>
              </div>
            )}

            {/* Step 5: Water Consumption */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Annual water consumption (kL)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('WT-CON-02', { required: true, min: 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-semibold text-slate-400">
                  💧 Factory water baseline: <strong className="text-slate-600">{baselineWater} kL</strong>
                </div>
              </div>
            )}

            {/* Step 6: Waste Management */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Annual solid waste generated (MT)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('WS-GEN-03', { required: true, min: 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-semibold text-slate-400">
                  🗑️ Factory solid waste baseline: <strong className="text-slate-600">{baselineWaste} MT</strong>
                </div>
              </div>
            )}

            {/* Step 7: Carbon Emissions */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Total CO2 emissions output (MT)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('GHG-EM-01', { required: true, min: 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-semibold text-slate-400">
                  🍃 Carbon baseline: <strong className="text-slate-600">{baselineCarbon} MT</strong>
                </div>
              </div>
            )}

            {/* Step 8: Renewable Energy */}
            {activeStep === 7 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Renewable energy capacity ratio (%)</label>
                  <input
                    type="number"
                    disabled={isLocked}
                    {...register('RE-USE-01', { required: true, min: 0, max: 100 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>
            )}

            {/* Step 9: Documents Upload */}
            {activeStep === 8 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attach audit verification evidence</p>
                
                {!isLocked && (
                  <div className="flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 transition-all relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileUpload(e, 'ENV-PAR-01')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-1.5 text-center text-slate-500 text-xs">
                      <UploadCloud size={24} className="text-slate-450" />
                      <p><span className="font-bold text-emerald-600">Click to upload</span> or drag and drop</p>
                      <p className="text-[10px] text-slate-400">PDF, JPEG, or PNG up to 25MB</p>
                    </div>
                  </div>
                )}

                {documents && documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center space-x-2.5">
                          <Paperclip size={14} className="text-emerald-600" />
                          <span className="text-slate-800">{doc.fileName}</span>
                        </div>
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => deleteDocMutation.mutate(doc.id)}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 10: Review & Submit */}
            {activeStep === 9 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Confirm submission details</p>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-700">
                  <p>Environmental criteria: <strong className="text-slate-900">{envVal}</strong></p>
                  <p>Electricity consumption: <strong className="text-slate-900">{energyVal} kWh</strong></p>
                  <p>Water consumption: <strong className="text-slate-900">{waterVal} kL</strong></p>
                  <p>Waste generated: <strong className="text-slate-900">{wasteVal} MT</strong></p>
                  <p>Carbon emissions: <strong className="text-slate-900">{carbonVal} MT</strong></p>
                  <p>Renewable energy ratio: <strong className="text-slate-900">{renewableVal}%</strong></p>
                </div>

                {!isLocked && (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={16} />
                    Submit Final Rating
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Nav Controls */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={14} />
              Previous Step
            </button>

            <button
              onClick={activeStep === 9 ? handleFinalSubmit : handleNextStep}
              className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {activeStep === 9 ? 'Submit Rating' : 'Next Step'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Score Engine Sidebar Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
              <Zap size={16} className="text-emerald-600" />
              Dynamic Score Engine
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ESG Score</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{esgScore || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sustain Index</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{sustainabilityScore || 0}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Red. %</span>
                <span className="text-lg font-black text-rose-600 mt-1 block">{carbonReduction || 0}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Water Eff.</span>
                <span className="text-lg font-black text-cyan-600 mt-1 block">{waterEfficiency || 0}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Energy Eff.</span>
                <span className="text-lg font-black text-blue-600 mt-1 block">{energyEfficiency || 0}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Waste Eff.</span>
                <span className="text-lg font-black text-purple-600 mt-1 block">{wasteEfficiency || 0}%</span>
              </div>
            </div>
            
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider text-center border-t border-slate-100 pt-3">Updates dynamically in real time</p>
          </div>

          {/* AI Insights & Alerts Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={16} className="text-emerald-600" />
              Real-time AI Insights
            </h3>

            <div className="space-y-3">
              {(parseFloat(carbonVal) > 500) && (
                <div className="p-3 rounded-xl border border-rose-100 bg-rose-50/50 flex items-start gap-2">
                  <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] font-bold text-rose-800">High Carbon Emission Alert</p>
                    <p className="text-[9px] text-rose-700 leading-normal mt-0.5">Carbon emissions exceed 500 tons. Shift boiler loads to solar grids.</p>
                  </div>
                </div>
              )}

              {(parseFloat(waterVal) > 6000) && (
                <div className="p-3 rounded-xl border border-cyan-100 bg-cyan-50/50 flex items-start gap-2">
                  <Activity className="text-cyan-600 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] font-bold text-cyan-800">Water Saving Suggestion</p>
                    <p className="text-[9px] text-cyan-700 leading-normal mt-0.5">Condensate water looping recycling can reduce kl consumption by 15%.</p>
                  </div>
                </div>
              )}

              {(parseFloat(renewableVal) < 20) && (
                <div className="p-3 rounded-xl border border-purple-100 bg-purple-50/50 flex items-start gap-2">
                  <TrendingUp className="text-purple-600 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] font-bold text-purple-800">Renewable Opportunity</p>
                    <p className="text-[9px] text-purple-700 leading-normal mt-0.5">Renewable ratio is under 20%. Expand rooftop panel array to hit next level.</p>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-2">
                <FileCheck className="text-emerald-600 shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-[10px] font-bold text-emerald-800">Compliance Improvement</p>
                  <p className="text-[9px] text-emerald-700 leading-normal mt-0.5">Attach solid waste disposal logs in Step 9 to avoid audit flags.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentWizardPage
