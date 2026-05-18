import { useNavigate } from 'react-router-dom'
import type { Course, CourseGrade } from '../../data/mockData'
import type { LetterGrade } from '../../utils/grades'
import { Mail } from '../Icons'

interface Props {
  course: Course
  courseGrade: CourseGrade | undefined
  lg: LetterGrade | null
}

export default function CourseHeader({ course, courseGrade, lg }: Props) {
  const navigate = useNavigate()
  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden mb-6">
      {/* Top colour accent strip */}
      <div className="h-1.5 w-full" style={{ background: course.color }} />

      <div className="p-6">
        {/* Title row */}
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
          {/* Current grade badge */}
          {lg && courseGrade && (
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="text-[28px] font-bold leading-none" style={{ color: lg.color }}>{courseGrade.percentage}%</span>
              <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${lg.color}15`, color: lg.color }}>
                {lg.letter}
              </span>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Schedule',      value: course.schedule },
            { label: 'Room',          value: course.room },
            { label: 'Credits',       value: `${course.credits} credit hrs` },
            { label: 'Last Activity', value: course.lastActivity },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3.5 py-3">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 mt-1 leading-snug">{value}</p>
            </div>
          ))}
        </div>

        {/* Primary action row — Join Zoom + Email Instructor */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {course.zoomLink && (
            <a
              href={course.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: course.color }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Join Zoom Session
            </a>
          )}
          <button
            type="button"
            onClick={() => navigate('/messages', {
              state: {
                openCompose: true,
                prefillTo: course.instructor,
                prefillCourseId: course.id,
                prefillSubject: `${course.code} — `,
              },
            })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-colors hover:bg-gray-50 dark:hover:bg-[#232d42]"
            style={{ borderColor: course.color, color: course.color }}
            title={`Email ${course.instructor}`}
          >
            <Mail size={14} aria-hidden="true" />
            Email {course.instructor.split(' ')[0]}
          </button>
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
  )
}
