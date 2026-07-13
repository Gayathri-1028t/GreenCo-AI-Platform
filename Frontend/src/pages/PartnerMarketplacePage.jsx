import { useState } from 'react'
import { 
  Store, 
  Search, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Users, 
  Briefcase 
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

          {/* Shortlisted Contractors (1/3 width) */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
        </div>

      </div>
    </div>
  )
}
