import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { messages, getCourse } from '../data/mockData'
import type { Message } from '../data/mockData'
import { Mail, Star, Inbox, Send } from '../components/Icons'
import ComposeModal from '../components/ComposeModal'
import { useToast } from '../context/ToastContext'

/** Shape of optional state passed by `navigate('/messages', { state })` from
 *  surfaces that want to compose a new message with the recipient pre-filled
 *  (e.g. CourseSidebar's "Send Message" button on a course page). */
interface MessagesNavState {
  openCompose?: boolean
  prefillTo?: string
  prefillCourseId?: string
  prefillSubject?: string
}

const tagConfig = {
  assignment:    { label: 'Assignment',    color: '#F97316', bg: '#F9731618' },
  grade:         { label: 'Grade',         color: '#22C55E', bg: '#22C55E18' },
  'office-hours':{ label: 'Office Hours',  color: '#8B5CF6', bg: '#8B5CF618' },
  general:       { label: 'General',       color: '#94A3B8', bg: '#94A3B818' },
}

export default function Messages() {
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState<string>(messages[0].id)
  const [starred, setStarred] = useState<Set<string>>(
    new Set(messages.filter(m => m.isStarred).map(m => m.id))
  )
  const [read, setRead] = useState<Set<string>>(
    new Set(messages.filter(m => m.isRead).map(m => m.id))
  )
  const [composeOpen, setComposeOpen] = useState(false)
  // Compose prefill (when arriving via state from a course page's "Send Message"
  // button). We snapshot it in state so dismissing + reopening compose locally
  // doesn't re-trigger from stale router state.
  const [composePrefill, setComposePrefill] = useState<{
    to?: string; courseId?: string; subject?: string
  }>({})
  const location = useLocation()
  const navigate = useNavigate()

  // If we arrived with state asking us to open compose, do it once and then
  // clear the state from history so a refresh/back doesn't reopen the modal.
  useEffect(() => {
    const st = location.state as MessagesNavState | null
    if (st?.openCompose) {
      setComposePrefill({
        to: st.prefillTo,
        courseId: st.prefillCourseId,
        subject: st.prefillSubject,
      })
      setComposeOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const [replyText, setReplyText] = useState('')
  // Track replies sent per message: messageId → reply string[]
  const [replies, setReplies] = useState<Record<string, string[]>>({})
  const replyRef = useRef<HTMLTextAreaElement>(null)

  const selected = messages.find(m => m.id === selectedId)!

  function selectMessage(msg: Message) {
    setSelectedId(msg.id)
    setRead(prev => new Set([...prev, msg.id]))
    setReplyText('')
  }

  function sendReply() {
    const text = replyText.trim()
    if (!text) return
    setReplies(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), text] }))
    setReplyText('')
    toast('Reply sent', 'success')
  }

  function toggleStar(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setStarred(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const unreadCount = messages.filter(m => !read.has(m.id)).length

  return (
    <div className="max-w-[1200px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Messages</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold transition-colors"
        >
          <Mail size={14} />
          Compose
        </button>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-5 h-[calc(100vh-200px)] min-h-[500px]">

        {/* Message list */}
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-[#232d42]">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-400 dark:text-gray-500">
              <Inbox size={14} />
              Inbox
              {unreadCount > 0 && (
                <span className="ml-auto bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#232d42]">
            {messages.map(msg => {
              const isSelected = selectedId === msg.id
              const isRead = read.has(msg.id)
              const isStarred = starred.has(msg.id)
              const tag = tagConfig[msg.tag]

              return (
                <div
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={`px-4 py-3.5 cursor-pointer transition-colors relative ${
                    isSelected
                      ? 'bg-[#2563EB]/[0.06] dark:bg-[#2563EB]/[0.1]'
                      : 'hover:bg-gray-50 dark:hover:bg-[#232d42]'
                  }`}
                >
                  {/* Unread dot */}
                  {!isRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  )}

                  <div className="flex items-start gap-3 pl-1">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5"
                      style={{ background: msg.senderColor }}
                    >
                      {msg.senderAbbr}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[13px] truncate ${isRead ? 'text-gray-600 dark:text-gray-400 font-medium' : 'text-gray-900 dark:text-gray-100 font-semibold'}`}>
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{msg.time}</span>
                      </div>
                      <p className={`text-[12px] truncate mt-0.5 ${isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{msg.preview}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: tag.bg, color: tag.color }}
                        >
                          {tag.label}
                        </span>
                        {msg.courseId && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {getCourse(msg.courseId).abbr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Star */}
                    <button
                      onClick={e => toggleStar(msg.id, e)}
                      className="p-0.5 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        size={13}
                        className={isStarred ? 'text-amber-400 fill-current' : ''}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Message detail — empty state when nothing is selected */}
        {!selected ? (
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#232d42] flex items-center justify-center mb-4">
              <Mail size={26} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">No message selected</p>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 text-center max-w-[220px]">
              Choose a message from your inbox to read it here.
            </p>
          </div>
        ) : (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden flex flex-col">

          {/* Detail header */}
          <div className="px-6 py-4 border-b border-gray-50 dark:border-[#232d42]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-snug">{selected.subject}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: selected.senderColor }}
                  >
                    {selected.senderAbbr}
                  </div>
                  <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">{selected.senderName}</span>
                  <span className="text-[12px] text-gray-400 dark:text-gray-500">·</span>
                  <span className="text-[12px] text-gray-400 dark:text-gray-500">{selected.date}</span>
                  {selected.courseId && (
                    <>
                      <span className="text-[12px] text-gray-400 dark:text-gray-500">·</span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${getCourse(selected.courseId).color}15`,
                          color: getCourse(selected.courseId).color
                        }}
                      >
                        {getCourse(selected.courseId).name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={e => toggleStar(selected.id, e)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400"
                >
                  <Star
                    size={16}
                    className={starred.has(selected.id) ? 'text-amber-400 fill-current' : ''}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Message body + replies */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-[640px] space-y-5">
              {/* Original message */}
              <div>
                {selected.body.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {/* Sent replies — appear inline below the original */}
              {(replies[selectedId] ?? []).map((r, i) => (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] bg-[#2563EB]/[0.08] dark:bg-[#2563EB]/[0.12] border border-[#2563EB]/20 rounded-2xl rounded-br-md px-4 py-3">
                    <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{r}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 text-right">You · Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply bar — functional textarea */}
          <div className="px-6 py-4 border-t border-gray-50 dark:border-[#232d42]">
            <div className="flex items-end gap-3">
              <textarea
                ref={replyRef}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply() }}
                placeholder={`Reply to ${selected.senderName.split(' ')[0]}…`}
                rows={1}
                className="flex-1 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] px-4 py-2.5 text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 resize-none leading-relaxed"
                style={{ minHeight: 40, maxHeight: 120 }}
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shrink-0 ${
                  replyText.trim()
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                    : 'bg-gray-100 dark:bg-[#232d42] text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={14} />
                Send
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">⌘ + Enter to send</p>
          </div>
        </div>
        )}
      </div>

      {composeOpen && (
        <ComposeModal
          onClose={() => {
            setComposeOpen(false)
            setComposePrefill({})
          }}
          prefillTo={composePrefill.to}
          prefillCourseId={composePrefill.courseId}
          prefillSubject={composePrefill.subject}
        />
      )}
    </div>
  )
}
