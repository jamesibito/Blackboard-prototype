import { tools, courses } from '../data/mockData'
import type { ToolItem } from '../data/mockData'
import { useToast } from '../context/ToastContext'
import { CheckCircle, AlertCircle, Clock } from '../components/Icons'

// ─── Category config ──────────────────────────────────────────────────────────

const categoryConfig: Record<ToolItem['category'], { label: string; description: string }> = {
  assessment:    { label: 'Assessment',         description: 'Submission, integrity, and exam tools' },
  communication: { label: 'Communication',      description: 'Office hours, lectures, and messaging' },
  productivity:  { label: 'Productivity',       description: 'Design, writing, and office software' },
  library:       { label: 'Library & Research', description: 'Databases, journals, and learning resources' },
  campus:        { label: 'Campus Services',    description: 'Book rooms, print, and rent equipment on campus' },
}

const categoryOrder: ToolItem['category'][] = ['productivity', 'assessment', 'communication', 'library', 'campus']

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<ToolItem['status'], { label: string; icon: React.FC<any>; color: string; bg: string }> = {
  active:          { label: 'Active',       icon: CheckCircle,  color: '#22C55E', bg: '#22C55E12' },
  'setup-required':{ label: 'Set up',       icon: AlertCircle,  color: '#F59E0B', bg: '#F59E0B12' },
  inactive:        { label: 'Not active',   icon: Clock,        color: '#94A3B8', bg: '#94A3B812' },
}

// ─── Tools Page ───────────────────────────────────────────────────────────────

export default function Tools() {
  const { toast } = useToast()

  const activeCount = tools.filter(t => t.status === 'active').length

  function handleLaunch(tool: ToolItem) {
    if (tool.status === 'inactive') {
      toast(`${tool.name} is not active this semester`, 'info')
    } else if (tool.status === 'setup-required') {
      toast(`Opening ${tool.name} setup…`, 'info')
    } else {
      toast(`Launching ${tool.name}…`, 'success')
    }
  }

  return (
    <div className="max-w-[960px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Tools</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {activeCount} of {tools.length} integrations active this semester
          </p>
        </div>
      </div>

      {/* ── Category sections ── */}
      <div className="space-y-8">
        {categoryOrder.map(cat => {
          const catTools = tools.filter(t => t.category === cat)
          if (catTools.length === 0) return null
          const cfg = categoryConfig[cat]
          return (
            <div key={cat}>
              <div className="mb-3">
                <h2 className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{cfg.label}</h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{cfg.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {catTools.map(tool => {
                  const sc       = statusConfig[tool.status]
                  const SIcon    = sc.icon
                  const isSetup    = tool.status === 'setup-required'
                  const isInactive = tool.status === 'inactive'
                  const linkedCourseObjs = tool.linkedCourses
                    ? tool.linkedCourses.map(id => courses.find(c => c.id === id)).filter(Boolean)
                    : []

                  return (
                    <div
                      key={tool.id}
                      className={`bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5 flex gap-4 transition-all ${
                        isInactive ? 'opacity-60' : 'hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)]'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[12px] shrink-0"
                        style={{ background: isInactive ? '#94A3B8' : tool.color }}
                      >
                        {tool.abbr}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 leading-tight">{tool.name}</h3>
                          <span
                            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            <SIcon size={10} />
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>

                        {/* Linked courses */}
                        {linkedCourseObjs.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {linkedCourseObjs.map(c => c && (
                              <span
                                key={c.id}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: `${c.color}18`, color: c.color }}
                              >
                                {c.abbr}
                              </span>
                            ))}
                          </div>
                        )}
                        {!tool.linkedCourses && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">Available to all students</p>
                        )}

                        <button
                          onClick={() => handleLaunch(tool)}
                          className={`mt-3 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                            isInactive
                              ? 'bg-gray-100 dark:bg-[#232d42] text-gray-400 dark:text-gray-500 cursor-default'
                              : isSetup
                                ? 'border'
                                : 'text-white hover:opacity-90'
                          }`}
                          style={
                            !isInactive
                              ? isSetup
                                ? { borderColor: tool.color, color: tool.color, background: 'transparent' }
                                : { background: tool.color }
                              : undefined
                          }
                        >
                          {isInactive ? 'Not available' : isSetup ? 'Set Up Account →' : 'Launch →'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Footer note ── */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-8 text-center">
        Need a tool added? Contact your instructor or{' '}
        <span className="text-[#2563EB] dark:text-[#60A5FA] cursor-pointer hover:underline" onClick={() => toast('Opening IT support portal…', 'info')}>
          GBC IT Support
        </span>.
      </p>
    </div>
  )
}
