import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse, getAssignment } from '../data/mockData'
import { CheckCircle, Clock, FileText, Download, Send, X } from '../components/Icons'
import Breadcrumbs from '../components/Breadcrumbs'
import { getLetterGrade } from '../utils/grades'
import { useToast } from '../context/ToastContext'

export default function AssignmentPage() {
  const { toast } = useToast()
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>()
  const course = courseId ? getCourse(courseId) : null
  const assignment = assignmentId ? getAssignment(assignmentId) : null

  // Local state for interactivity (doesn't persist — prototype only)
  const [feedbackText, setFeedbackText] = useState('')
  const [extraReplies, setExtraReplies] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  // Files selected via the upload input — kept in component state, never uploaded
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function sendFeedbackReply() {
    const text = feedbackText.trim()
    if (!text) return
    setExtraReplies(prev => [...prev, text])
    setFeedbackText('')
    toast('Reply sent to instructor', 'success')
  }

  function handleSubmit() {
    setSubmitted(true)
    const fileNote = stagedFiles.length > 0
      ? ` (${stagedFiles.length} file${stagedFiles.length === 1 ? '' : 's'})`
      : ''
    toast(`Assignment submitted${fileNote}`, 'success')
    // Clear staging so the post-submit state shows the "Submitted & Graded" view
    setStagedFiles([])
  }

  // Real file picker — opens the OS file dialog. Selected files live in state
  // so the staging UI can show them with size + remove controls.
  function handleFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setStagedFiles(prev => [...prev, ...Array.from(files)])
    // Reset the input so re-picking the same file fires onChange again
    e.target.value = ''
  }

  function removeStagedFile(index: number) {
    setStagedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Human-readable file size — used in the staging list
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  if (!course || !assignment) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">Assignment not found</h1>
          <Link to="/courses" className="text-[13px] text-[#2563EB] dark:text-[#60A5FA] hover:underline">Back to Courses</Link>
        </div>
      </div>
    )
  }

  const totalScore = assignment.rubric.reduce((sum, r) => sum + (r.score || 0), 0)
  const totalPossible = assignment.rubric.reduce((sum, r) => sum + r.total, 0)
  const pct = Math.round((totalScore / totalPossible) * 100)
  const lg = getLetterGrade(pct)

  const statusConfig = {
    graded:    { label: 'Graded',    color: '#22C55E', bg: '#22C55E15' },
    submitted: { label: 'Submitted', color: '#2563EB', bg: '#2563EB15' },
    upcoming:  { label: 'Upcoming',  color: '#F59E0B', bg: '#F59E0B15' },
    late:      { label: 'Late',      color: '#EF4444', bg: '#EF444415' },
  }
  const sc = statusConfig[assignment.status]

  return (
    <div className="max-w-[900px]">
      <Breadcrumbs items={[
        { label: 'Courses', to: '/courses' },
        { label: course.name, to: `/courses/${course.id}` },
        { label: assignment.title },
      ]} />

      {/* Assignment Header */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden mb-6">
        <div className="h-1.5 w-full" style={{ background: course.color }} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {sc.label}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{course.code}</span>
              </div>
              <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-snug">{assignment.title}</h1>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2">{assignment.description}</p>
            </div>

            {assignment.status === 'graded' && (
              <div className="shrink-0 text-center bg-gray-50 dark:bg-[#131825] rounded-2xl px-5 py-4 border border-gray-100 dark:border-[#2D3A52]">
                <span className="text-[32px] font-bold leading-none" style={{ color: lg.color }}>{pct}%</span>
                <div className="mt-1">
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${lg.color}15`, color: lg.color }}>
                    {lg.letter}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">{totalScore}/{totalPossible} pts</p>
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Due Date</p>
              </div>
              <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200">{assignment.dueDate}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText size={12} className="text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Points</p>
              </div>
              <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200">{assignment.points} points</p>
            </div>
            {assignment.submittedDate && (
              <div className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3.5 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Submitted</p>
                </div>
                <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200">{assignment.submittedDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left: Instructions + Rubric + Feedback Thread */}
        <div className="space-y-6">

          {/* Instructions */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Instructions</h2>
            </div>
            <div className="px-5 pb-5">
              <ol className="space-y-2.5">
                {assignment.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[12px] font-bold text-gray-300 dark:text-gray-600 mt-0.5 shrink-0 w-5 text-right">{i + 1}.</span>
                    <span className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Rubric */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Rubric</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#2D3A52]">
                    <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Criterion</th>
                    <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-20">Weight</th>
                    <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide w-20">Score</th>
                    <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#232d42]">
                  {assignment.rubric.map((r, i) => {
                    const scorePct = r.score !== undefined ? Math.round((r.score / r.total) * 100) : null
                    const barColor = scorePct !== null
                      ? scorePct >= 80 ? '#22C55E' : scorePct >= 60 ? '#F97316' : '#EF4444'
                      : '#94a3b8'
                    return (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{r.name}</span>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span className="text-[12px] text-gray-500 dark:text-gray-400">{r.weight}%</span>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          {r.score !== undefined ? (
                            <div>
                              <span className="text-[13px] font-bold tabular-nums" style={{ color: barColor }}>
                                {r.score}/{r.total}
                              </span>
                              <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-1.5 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${scorePct}%`, background: barColor }} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-[12px] text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {r.feedback ? (
                            <span className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{r.feedback}</span>
                          ) : (
                            <span className="text-[12px] text-gray-300 dark:text-gray-600">No comments</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/*
            Feedback Thread — instructor/student comment exchange below the rubric.
            Only shown for graded assignments that have thread data.
            Mirrors the Canvas "Comments" feature: lets students see instructor notes
            and ask follow-up questions in context.
          */}
          {assignment.feedbackThread && assignment.feedbackThread.length > 0 && (
            <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Feedback Thread</h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Instructor and student comments on this submission</p>
              </div>
              <div className="px-5 pb-5 space-y-4">
                {assignment.feedbackThread.map(msg => {
                  const isInstructor = msg.authorType === 'instructor'
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isInstructor ? '' : 'flex-row-reverse'}`}>
                      {/* Author avatar */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                        style={{ background: isInstructor ? course.color : '#6B7280' }}
                      >
                        {msg.authorInitials}
                      </div>
                      {/* Bubble */}
                      <div className={`flex-1 max-w-[85%] ${isInstructor ? '' : 'flex flex-col items-end'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          isInstructor
                            ? 'bg-gray-50 dark:bg-[#131825] rounded-tl-sm'
                            : 'bg-[#2563EB]/[0.08] dark:bg-[#2563EB]/[0.12] rounded-tr-sm'
                        }`}>
                          <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {msg.author}
                          </p>
                          <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                            {msg.body}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">{msg.date}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Replies added this session */}
                {extraReplies.map((r, i) => (
                  <div key={i} className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-gray-400">KH</div>
                    <div className="flex-1 max-w-[85%] flex flex-col items-end">
                      <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-[#2563EB]/[0.08] dark:bg-[#2563EB]/[0.12]">
                        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 mb-1">Kevin H.</p>
                        <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{r}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">Just now</p>
                    </div>
                  </div>
                ))}

                {/* Functional reply input */}
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-[#2D3A52]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-gray-400">KH</div>
                  <div className="flex-1 flex gap-2 items-end">
                    <textarea
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendFeedbackReply() }}
                      placeholder="Reply to instructor…"
                      rows={1}
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-200 dark:border-[#2D3A52] text-[12px] text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition resize-none"
                      style={{ minHeight: 36, maxHeight: 100 }}
                    />
                    <button
                      onClick={sendFeedbackReply}
                      disabled={!feedbackText.trim()}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white transition-all ${feedbackText.trim() ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'}`}
                      style={{ background: course.color }}
                    >
                      <Send size={12} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Deliverables */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-3">Deliverables</h2>
            <div className="space-y-2">
              {assignment.deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#131825] border border-gray-100 dark:border-[#2D3A52]">
                  <FileText size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <span className="text-[12px] text-gray-700 dark:text-gray-300 flex-1">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission area */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-3">Submission</h2>
            {(assignment.status === 'graded' || assignment.status === 'submitted' || submitted) ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={22} className="text-emerald-500" />
                </div>
                <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  {assignment.status === 'graded' ? 'Submitted & Graded' : 'Submitted'}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {submitted ? 'Just now' : assignment.submittedDate}
                </p>
                <button
                  onClick={() => {
                    const filename = assignment.previousSubmissions?.[0]?.files[0] ?? `${assignment.title}.pdf`
                    toast(`Opening ${filename}`, 'info')
                  }}
                  className="flex items-center gap-1.5 mx-auto mt-3 text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                >
                  <Download size={12} />
                  View submission
                </button>
              </div>
            ) : (
              <div>
                {/* Real (hidden) file input — opens the OS file picker on click */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                  onChange={handleFilesPicked}
                  className="sr-only"
                  aria-label="Upload assignment files"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 dark:border-[#2D3A52] rounded-xl p-6 text-center hover:border-gray-300 dark:hover:border-gray-500 transition-colors block"
                >
                  <Download size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">Click to upload files</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX, ZIP up to 25MB</p>
                </button>

                {/* Staged files — what the student has chosen but not yet submitted */}
                {stagedFiles.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      Ready to submit ({stagedFiles.length})
                    </p>
                    {stagedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-[#131825] border border-gray-100 dark:border-[#2D3A52]">
                        <FileText size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 truncate">{f.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{formatFileSize(f.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStagedFile(i)}
                          aria-label={`Remove ${f.name}`}
                          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#232d42] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <X size={12} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={stagedFiles.length === 0}
                  className={`w-full mt-3 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all ${
                    stagedFiles.length > 0
                      ? 'hover:opacity-90 active:scale-[0.98]'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                  style={{ background: course.color }}
                >
                  {stagedFiles.length > 0
                    ? `Submit ${stagedFiles.length} file${stagedFiles.length === 1 ? '' : 's'}`
                    : 'Submit Assignment'}
                </button>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Prototype — files stay on your device only.
                </p>
              </div>
            )}
          </div>

          {/*
            Submission History — shows every file submission attempt with a timestamp.
            Useful when students submit multiple drafts or resubmit after feedback.
            Only rendered when the assignment has previousSubmissions data.
          */}
          {assignment.previousSubmissions && assignment.previousSubmissions.length > 0 && (
            <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-3">Submission History</h2>
              <div className="space-y-3">
                {assignment.previousSubmissions.map((sub, i) => (
                  <div key={sub.id} className="flex items-start gap-3">
                    {/* Attempt number badge */}
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#232d42] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{sub.submittedDate}</p>
                      <div className="space-y-0.5 mt-1">
                        {sub.files.map(f => (
                          <div key={f} className="flex items-center gap-1.5">
                            <FileText size={11} className="text-gray-400 dark:text-gray-500 shrink-0" />
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast(`Opening ${sub.files[0] ?? 'submission'}`, 'info')}
                      className="text-[10px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline shrink-0"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course info */}
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-3 bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-4 hover:border-[#2563EB]/30 dark:hover:border-[#60A5FA]/20 transition-colors group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[12px] shrink-0"
              style={{ background: course.color }}
            >
              {course.abbr}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">{course.name}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.instructor}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
