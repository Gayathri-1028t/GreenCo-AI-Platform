import { useState } from 'react'
import { 
  MessageSquare, 
  Search, 
  Send, 
  FileText, 
  CheckSquare, 
  Clock, 
  Bell, 
  Users, 
  Download, 
  Plus,
  Paperclip,
  Bookmark,
  ExternalLink,
  Eye
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx'
import { toast } from 'react-toastify'

export default function CollaborationPortalPage() {
  const [activeChannel, setActiveChannel] = useState('#audits-2026')
  const [newMessage, setNewMessage] = useState('')
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)

  // Mock channels
  const channels = ['#audits-2026', '#carbon-reduction-strategy', '#water-champion-coordination', '#biomass-boiler-safety']

  // Mock team members
  const team = [
    { name: 'Karan Sharma', role: 'Plant Manager', status: 'online' },
    { name: 'Priya Nair', role: 'Coordinator', status: 'online' },
    { name: 'Arjun Patel', role: 'Operator', status: 'offline' },
    { name: 'Sanjay Sen', role: 'Auditor', status: 'online' }
  ]

  // Mock messages database
  const [messages, setMessages] = useState([
    { id: 1, channel: '#audits-2026', user: 'Priya Nair', text: 'Hello team, reminder that Coimbatore Textiles site audit is scheduled for July 12th.', time: '10:05 AM', avatar: 'PN' },
    { id: 2, channel: '#audits-2026', user: 'Karan Sharma', text: 'Thanks Priya, documents upload is already completed on the wizard portal.', time: '10:12 AM', avatar: 'KS' },
    { id: 3, channel: '#carbon-reduction-strategy', user: 'Amit Sharma', text: 'Parabolic solar troughs proposed on Q3 budget are under evaluation.', time: 'Yesterday', avatar: 'AS' },
    { id: 4, channel: '#water-champion-coordination', user: 'Sanjay Sen', text: 'Chennai Smelting wastewater reuse metrics are looking solid.', time: '2 days ago', avatar: 'SS' }
  ])

  // Mock Tasks assignments
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Confirm Coimbatore site audit date details', assignee: 'Priya Nair', status: 'DONE', priority: 'High' },
    { id: 2, text: 'Upload Scope 1 furnace log attachments', assignee: 'Karan Sharma', status: 'PENDING', priority: 'High' },
    { id: 3, text: 'Complete safety checklist for biomass feed digester', assignee: 'Arjun Patel', status: 'PENDING', priority: 'Medium' }
  ])

  // Mock Shared documents database with actual files
  const documents = [
    { name: 'Coimbatore_Textiles_Audit_Report.pdf', size: '863 B', date: '2026-07-08', uploader: 'Priya Nair', type: 'pdf' },
    { name: 'Furnace_Green_Hydrogen_Proposal.pdf', size: '848 B', date: '2026-07-05', uploader: 'Karan Sharma', type: 'pdf' },
    { name: 'Water_Management_Strategy.pdf', size: '853 B', date: '2026-07-04', uploader: 'Sanjay Sen', type: 'pdf' },
    { name: 'Carbon_Reduction_Action_Plan.pdf', size: '858 B', date: '2026-07-02', uploader: 'Priya Nair', type: 'pdf' },
    { name: 'ESG_Audit_Checklist.pdf', size: '859 B', date: '2026-06-28', uploader: 'Sanjay Sen', type: 'pdf' },
    { name: 'Meeting_Minutes_July_2026.docx', size: '87 B', date: '2026-07-01', uploader: 'Karan Sharma', type: 'docx' }
  ]

  // Helper to generate jsPDF document dynamically
  const generatePDFBlob = (docItem) => {
    const doc = new jsPDF()

    // 1. Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(16, 185, 129) // Emerald-500 (#10b981)
    doc.text("GreenCo Sustainability", 14, 22)
    
    doc.setDrawColor(226, 232, 240) // Slate-200
    doc.line(14, 28, 196, 28)

    // 2. Document Title & Metadata
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59) // Slate-800
    doc.text(`Document: ${docItem.name.replace(/_/g, ' ')}`, 14, 40)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139) // Slate-500
    doc.text(`File Owner: ${docItem.uploader}`, 14, 48)
    doc.text(`Upload Date: ${docItem.date}`, 14, 54)
    doc.text(`File Size: ${docItem.size}`, 14, 60)

    doc.line(14, 66, 196, 66)

    // 3. Mock Report Contents
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text("Mock Report Contents & Analysis Summary", 14, 76)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105) // Slate-600

    let contents = []
    const docLower = docItem.name.toLowerCase()
    if (docLower.includes("audit")) {
      contents = [
        "This compliance log represents the official GreenCo Sustainability audit check data.",
        "Systematic site evaluations verified emissions telemetry and boiler optimization logs.",
        "",
        "Key Findings:",
        "1. Facility scope alignment meets baseline standard specifications.",
        "2. Continuous data logging ensures a validated digital audit trail.",
        "3. Recommended action: perform follow-up energy balance tests on furnace systems."
      ]
    } else if (docLower.includes("hydrogen")) {
      contents = [
        "Proposal assessing transition of industrial blast furnaces to a hydrogen fuel blend.",
        "Calculated combustion efficiencies show a significant reduction in direct carbon emissions.",
        "",
        "Evaluation Parameters:",
        "- Gas supply telemetry flow rates and temperature tolerance limits.",
        "- Retrofitting burner heads to prevent leakage and thermal pressure stress.",
        "- Phase 2 strategy maps full scale green hydrogen fuel cell cells deployment."
      ]
    } else if (docLower.includes("water")) {
      contents = [
        "Strategic master plan detailing wastewater recycling and cooling tower performance improvements.",
        "Targeting a 40% reduction in municipal water extraction volumes by Q4 2026.",
        "",
        "Action Milestones:",
        "- Install advanced secondary filtration loops in utility lines.",
        "- Map local water stress indexes to adjust weekly usage threshold constraints."
      ]
    } else if (docLower.includes("carbon")) {
      contents = [
        "Scope 1 & 2 Carbon Reduction Action Plan for GreenCo manufacturing facilities.",
        "Aims to achieve a 25% reduction in total Scope 1 emissions through boiler retrofits.",
        "",
        "Roadmap items:",
        "- Transition from coal-fired boilers to biomass gasifier boiler units.",
        "- Enable real-time emission sensors for continuous telemetry mapping."
      ]
    } else {
      contents = [
        "Official GreenCo Shared document log outlining corporate ESG standards and action items.",
        "Authorized stakeholders are recommended to review files for quarterly alignment checks.",
        "",
        "Key parameters verified:",
        "- Environmental KPI logging protocols",
        "- Safety training checklists and employee feedback matrix tracker"
      ]
    }

    let y = 86
    contents.forEach(line => {
      doc.text(line, 14, y)
      y += 7
    })

    // 4. Footer
    doc.setFont("helvetica", "italic")
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184) // Slate-400
    doc.text("Page 1 of 1", 100, 285, { align: "center" })

    return doc.output("blob")
  }

  // Helper to generate docx document dynamically
  const generateDocxBlob = async (docItem) => {
    const docObj = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "GreenCo Sustainability Platform - Collaboration Portal",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Meeting Minutes - July 2026",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 120 }
          }),
          new Paragraph({
            text: "Official Compliance Log Reference: GC-MM-2026-07",
            spacing: { after: 240 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun("July 1, 2026 • 10:00 AM IST\n"),
              new TextRun({ text: "Owner / Moderator: ", bold: true }),
              new TextRun("Karan Sharma (Project Lead)\n"),
              new TextRun({ text: "Attendees: ", bold: true }),
              new TextRun("Priya Nair, Karan Sharma, Amit Sharma, Sanjay Sen"),
            ],
            spacing: { after: 240 }
          }),
          new Paragraph({
            text: "1. Agenda Overview",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "- Coimbatore site Q2 audit readiness evaluation and certification logs.",
            spacing: { after: 60 }
          }),
          new Paragraph({
            text: "- Furnace green hydrogen blend trial safety procedures approval.",
            spacing: { after: 60 }
          }),
          new Paragraph({
            text: "- Bangalore and Chennai operational coordination on biomass digestor feedstocks.",
            spacing: { after: 180 }
          }),
          new Paragraph({
            text: "2. Discussion Points",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Coimbatore Audit readiness: ", bold: true }),
              new TextRun("Priya confirmed all Scope 1 & 2 carbon footprint certificates are uploaded. The external auditor will arrive on July 12th.")
            ],
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Hydrogen Blend Safety: ", bold: true }),
              new TextRun("Karan presented burner head pressure limits. Thermal stress analysis is completed and approved.")
            ],
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Biomass Digestor: ", bold: true }),
              new TextRun("Feedstock supplies from Karnataka rural cooperatives are fully synced. Operational testing begins next Monday.")
            ],
            spacing: { after: 180 }
          }),
          new Paragraph({
            text: "3. Action Items & Assignments",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Action Task", bold: true })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Assignee", bold: true })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Deadline", bold: true })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Finalize verification checklists for audit" })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Priya Nair" })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "July 10, 2026" })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Upload Scope 1 furnace log telemetry attachment" })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Karan Sharma" })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "July 11, 2026" })],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({
            text: "4. Signatures & Approvals",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Signed off by: ", bold: true }),
              new TextRun("Karan Sharma (Project Lead)\n"),
              new TextRun({ text: "Reviewed by: ", bold: true }),
              new TextRun("Priya Nair (Reviewer)"),
            ],
            spacing: { after: 120 }
          })
        ]
      }]
    })

    const blob = await Packer.toBlob(docObj)
    return blob
  }

  // File Preview Handler
  const handlePreviewFile = (doc) => {
    if (!doc) return
    const ext = doc.name.split('.').pop().toLowerCase()
    if (doc.name === 'Meeting_Minutes_July_2026.docx') {
      setPreviewDoc(doc)
      setIsPreviewModalOpen(true)
    } else if (ext === 'pdf') {
      try {
        const blob = generatePDFBlob(doc)
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      } catch (err) {
        console.error("PDF generation failed:", err)
        toast.error("Document unavailable.")
      }
    } else {
      handleDownloadFile(doc)
    }
  }

  // File Download Handler
  const handleDownloadFile = async (doc) => {
    if (!doc) return
    const ext = doc.name.split('.').pop().toLowerCase()
    if (doc.name === 'Meeting_Minutes_July_2026.docx') {
      try {
        const blob = await generateDocxBlob(doc)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success(`Downloaded ${doc.name} successfully!`)
      } catch (err) {
        console.error("DOCX generation failed:", err)
        toast.error("Document unavailable.")
      }
    } else if (ext === 'pdf') {
      try {
        const blob = generatePDFBlob(doc)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success(`Downloaded ${doc.name} successfully!`)
      } catch (err) {
        console.error("PDF download failed:", err)
        toast.error("Document unavailable.")
      }
    } else {
      const path = `/documents/${doc.name}`
      fetch(path, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const link = document.createElement('a')
            link.href = path
            link.setAttribute('download', doc.name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success(`Downloaded ${doc.name} successfully!`)
          } else {
            toast.error("Document unavailable.")
          }
        })
        .catch(() => {
          toast.error("Document unavailable.")
        })
    }
  }

  // Toggle tasks status
  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'DONE' ? 'PENDING' : 'DONE'
        toast.success(nextStatus === 'DONE' ? 'Task marked completed' : 'Task reverted to pending')
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const msg = {
      id: Date.now(),
      channel: activeChannel,
      user: 'GreenCo User',
      text: newMessage,
      time: 'Just now',
      avatar: 'GU'
    }

    setMessages([...messages, msg])
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-emerald-500 fill-emerald-50" size={24} />
            Stakeholder Collaboration Portal
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Coordinate tasks, share files, manage team logs, and chat real-time across regional sustainability coordinators.
          </p>
        </div>
      </div>

      {/* Main Grid: Discussion + Tasks vs Files & Team Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        
        {/* Left Columns - Channels & Conversations & Tasks (70%) */}
        <div className="xl:col-span-7 space-y-6 min-w-0 flex flex-col">
          
          {/* Discussion board */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[400px]">
            {/* Channel panel (Left 30%) */}
            <div className="md:col-span-3 bg-slate-50/50 border-r border-slate-200 p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Discussion Channels</h4>
                  <p className="text-[9px] text-slate-400">Select active team context.</p>
                </div>
                <div className="space-y-1">
                  {channels.map(ch => (
                    <button
                      key={ch}
                      onClick={() => setActiveChannel(ch)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border-none outline-none cursor-pointer ${
                        activeChannel === ch 
                          ? 'bg-slate-800 text-white font-black' 
                          : 'text-slate-550 hover:bg-slate-200/50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chats messages timeline (Right 70%) */}
            <div className="md:col-span-7 flex flex-col justify-between h-full min-w-0">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-850 text-xs">{activeChannel}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Active Thread</span>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[260px] scrollbar-thin">
                {messages
                  .filter(m => m.channel === activeChannel)
                  .map(msg => (
                    <div key={msg.id} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 border border-slate-200">
                        {msg.avatar}
                      </div>
                      <div className="space-y-0.5 max-w-[85%]">
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <strong className="text-slate-800 font-extrabold">{msg.user}</strong>
                          <span className="text-slate-400 font-semibold">{msg.time}</span>
                        </div>
                        <p className="text-[11.5px] text-slate-650 leading-relaxed font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 shrink-0 bg-slate-50/50">
                <input
                  type="text"
                  placeholder={`Reply in ${activeChannel}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800"
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Task Assignments Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare size={15} className="text-emerald-600" />
                  Task Assignments Tracker
                </h3>
                <p className="text-[10px] text-slate-400">Coordinators audit actions checklist logs.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-150">
                <thead className="bg-slate-50/40">
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Audit Task Description</th>
                    <th className="px-6 py-3">Assignee</th>
                    <th className="px-6 py-3 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {tasks.map(t => (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-slate-50/30 transition-colors cursor-pointer ${
                        t.status === 'DONE' ? 'bg-slate-50/50 line-through text-slate-400' : ''
                      }`}
                      onClick={() => handleToggleTask(t.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={t.status === 'DONE'}
                          onChange={() => {}} // toggles on row click
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-800">{t.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{t.assignee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                          t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-650'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column - Team & Files Sidebar (30%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Shared files repository */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-indigo-650" />
                Shared Files Library
              </h3>
              <p className="text-[10px] text-slate-400">Collaboration documentation repo.</p>
            </div>

            <div className="space-y-3">
              {documents.map((doc, idx) => {
                const ext = doc.name.split('.').pop().toLowerCase();
                const isPdf = ext === 'pdf';
                return (
                  <div 
                    key={idx} 
                    onClick={() => handlePreviewFile(doc)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="shrink-0 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <FileText size={16} className={
                          ext === 'pdf' ? 'text-rose-500' :
                          ext === 'xlsx' ? 'text-emerald-500' :
                          ext === 'docx' ? 'text-blue-500' :
                          'text-slate-400'
                        } />
                      </div>
                      <div className="truncate">
                        <p className="font-extrabold text-slate-850 truncate group-hover:text-emerald-650 transition-colors">{doc.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold">
                          By: {doc.uploader} • {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handlePreviewFile(doc)}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 rounded border border-slate-200 cursor-pointer"
                        title={isPdf ? "Preview PDF" : "Open File"}
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(doc)}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 rounded border border-slate-200 cursor-pointer"
                        title="Download"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active team members list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users size={15} className="text-indigo-600" />
                Online Team Members
              </h3>
              <p className="text-[10px] text-slate-400">Lab active stakeholders.</p>
            </div>

            <div className="space-y-3.5">
              {team.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{t.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{t.role}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    t.status === 'online' ? 'bg-emerald-500 border border-emerald-350' : 'bg-slate-300 border border-slate-400'
                  }`} />
                </div>
              ))}
            </div>
          </div>

        </div>

      {/* Document Preview Modal */}
      {isPreviewModalOpen && previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">In-App Document Viewer</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsPreviewModalOpen(false); setPreviewDoc(null); }}
                className="p-1.5 hover:bg-slate-250 text-slate-450 hover:text-slate-650 rounded-lg transition-colors cursor-pointer text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed max-h-[calc(85vh-120px)]">
              <div className="text-center pb-4 border-b border-slate-100 space-y-1">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                  GreenCo Sustainability Platform
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 pt-1">
                  Meeting Minutes - July 2026
                </h1>
                <p className="text-[10px] text-slate-400">Collaboration Portal Log Reference: GC-MM-2026-07</p>
              </div>

              {/* Metadata Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150 text-[11px] font-bold text-slate-650">
                <div>
                  <span className="text-slate-400 block uppercase text-[8px] tracking-wider">Date & Time</span>
                  <span>July 1, 2026 • 10:00 AM IST</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[8px] tracking-wider">Owner / Moderator</span>
                  <span>Karan Sharma (Project Lead)</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block uppercase text-[8px] tracking-wider">Attendees</span>
                  <span>Priya Nair, Karan Sharma, Amit Sharma, Sanjay Sen</span>
                </div>
              </div>

              {/* Document Sections */}
              <div className="space-y-4 text-slate-650">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm uppercase tracking-wide text-emerald-600 border-b border-emerald-100 pb-1">
                    1. Agenda Overview
                  </h3>
                  <ul className="list-decimal pl-5 space-y-1">
                    <li>Coimbatore site Q2 audit readiness evaluation and certification logs.</li>
                    <li>Furnace green hydrogen blend trial safety procedures approval.</li>
                    <li>Bangalore and Chennai operational coordination on biomass digestor feedstocks.</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm uppercase tracking-wide text-emerald-600 border-b border-emerald-100 pb-1">
                    2. Discussion Points
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <span className="font-bold text-slate-855">Coimbatore Audit readiness:</span> Priya confirmed all Scope 1 & 2 carbon footprint certificates are uploaded. The external auditor will arrive on July 12th.
                    </li>
                    <li>
                      <span className="font-bold text-slate-855">Hydrogen Blend Safety:</span> Karan presented burner head pressure limits. Thermal stress analysis is completed and approved.
                    </li>
                    <li>
                      <span className="font-bold text-slate-855">Biomass Digestor:</span> Feedstock supplies from Karnataka rural cooperatives are fully synced. Operational testing begins next Monday.
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm uppercase tracking-wide text-emerald-600 border-b border-emerald-100 pb-1">
                    3. Action Items & Assignments
                  </h3>
                  <div className="border border-slate-150 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-150 text-[11px] text-left">
                      <thead className="bg-slate-55 text-slate-400 uppercase font-black tracking-wider text-[8px]">
                        <tr>
                          <th className="px-3.5 py-2">Action Task</th>
                          <th className="px-3.5 py-2">Assignee</th>
                          <th className="px-3.5 py-2">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-bold text-slate-700 bg-white">
                        <tr>
                          <td className="px-3.5 py-2">Finalize verification checklists for audit</td>
                          <td className="px-3.5 py-2 text-indigo-650">Priya Nair</td>
                          <td className="px-3.5 py-2 text-slate-500">July 10, 2026</td>
                        </tr>
                        <tr>
                          <td className="px-3.5 py-2">Upload Scope 1 furnace log telemetry attachment</td>
                          <td className="px-3.5 py-2 text-indigo-650">Karan Sharma</td>
                          <td className="px-3.5 py-2 text-slate-500">July 11, 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm uppercase tracking-wide text-emerald-600 border-b border-emerald-100 pb-1">
                    4. Signatures & Approvals
                  </h3>
                  <div className="flex justify-between items-center pt-2 text-[11px] font-bold text-slate-500">
                    <div className="text-center">
                      <div className="font-serif italic text-indigo-900 border-b border-slate-200 pb-1 px-4">Karan Sharma</div>
                      <span className="text-[9px] uppercase tracking-wider block pt-1 text-slate-400">Karan Sharma (Lead)</span>
                    </div>
                    <div className="text-center">
                      <div className="font-serif italic text-indigo-900 border-b border-slate-200 pb-1 px-4">Priya Nair</div>
                      <span className="text-[9px] uppercase tracking-wider block pt-1 text-slate-400">Priya Nair (Reviewer)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5 shrink-0">
              <button 
                onClick={() => { setIsPreviewModalOpen(false); setPreviewDoc(null); }}
                className="px-4 py-2 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-all border border-slate-250 cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => { handleDownloadFile(previewDoc); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} />
                Download DOCX
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
