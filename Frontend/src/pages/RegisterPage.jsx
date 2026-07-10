import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { 
  Building, 
  Mail, 
  Phone, 
  User, 
  Lock, 
  Globe, 
  CheckCircle, 
  Leaf, 
  ArrowLeft, 
  Globe2, 
  Layers, 
  FileText, 
  ShieldCheck,
  Loader2,
  LockKeyhole
} from 'lucide-react'

const INDUSTRIES = [
  'Metals & Metallurgy',
  'Cement & Building Materials',
  'Power & Renewable Energy',
  'Pharmaceuticals & Biotech',
  'Chemicals & Fertilizers',
  'Logistics & Transportation',
  'Textiles & Apparel',
  'Food Processing & Agro',
  'Electronics & Semiconductors',
  'Paper & Pulp',
  'Plastics & Polymers',
  'Automotive & Engineering'
]

function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredData, setRegisteredData] = useState(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      country: 'India',
      factoryCount: 1
    }
  })

  // Prefill SSO details if redirected
  useEffect(() => {
    const email = searchParams.get('email')
    const firstName = searchParams.get('firstName')
    const lastName = searchParams.get('lastName')
    if (email) {
      setValue('companyEmail', email)
    }
    if (firstName) {
      setValue('contactPerson', `${firstName} ${lastName || ''}`.trim())
    }
  }, [searchParams, setValue])

  // Password Watch for confirm validation
  const passwordVal = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // POST to backend public register endpoint
      await api.post('/auth/register', {
        companyName: data.companyName,
        industry: data.industry,
        companyRegistrationNumber: data.companyRegistrationNumber,
        gstNumber: data.gstNumber,
        companyEmail: data.companyEmail,
        phone: data.phone,
        website: data.website,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        factoryCount: parseInt(data.factoryCount, 10),
        contactPerson: data.contactPerson,
        designation: data.designation,
        password: data.password,
        confirmPassword: data.confirmPassword
      })

      // Perform automatic passwordless login (SSO style) using the password they typed
      const loginResponse = await api.post('/auth/login', {
        email: data.companyEmail,
        password: data.password
      })

      const { accessToken, user } = loginResponse.data.data
      setAuth(user, accessToken)

      toast.success('Enterprise account registered successfully!')
      setRegisteredData(data)
      setRegistrationSuccess(true)

      // Auto redirect to dashboard after 2.5 seconds to let the user see the registration success animation
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2500)

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please resolve form errors.'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Glow blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
              <Leaf className="text-emerald-500" size={18} />
            </div>
            <span className="font-mono text-sm font-black uppercase tracking-widest text-slate-850 dark:text-white">GreenCo</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-450 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>
          </div>
        </div>

        {registrationSuccess ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-3xl p-8 shadow-2xl text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto border-2 border-green-200 dark:border-green-800/40 shadow-lg animate-bounce">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-850 dark:text-white tracking-tight">Enterprise Profile Initialized</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Your GreenCo Enterprise Account has been created successfully.
              </p>
            </div>
             <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 transition-colors cursor-pointer"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/dashboard', { replace: true })}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-850 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-850 dark:text-white tracking-tight">Create Enterprise Account</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Register your manufacturing organization in the global sustainability register</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* SECTION A: Organization Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">1. Organization Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Company Name *</label>
                    <input 
                      type="text"
                      {...register('companyName', { required: 'Company Name is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="SteelCorp Industries"
                    />
                    {errors.companyName && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.companyName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Industry Sector *</label>
                    <select
                      {...register('industry', { required: 'Industry is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-350"
                    >
                      <option value="">Select Sector</option>
                      {INDUSTRIES.map((ind, i) => <option key={i} value={ind}>{ind}</option>)}
                    </select>
                    {errors.industry && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.industry.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Registration Number *</label>
                    <input 
                      type="text"
                      {...register('companyRegistrationNumber', { required: 'Registration Number is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="REG-99088"
                    />
                    {errors.companyRegistrationNumber && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.companyRegistrationNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">GST Number (India GSTIN) *</label>
                    <input 
                      type="text"
                      {...register('gstNumber', { 
                        required: 'GST Number is required',
                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                          message: 'Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)'
                        }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="22AAAAA0000A1Z5"
                    />
                    {errors.gstNumber && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.gstNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Corporate Email *</label>
                    <input 
                      type="email"
                      {...register('companyEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="contact@company.com"
                    />
                    {errors.companyEmail && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.companyEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Contact Phone *</label>
                    <input 
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\+?[0-9\s-]{10,15}$/,
                          message: 'Invalid phone format (e.g. +91 99000 88000)'
                        }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Corporate Website</label>
                    <input 
                      type="url"
                      {...register('website')}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="https://www.company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Country *</label>
                    <input 
                      type="text"
                      {...register('country', { required: 'Country is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="India"
                    />
                    {errors.country && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.country.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">State / Province</label>
                    <input 
                      type="text"
                      {...register('state')}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="Telangana"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">City</label>
                    <input 
                      type="text"
                      {...register('city')}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="Hyderabad"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Address Location</label>
                    <input 
                      type="text"
                      {...register('address')}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="Phase 1, Industrial Area"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Factory Count *</label>
                    <input 
                      type="number"
                      min="1"
                      {...register('factoryCount', { required: 'Factory count is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Representative Contact */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">2. Contact Representative</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Contact Person Name *</label>
                    <input 
                      type="text"
                      {...register('contactPerson', { required: 'Contact person is required' })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="Mohan Reddy"
                    />
                    {errors.contactPerson && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.contactPerson.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Representative Designation</label>
                    <input 
                      type="text"
                      {...register('designation')}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="Sustainability Director"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Security Password */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">3. Security Credentials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Login Password *</label>
                    <input 
                      type="password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        validate: {
                          hasUpper: v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                          hasDigit: v => /[0-9]/.test(v) || 'Password must contain at least one number'
                        }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">Confirm Password *</label>
                    <input 
                      type="password"
                      {...register('confirmPassword', { 
                        required: 'Confirm password is required',
                        validate: v => v === passwordVal || 'Passwords do not match'
                      })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-650 font-bold">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              {/* Accept Terms */}
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="accept" 
                  {...register('acceptTerms', { required: 'You must accept the terms & conditions' })}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 mt-0.5" 
                />
                <label htmlFor="accept" className="ml-2.5 text-xs font-semibold text-slate-500 dark:text-slate-450 cursor-pointer select-none">
                  I accept the <span onClick={(e) => { e.stopPropagation(); navigate('/terms') }} className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</span> and <span onClick={(e) => { e.stopPropagation(); navigate('/privacy-policy') }} className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</span>.
                </label>
              </div>
              {errors.acceptTerms && <p className="text-[10px] text-red-650 font-bold mt-1">{errors.acceptTerms.message}</p>}

              {/* Submit Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                  Register Organization
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default RegisterPage
