import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import { User, Shield, KeyRound, Save, Loader2 } from 'lucide-react'

function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  })

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass }
  } = useForm()

  const onUpdateProfile = async (data) => {
    if (isUpdatingProfile) return
    setIsUpdatingProfile(true)
    
    // Simulate API network latency
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      const updatedUser = {
        ...user,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim()
      }
      
      updateUser(updatedUser)
      toast.success('Profile updated successfully.')
    } catch (err) {
      toast.error('Failed to update profile.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const onChangePassword = async (data) => {
    if (isUpdatingPassword) return
    
    // 1. Current password check
    const storedPassword = localStorage.getItem('greenco_user_password') || 'AdminPass123!'
    if (data.currentPassword !== storedPassword) {
      toast.error('Current password is incorrect.')
      return
    }

    // 2. Weak password check (minimum 8 characters)
    if (data.newPassword.length < 8) {
      toast.error('Password must contain at least 8 characters.')
      return
    }

    // 3. Confirm password check
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsUpdatingPassword(true)
    
    // Simulate API network latency
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      localStorage.setItem('greenco_user_password', data.newPassword)
      toast.success('Password updated successfully.')
      resetPass({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      toast.error('Failed to update password.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="mt-1 text-slate-500 text-sm">Configure your personal profile details, security credentials, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <form onSubmit={handleSubmit(onUpdateProfile)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="text-slate-400" size={20} />
            <h2 className="font-bold text-slate-800 text-base">Profile Information</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              {...register('email')}
              className="mt-1 block w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg sm:text-sm cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'Required' })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
              />
              {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Required' })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
              />
              {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Password Security Card */}
        <form onSubmit={handleSubmitPass(onChangePassword)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <KeyRound className="text-slate-400" size={20} />
            <h2 className="font-bold text-slate-800 text-base">Security Settings</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">Current Password</label>
            <input
              type="password"
              {...registerPass('currentPassword', { required: 'Required' })}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
            />
            {errorsPass.currentPassword && <p className="text-xs text-red-600 mt-1">{errorsPass.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">New Password</label>
            <input
              type="password"
              {...registerPass('newPassword', { required: 'Required' })}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
            />
            {errorsPass.newPassword && <p className="text-xs text-red-600 mt-1">{errorsPass.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">Confirm New Password</label>
            <input
              type="password"
              {...registerPass('confirmPassword', { required: 'Required' })}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg sm:text-sm"
            />
            {errorsPass.confirmPassword && <p className="text-xs text-red-600 mt-1">{errorsPass.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Permissions / Authorization Badge Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="text-slate-400" size={20} />
          <h2 className="font-bold text-slate-800 text-base">Assigned Security Roles</h2>
        </div>
        <p className="text-xs text-slate-400 font-semibold uppercase">Active User Roles</p>
        <div className="flex flex-wrap gap-2">
          {user?.roles?.map(role => (
            <span key={role} className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
              {role.replace('ROLE_', '').replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
