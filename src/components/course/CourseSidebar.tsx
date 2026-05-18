import { Link, useNavigate } from 'react-router-dom'
import type { Course, CourseGrade, ActivityItem } from '../../data/mockData'
import type { LetterGrade } from '../../utils/grades'
import { FileText, ClipboardList, Award, Megaphone, Download } from '../Icons'

interface Props {
  course: Course
  courseGrade: CourseGrade | undefined
  lg: LetterGrade | null
  courseActivity: ActivityItem[]
}

const typeIcons: Record<string, React.FC<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  assignment: ClipboardList,
  grade: Award,
  resource: FileText,
  announcement: Megaphone,
}

export default function CourseSidebar({ course, courseGrade, lg, courseActivity }: Props) {
  const navigate = useNavigate()

  return (
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
            {/* Overall row */}
            {lg && (
              <div className="pt-2 mt-1 border-t border-gray-100 dark:border-[#2D3A52] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">Overall</span>
                <span className="text-[13px] font-bold" style={{ color: lg.color }}>
                  {courseGrade.percentage}% · {lg.letter}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Syllabus */}
      {course.syllabus && (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Syllabus</h2>
            <button
              onClick={() => window.alert('Syllabus PDF would open here in a production build.')}
              className="flex items-center gap-1 text-[11px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
              aria-label="Download course syllabus PDF"
            >
              <Download size={11} aria-hidden="true" />
              PDF
            </button>
          </div>
          <div className="px-5 pb-4 space-y-2">
            {course.syllabus.weights.map((w, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-gray-700 dark:text-gray-300">{w.category}</span>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: course.color }}>{w.weight}%</span>
                </div>
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${w.weight}%`, background: course.color, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
          {/* Policies */}
          <div className="px-5 pb-5">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Key Policies</p>
            <ul className="space-y-1.5">
              {course.syllabus.policies.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: course.color }} />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Recent Activity</h2>
          <Link to="/activity-stream" className="text-[11px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">View all</Link>
        </div>
        {courseActivity.length > 0 ? (
          <div className="px-5 pb-5 space-y-3">
            {courseActivity.map(a => {
              const Icon = typeIcons[a.type] || FileText
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${course.color}15` }}
                  >
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

      {/* Instructor */}
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
        {course.officeHours && (
          <div className="mt-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#131825]">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Office Hours</p>
            <p className="text-[12px] text-gray-700 dark:text-gray-300 mt-0.5">{course.officeHours}</p>
          </div>
        )}
        <button
          onClick={() => navigate('/messages', {
            state: {
              openCompose: true,
              prefillTo: course.instructor,
              prefillCourseId: course.id,
              prefillSubject: `${course.code} — `,
            },
          })}
          className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-colors hover:opacity-90"
          style={{ borderColor: course.color, color: course.color }}
        >
          Send Message
        </button>
      </div>
    </div>
  )
}
