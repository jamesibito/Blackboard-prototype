import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourse, grades, courseModules, assignments, activityItems } from '../data/mockData'
import { CheckCircle, ChevronRight, FileText, ClipboardList, Award, Megaphone, Folder, BookOpen } from '../components/Icons'
import Breadcrumbs from '../components/Breadcrumbs'

function getLetterGrade(pct: number) {
  if (pct >= 90) return { letter: 'A+', color: '#22C55E' }
  if (pct >= 80) return { letter: 'A',  color: '#22C55E' }
  if (pct >= 73) return { letter: 'B+', color: '#06B6D4' }
  if (pct >= 67) return { letter: 'B',  color: '#06B6D4' }
  if (pct >= 60) return { letter: 'C+', color: '#F97316' }
  if (pct >= 53) return { letter: 'C',  color: '#F97316' }
  return { letter: 'D', color: '#EF4444' }
}

const typeIcons: Record<string, React.FC<any>> = {
  assignment: ClipboardList,
  grade: Award,
  resource: FileText,
  announcement: Megaphone,
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const course = courseId ? getCourse(courseId) : null

  if (!course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">Course not found</h1>
          <Link to="/courses" className="text-[13px] text-[#2563EB] dark:text-[#60A5FA] hover:underline">Back to Courses</Link>
        </div>
      </div>
    )
  }

  const courseGrade = grades.find(g => g.courseId === course.id)
  const lg = courseGrade ? getLetterGrade(courseGrade.percentage) : null
  const modules = courseModules[course.id] || []
  const courseAssignments = assignments.filter(a => a.courseId === course.id)
  const courseActivity = activityItems.filter(a => a.courseId === course.id).slice(0, 4)

  return (
    <div className="max-w-[1000px]">
      <Breadcrumbs items={[
        { label: 'Courses', to: '/courses' },
        { label: course.name },
      ]} />

      {/* Course Header */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden mb-6">
        <div className="h-1.5 w-full" style={{ background: course.color }} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-[18px] shrink-0"
              style={{ background: course.color }}
            >
              {course.abbr}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">{course.name}</h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">{course.code} · {course.instructor}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2 max-w-[640px]">{course.description}</p>
            </div>
            {lg && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-[28px] font-bold leading-none" style={{ color: lg.color }}>{courseGrade!.percentage}%</span>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${lg.color}15`, color: lg.color }}>
                  {lg.letter}
                </span>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Schedule', value: course.schedule },
              { label: 'Room', value: course.room },
              { label: 'Credits', value: `${course.credits} credit hrs` },
              { label: 'Last Activity', value: course.lastActivity },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3.5 py-3">
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 mt-1 leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Course Progress</span>
              <span className="text-[12px] font-bold" style={{ color: course.color }}>{course.completion}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${course.completion}%`, background: course.color }} />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{course.completedModules} of {course.moduleCount} modules complete</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Left: Modules & Assignments */}
        <div className="space-y-6">

          {/* Modules */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Modules</h2>
            </div>
            {modules.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-[#232d42]">
                {modules.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors cursor-pointer"
                  >
                    <CheckCircle
                      size={16}
                      className={m.completed ? 'text-emerald-500 shrink-0' : 'text-gray-300 dark:text-gray-600 shrink-0'}
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[13px] leading-snug ${
                        m.completed
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-900 dark:text-gray-100 font-medium'
                      }`}>
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 px-2 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded-md">
                      {m.itemCount} items
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      m.type === 'assignment' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                      : m.type === 'quiz' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-500'
                      : m.type === 'reading' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500'
                      : 'bg-gray-50 dark:bg-gray-500/10 text-gray-500'
                    }`}>
                      {m.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-5">
                <BookOpen size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-[13px] text-gray-400 dark:text-gray-500">Modules will appear here when published by the instructor.</p>
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Assignments</h2>
            </div>
            {courseAssignments.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-[#232d42]">
                {courseAssignments.map(a => {
                  const statusColors = {
                    graded: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
                    submitted: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
                    upcoming: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
                    late: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
                  }
                  const sc = statusColors[a.status]
                  const totalScore = a.rubric.reduce((sum, r) => sum + (r.score || 0), 0)
                  const totalPossible = a.rubric.reduce((sum, r) => sum + r.total, 0)

                  return (
                    <Link
                      key={a.id}
                      to={`/courses/${course.id}/assignments/${a.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${course.color}15` }}>
                        <ClipboardList size={16} style={{ color: course.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">Due {a.dueDate}</span>
                          <span className="text-[11px] text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">{a.points} pts</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {a.status === 'graded' && (
                          <span className="text-[12px] font-bold tabular-nums" style={{ color: course.color }}>
                            {totalScore}/{totalPossible}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${sc.bg} ${sc.text}`}>
                          {a.status}
                        </span>
                        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 px-5">
                <Folder size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-[13px] text-gray-400 dark:text-gray-500">No assignments yet for this course.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Grades summary */}
          {courseGrade && (
            <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Grades</h2>
                <Link to="/grades" className="text-[11px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">View all</Link>
              </div>
              <div className="px-5 pb-5 space-y-2.5">
                {courseGrade.marks.map((m, i) => {
                  const pct = Math.round((m.score / m.total) * 100)
                  return (
                    <div key={i}>
                      {m.assignmentId ? (
                        <Link
                          to={`/courses/${course.id}/assignments/${m.assignmentId}`}
                          className="block hover:bg-gray-50 dark:hover:bg-[#232d42] -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-gray-700 dark:text-gray-300 truncate flex-1 mr-3">{m.name}</span>
                            <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: course.color }}>
                              {m.score}/{m.total}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-1">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color, opacity: 0.6 }} />
                          </div>
                        </Link>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-gray-700 dark:text-gray-300 truncate flex-1 mr-3">{m.name}</span>
                            <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: course.color }}>
                              {m.score}/{m.total}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-1">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Recent Activity</h2>
              <Link to="/activity-stream" className="text-[11px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">See all</Link>
            </div>
            {courseActivity.length > 0 ? (
              <div className="px-5 pb-5 space-y-3">
                {courseActivity.map(a => {
                  const Icon = typeIcons[a.type] || FileText
                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${course.color}15` }}>
                        <Icon size={13} style={{ color: course.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 leading-snug">{a.title}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{a.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="px-5 pb-5">
                <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center py-4">No recent activity</p>
              </div>
            )}
          </div>

          {/* Instructor contact card */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-3">Instructor</h2>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                style={{ background: course.color }}
              >
                {course.instructor.split(' ').map(w => w[0]).join('')}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{course.instructor}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.room}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/messages')}
              className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-colors hover:opacity-90"
              style={{ borderColor: course.color, color: course.color }}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
