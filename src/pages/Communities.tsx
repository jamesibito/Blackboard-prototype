import { useState } from 'react'
import { Link } from 'react-router-dom'
import { discussionThreads, courses } from '../data/mockData'
import type { DiscussionThread } from '../data/mockData'
import { MessageCircle, Plus, ChevronRight } from '../components/Icons'
import { useToast } from '../context/ToastContext'

// ─── Tag config ───────────────────────────────────────────────────────────────

const tagConfig: Record<DiscussionThread['tag'], { label: string; color: string; bg: string }> = {
  question:     { label: 'Question',     color: '#F97316', bg: '#F9731618' },
  discussion:   { label: 'Discussion',   color: '#8B5CF6', bg: '#8B5CF618' },
  announcement: { label: 'Announcement', color: '#2563EB', bg: '#2563EB18' },
  resource:     { label: 'Resource',     color: '#06B6D4', bg: '#06B6D418' },
}

// Sentinel for college-wide filter
const COLLEGE_ID = '__college__'

// ─── Communities Page ─────────────────────────────────────────────────────────

export default function Communities() {
  const { toast } = useToast()
  const [courseFilter, setCourseFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter]       = useState<DiscussionThread['tag'] | null>(null)
  const [readIds, setReadIds]           = useState<Set<string>>(
    new Set(discussionThreads.filter(t => t.isRead).map(t => t.id))
  )

  const filtered = discussionThreads.filter(t => {
    if (tagFilter && t.tag !== tagFilter) return false
    if (courseFilter === COLLEGE_ID && t.courseId !== null) return false
    if (courseFilter && courseFilter !== COLLEGE_ID && t.courseId !== courseFilter) return false
    return true
  })

  const unreadCount = discussionThreads.filter(t => !readIds.has(t.id)).length

  function markRead(id: string) {
    setReadIds(prev => new Set([...prev, id]))
  }

  return (
    <div className="max-w-[900px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Communities</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {filtered.length} threads · {unreadCount > 0 ? `${unreadCount} unread` : 'all caught up'}
          </p>
        </div>
        <button
          onClick={() => toast('New thread composer coming soon!', 'info')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold transition-colors"
        >
          <Plus size={14} />
          New Thread
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-4 mb-5 space-y-3">

        {/* Tag chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-10 shrink-0">Type</span>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(tagConfig) as [DiscussionThread['tag'], typeof tagConfig[DiscussionThread['tag']]][]).map(([tag, cfg]) => {
              const active = tagFilter === tag
              return (
                <button
                  key={tag}
                  onClick={() => setTagFilter(active ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                    active ? '' : 'border-gray-200 dark:border-[#2D3A52] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#232d42]'
                  }`}
                  style={active ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color } : undefined}
                >
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Course chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-10 shrink-0">Course</span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCourseFilter(courseFilter === COLLEGE_ID ? null : COLLEGE_ID)}
              className={`px-3 py-1 rounded-full text-[12px] font-bold border transition-all ${
                courseFilter === COLLEGE_ID ? '' : 'bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 border-transparent'
              }`}
              style={courseFilter === COLLEGE_ID ? { background: '#1B3F8918', borderColor: '#1B3F89', color: '#1B3F89' } : undefined}
            >
              GBC
            </button>
            {courses.map(c => {
              const active = courseFilter === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCourseFilter(active ? null : c.id)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold border transition-all ${
                    active ? '' : 'bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 border-transparent'
                  }`}
                  style={active ? { background: `${c.color}18`, borderColor: c.color, color: c.color } : undefined}
                >
                  {c.abbr}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Thread list ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500 dark:text-gray-400">No threads match your filters</p>
          <button onClick={() => { setCourseFilter(null); setTagFilter(null) }} className="mt-2 text-[13px] text-[#2563EB] dark:text-[#60A5FA] hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(thread => {
            const isRead      = readIds.has(thread.id)
            const course      = thread.courseId ? courses.find(c => c.id === thread.courseId) : null
            const avatarColor = course ? course.color : '#1B3F89'
            const avatarLabel = course ? course.abbr  : 'GBC'
            const tagCfg      = tagConfig[thread.tag]

            return (
              <div
                key={thread.id}
                onClick={() => { markRead(thread.id); toast(`Opening "${thread.title.slice(0, 40)}…"`, 'info') }}
                className={`bg-white dark:bg-[#1A2236] rounded-2xl border transition-all cursor-pointer hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)] ${
                  isRead
                    ? 'border-gray-100 dark:border-[#2D3A52]'
                    : 'border-[#2563EB]/20 dark:border-[#60A5FA]/15'
                }`}
              >
                {/* Pinned banner */}
                {thread.isPinned && (
                  <div className="flex items-center gap-2 px-5 pt-3 pb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Pinned</span>
                  </div>
                )}

                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Unread dot + avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    {!isRead && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    )}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ background: avatarColor }}
                    >
                      {avatarLabel}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h3 className={`text-[14px] leading-snug truncate ${isRead ? 'font-medium text-gray-700 dark:text-gray-300' : 'font-bold text-gray-900 dark:text-gray-100'}`}>
                          {thread.title}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: tagCfg.bg, color: tagCfg.color }}>
                          {tagCfg.label}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                    </div>

                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {thread.preview}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{thread.author}</span>
                      <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{thread.date}</span>
                      <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                        <MessageCircle size={11} />
                        {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                      </span>
                      {course && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                          <Link
                            to={`/courses/${course.id}`}
                            onClick={e => e.stopPropagation()}
                            className="text-[11px] font-semibold hover:underline"
                            style={{ color: course.color }}
                          >
                            {course.name}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
