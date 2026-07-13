import { useState } from 'react'
import { 
  Store, 
  Search, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Users, 
  Briefcase,
  Clock,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'

const initialEnquiries = [
  {
    supplierId: 1,
    supplierName: 'EcoGrid Solar Solutions',
    category: 'Renewable Installation',
    company: 'GreenCo Enterprise Partner',
    factory: 'Pune AutoForge Phase 1',
    timestamp: '12 Jul 2026 • 02:45 PM',
    subject: '2 MW Rooftop Solar Proposal',
    message: 'Looking for a 2 MW rooftop solar installation proposal.',
    status: 'Vendor Responded',
    priority: 'High'
  },
  {
    supplierId: 2,
    supplierName: 'Chennai Carbon Advisory Group',
    category: 'ESG Auditing & Consulting',
    company: 'GreenCo Enterprise Partner',
    factory: 'Chennai Casting Unit',
    timestamp: '11 Jul 2026 • 11:30 AM',
    subject: 'Scope 3 Emission Mapping',
    message: 'Scope 3 logistics carbon mapping quote requested.',
    status: 'Meeting Scheduled',
    priority: 'Medium'
  },
  {
    supplierId: 3,
    supplierName: 'HydraTech Wastewater Engineering',
    category: 'Water Recycling systems',
    company: 'GreenCo Enterprise Partner',
    factory: 'Coimbatore TexMills',
    timestamp: '10 Jul 2026 • 09:15 AM',
    subject: 'Zero Liquid Discharge setup',
    message: 'Requesting feasibility study for ZLD plant.',
    status: 'Under Review',
    priority: 'High'
  },
  {
    supplierId: 4,
    supplierName: 'Indus Bio-Energy Systems',
    category: 'Bio-Gas solutions',
    company: 'GreenCo Enterprise Partner',
    factory: 'Hosur Food Processing',
    timestamp: '09 Jul 2026 • 04:20 PM',
    subject: 'Methane Bio-Digester setup',
    message: 'Sizing details for organic food waste bio-digester.',
    status: 'Quote Received',
    priority: 'Medium'
  },
  {
    supplierId: 5,
    supplierName: 'GreenCarbon Consulting',
    category: 'ESG Auditing & Consulting',
    company: 'GreenCo Enterprise Partner',
    factory: 'Hyderabad Pharma Lab',
    timestamp: '08 Jul 2026 • 01:10 PM',
    subject: 'BRSR Compliance Review',
    message: 'Assistance needed for SEBI BRSR annual filings review.',
    status: 'Sent',
    priority: 'Low'
  },
  {
    supplierId: 6,
    supplierName: 'AquaPure Recycling',
    category: 'Water Recycling systems',
    company: 'GreenCo Enterprise Partner',
    factory: 'Pune AutoForge Phase 2',
    timestamp: '07 Jul 2026 • 10:05 AM',
    subject: 'Cooling Tower Filter Upgrade',
    message: 'Upgrade quote for closed-loop reverse osmosis filter.',
    status: 'Closed',
    priority: 'Low'
  },
  {
    supplierId: 7,
    supplierName: 'SunVolt Energy Systems',
    category: 'Renewable Installation',
    company: 'GreenCo Enterprise Partner',
    factory: 'Nagpur Foundry Unit',
    timestamp: '06 Jul 2026 • 03:00 PM',
    subject: 'Solar Plant Sizing',
    message: 'On-site solar plant concentrator capacity assessment.',
    status: 'Vendor Responded',
    priority: 'High'
  },
  {
    supplierId: 8,
    supplierName: 'EcoWaste Technologies',
    category: 'Bio-Gas solutions',
    company: 'GreenCo Enterprise Partner',
    factory: 'Bengaluru Packaging Site',
    timestamp: '05 Jul 2026 • 11:45 AM',
    subject: 'Sludge composting grid',
    message: 'Design proposals for organic compost recycling grid.',
    status: 'Under Review',
    priority: 'Medium'
  }
]

export default function PartnerMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [inquiryPartner, setInquiryPartner] = useState(null)
  const [selectedService, setSelectedService] = useState('')
  const [selectedCert, setSelectedCert] = useState('')

  // Seed partner listings
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: 'EcoGrid Solar Solutions',
      service: 'Renewable Installation',
      certification: 'ISO 14001',
      rating: 4.8,
      reviews: 14,
      location: 'Coimbatore, TN',
      description: 'Full-service rooftop solar concentrators, sizing optimization, and photovoltaic system installation.',
      contactEmail: 'info@ecogridsolar.com',
      shortlisted: true
    },
    {
      id: 2,
      name: 'Chennai Carbon Advisory Group',
      service: 'ESG Auditing & Consulting',
      certification: 'GRI Certified',
      rating: 4.9,
      reviews: 22,
      location: 'Chennai, TN',
      description: 'Scope 1-3 greenhouse gas verification, BRSR reporting consultancy, and carbon offset planning.',
      contactEmail: 'consult@chennaicarbon.org',
      shortlisted: false
    },
    {
      id: 3,
      name: 'HydraTech Wastewater Engineering',
      service: 'Water Recycling systems',
      certification: 'ISO 9001',
      rating: 4.6,
      reviews: 19,
      location: 'Bangalore, KA',
      description: 'Closed-loop cooling tower filtration, reverse osmosis units, and runoff storage pond configurations.',
      contactEmail: 'engineering@hydratech.com',
      shortlisted: false
    },
    {
      id: 4,
      name: 'Indus Bio-Energy Systems',
      service: 'Bio-Gas solutions',
      certification: 'ISO 14001',
      rating: 4.7,
      reviews: 11,
      location: 'Tumkur, KA',
      description: 'Localized methane bio-digester setups, organic composting grids, and kitchen waste conversion systems.',
      contactEmail: 'sales@indusbioenergy.com',
      shortlisted: false
    }
  ])

  // Toggle shortlist status
  const handleToggleShortlist = (id) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.shortlisted
        toast.info(nextState ? `${p.name} added to shortlist` : `${p.name} removed from shortlist`)
        return { ...p, shortlisted: nextState }
      }
      return p
    }))
  }

  // Handle contact form mock submission inside modal
  const handleModalSubmit = (e) => {
    e.preventDefault()
    if (!inquiryPartner) return

    const message = e.target.elements.message.value
    const subject = e.target.elements.subject.value
    const factory = e.target.elements.factory.value
    const priority = e.target.elements.priority.value
    const company = "GreenCo Enterprise Partner"
    
    const now = new Date()
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
    const formattedDate = now.toLocaleDateString('en-GB', options)
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions)
    const timestamp = `${formattedDate} • ${formattedTime}`

    const newEnquiry = {
      supplierId: inquiryPartner.id,
      supplierName: inquiryPartner.name,
      category: inquiryPartner.service,
      company: company,
      factory: factory,
      timestamp: timestamp,
      subject: subject,
      message: message,
      status: 'Sent',
      priority: priority
    }

    // Prepend automatically to the top of Request History
    setEnquiries(prev => [newEnquiry, ...prev])

    toast.success(`Contact request sent to ${inquiryPartner.name}! They will reply to your registered corporate email shortly.`)

    // Close Modal
    setInquiryPartner(null)
  }

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesService = !selectedService || p.service === selectedService
    const matchesCert = !selectedCert || p.certification === selectedCert
    return matchesSearch && matchesService && matchesCert
  })

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="text-emerald-500 fill-emerald-50" size={24} />
            ESG Marketplace & Partner Network
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Connect with certified vendors, energy consultants, carbon offset providers, and wastewater recycling contractors.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified ESG Vendors</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">24 Partners</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Featured Specialists</p>
          <p className="text-lg font-black text-indigo-650 mt-0.5">6 Specialist categories</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Vendor Rating</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">4.7 / 5.0 stars</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shortlisted Contractors</p>
          <p className="text-lg font-black text-blue-650 mt-0.5">
            {partners.filter(p => p.shortlisted).length} Vendors
          </p>
        </div>
      </div>

      {/* Full Width Layout: Directory & Comparison */}
      <div className="w-full space-y-6">
        
        {/* Search bar and Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search vendor services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650"
            >
              <option value="">All Services</option>
              <option value="Renewable Installation">Solar Power</option>
              <option value="ESG Auditing & Consulting">ESG Consulting</option>
              <option value="Water Recycling systems">Water Systems</option>
              <option value="Bio-Gas solutions">Bio-Energy</option>
            </select>

            <select
              value={selectedCert}
              onChange={(e) => setSelectedCert(e.target.value)}
              className="px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-650"
            >
              <option value="">All Certs</option>
              <option value="ISO 14001">ISO 14001</option>
              <option value="GRI Certified">GRI Certified</option>
              <option value="ISO 9001">ISO 9001</option>
            </select>
          </div>
        </div>

        {/* Directory Listings Grid - Full Width Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPartners.length === 0 ? (
            <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-200 shadow-sm col-span-full">
              <Store className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="font-semibold text-slate-700 text-xs">No partners match filters</p>
            </div>
          ) : (
            filteredPartners.map(p => (
              <div 
                key={p.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {p.service}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-extrabold">
                      <Star size={12} className="fill-amber-500" />
                      <span>{p.rating} ({p.reviews})</span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-xs truncate leading-snug">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{p.description}</p>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-semibold">{p.location}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setInquiryPartner(p); }}
                      className="px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-50 bg-white text-emerald-700 text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      ✉ Inquire
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleShortlist(p.id); }}
                      className={`px-2 py-0.5 rounded border transition-colors text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                        p.shortlisted 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {p.shortlisted ? '★ Shortlisted' : '★ Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Section: Comparison & Shortlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comparison Table (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={15} className="text-indigo-650" />
                  Technical Capabilities Comparison
                </h3>
                <p className="text-[10px] text-slate-400">Comparing verified certifications and service locations.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-150 text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr className="text-left">
                      <th className="px-6 py-3">Vendor</th>
                      <th className="px-6 py-3">Focus Area</th>
                      <th className="px-6 py-3 text-center">Safety Certification</th>
                      <th className="px-6 py-3 text-right">Geographic reach</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {partners.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-800">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{p.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                            <ShieldCheck size={11} className="text-indigo-600" />
                            {p.certification}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-550">{p.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column containing Shortlist & Request History widgets (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Shortlisted Contractors */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={15} className="text-indigo-650" />
                  Shortlisted Contractors
                </h3>
                <p className="text-[10px] text-slate-400">List of saved suppliers.</p>
              </div>

              <div className="space-y-3">
                {partners.filter(p => p.shortlisted).length === 0 ? (
                  <p className="text-center text-[10px] text-slate-400 py-2">No vendors saved in shortlist</p>
                ) : (
                  partners
                    .filter(p => p.shortlisted)
                    .map(p => (
                      <div key={p.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <div>
                          <p className="font-bold text-slate-850 truncate max-w-[150px]">{p.name}</p>
                          <p className="text-[8px] text-slate-400 font-bold">{p.service}</p>
                        </div>
                        <button
                          onClick={() => handleToggleShortlist(p.id)}
                          className="text-[9px] text-rose-600 font-bold hover:underline bg-transparent border-none outline-none cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Request History Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={15} className="text-emerald-600" />
                  Request History
                </h3>
                <span className="text-[9px] bg-slate-100 font-mono text-slate-450 px-2 py-0.5 rounded font-black uppercase">
                  {enquiries.length} requests
                </span>
              </div>
              
              {/* Scrollable Container (more than 5 entries) */}
              <div className="space-y-3 mt-3 max-h-[360px] overflow-y-auto pr-1">
                {enquiries.length === 0 ? (
                  <p className="text-center text-[10px] text-slate-400 py-4">No enquiries sent yet.</p>
                ) : (
                  enquiries.map((enq, index) => (
                    <div key={index} className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-xs font-semibold text-slate-650 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-slate-800 truncate block leading-snug">{enq.supplierName}</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border shrink-0 ${
                          enq.status === 'Vendor Responded' ? 'bg-green-50 text-green-700 border-green-200' :
                          enq.status === 'Sent' ? 'bg-blue-55 text-blue-700 border-blue-200' :
                          enq.status === 'Under Review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          enq.status === 'Meeting Scheduled' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          enq.status === 'Quote Received' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-[8px] text-slate-450 uppercase block font-bold leading-none tracking-wider">{enq.category}</p>
                      <p className="text-[10px] text-slate-650 font-medium leading-relaxed bg-white p-2 rounded border border-slate-100 line-clamp-2">
                        "{enq.message}"
                      </p>
                      <div className="flex justify-between items-center text-[8px] text-slate-400 border-t border-slate-100 pt-1.5">
                        <span>Fac: {enq.factory}</span>
                        <span className="font-mono">{enq.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Inquiry Modal */}
      {inquiryPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 relative overflow-hidden text-xs">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                  <Clock size={16} className="text-emerald-600" />
                  Quick Quote Inquiry
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Send a formal enquiry to {inquiryPartner.name}.</p>
              </div>
              <button 
                onClick={() => setInquiryPartner(null)}
                className="w-6 h-6 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs font-semibold text-slate-650">
              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Supplier Name</label>
                <input 
                  type="text" 
                  disabled
                  value={inquiryPartner.name}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Service Category</label>
                <input 
                  type="text" 
                  disabled
                  value={inquiryPartner.service}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Factory Facility</label>
                  <select 
                    name="factory"
                    required
                    className="w-full px-3 py-1.5 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-bold text-slate-650"
                  >
                    <option value="Pune AutoForge Phase 1">Pune AutoForge Phase 1</option>
                    <option value="Pune AutoForge Phase 2">Pune AutoForge Phase 2</option>
                    <option value="Chennai Casting Unit">Chennai Casting Unit</option>
                    <option value="Coimbatore TexMills">Coimbatore TexMills</option>
                    <option value="Nagpur Foundry Unit">Nagpur Foundry Unit</option>
                    <option value="Bengaluru Packaging Site">Bengaluru Packaging Site</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Priority Level</label>
                  <select 
                    name="priority"
                    required
                    className="w-full px-3 py-1.5 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-bold text-slate-650"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Request Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  placeholder="e.g., 2 MW Solar Panel Installation feasibility quote"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-semibold text-slate-750"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Enquiry Message Details</label>
                <textarea 
                  name="message"
                  rows="3" 
                  required
                  placeholder="Provide specifications, target budget cap-ex bounds, and timeline targets..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-semibold text-slate-750"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInquiryPartner(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow transition-all cursor-pointer"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
