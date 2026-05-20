import { useState } from 'react'
import { Link } from 'react-router-dom'
import { discussionThreads, courses } from '../data/mockData'
import type { DiscussionThread } from '../data/mockData'
import { MessageCircle, Plus, ChevronRight, X, Send } from '../components/Icons'
import { useToast } from '../context/ToastContext'
import ThreadDetailModal from '../components/ThreadDetailModal'

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
  // Composer state — open/close + form fields. Threads created here live only
  // in component state (`localThreads`) since this is a portfolio prototype.
  const [composerOpen, setComposerOpen] = useState(false)
  const [draftTitle, setDraftTitle]     = useState('')
  const [draftBody, setDraftBody]       = useState('')
  const [draftTag, setDraftTag]         = useState<DiscussionThread['tag']>('discussion')
  const [draftCourseId, setDraftCourseId] = useState<string>('')   // '' = college-wide
  const [localThreads, setLocalThreads] = useState<DiscussionThread[]>([])
  // Thread detail modal — opens when a thread card is clicked. Replies added in
  // the modal live here, keyed by thread id, so they persist across reopens.
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [threadReplies, setThreadReplies] = useState<Record<string, string[]>>({})

  // Combined list — newly composed threads appear at the top so the user sees
  // the result of their action immediately
  const allThreads = [...localThreads, ...discussionThreads]

  const filtered = allThreads.filter(t => {
    if (tagFilter && t.tag !== tagFilter) return false
    if (courseFilter === COLLEGE_ID && t.courseId !== null) return false
    if (courseFilter && courseFilter !== COLLEGE_ID && t.courseId !== courseFilter) return false
    return true
  })

  const unreadCount = allThreads.filter(t => !readIds.has(t.id)).length

  function markRead(id: string) {
    setReadIds(prev => new Set([...prev, id]))
  }

  // Close composer + reset draft fields
  function closeComposer() {
    setComposerOpen(false)
    setDraftTitle('')
    setDraftBody('')
    setDraftTag('discussion')
    setDraftCourseId('')
  }

  function publishThread() {
    const title = draftTitle.trim()
    const body  = draftBody.trim()
    if (!title || !body) return

    const newThread: DiscussionThread = {
      id: `local-${Date.now()}`,
      courseId: draftCourseId || null,
      title,
      preview: body,
      author: 'Kevin H.',
      authorType: 'student',
      date: 'Just now',
      replyCount: 0,
      isPinned: false,
      isRead: true,        // own posts are auto-read
      tag: draftTag,
    }

    setLocalThreads(prev => [newThread, ...prev])
    setReadIds(prev => new Set([...prev, newThread.id]))
    closeComposer()
    toast('Thread posted', 'success')
  }

  const canPublish = draftTitle.trim().length > 0 && draftBody.trim().length > 0

  return (
    <div className="max-w-[900px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Communities</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-400 mt-0.5">
            {filtered.length} threads · {unreadCount > 0 ? `${unreadCount} unread` : 'all caught up'}
          </p>
        </div>
        <button
          onClick={() => setComposerOpen(o => !o)}
          aria-expanded={composerOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--tenant-primary)] hover:brightness-90 text-white text-[13px] font-semibold transition-colors"
        >
          <Plus size={14} className={`transition-transform ${composerOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
          {composerOpen ? 'Close' : 'New Thread'}
        </button>
      </div>

      {/* ── Inline composer ──
          Opens above the filter bar when the user clicks New Thread. Threads
          published here are added to local state and appear at the top of the
          list immediately. */}
      {composerOpen && (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-[var(--tenant-primary)]/30 dark:border-[var(--tenant-link-dark)]/20 shadow-sm p-5 mb-5 ring-1 ring-[var(--tenant-primary)]/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Start a new thread</h2>
            <button
              onClick={closeComposer}
              aria-label="Close composer"
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#232d42] text-gray-400"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>

          {/* Title */}
          <input
            type="text"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            placeholder="Thread title…"
            className="w-full h-10 px-3.5 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition mb-2"
            autoFocus
          />

          {/* Body */}
          <textarea
            value={draftBody}
            onChange={e => setDraftBody(e.target.value)}
            placeholder="Share a question, observation, or resource…"
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[12.5px] text-gray-700 dark:text-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 resize-none transition leading-relaxed mb-3"
          />

          {/* Meta row: tag + course + publish */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={draftTag}
              onChange={e => setDraftTag(e.target.value as DiscussionThread['tag'])}
              aria-label="Thread type"
              className="h-9 px-3 rounded-lg bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[12px] text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition"
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="resource">Resource</option>
              <option value="announcement">Announcement</option>
            </select>

            <select
              value={draftCourseId}
              onChange={e => setDraftCourseId(e.target.value)}
              aria-label="Course context"
              className="h-9 px-3 rounded-lg bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[12px] text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition"
            >
              <option value="">College-wide</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={publishThread}
              disabled={!canPublish}
              className={`ml-auto flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold text-white transition-colors ${
                canPublish
                  ? 'bg-[var(--tenant-primary)] hover:brightness-90'
                  : 'bg-[var(--tenant-primary)]/40 cursor-not-allowed'
              }`}
            >
              <Send size={11} aria-hidden="true" />
              Publish
            </button>
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-4 mb-5 space-y-3">

        {/* Tag chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide w-10 shrink-0">Type</span>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(tagConfig) as [DiscussionThread['tag'], typeof tagConfig[DiscussionThread['tag']]][]).map(([tag, cfg]) => {
              const active = tagFilter === tag
              return (
                <button
                  key={tag}
                  onClick={() => setTagFilter(active ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                    active ? '' : 'border-gray-200 dark:border-[#2D3A52] text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#232d42]'
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
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide w-10 shrink-0">Course</span>
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
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#232d42] flex items-center justify-center mb-4">
            <MessageCircle size={26} className="text-gray-400 dark:text-gray-400" />
          </div>
          <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">No threads match your filters</p>
          <p className="text-[13px] text-gray-400 dark:text-gray-400 mt-1 text-center max-w-[240px]">
            Try a different tag or course, or start a new thread.
          </p>
          <button
            onClick={() => { setCourseFilter(null); setTagFilter(null) }}
            className="mt-4 px-4 py-2 rounded-xl bg-[var(--tenant-primary)] hover:brightness-90 text-white text-[13px] font-semibold transition-colors"
          >
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
                onClick={() => { markRead(thread.id); setOpenThreadId(thread.id) }}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    markRead(thread.id)
                    setOpenThreadId(thread.id)
                  }
                }}
                aria-label={`Open thread: ${thread.title}`}
                className={`bg-white dark:bg-[#1A2236] rounded-2xl border transition-all cursor-pointer hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none ${
                  isRead
                    ? 'border-gray-100 dark:border-[#2D3A52]'
                    : 'border-[var(--tenant-primary)]/20 dark:border-[var(--tenant-link-dark)]/15'
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
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--tenant-primary)]" />
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
                      <ChevronRight size={14} className="text-gray-300 dark:text-gray-500 shrink-0 mt-0.5" />
                    </div>

                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {thread.preview}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{thread.author}</span>
                      <span className="text-gray-300 dark:text-gray-500 text-[10px]">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-400">{thread.date}</span>
                      <span className="text-gray-300 dark:text-gray-500 text-[10px]">·</span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-400">
                        <MessageCircle size={11} />
                        {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                      </span>
                      {course && (
                        <>
                          <span className="text-gray-300 dark:text-gray-500 text-[10px]">·</span>
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

      {/* Thread detail modal — renders only when openThreadId is set */}
      {openThreadId && (() => {
        const thread = allThreads.find(t => t.id === openThreadId)
        if (!thread) return null
        return (
          <ThreadDetailModal
            thread={thread}
            sessionReplies={threadReplies[thread.id] ?? []}
            onClose={() => setOpenThreadId(null)}
            onReplySubmit={text =>
              setThreadReplies(prev => ({
                ...prev,
                [thread.id]: [...(prev[thread.id] ?? []), text],
              }))
            }
          />
        )
      })()}
    </div>
  )
}
