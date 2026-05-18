import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Send, MessageCircle, Reply } from './Icons'
import type { DiscussionThread } from '../data/mockData'
import { getCourse } from '../data/mockData'
import { useToast } from '../context/ToastContext'

/**
 * ThreadDetailModal
 * ─────────────────
 * Opens when a user clicks a discussion thread on the Communities page.
 * Shows the original post, a deterministic preview of replies (so the page
 * doesn't look empty — uses thread.id as a seed so each thread has stable
 * fake replies), and a composer for adding new replies that persist for the
 * session via the parent's state.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal + aria-labelledby on the title
 *   - ESC dismisses
 *   - Backdrop click dismisses
 *   - Body scroll locked while open
 *   - Initial focus on the reply composer
 */

interface Props {
  thread: DiscussionThread
  /** Local replies added this session (composer submissions). Keyed by thread id. */
  sessionReplies: string[]
  onClose: () => void
  onReplySubmit: (text: string) => void
}

const tagConfig: Record<DiscussionThread['tag'], { label: string; color: string; bg: string }> = {
  question:     { label: 'Question',     color: '#F97316', bg: '#F9731618' },
  discussion:   { label: 'Discussion',   color: '#8B5CF6', bg: '#8B5CF618' },
  announcement: { label: 'Announcement', color: '#2563EB', bg: '#2563EB18' },
  resource:     { label: 'Resource',     color: '#06B6D4', bg: '#06B6D418' },
}

// ─── Sample-reply generator ──────────────────────────────────────────────────
// Returns a stable list of 2-4 plausible replies seeded from thread.id so
// every refresh shows the same content. Names/initials are pulled from a small
// pool of believable classmate names.
const REPLY_POOL = [
  { name: 'Aisha M.',    initials: 'AM', color: '#EC4899' },
  { name: 'Daniel C.',   initials: 'DC', color: '#22C55E' },
  { name: 'Priya K.',    initials: 'PK', color: '#F97316' },
  { name: 'Marcus L.',   initials: 'ML', color: '#8B5CF6' },
  { name: 'Sara T.',     initials: 'ST', color: '#06B6D4' },
  { name: 'Jordan W.',   initials: 'JW', color: '#EF4444' },
]

// Replies are tagged with one of these "shapes" so each thread feels organic.
// Keeps the prose plausible without needing per-thread custom data.
const REPLY_TEMPLATES = [
  'Thanks for posting this — really helpful. I had the same question about Section 3.',
  'I went with the wordmark version too. The icon-only felt too generic for the brief.',
  'Same boat — bookmarking this thread. Going to compare notes after the deadline.',
  'Quick note: the rubric says minimum 3 applications. I almost missed that.',
  'Booked a slot. Let me know if you need someone for evening sessions.',
  'Just submitted mine. Took longer than expected — give yourself extra time on the rationale.',
  'Anyone else having trouble exporting at 300dpi? My Illustrator file is huge.',
  'For what it\'s worth, the office hours notes covered most of this already.',
  'Following — also stuck on the same part.',
  'Try checking the brief on page 4. There\'s a clarification footnote that helps.',
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

interface Reply {
  authorName: string
  authorInitials: string
  authorColor: string
  body: string
  daysAgo: number
}

function generateReplies(thread: DiscussionThread): Reply[] {
  // Show 2-4 replies based on hash, capped by the actual replyCount so a
  // thread with 1 reply doesn't fake 4.
  const seed = hashString(thread.id)
  const showCount = Math.min(thread.replyCount, 2 + (seed % 3))   // 2..4
  const out: Reply[] = []
  for (let i = 0; i < showCount; i++) {
    const author = REPLY_POOL[(seed + i * 7) % REPLY_POOL.length]
    const body   = REPLY_TEMPLATES[(seed + i * 13) % REPLY_TEMPLATES.length]
    out.push({
      authorName:     author.name,
      authorInitials: author.initials,
      authorColor:    author.color,
      body,
      // Sample threads are dated Dec 1–13 — replies are 0–3 days after.
      daysAgo: showCount - i,
    })
  }
  return out
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export default function ThreadDetailModal({ thread, sessionReplies, onClose, onReplySubmit }: Props) {
  const { toast } = useToast()
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState('')

  const tag    = tagConfig[thread.tag]
  const course = thread.courseId ? getCourse(thread.courseId) : null
  const baseReplies = generateReplies(thread)
  const totalReplies = thread.replyCount + sessionReplies.length
  const moreCount = Math.max(0, totalReplies - baseReplies.length - sessionReplies.length)

  // a11y: ESC, scroll lock, autofocus composer
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    composerRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  function submitReply() {
    const text = draft.trim()
    if (!text) return
    onReplySubmit(text)
    setDraft('')
    toast('Reply posted', 'success')
  }

  // Cmd/Ctrl+Enter to send from the composer — same shortcut as Messages
  function onComposerKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submitReply()
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="thread-detail-title"
      onClick={onBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-[680px] max-h-[88vh] bg-white dark:bg-[#1A2236] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2D3A52] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <header className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-[#2D3A52]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: tag.bg, color: tag.color }}
              >
                {tag.label}
              </span>
              {course && (
                <Link
                  to={`/courses/${course.id}`}
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                  style={{ background: `${course.color}18`, color: course.color }}
                  title={`Open ${course.name}`}
                >
                  {course.abbr} · {course.name}
                </Link>
              )}
              {!course && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1B3F89]/10 text-[#1B3F89] dark:bg-[#1B3F89]/20 dark:text-[#93C5FD]">
                  College-wide
                </span>
              )}
              {thread.isPinned && (
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">📌 Pinned</span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close thread"
              className="p-1.5 rounded-lg text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232d42] hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0 -mt-1 -mr-1"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <h2
            id="thread-detail-title"
            className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-snug tracking-tight"
          >
            {thread.title}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-[12px] text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{thread.author}</span>
            <span>·</span>
            <span>{thread.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MessageCircle size={11} />
              {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </header>

        {/* ── Body: original post + replies (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Original post body */}
          <article>
            <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {thread.preview}
            </p>
          </article>

          {/* Replies section */}
          {(baseReplies.length > 0 || sessionReplies.length > 0) && (
            <section className="border-t border-gray-100 dark:border-[#2D3A52] pt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                <Reply size={11} />
                Replies
              </p>

              <div className="space-y-3">
                {baseReplies.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background: r.authorColor }}
                    >
                      {r.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{r.authorName}</span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-400">
                          {r.daysAgo === 0 ? 'today' : r.daysAgo === 1 ? 'yesterday' : `${r.daysAgo} days ago`}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}

                {/* "And N more replies" — implies a deeper thread without rendering them all */}
                {moreCount > 0 && (
                  <p className="text-[12px] text-gray-400 dark:text-gray-400 italic pl-11 py-1">
                    …and {moreCount} more {moreCount === 1 ? 'reply' : 'replies'} in this thread.
                  </p>
                )}

                {/* This session's replies (locally tracked) */}
                {sessionReplies.map((r, i) => (
                  <div key={`session-${i}`} className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#2563EB]">
                      KH
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-end">
                      <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 bg-[#2563EB]/[0.08] dark:bg-[#2563EB]/[0.12] max-w-[88%]">
                        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 mb-0.5">Kevin H.</p>
                        <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{r}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-1 px-1">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Composer ── */}
        <footer className="px-6 py-4 border-t border-gray-100 dark:border-[#2D3A52] bg-gray-50/50 dark:bg-[#131825]/40">
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#2563EB]">
              KH
            </div>
            <textarea
              ref={composerRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onComposerKey}
              placeholder="Write a reply…"
              rows={2}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition resize-none leading-relaxed"
            />
            <button
              onClick={submitReply}
              disabled={!draft.trim()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shrink-0 ${
                draft.trim()
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                  : 'bg-gray-100 dark:bg-[#232d42] text-gray-400 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
              Reply
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-1.5 pl-10">⌘ + Enter to send · ESC to close</p>
        </footer>
      </div>
    </div>
  )
}

