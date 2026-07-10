import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Leaf, Shield, Lock, FileText, HelpCircle, Eye } from 'lucide-react'

function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-850">
          <div className="flex items-center space-x-2.5">
            <Leaf className="text-emerald-500" size={24} />
            <span className="font-mono text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">GreenCo</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-400 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last updated: July 2026</p>
        </div>

        {/* Policy Content Cards */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Shield size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">1. Introduction</h3>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
              Welcome to the GreenCo Sustainability Intelligence Platform. We are committed to protecting your organizational data and personal information. This Privacy Policy describes how we collect, process, and safeguard information submitted to our digital platform.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Eye size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">2. Information We Collect</h3>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
              We collect user registration details, contact credentials, enterprise metadata, and active manufacturing profiles required to assign Role-Based Access Control (RBAC) scopes and issue certification audits.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <FileText size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">3. ESG &amp; Carbon Intelligence Data</h3>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
              We process Scope-1 and Scope-2 emission parameters, electricity and water consumption metrics, waste generated logs, and baseline data. This data is exclusively utilized to construct ESG forecast charts, compliance timelines, and sustainability readiness indices.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Lock size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">4. Security Measures &amp; Retention</h3>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
              We encrypt passwords using advanced BCrypt hashing schemes and secure communications with HTTPS. Access tokens utilize JSON Web Tokens (JWT) stored client-side securely. We retain audit log histories, assessment responses, and certificates indefinitely to comply with industrial certification transparency standards.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <HelpCircle size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">5. Contact Information</h3>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
              If you have any questions concerning this Privacy Policy, your rights, or data deletion requests, please contact our data safety division at:
              <br />
              <span className="font-bold text-slate-800 dark:text-white mt-1 block">privacy@greenco.org</span>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-6">
          © 2025 GreenCo Sustainability Platform | CII Green Business Centre
        </div>

      </div>
    </div>
  )
}

export default PrivacyPolicyPage
