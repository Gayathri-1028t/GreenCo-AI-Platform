import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { 
  Building2, 
  FileSpreadsheet, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Bell,
  Users,
  BarChart3,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SearchCode,
  ClipboardCheck,
  Lightbulb,
  Trophy,
  CloudRain,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Store,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import api from '../services/api'
import { toast } from 'react-toastify'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions))
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuth()
      navigate('/login', { replace: true })
    }
  }

  const baseNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FileSpreadsheet },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Factories', path: '/factories', icon: Building2 },
    { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'AI Copilot', path: '/copilot', icon: Sparkles },
    { name: 'Audit Logs', path: '/audit-logs', icon: SearchCode },
    { name: 'Innovation Lab', path: '/innovation-lab', icon: Lightbulb },
    { name: 'ESG Awards', path: '/awards', icon: Trophy },
    { name: 'Climate Intelligence', path: '/climate-intelligence', icon: CloudRain },
    { name: 'Investment Planner', path: '/investment-planner', icon: TrendingUp },
    { name: 'Research Hub', path: '/research-hub', icon: BookOpen },
    { name: 'Collaboration Portal', path: '/collaboration', icon: MessageSquare },
    { name: 'Partner Marketplace', path: '/marketplace', icon: Store }
  ]

  const hasManagementAccess = user?.roles?.some(role => 
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_GREENCO_COORDINATOR'].includes(role)
  )

  const navItems = hasManagementAccess
    ? [...baseNavItems, { name: 'Users', path: '/users', icon: Users }, { name: 'Settings', path: '/settings', icon: Settings }]
    : [...baseNavItems, { name: 'Settings', path: '/settings', icon: Settings }]

  // Dynamic Notifications State with Priorities
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'V3.0 Assessment approved for SteelCorp Plant 1', type: 'success', priority: 'High', time: '10 min ago', read: false },
    { id: 2, text: 'AI OCR detected anomaly in electricity bill upload', type: 'warning', priority: 'High', time: '1 hour ago', read: false },
    { id: 3, text: 'Company profile information modified by Coordinator', type: 'info', priority: 'Medium', time: '4 hours ago', read: true },
    { id: 4, text: 'Expiry warning: GC-2026-00001 certificate expires soon', type: 'warning', priority: 'High', time: '1 day ago', read: false },
    { id: 5, text: 'Backup database migration completed successfully', type: 'success', priority: 'Low', time: '2 days ago', read: true }
  ])
  const [notifSearch, setNotifSearch] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay/Drawer */}
      {mobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-45 md:hidden" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col z-50 shadow-xl md:hidden animate-in slide-in-from-left duration-250">
            {/* Brand Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-150">
              <Link to="/dashboard" onClick={() => setMobileSidebarOpen(false)} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                  GC
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base leading-tight tracking-tight text-slate-900">GreenCo</span>
                  <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">Sustainability</span>
                </div>
              </Link>
              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick user info */}
            <div className="px-4 py-6 border-b border-slate-150 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center font-bold shadow-sm">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.firstName || 'GreenCo User'}</p>
                  <p className="text-xs text-slate-400 font-bold truncate">{user?.roles?.[0]?.replace('ROLE_', '') || 'OPERATOR'}</p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-450'}`} />
                    <span className="text-[13.5px]">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-slate-150 bg-slate-50/20">
              <button 
                onClick={() => {
                  setMobileSidebarOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-55 hover:text-red-650 transition-all duration-200"
              >
                <LogOut size={20} className="shrink-0" />
                <span className="text-[13.5px] font-bold">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside 
        className={`bg-white border-r border-slate-200 text-slate-700 hidden md:flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        } h-screen sticky top-0 z-20 shadow-sm`}
      >
        {/* Brand Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-150">
          <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden whitespace-nowrap group">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
              GC
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight text-slate-900">GreenCo</span>
                <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">Sustainability</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-slate-400 hover:text-slate-655 p-1 hover:bg-slate-50 rounded-lg transition-colors hidden md:block"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* User Quick Info */}
        {sidebarOpen && (
          <div className="px-4 py-6 border-b border-slate-150 bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center font-bold shadow-sm">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.firstName || 'GreenCo User'}</p>
                <p className="text-xs text-slate-400 font-bold truncate">{user?.roles?.[0]?.replace('ROLE_', '') || 'OPERATOR'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-450 group-hover:text-slate-655'
                  }`} 
                />
                {sidebarOpen && <span className="text-[13.5px]">{item.name}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-slate-800 text-slate-100 text-xs font-semibold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-150 bg-slate-50/20">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-650 transition-all duration-200 group"
          >
            <LogOut size={20} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
            {sidebarOpen && <span className="text-[13.5px] font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm shrink-0">
          <button 
            onClick={() => setMobileSidebarOpen(true)} 
            className="text-slate-500 hover:text-slate-850 p-2 hover:bg-slate-50 rounded-lg transition-colors block md:hidden mr-2"
          >
            <Menu size={20} />
          </button>
          {/* Left Welcome message */}
          <div className="hidden sm:flex items-center space-x-3">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{currentDate}</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Bar */}
            <div className="relative max-w-xs hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Quick search..."
                className="w-48 xl:w-60 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-250">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <span className="font-semibold text-xs text-slate-700 uppercase tracking-wider">Notifications</span>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[10px] text-emerald-600 font-bold hover:underline bg-transparent border-none outline-none"
                      >
                        Mark all read
                      </button>
                    </div>
                    
                    {/* Search inside notifications */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={notifSearch}
                        onChange={(e) => setNotifSearch(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-55 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-750 focus:outline-none"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {notifications.filter(notif => notif.text.toLowerCase().includes(notifSearch.toLowerCase())).map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                          className={`p-3 hover:bg-slate-50 transition-colors flex gap-2 cursor-pointer ${!notif.read ? 'bg-slate-50/60' : ''}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div className="space-y-1 flex-1">
                            <p className={`text-xs leading-normal ${!notif.read ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{notif.text}</p>
                            <div className="flex justify-between items-center text-[9px] text-slate-400">
                              <span>{notif.time}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                notif.priority === 'High' ? 'bg-rose-100 text-rose-800' : 
                                notif.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                              }`}>{notif.priority}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-inner">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-slate-700 leading-none">{user?.firstName || 'User'}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user?.email || 'N/A'}</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-250">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link 
                      to="/settings" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings size={14} className="text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={14} className="text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
