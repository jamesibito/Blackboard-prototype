import { useParams, Link } from 'react-router-dom'
import { getCourse, getAssignment } from '../data/mockData'
import { CheckCircle, Clock, FileText, Download } from '../components/Icons'
import Breadcrumbs from '../components/Breadcrumbs'
import { getLetterGrade } from '../utils/grades'  // shared grading scale

export default function AssignmentPage() {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>()
  const course = courseId ? getCourse(courseId) : null
  const assignment = assignmentId ? getAssignment(assignmentId) : null

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
        {/* Left: Instructions + Rubric */}
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
            {assignment.status === 'graded' || assignment.status === 'submitted' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={22} className="text-emerald-500" />
                </div>
                <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  {assignment.status === 'graded' ? 'Submitted & Graded' : 'Submitted'}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{assignment.submittedDate}</p>
                <button className="flex items-center gap-1.5 mx-auto mt-3 text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                  <Download size={12} />
                  View submission
                </button>
              </div>
            ) : (
              <div>
                <div className="border-2 border-dashed border-gray-200 dark:border-[#2D3A52] rounded-xl p-6 text-center">
                  <Download size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">Drop files here or click to upload</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX, ZIP up to 25MB</p>
                </div>
                <button
                  className="w-full mt-3 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: course.color }}
                >
                  Submit Assignment
                </button>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  This is a prototype — files are not uploaded.
                </p>
              </div>
            )}
          </div>

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
