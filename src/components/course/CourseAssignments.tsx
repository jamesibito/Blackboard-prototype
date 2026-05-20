import { Link } from 'react-router-dom'
import type { Assignment, Course } from '../../data/mockData'
import { ClipboardList, ChevronRight, Folder } from '../Icons'

interface Props {
  courseAssignments: Assignment[]
  course: Course
}

const statusColors = {
  graded:    { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  submitted: { bg: 'bg-blue-50 dark:bg-blue-500/10',       text: 'text-blue-600 dark:text-blue-400' },
  upcoming:  { bg: 'bg-amber-50 dark:bg-amber-500/10',     text: 'text-amber-600 dark:text-amber-400' },
  late:      { bg: 'bg-red-50 dark:bg-red-500/10',         text: 'text-red-600 dark:text-red-400' },
}

export default function CourseAssignments({ courseAssignments, course }: Props) {
  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Assignments</h2>
      </div>
      {courseAssignments.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
          {courseAssignments.map(a => {
            const sc = statusColors[a.status]
            const totalScore    = a.rubric.reduce((sum, r) => sum + (r.score || 0), 0)
            const totalPossible = a.rubric.reduce((sum, r) => sum + r.total, 0)
            return (
              <Link
                key={a.id}
                to={`/courses/${course.id}/assignments/${a.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${course.color}15` }}
                >
                  <ClipboardList size={16} style={{ color: course.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[var(--tenant-link)] dark:group-hover:text-[var(--tenant-link-dark)] transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400 dark:text-gray-400">Due {a.dueDate}</span>
                    <span className="text-[11px] text-gray-300 dark:text-gray-500">·</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-400">{a.points} pts</span>
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
                  <ChevronRight size={14} className="text-gray-300 dark:text-gray-500" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-5">
          <Folder size={28} className="text-gray-300 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-[13px] text-gray-400 dark:text-gray-400">No assignments yet for this course.</p>
        </div>
      )}
    </div>
  )
}
