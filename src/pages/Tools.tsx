import { useState } from 'react'
import { tools, courses } from '../data/mockData'
import type { ToolItem } from '../data/mockData'
import { useToast } from '../context/ToastContext'
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, ArrowRight } from '../components/Icons'
import {
  FigmaLogo, MicrosoftLogo, AdobeLogo, ZoomLogo, LinkedInLogo,
  TurnitinLogo, GrammarlyLogo, RespondusLogo,
  LibraryGlyph, StudyRoomGlyph, PrintGlyph, TechLabGlyph,
} from '../components/tools/ToolLogos'

// ─── Logo registry ────────────────────────────────────────────────────────────
// Maps tool.id → SVG logo component. Tools missing from the registry fall back
// to a coloured-abbr box so the page never crashes if data outpaces logos.

const toolLogos: Record<string, React.ComponentType<{ size?: number }>> = {
  figma: FigmaLogo,
  microsoft365: MicrosoftLogo,
  'adobe-cc': AdobeLogo,
  zoom: ZoomLogo,
  'linkedin-learning': LinkedInLogo,
  turnitin: TurnitinLogo,
  grammarly: GrammarlyLogo,
  respondus: RespondusLogo,
  library: LibraryGlyph,
  'study-rooms': StudyRoomGlyph,
  'print-centre': PrintGlyph,
  'tech-lab': TechLabGlyph,
}

// ─── Per-tool CTA labels ──────────────────────────────────────────────────────
// Each tool gets a context-appropriate CTA. Falls back to a status-default if a
// tool isn't in this map (e.g. when a new tool is added without a custom label).

interface CtaLabels {
  active?: string
  setupRequired?: string
  inactive?: string
}

const toolCtaLabels: Record<string, CtaLabels> = {
  turnitin:            { active: 'Open Turnitin' },
  respondus:           { inactive: 'Activates when needed' },
  zoom:                { active: 'Open Zoom' },
  'adobe-cc':          { setupRequired: 'Activate Student Licence' },
  figma:               { active: 'Open Figma' },
  microsoft365:        { active: 'Sign in with GBC email' },
  grammarly:           { setupRequired: 'Connect Premium Tier' },
  library:             { active: 'Search Catalogue' },
  'linkedin-learning': { active: 'Browse Courses' },
  'study-rooms':       { active: 'Book a Room' },
  'print-centre':      { active: 'Send a Print Job' },
  'tech-lab':          { active: 'Browse Equipment' },
}

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

const statusConfig: Record<ToolItem['status'], { label: string; icon: React.FC<{ size?: number }>; color: string; bg: string }> = {
  active:           { label: 'Active',     icon: CheckCircle, color: '#22C55E', bg: '#22C55E12' },
  'setup-required': { label: 'Set up',     icon: AlertCircle, color: '#F59E0B', bg: '#F59E0B12' },
  inactive:         { label: 'Not active', icon: Clock,       color: '#94A3B8', bg: '#94A3B812' },
}

// ─── Helper: pick the right CTA label for a given tool ───────────────────────

function getCtaLabel(tool: ToolItem): string {
  const overrides = toolCtaLabels[tool.id] ?? {}
  if (tool.status === 'active')         return overrides.active        ?? 'Launch'
  if (tool.status === 'setup-required') return overrides.setupRequired ?? 'Set Up Account'
  return overrides.inactive ?? 'Not available'
}

// ─── Tools Page ───────────────────────────────────────────────────────────────

export default function Tools() {
  const { toast } = useToast()
  // Tracks which cards have their long-form details expanded
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const activeCount = tools.filter(t => t.status === 'active').length

  function toggleExpand(toolId: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(toolId)) next.delete(toolId)
      else                  next.add(toolId)
      return next
    })
  }

  // Opens the real tool URL in a new tab and fires a toast for feedback.
  // Inactive tools get an info toast only — no navigation.
  function handleLaunch(tool: ToolItem) {
    if (tool.status === 'inactive') {
      toast(`${tool.name} isn't active this semester`, 'info')
    } else if (tool.status === 'setup-required') {
      toast(`Opening ${tool.name} account setup…`, 'info')
      window.open(tool.url, '_blank', 'noopener,noreferrer')
    } else {
      toast(`Launching ${tool.name}…`, 'success')
      window.open(tool.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="max-w-[1100px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
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
            <section key={cat} aria-labelledby={`tools-${cat}`}>
              <div className="mb-3">
                <h2 id={`tools-${cat}`} className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {cfg.label}
                </h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{cfg.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {catTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    expanded={expandedIds.has(tool.id)}
                    onToggleExpand={() => toggleExpand(tool.id)}
                    onLaunch={() => handleLaunch(tool)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Footer note ── Real mailto so the link actually does something. */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-8 text-center">
        Need a tool added? Contact your instructor or{' '}
        <a
          href="mailto:itsupport@georgebrown.ca?subject=Blackboard%20tool%20request"
          className="text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          GBC IT Support
        </a>.
      </p>
    </div>
  )
}

// ─── ToolCard sub-component ───────────────────────────────────────────────────
// Pulled out so the main Tools function stays focused on layout/orchestration.
// Receives everything it needs as props; owns no state of its own.

interface ToolCardProps {
  tool: ToolItem
  expanded: boolean
  onToggleExpand: () => void
  onLaunch: () => void
}

function ToolCard({ tool, expanded, onToggleExpand, onLaunch }: ToolCardProps) {
  const sc           = statusConfig[tool.status]
  const StatusIcon   = sc.icon
  const Logo         = toolLogos[tool.id]
  const ctaLabel     = getCtaLabel(tool)
  const isInactive   = tool.status === 'inactive'
  const isSetup      = tool.status === 'setup-required'
  const linkedCourseObjs = tool.linkedCourses
    ? tool.linkedCourses.map(id => courses.find(c => c.id === id)).filter(Boolean)
    : []

  return (
    <div
      className={`bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5 flex flex-col gap-3 transition-all ${
        isInactive ? 'opacity-70' : 'hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)]'
      }`}
    >
      {/* Top row: logo + name + status pill */}
      <div className="flex items-start gap-3">

        {/* Logo box — uses real SVG when available, falls back to abbr */}
        <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-[#0F1623] flex items-center justify-center shrink-0 overflow-hidden">
          {Logo ? (
            <Logo size={28} />
          ) : (
            // Fallback for any tool without a registered logo
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-[11px]"
              style={{ background: tool.color }}
            >
              {tool.abbr}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 leading-tight">{tool.name}</h3>
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: sc.bg, color: sc.color }}
            >
              <StatusIcon size={10} />
              {sc.label}
            </span>
          </div>
          {/* Short tagline — always visible */}
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Expandable details */}
      {tool.details && (
        <div>
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-controls={`details-${tool.id}`}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
          >
            {expanded ? 'Show less' : 'Show more'}
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          {expanded && (
            <p
              id={`details-${tool.id}`}
              className="text-[12px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed pl-3 border-l-2 border-gray-100 dark:border-[#2D3A52]"
            >
              {tool.details}
            </p>
          )}
        </div>
      )}

      {/* Linked courses */}
      {linkedCourseObjs.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Used in:</span>
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
      ) : (
        <p className="text-[10px] text-gray-400 dark:text-gray-500">Available to all students</p>
      )}

      {/* CTA — pinned to bottom of the card */}
      <div className="mt-auto pt-1">
        <button
          type="button"
          onClick={onLaunch}
          disabled={isInactive}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
            isInactive
              ? 'bg-gray-100 dark:bg-[#232d42] text-gray-400 dark:text-gray-500 cursor-default'
              : isSetup
                ? 'border hover:opacity-90'
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
          {ctaLabel}
          {!isInactive && <ArrowRight size={12} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
