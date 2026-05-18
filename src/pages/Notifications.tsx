import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notifications, getCourse } from '../data/mockData'
import type { Notification } from '../data/mockData'
import { Award, ClipboardList, FileText, Megaphone } from '../components/Icons'

// ─── Config ───────────────────────────────────────────────────────────────────

// Each notification type gets a colour + icon for visual scanning
const typeConfig: Record<Notification['type'], { color: string; bg: string; icon: React.FC<any>; label: string }> = {
  grade:        { color: '#22C55E', bg: '#22C55E18', icon: Award,         label: 'Grade' },
  assignment:   { color: '#F97316', bg: '#F9731618', icon: ClipboardList, label: 'Assignment' },
  announcement: { color: '#8B5CF6', bg: '#8B5CF618', icon: Megaphone,     label: 'Announcement' },
  resource:     { color: '#06B6D4', bg: '#06B6D418', icon: FileText,      label: 'Resource' },
}

// Section headers for the three time groups
const groupLabels: Record<Notification['timeGroup'], string> = {
  'today':     'Today',
  'this-week': 'This Week',
  'earlier':   'Earlier',
}

const typeFilters = ['All', 'Grade', 'Assignment', 'Announcement', 'Resource'] as const

// ─── Notifications Page ───────────────────────────────────────────────────────

export default function Notifications() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [items, setItems] = useState(notifications)

  const unreadCount = items.filter(n => n.unread).length

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })))

  const filtered = typeFilter === 'All'
    ? items
    : items.filter(n => n.type === typeFilter.toLowerCase())

  // Split filtered list into three groups in display order
  const groups: Notification['timeGroup'][] = ['today', 'this-week', 'earlier']

  return (
    <div className="max-w-[720px]">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Notifications</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="mt-1 text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Type filter chips ── */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {typeFilters.map(f => {
          const active = typeFilter === f
          const cfg = f !== 'All' ? typeConfig[f.toLowerCase() as Notification['type']] : null
          return (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                active
                  ? ''
                  : 'border-gray-200 dark:border-[#2D3A52] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#232d42] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              style={active && cfg ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color }
                : active ? { background: '#2563EB18', borderColor: '#2563EB', color: '#2563EB' }
                : undefined}
            >
              {cfg && <cfg.icon size={11} />}
              {f}
            </button>
          )
        })}
      </div>

      {/* ── Grouped notification list ── */}
      <div className="space-y-6">
        {groups.map(group => {
          const groupItems = filtered.filter(n => n.timeGroup === group)
          if (groupItems.length === 0) return null

          return (
            <div key={group}>
              {/* Group heading */}
              <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 px-1">
                {groupLabels[group]}
              </h2>

              <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden divide-y divide-gray-100 dark:divide-[#232d42]">
                {groupItems.map(n => {
                  const cfg    = typeConfig[n.type]
                  const Icon   = cfg.icon
                  const course = n.courseId ? getCourse(n.courseId) : undefined

                  return (
                    <button
                      key={n.id}
                      className="flex items-start gap-4 w-full px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors"
                      onClick={() => {
                        // Mark this notification as read, then navigate if it has a link
                        setItems(prev => prev.map(item =>
                          item.id === n.id ? { ...item, unread: false } : item
                        ))
                        if (n.linkTo) {
                          n.linkTo.startsWith('http')
                            ? window.open(n.linkTo, '_blank', 'noopener,noreferrer')
                            : navigate(n.linkTo)
                        }
                      }}
                    >
                      {/* Unread indicator dot */}
                      <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                        <div
                          className="w-2 h-2 rounded-full transition-colors"
                          style={{
                            background: n.unread ? cfg.color : 'transparent',
                            border: n.unread ? 'none' : '1.5px solid #94a3b8',
                          }}
                        />
                      </div>

                      {/* Type icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: cfg.bg }}
                      >
                        <Icon size={16} style={{ color: cfg.color }} />
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          {/* Course pill (if course-specific) */}
                          {course && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: `${course.color}18`, color: course.color }}
                            >
                              {course.abbr}
                            </span>
                          )}
                          {/* Type badge */}
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label.toUpperCase()}
                          </span>
                        </div>

                        <p className={`text-[13px] leading-snug ${
                          n.unread
                            ? 'font-semibold text-gray-900 dark:text-gray-100'
                            : 'font-normal text-gray-700 dark:text-gray-300'
                        }`}>
                          {n.title}
                        </p>

                        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1 line-clamp-2">
                          {n.body}
                        </p>

                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{n.time}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Empty state — filter returned no results */}
        {filtered.length === 0 && typeFilter !== 'All' && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#232d42] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">No {typeFilter.toLowerCase()} notifications</p>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 text-center max-w-[240px]">
              Nothing here right now. Check back later or broaden your filter.
            </p>
            <button
              onClick={() => setTypeFilter('All')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold transition-colors"
            >
              Show all notifications
            </button>
          </div>
        )}

        {/* All-clear state — "All" filter selected but everything is read */}
        {filtered.length === 0 && typeFilter === 'All' && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">You're all caught up</p>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 text-center max-w-[240px]">
              No new notifications. We'll let you know when something needs your attention.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
