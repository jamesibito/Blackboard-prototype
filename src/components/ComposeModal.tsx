import { useState, useEffect, useRef } from 'react'
import { X, Send } from './Icons'
import { courses } from '../data/mockData'
import { useToast } from '../context/ToastContext'

interface Props {
  onClose: () => void
  /** Pre-fill the recipient (e.g. when opened from a course sidebar "Send Message to Instructor") */
  prefillTo?: string
  /** Pre-fill the course context */
  prefillCourseId?: string
  /** Pre-fill the subject line (optional, useful for "Re: …" flows) */
  prefillSubject?: string
}

export default function ComposeModal({ onClose, prefillTo, prefillCourseId, prefillSubject }: Props) {
  const { toast } = useToast()
  const [to, setTo] = useState(prefillTo ?? '')
  const [subject, setSubject] = useState(prefillSubject ?? '')
  const [body, setBody] = useState('')
  const [courseId, setCourseId] = useState(prefillCourseId ?? '')

  // Decorative — no message is actually persisted (this is a portfolio prototype).
  // We still fire a realistic success toast and close so the interaction feels real.
  function handleSend() {
    const recipient = to.trim() || 'recipient'
    toast(`Message sent to ${recipient}`, 'success')
    onClose()
  }

  // Disable Send unless at least the recipient + body are filled — mirrors real
  // form validation a student would expect from a real LMS.
  const canSend = to.trim().length > 0 && body.trim().length > 0

  const toInputRef   = useRef<HTMLInputElement>(null)
  const bodyInputRef = useRef<HTMLTextAreaElement>(null)

  // a11y: Escape to close, body scroll lock, autofocus first empty input.
  // If recipient is pre-filled (e.g. messaging an instructor from a course page),
  // skip the To field and focus the body so the user can start typing.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    if (prefillTo) {
      bodyInputRef.current?.focus()
    } else {
      toInputRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, prefillTo])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-title"
        className="relative w-full max-w-[560px] bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-200 dark:border-[#2D3A52] shadow-2xl overflow-hidden mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#232d42]">
          <h2 id="compose-title" className="text-[16px] font-bold text-gray-900 dark:text-gray-100">New Message</h2>
          <button
            onClick={onClose}
            aria-label="Close compose dialog"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* To field */}
          <div>
            <label htmlFor="compose-to" className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              To
            </label>
            <input
              ref={toInputRef}
              id="compose-to"
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="Instructor or student name..."
              className="w-full h-10 px-4 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition"
            />
          </div>

          {/* Course selector */}
          <div>
            <label htmlFor="compose-course" className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Course (optional)
            </label>
            <select
              id="compose-course"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition appearance-none"
            >
              <option value="">No course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="compose-subject" className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Subject
            </label>
            <input
              id="compose-subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject..."
              className="w-full h-10 px-4 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="compose-body" className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Message
            </label>
            <textarea
              ref={bodyInputRef}
              id="compose-body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 transition resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#232d42] bg-gray-50/50 dark:bg-[#131825]/50">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            This is a prototype — messages are not sent.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#232d42] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white text-[13px] font-semibold transition-colors ${
                canSend
                  ? 'bg-[var(--tenant-primary)] hover:brightness-90'
                  : 'bg-[var(--tenant-primary)]/40 cursor-not-allowed'
              }`}
            >
              <Send size={13} aria-hidden="true" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
