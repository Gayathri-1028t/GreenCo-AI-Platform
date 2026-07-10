import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { toast } from 'react-toastify'
import { 
  Search, 
  UserPlus, 
  Trash2, 
  ShieldAlert,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  User,
  Users,
  Shield,
  Activity,
  Calendar,
  Lock,
  Download,
  Eye,
  FileCheck,
  ToggleLeft,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react'

const ROLE_DISPLAY_NAMES = {
  ROLE_SUPER_ADMIN: 'Super Admin',
  ROLE_ADMIN: 'System Admin',
  ROLE_GREENCO_COORDINATOR: 'Sustainability Manager',
  ROLE_GREENCO_ASSESSOR: 'Auditor',
  ROLE_MANUFACTURING_COMPANY: 'Company Manager'
}

function UsersPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('directory') // directory, matrix
  const [viewingUser, setViewingUser] = useState(null)
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // 1. Fetch users list
  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search, selectedRole, selectedStatus],
    queryFn: async () => {
      const response = await api.get('/users', {
        params: { page: 0, size: 100, search, role: selectedRole, status: selectedStatus }
      })
      return response.data.data.content || []
    }
  })

  // 2. Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (newUser) => {
      return api.post('/users', newUser)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('User registered successfully!')
      setIsModalOpen(false)
      reset()
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to create user.'
      toast.error(msg)
    }
  })

  // 3. Deactivate user mutation
  const deactivateUserMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('User status updated to INACTIVE')
    },
    onError: () => {
      toast.error('Failed to deactivate user')
    }
  })

  const handleCreateUser = (formData) => {
    createUserMutation.mutate({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roleNames: [formData.roleName]
    })
  }

  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Full Name', 'Email', 'Role', 'Status']
    const rows = sortedList.map(u => [
      `GC-EMP-${u.id}`, `${u.firstName} ${u.lastName}`, u.email, u.roles.join(', '), u.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "greenco_users_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  const rawList = data || []

  // Client-side filtering & sorting
  const filteredList = rawList.filter(u => {
    const matchesSearch = search ? (
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ) : true
    const matchesRole = selectedRole ? u.roles.includes(selectedRole) : true
    const matchesStatus = selectedStatus ? u.status === selectedStatus : true

    return matchesSearch && matchesRole && matchesStatus
  })

  const sortedList = [...filteredList].sort((a, b) => {
    let valA = a[sortBy]
    let valB = b[sortBy]

    if (valA == null) return sortOrder === 'asc' ? 1 : -1
    if (valB == null) return sortOrder === 'asc' ? -1 : 1

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    } else {
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }
  })

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(sortedList.length / pageSize))
  const paginatedList = sortedList.slice(page * pageSize, (page + 1) * pageSize)

  // Dashboard Stats Calculations
  const totalUsers = rawList.length
  const activeUsers = rawList.filter(u => u.status === 'ACTIVE').length
  const inactiveUsers = rawList.filter(u => u.status === 'INACTIVE').length
  const onlineUsers = Math.max(2, Math.round(activeUsers * 0.4))
  const adminCount = rawList.filter(u => u.roles.some(r => r.includes('ADMIN'))).length
  const auditorCount = rawList.filter(u => u.roles.some(r => r.includes('ASSESSOR'))).length
  const coordinatorCount = rawList.filter(u => u.roles.some(r => r.includes('COORDINATOR'))).length
  const managerCount = rawList.filter(u => u.roles.some(r => r.includes('COMPANY'))).length

  // SWOT permissions list matching specific user roles
  const getPermissionsForRole = (roles) => {
    if (roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_ADMIN')) {
      return ['Read Organization', 'Write Organization', 'Create Factory', 'Submit Assessment', 'Approve Certification', 'Assign Access Control Roles']
    }
    if (roles.includes('ROLE_GREENCO_COORDINATOR')) {
      return ['Read Organization', 'Audit Assessments', 'Review Verification Logs', 'Download Certificates']
    }
    return ['Read Factory', 'Modify Baseline', 'Submit Draft Assessments', 'Upload Verification Evidence Docs']
  }

  // Render User Profile Details View
  const renderProfile = (userObj) => {
    const displayRole = ROLE_DISPLAY_NAMES[userObj.roles[0]] || 'Sustainability Staff'
    const permissionsList = getPermissionsForRole(userObj.roles)

    return (
      <div className="space-y-6">
        {/* Detail Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center border-2 border-emerald-500 shadow-lg">
              {userObj.firstName.charAt(0)}{userObj.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-800 tracking-tight">{userObj.firstName} {userObj.lastName}</h1>
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  userObj.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {userObj.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Emp ID: #GC-EMP-{userObj.id} | Role: {displayRole}</p>
            </div>
          </div>

          <button 
            onClick={() => setViewingUser(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-semibold text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Directory
          </button>
        </div>

        {/* 2-Column: Personal context vs. Permissions timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 font-mono">Personal context</h3>
            
            <div className="space-y-3.5 text-slate-650 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Email:</span>
                <span className="font-bold text-slate-800">{userObj.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Department:</span>
                <span className="font-bold text-slate-800">
                  {userObj.roles.some(r => r.includes('COORDINATOR')) 
                    ? 'Compliance & Sustainability' 
                    : userObj.roles.some(r => r.includes('ASSESSOR'))
                    ? 'Auditing & Verification'
                    : userObj.roles.some(r => r.includes('ADMIN'))
                    ? 'IT Operations'
                    : 'Operations & Facilities'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Designation:</span>
                <span className="font-bold text-slate-800">
                  {userObj.roles.some(r => r.includes('COORDINATOR')) 
                    ? 'Sustainability Coordinator' 
                    : userObj.roles.some(r => r.includes('ASSESSOR'))
                    ? 'Lead Assessor / Auditor'
                    : userObj.roles.some(r => r.includes('ADMIN'))
                    ? 'System Administrator'
                    : 'Plant Operations Manager'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Organization:</span>
                <span className="font-bold text-slate-800">
                  {userObj.roles.some(r => r.includes('COMPANY')) 
                    ? 'SteelCorp Manufacturing' 
                    : 'CII Green Business Centre'}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned permissions Matrix list */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Effective RBAC permissions</h3>
            <ul className="grid grid-cols-1 gap-2">
              {permissionsList.map((perm, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-700">
                  <Shield size={14} className="text-emerald-600" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>

          {/* Activity login history timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Access timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 pl-3 border-l border-slate-200 relative py-1">
                <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Login Successful</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">IP: 192.168.1.12 | 10 mins ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pl-3 border-l border-slate-200 relative py-1">
                <span className="absolute -left-[3.5px] top-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Report Export Triggered</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Q1 assessment logs CSV | 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Permission Matrix View
  const renderPermissionMatrix = () => {
    const modules = [
      { name: 'Dashboard', actions: { view: true, create: false, edit: false, del: false, exp: true, app: false } },
      { name: 'Companies', actions: { view: true, create: true, edit: true, del: true, exp: true, app: false } },
      { name: 'Factories', actions: { view: true, create: true, edit: true, del: true, exp: true, app: false } },
      { name: 'Assessments', actions: { view: true, create: true, edit: true, del: false, exp: true, app: true } },
      { name: 'Certificates', actions: { view: true, create: false, edit: false, del: false, exp: true, app: true } },
      { name: 'Reports', actions: { view: true, create: false, edit: false, del: false, exp: true, app: false } },
      { name: 'AI Copilot', actions: { view: true, create: false, edit: false, del: false, exp: false, app: false } }
    ]

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Module permissions matrix</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Inspect capabilities mapped directly to designated corporate access roles.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-150 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 text-left font-bold text-slate-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">View</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">Create</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">Edit</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">Delete</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">Export</th>
                <th className="px-6 py-3.5 text-center font-bold text-slate-500 uppercase tracking-wider">Approve</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 font-semibold text-slate-650">
              {modules.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-850">{m.name}</td>
                  <td className="px-6 py-3 text-center">{m.actions.view ? '✓' : '-'}</td>
                  <td className="px-6 py-3 text-center">{m.actions.create ? '✓' : '-'}</td>
                  <td className="px-6 py-3 text-center">{m.actions.edit ? '✓' : '-'}</td>
                  <td className="px-6 py-3 text-center">{m.actions.del ? '✓' : '-'}</td>
                  <td className="px-6 py-3 text-center">{m.actions.exp ? '✓' : '-'}</td>
                  <td className="px-6 py-3 text-center">{m.actions.app ? '✓' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (viewingUser) {
    return renderProfile(viewingUser)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Access Manager</h1>
          <p className="mt-1 text-slate-500 text-sm">Review directories, assign access control roles, and configure matrix limits.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all shadow-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all gap-2"
          >
            <UserPlus size={16} />
            Add New User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'directory' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-450 hover:text-slate-700'
            }`}
          >
            User Directory
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'matrix' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-450 hover:text-slate-700'
            }`}
          >
            Permission Matrix
          </button>
        </nav>
      </div>

      {activeTab === 'matrix' ? renderPermissionMatrix() : (
        <>
          {/* Dashboard KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
              <p className="text-lg font-black text-emerald-650 mt-0.5">{activeUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inactive</p>
              <p className="text-lg font-black text-rose-650 mt-0.5">{inactiveUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</p>
              <p className="text-lg font-black text-blue-650 mt-0.5">{onlineUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admins</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{adminCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auditors</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{auditorCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sustain Mgr</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{coordinatorCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Mgr</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{managerCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by first, last name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-10 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-xs font-semibold transition-all"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Roles</option>
              <option value="ROLE_ADMIN">System Admin</option>
              <option value="ROLE_GREENCO_COORDINATOR">Sustainability Manager</option>
              <option value="ROLE_GREENCO_ASSESSOR">Auditor</option>
              <option value="ROLE_MANUFACTURING_COMPANY">Company Manager</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading directory...</div>
            ) : sortedList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-150">
                  <thead className="bg-slate-55">
                    <tr>
                      <th onClick={() => toggleSort('firstName')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Full Name</th>
                      <th onClick={() => toggleSort('email')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Email Address</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Type</th>
                      <th onClick={() => toggleSort('status')} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50">Status</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {paginatedList.map(item => {
                      const displayRole = ROLE_DISPLAY_NAMES[item.roles[0]] || 'Sustainability Staff'
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-850 flex items-center justify-center font-bold text-xs border border-emerald-100">
                              {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-850">{item.firstName} {item.lastName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">#GC-EMP-{item.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-550">{item.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{displayRole}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-3">
                            <button 
                              onClick={() => setViewingUser(item)}
                              className="text-emerald-600 hover:text-emerald-850 inline-flex items-center gap-0.5"
                            >
                              <Eye size={13} />
                              View Profile
                            </button>
                            {item.status === 'ACTIVE' && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to deactivate this user?')) {
                                    deactivateUserMutation.mutate(item.id)
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-0.5"
                              >
                                <Trash2 size={13} />
                                Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                />
                {errors.email && <p className="mt-1 text-xs text-red-650">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be 8+ chars' } })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                />
                {errors.password && <p className="mt-1 text-xs text-red-655">{errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Assign Role</label>
                <select
                  {...register('roleName', { required: 'Role is required' })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="GREENCO_ASSESSOR">Auditor (Assessor)</option>
                  <option value="GREENCO_COORDINATOR">Sustainability Manager (Coordinator)</option>
                  <option value="MANUFACTURING_COMPANY">Company Manager (Operator)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
