import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ClipboardList, Award, Megaphone, ChevronDown, X, ArrowRight } from '../components/Icons'
import { activityItems, courses, getCourse } from '../data/mockData'
import type { ActivityItem } from '../data/mockData'

// ─── Constants ────────────────────────────────────────────────────────────────

const typeConfig: Record<ActivityItem['type'], { icon: React.FC<any>; label: string; color: string; bg: string }> = {
  resource:     { icon: FileText,      label: 'Resource',     color: '#06B6D4', bg: '#06B6D418' },
  assignment:   { icon: ClipboardList, label: 'Assignment',   color: '#F97316', bg: '#F9731618' },
  grade:        { icon: Award,         label: 'Grade',        color: '#22C55E', bg: '#22C55E18' },
  announcement: { icon: Megaphone,     label: 'Announcement', color: '#8B5CF6', bg: '#8B5CF618' },
}

// ─── Activity Stream ───────────────────────────────────────────────────────────

export default function ActivityStream() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['a1']))
  const [courseFilter, setCourseFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredItems = useMemo(() => {
    return activityItems.filter(item => {
      if (courseFilter && item.courseId !== courseFilter) return false
      if (typeFilter && item.type !== typeFilter) return false
      return true
    })
  }, [courseFilter, typeFilter])

  const hasFilters = courseFilter !== null || typeFilter !== null

  return (
    <div className="max-w-[860px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Activity Stream</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {hasFilters && ' · filtered'}
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={() => { setCourseFilter(null); setTypeFilter(null) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232d42] transition-colors mt-1"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-4 mb-5 space-y-3">

        {/* Type chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide shrink-0 w-12">Type</span>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(typeConfig) as [ActivityItem['type'], typeof typeConfig[ActivityItem['type']]][]).map(([type, cfg]) => {
              const active = typeFilter === type
              return (
                <button
                  key={type}
                  onClick={() => setTypeFilter(active ? null : type)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                    active
                      ? ''
                      : 'border-gray-200 dark:border-[#2D3A52] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#232d42] hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  style={active ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color } : undefined}
                >
                  <cfg.icon size={11} />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Course chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide shrink-0 w-12">Course</span>
          <div className="flex gap-1.5 flex-wrap">
            {courses.map(c => {
              const active = courseFilter === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCourseFilter(active ? null : c.id)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold border transition-all duration-150 ${
                    active
                      ? ''
                      : 'bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-[#2a354d]'
                  }`}
                  style={active ? { background: `${c.color}20`, borderColor: c.color, color: c.color } : undefined}
                >
                  {c.abbr}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-[15px] font-medium">No activity matches your filters</p>
          <button
            onClick={() => { setCourseFilter(null); setTypeFilter(null) }}
            className="mt-2 text-[13px] text-[#2563EB] dark:text-[#60A5FA] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gray-200 dark:bg-[#2D3A52]" />
          <div className="space-y-4">
            {filteredItems.map(item => {
              const course = getCourse(item.courseId)
              const cfg = typeConfig[item.type]
              const Icon = cfg.icon
              const isOpen = expanded.has(item.id)

              return (
                <div key={item.id} className="relative flex gap-4">
                  {/* Timeline node */}
                  <div className="relative z-10 shrink-0 mt-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#1A2236] border-2 border-gray-100 dark:border-[#2D3A52]">
                      <Icon size={16} style={{ color: cfg.color }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden cursor-pointer hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.25)] transition-shadow duration-150"
                    onClick={() => toggle(item.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: course.color }}
                        >
                          {course.abbr}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-[14px] text-gray-900 dark:text-gray-100">{item.title}</h3>
                            <span
                              className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                            {course.name} · {item.date} · {item.timeRange}
                          </p>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-4 pb-4">
                        <div className="ml-11 p-3.5 rounded-xl bg-gray-50 dark:bg-[#0C0F1A] border border-gray-100 dark:border-[#2D3A52]">
                          <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{item.body}</p>
                          {item.linkTo && (
                            <Link
                              to={item.linkTo}
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                            >
                              {item.type === 'grade' ? 'View feedback' : item.type === 'assignment' ? 'View assignment' : 'View details'}
                              <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
