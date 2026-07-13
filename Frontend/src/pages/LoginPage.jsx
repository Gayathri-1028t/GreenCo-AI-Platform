import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, isTokenExpired } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import api from '../services/api'
import { 
  Sparkles, 
  Leaf, 
  Globe, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Lock, 
  ChevronRight, 
  Loader2,
  Accessibility,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu
} from 'lucide-react'

const TRANSLATIONS = {
  en: {
    welcome: 'Welcome Back',
    signin: 'Sign in to continue',
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    submitBtn: 'Sign In',
    loggingIn: 'Signing in...',
    newToGreenCo: 'New to GreenCo?',
    createAccount: 'Create Enterprise Account',
    googleText: 'Continue with Google',
    microsoftText: 'Continue with Microsoft',
    footerText: '© 2025 GreenCo Sustainability Platform',
    footerSub: 'Powered by AI | ESG | Carbon Intelligence',
    privacy: 'Privacy Policy',
    terms: 'Terms',
    support: 'Support',
    reqEmail: 'Email is required',
    reqPassword: 'Password is required'
  },
  ta: {
    welcome: 'மீண்டும் வருக',
    signin: 'தொடர உள்நுழைக',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    rememberMe: 'என்னை நினைவில் கொள்',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    submitBtn: 'உள்நுழைக',
    loggingIn: 'உள்நுழைகிறது...',
    newToGreenCo: 'கிரீன்கோவிற்கு புதியவரா?',
    createAccount: 'நிறுவன கணக்கை உருவாக்குங்கள்',
    googleText: 'கூகிள் மூலம் தொடரவும்',
    microsoftText: 'மைக்ரோசாப்ட் மூலம் தொடரவும்',
    footerText: '© 2025 கிரீன்கோ நிலைத்தன்மை தளம்',
    footerSub: 'AI | ESG | கார்பன் நுண்ணறிவு மூலம் இயக்கப்படுகிறது',
    privacy: 'தனியுரிமைக் கொள்கை',
    terms: 'விதிமுறைகள்',
    support: 'ஆதரவு',
    reqEmail: 'மின்னஞ்சல் முகவரி தேவை',
    reqPassword: 'கடவுச்சொல் தேவை'
  }
}

function LoginPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { setAuth, isAuthenticated, accessToken } = useAuthStore()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated and token is valid
  useEffect(() => {
    if (isAuthenticated && !isTokenExpired(accessToken)) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, accessToken, navigate])

  // State managers
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('base') // base, lg, xl
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ssoProvider, setSsoProvider] = useState(null) // 'google' or 'microsoft' or null
  const [typedTitle, setTypedTitle] = useState('')

  const t = TRANSLATIONS[language]

  // Typing animation on Mount
  const fullTitle = 'GreenCo Sustainability Intelligence Platform'
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.substring(0, index + 1))
      index++
      if (index >= fullTitle.length) {
        clearInterval(interval)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [])

  const DEMO_MODE = true

  // Auth POST submit
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    if (DEMO_MODE) {
      const storedPassword = localStorage.getItem('greenco_user_password') || 'AdminPass123!'
      if (data.email === 'admin@greenco.org' && data.password === storedPassword) {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
        const payload = btoa(JSON.stringify({
          sub: "admin@greenco.org",
          roles: ["ROLE_SUPER_ADMIN"],
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year
        }))
        const mockToken = `${header}.${payload}.mock_signature`
        const mockUser = {
          id: 1,
          email: "admin@greenco.org",
          firstName: "System",
          lastName: "Admin",
          roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
        }

        setAuth(mockUser, mockToken)
        toast.success('Successfully logged in!')
        navigate('/dashboard', { replace: true })
        setIsSubmitting(false)
        return
      } else {
        toast.error('Invalid username or password')
        setIsSubmitting(false)
        return
      }
    }

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      })

      const { accessToken, user } = response.data.data
      setAuth(user, accessToken)
      toast.success('Successfully logged in!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(serverMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // SSO Login simulator helpers
  const handleSSOSelect = async (type) => {
    let email = ''
    if (type === 'admin') {
      email = 'admin@greenco.org'
    } else if (type === 'manager') {
      email = 'factory@steelcorp.com'
    } else if (type === 'new') {
      email = ssoProvider === 'google' ? 'google.sso.user@gmail.com' : 'microsoft.sso.user@outlook.com'
    }

    const currentProvider = ssoProvider || 'sso'
    setSsoProvider(null)
    setIsSubmitting(true)

    if (DEMO_MODE && email === 'admin@greenco.org') {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
      const payload = btoa(JSON.stringify({
        sub: "admin@greenco.org",
        roles: ["ROLE_SUPER_ADMIN"],
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
      }))
      const mockToken = `${header}.${payload}.mock_signature`
      const mockUser = {
        id: 1,
        email: "admin@greenco.org",
        firstName: "System",
        lastName: "Admin",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
      }

      setAuth(mockUser, mockToken)
      toast.success('SSO Login successful!')
      navigate('/dashboard', { replace: true })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await api.post(`/auth/sso?email=${email}&provider=${currentProvider}`)
      const { accessToken, user } = response.data.data
      setAuth(user, accessToken)
      toast.success('SSO Login successful!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      if (type === 'new' || error.response?.status === 404) {
        const firstName = currentProvider === 'google' ? 'Google' : 'Microsoft'
        const lastName = 'SSO'
        toast.info('No existing SSO profile found. Redirecting to registration page...')
        navigate(`/register?prefill=true&email=${email}&firstName=${firstName}&lastName=${lastName}&provider=${currentProvider}`)
      } else {
        toast.error('SSO Authentication failed.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Accessibility Font Sizer
  const getFontSizeClass = (baseClass) => {
    if (fontSize === 'lg') {
      if (baseClass.includes('text-xs')) return baseClass.replace('text-xs', 'text-sm')
      if (baseClass.includes('text-sm')) return baseClass.replace('text-sm', 'text-base')
      if (baseClass.includes('text-base')) return baseClass.replace('text-base', 'text-lg')
      if (baseClass.includes('text-lg')) return baseClass.replace('text-lg', 'text-xl')
      if (baseClass.includes('text-xl')) return baseClass.replace('text-xl', 'text-2xl')
      if (baseClass.includes('text-2xl')) return baseClass.replace('text-2xl', 'text-3xl')
      if (baseClass.includes('text-3xl')) return baseClass.replace('text-3xl', 'text-4xl')
    }
    if (fontSize === 'xl') {
      if (baseClass.includes('text-xs')) return baseClass.replace('text-xs', 'text-base')
      if (baseClass.includes('text-sm')) return baseClass.replace('text-sm', 'text-lg')
      if (baseClass.includes('text-base')) return baseClass.replace('text-base', 'text-xl')
      if (baseClass.includes('text-lg')) return baseClass.replace('text-lg', 'text-2xl')
      if (baseClass.includes('text-xl')) return baseClass.replace('text-xl', 'text-3xl')
      if (baseClass.includes('text-2xl')) return baseClass.replace('text-2xl', 'text-4xl')
      if (baseClass.includes('text-3xl')) return baseClass.replace('text-3xl', 'text-5xl')
    }
    return baseClass
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Self-contained CSS animations */}
      <style>{`
        @keyframes floatLeaf {
          0% { transform: translateY(110vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-10vh) translateX(50px) rotate(360deg); opacity: 0; }
        }
        .animate-leaf-1 { animation: floatLeaf 15s linear infinite; left: 10%; }
        .animate-leaf-2 { animation: floatLeaf 18s linear infinite; left: 30%; animation-delay: 2s; }
        .animate-leaf-3 { animation: floatLeaf 12s linear infinite; left: 70%; animation-delay: 5s; }
        .animate-leaf-4 { animation: floatLeaf 20s linear infinite; left: 85%; animation-delay: 8s; }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-blob-1 { animation: floatBlob 12s ease-in-out infinite; }
        .animate-blob-2 { animation: floatBlob 15s ease-in-out infinite; animation-delay: 2s; }
      `}</style>

      {/* LEFT SIDE: SaaS Premium Hero (45%) */}
      <div className="hidden lg:flex lg:w-[43%] bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 text-white flex-col justify-between p-12 relative overflow-hidden shadow-2xl">
        
        {/* Background glow and floating leaves */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <Leaf size={14} className="absolute text-emerald-500/20 floating-leaf animate-leaf-1" />
          <Leaf size={18} className="absolute text-teal-400/20 floating-leaf animate-leaf-2" />
          <Leaf size={12} className="absolute text-emerald-400/15 floating-leaf animate-leaf-3" />
          <Leaf size={16} className="absolute text-green-500/20 floating-leaf animate-leaf-4" />
        </div>

        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
            <Leaf className="text-emerald-400" size={18} />
          </div>
          <span className="font-mono text-base font-extrabold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">GreenCo</span>
        </div>

        {/* Core Value Statement */}
        <div className="space-y-8 my-auto z-10 max-w-sm">
          <div className="space-y-4">
            <h1 className={getFontSizeClass("text-3xl font-black leading-tight tracking-tight min-h-[72px]")}>
              {typedTitle}
            </h1>
            <p className={getFontSizeClass("text-xs text-slate-350 leading-relaxed font-medium")}>
              AI-Powered ESG Rating, Carbon Intelligence &amp; Digital Certification Platform
            </p>
          </div>

          {/* Dynamic feature cards */}
          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {[
              { icon: Leaf, title: 'ESG Assessment', desc: 'Interactive modular compliance wizards', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { icon: Activity, title: 'Carbon Analytics', desc: 'Realtime Scope-1 & Scope-2 emission tracking', color: 'border-teal-500/20 bg-teal-500/5' },
              { icon: Building, title: 'Factory Sustainability', desc: 'Multi-plant resource consumption dashboards', color: 'border-indigo-500/20 bg-indigo-500/5' },
              { icon: Cpu, title: 'AI Sustainability Copilot', desc: 'SWOT recommendations & analytics forecasts', color: 'border-violet-500/20 bg-violet-500/5' }
            ].map((card, idx) => (
              <div key={idx} className={`flex items-start space-x-3.5 p-3 rounded-2xl border ${card.color} backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg`}>
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center mt-0.5 shadow-inner">
                  <card.icon size={14} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className={getFontSizeClass("text-xs font-bold text-slate-100")}>{card.title}</h4>
                  <p className={getFontSizeClass("text-[10px] text-slate-400 mt-0.5 font-medium")}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Side Footer */}
        <div className="flex justify-between items-center text-[10px] text-slate-450 z-10 border-t border-white/5 pt-4">
          <span className="font-semibold">{t.footerText}</span>
          <div className="space-x-3.5 font-bold">
            <span onClick={() => navigate('/privacy-policy')} className="hover:text-emerald-400 cursor-pointer">{t.privacy}</span>
            <span onClick={() => navigate('/terms')} className="hover:text-emerald-400 cursor-pointer">{t.terms}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Auth Container (55%) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        
        {/* Dynamic background blur blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/20 dark:bg-emerald-950/20 blur-3xl pointer-events-none animate-blob-1" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-200/20 dark:bg-teal-950/20 blur-3xl pointer-events-none animate-blob-2" />

        {/* Global Toolbar: Theme, Language, Accessibility */}
        <div className="flex justify-end items-center space-x-3 z-10 print:hidden">
          {/* Accessibility Font Toggle */}
          <button 
            onClick={() => setFontSize(f => f === 'base' ? 'lg' : f === 'lg' ? 'xl' : 'base')}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500 dark:text-slate-400 flex items-center gap-1"
            title="Toggle Accessibility Font Size"
          >
            <Accessibility size={15} />
            <span className="text-[9px] font-bold uppercase">{fontSize}</span>
          </button>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(lang => lang === 'en' ? 'ta' : 'en')}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
          >
            <Globe size={15} />
            <span className="text-[9px] font-bold uppercase">{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>

        {/* Central Authentication Card */}
        <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header Identity */}
            <div className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center space-x-2.5 mb-2">
                <Leaf className="text-emerald-500" size={24} />
                <span className="font-mono text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">GreenCo</span>
              </div>
              <h2 className={getFontSizeClass("text-xl font-black text-slate-800 dark:text-white tracking-tight")}>{t.welcome}</h2>
              <p className={getFontSizeClass("text-xs text-slate-400 dark:text-slate-550 font-semibold")}>{t.signin}</p>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={getFontSizeClass("block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1.5")}>
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input 
                    type="email"
                    {...register('email', { required: t.reqEmail })}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-white transition-all shadow-inner disabled:opacity-50"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-[10px] text-red-650 font-bold">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={getFontSizeClass("block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider")}>
                    {t.password}
                  </label>
                  <span 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {t.forgotPassword}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: t.reqPassword })}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-white transition-all shadow-inner disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-[10px] text-red-650 font-bold">{errors.password.message}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-850" 
                />
                <label htmlFor="remember" className={getFontSizeClass("ml-2 text-xs font-semibold text-slate-500 dark:text-slate-450 cursor-pointer select-none")}>
                  {t.rememberMe}
                </label>
              </div>

              {/* Authenticated Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer select-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{t.loggingIn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">Enterprise OAuth SSO</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Social Authentication buttons (Interactive SSO Selection) */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSsoProvider('google')}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-650 dark:text-slate-450 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.76 5.76 0 0 1 8.2 12.8a5.76 5.76 0 0 1 5.79-5.8 5.68 5.68 0 0 1 3.93 1.54l3.1-3.1A9.97 9.97 0 0 0 13.99 2 10 10 0 0 0 4 12a10 10 0 0 0 9.99 10c5.36 0 9.25-3.67 9.25-9.12 0-.58-.05-1.12-.15-1.6H12.24z"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                onClick={() => setSsoProvider('microsoft')}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-650 dark:text-slate-450 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z"/>
                  <path fill="#81bc06" d="M12 0h11v11H12z"/>
                  <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                  <path fill="#ffba08" d="M12 12h11v11H12z"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Create Account invitation */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 text-center space-y-2">
              <p className={getFontSizeClass("text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider")}>{t.newToGreenCo}</p>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 transition-colors w-full cursor-pointer"
              >
                <span>{t.createAccount}</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>
        </div>

        {/* Right Side Mobile Footer */}
        <div className="text-center space-y-2 z-10 pt-4 border-t border-slate-200 dark:border-slate-850/50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.footerSub}</p>
          <div className="flex justify-center space-x-4 text-[10px] text-slate-450 dark:text-slate-500 font-semibold lg:hidden">
            <span onClick={() => navigate('/privacy-policy')} className="cursor-pointer hover:underline">{t.privacy}</span>
            <span onClick={() => navigate('/terms')} className="cursor-pointer hover:underline">{t.terms}</span>
            <span className="hover:underline">{t.support}</span>
          </div>
        </div>
      </div>

      {/* SSO PROVIDER SELECTOR MODAL (INTEGRATED OAUTH FLOW) */}
      {ssoProvider && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
                <Globe className="text-emerald-500" size={16} />
                Continue with {ssoProvider === 'google' ? 'Google' : 'Microsoft'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Select an identity profile to login or sign up</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleSSOSelect('admin')}
                className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-300">GreenCo Administrator</p>
                  <p className="text-[9px] text-slate-450 font-semibold mt-0.5">admin@greenco.org</p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleSSOSelect('manager')}
                className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-300">SteelCorp Company Manager</p>
                  <p className="text-[9px] text-slate-450 font-semibold mt-0.5">factory@steelcorp.com</p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                onClick={() => handleSSOSelect('new')}
                className="w-full flex items-center justify-between p-3 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Register New Profile</p>
                  <p className="text-[9px] text-emerald-650 dark:text-emerald-500 font-semibold mt-0.5">
                    {ssoProvider === 'google' ? 'google.sso.user@gmail.com' : 'microsoft.sso.user@outlook.com'}
                  </p>
                </div>
                <ChevronRight size={14} className="text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setSsoProvider(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
                <Lock className="text-emerald-500" size={16} />
                Reset Password
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Enter your email address to receive a password reset link.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input 
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-semibold text-slate-850 dark:text-white transition-all shadow-inner"
                />
              </div>
              
              <button
                onClick={() => {
                  toast.success('Password reset link sent to your email!')
                  setShowForgotPassword(false)
                }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default LoginPage
