import { useState } from 'react'
import { 
  Store, 
  Search, 
  Star, 
  CheckCircle, 
  ExternalLink, 
  ShieldCheck, 
  Mail, 
  Filter, 
  ArrowRight, 
  Users, 
  Briefcase,
  Clock 
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function PartnerMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
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

  // Selected partner for contact / details card
  const [selectedPartner, setSelectedPartner] = useState(partners[0])
  const [enquiries, setEnquiries] = useState([])
  const [successModalData, setSuccessModalData] = useState(null)

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

  // Handle contact form mock submission
  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!selectedPartner) return

    const message = e.target.elements.message.value
    const company = "GreenCo Enterprise Partner"
    const timestamp = new Date().toLocaleString()

    const newEnquiry = {
      supplierId: selectedPartner.id,
      supplierName: selectedPartner.name,
      category: selectedPartner.service,
      message: message,
      company: company,
      timestamp: timestamp,
      status: "SENT"
    }

    setEnquiries(prev => [newEnquiry, ...prev])
    setSuccessModalData(newEnquiry)

    toast.success(`Contact request sent to ${selectedPartner.name}! They will reply to your registered corporate email shortly.`)

    // Clear form
    e.target.reset()

    // Close the enquiry panel
    setSelectedPartner(null)
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

      {/* Two Column Grid: Directory vs Contact Partner */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left Column - Search & Directory (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0">
          
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

          {/* Directory Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.length === 0 ? (
              <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-200 shadow-sm col-span-2">
                <Store className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="font-semibold text-slate-700 text-xs">No partners match filters</p>
              </div>
            ) : (
              filteredPartners.map(p => (
                <div 
                  key={p.id} 
                  className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedPartner.id === p.id ? 'ring-2 ring-emerald-500/10 border-emerald-500' : ''
                  }`}
                  onClick={() => setSelectedPartner(p)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
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

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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

        {/* Right Column - Vendor contact box & shortlist locker (30%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Vendor Details & Contact Form */}
          {selectedPartner ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Mail size={18} className="text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Inquire Supplier</h3>
                  <p className="text-[9px] text-slate-400">Send contact request to partner.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-650 leading-relaxed">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Partner Selected</span>
                  <h4 className="text-slate-800 font-extrabold text-sm">{selectedPartner.name}</h4>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <p className="text-[10px] font-medium leading-relaxed">{selectedPartner.description}</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider">Message Description</label>
                    <textarea 
                      name="message"
                      rows="3" 
                      required
                      placeholder="Describe project CapEx limits and location requirements..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-semibold text-slate-750"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-[10px] font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
                  >
                    Request Information Quote
                    <ArrowRight size={11} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-250 text-center text-slate-450 space-y-2">
              <Mail className="mx-auto text-slate-300" size={24} />
              <p className="text-xs font-semibold text-slate-700">No partner selected for inquiry</p>
              <p className="text-[10px] text-slate-400">Select any partner card from the directory to start a request.</p>
            </div>
          )}

          {/* Shortlisted locker */}
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
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={15} className="text-emerald-600" />
                Request History
              </h3>
              <p className="text-[10px] text-slate-400">Track sent enquiries and quotes.</p>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {enquiries.length === 0 ? (
                <p className="text-center text-[10px] text-slate-400 py-2">No enquiries sent yet</p>
              ) : (
                enquiries.map((enq, index) => (
                  <div key={index} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-800 truncate max-w-[130px]">{enq.supplierName}</span>
                      <span className="bg-emerald-100 text-emerald-850 px-1.5 py-0.5 rounded font-black uppercase text-[8px]">{enq.status}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium line-clamp-1">{enq.message}</p>
                    <div className="flex justify-between items-center text-[8px] text-slate-400">
                      <span>{enq.category}</span>
                      <span>{enq.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Success Modal Overlay */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8" />
            
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <div className="space-y-1 truncate">
                <h3 className="text-sm font-black text-slate-850 tracking-tight">Contact request sent to {successModalData.supplierName}!</h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">They will reply to your registered corporate email shortly.</p>
              </div>
            </div>

            {/* Email Preview Frame */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl overflow-hidden text-[10px] font-semibold text-slate-650">
              <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-150 font-bold text-slate-450 uppercase tracking-wider flex justify-between">
                <span>Auto-Generated Email Dispatch</span>
                <span className="text-emerald-700">● STAGED OUTBOX</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5 text-[10px]">
                  <span className="text-slate-400">To:</span>
                  <span className="font-bold text-slate-800">info@{successModalData.supplierName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 text-[10px]">
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-bold text-slate-800">Information Quote Enquiry - GreenCo Platform</span>
                </div>
                <div className="pt-1 text-slate-550 leading-relaxed italic bg-white p-2.5 rounded border border-slate-100 text-[10px]">
                  "Hello {successModalData.supplierName} Team,<br/><br/>
                  We would like to request an information quote regarding your '{successModalData.category}' services.<br/><br/>
                  Message description: {successModalData.message}<br/><br/>
                  Best regards,<br/>
                  {successModalData.company}"
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSuccessModalData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] font-bold shadow-md transition-all cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
