import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, EyeOff, TrendingUp } from '../components/Icons'
import {
  grades, getCourse, getOverallGPA,
  winterGrades, getWinterCourse, getWinterGPA,
  semesters,
} from '../data/mockData'
import { getLetterGrade } from '../utils/grades'

// ─── Circle Progress ───────────────────────────────────────────────────────────

function CircleProgress({ percentage, color, size = 56 }: { percentage: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percentage / 100) * circ
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          className="text-gray-100 dark:text-gray-800" strokeWidth={3.5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={3.5} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[12px] font-bold tabular-nums" style={{ color }}>{percentage}%</span>
    </div>
  )
}

// ─── Grades Page ───────────────────────────────────────────────────────────────

export default function Grades() {
  // semesters[0] = Winter 2022, semesters[1] = Fall 2022 (current)
  const [semIdx, setSemIdx] = useState(semesters.length - 1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hideGrades, setHideGrades] = useState(false)

  const isFall    = semesters[semIdx].id === 'fall-2022'
  const semester  = semesters[semIdx]

  // Pick the right data set based on active semester
  const activeGrades  = isFall ? grades      : winterGrades
  const activeOverall = isFall ? getOverallGPA() : getWinterGPA()
  const getCourseInfo = isFall
    ? (id: string) => { const c = getCourse(id); return { ...c, hasPage: true } }
    : (id: string) => { const c = getWinterCourse(id); return { ...c, hasPage: false } }

  const sortedGrades = [...activeGrades].sort((a, b) => b.percentage - a.percentage)
  const { letter: overallLetter, color: overallColor } = getLetterGrade(activeOverall)

  const canGoPrev = semIdx > 0
  const canGoNext = semIdx < semesters.length - 1

  // Reset expanded card when switching semesters
  const navigate = (dir: -1 | 1) => {
    setSemIdx(i => i + dir)
    setExpandedId(null)
  }

  return (
    <div className="max-w-[1200px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Grades</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            {semester.label} · George Brown College
            {semester.isCurrent && (
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA] align-middle">
                Current
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Semester navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => canGoPrev && navigate(-1)}
              disabled={!canGoPrev}
              className={`p-1.5 rounded-lg transition ${canGoPrev ? 'hover:bg-gray-100 dark:hover:bg-[#232d42] text-gray-500 dark:text-gray-400' : 'text-gray-200 dark:text-gray-700 cursor-not-allowed'}`}
              title="Previous semester"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 px-2 min-w-[100px] text-center">
              {semester.label}
            </span>
            <button
              onClick={() => canGoNext && navigate(1)}
              disabled={!canGoNext}
              className={`p-1.5 rounded-lg transition ${canGoNext ? 'hover:bg-gray-100 dark:hover:bg-[#232d42] text-gray-500 dark:text-gray-400' : 'text-gray-200 dark:text-gray-700 cursor-not-allowed'}`}
              title="Next semester"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Hide/show toggle */}
          <button
            onClick={() => setHideGrades(h => !h)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400 dark:text-gray-500"
            title={hideGrades ? 'Show grades' : 'Hide grades'}
          >
            {hideGrades ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* ── Semester GPA banner ── */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-6 mb-6 flex items-center gap-8">

        {/* Left: overall average + letter */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${overallColor}15` }}>
            <TrendingUp size={24} style={{ color: overallColor }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Semester Average</p>
            {hideGrades ? (
              <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-[#232d42] mt-1" />
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[32px] font-bold leading-none" style={{ color: overallColor }}>{activeOverall}%</span>
                <span className="text-[16px] font-bold" style={{ color: overallColor }}>{overallLetter}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-px self-stretch bg-gray-100 dark:bg-[#2D3A52]" />

        {/* Per-course mini bars */}
        <div className="flex-1 grid gap-4" style={{ gridTemplateColumns: `repeat(${sortedGrades.length}, 1fr)` }}>
          {sortedGrades.map(g => {
            const course = getCourseInfo(g.courseId)
            const { letter } = getLetterGrade(g.percentage)
            const barContent = (
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{ width: hideGrades ? '0%' : `${g.percentage}%`, background: course.color }}
                  />
                </div>
                <span className={`text-[10px] font-bold text-gray-500 dark:text-gray-400 transition-colors ${course.hasPage ? 'group-hover:underline group-hover:text-gray-700 dark:group-hover:text-gray-300' : ''}`}>
                  {course.abbr}
                </span>
                {!hideGrades && (
                  <span className="text-[10px] font-semibold" style={{ color: course.color }}>{letter}</span>
                )}
              </div>
            )
            return course.hasPage ? (
              <Link key={g.courseId} to={`/courses/${g.courseId}`} title={course.name}>
                {barContent}
              </Link>
            ) : (
              <div key={g.courseId} title={course.name}>
                {barContent}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Past semester badge ── */}
      {!isFall && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2236] border border-gray-100 dark:border-[#2D3A52]">
          <span className="text-[13px] text-gray-500 dark:text-gray-400">
            Viewing archived grades for <strong className="text-gray-700 dark:text-gray-300">{semester.label}</strong>.
            Course pages are not available for past semesters.
          </span>
          <button
            onClick={() => navigate(1)}
            className="ml-auto text-[12px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline shrink-0"
          >
            Back to current →
          </button>
        </div>
      )}

      {/* ── Expand hint ── */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-1">
        <Eye size={12} />
        <span>Click any card to expand full mark breakdown · Use the eye icon above to hide all grades</span>
      </p>

      {/* ── Course grade cards ── */}
      <div className="grid grid-cols-3 gap-5">
        {activeGrades.map(g => {
          const course      = getCourseInfo(g.courseId)
          const isExpanded  = expandedId === g.courseId
          const { letter, color: letterColor } = getLetterGrade(g.percentage)

          return (
            <div
              key={g.courseId}
              className={`bg-white dark:bg-[#1A2236] rounded-2xl border overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-sm dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)] ${
                isExpanded
                  ? 'border-[#2563EB]/30 dark:border-[#60A5FA]/20 ring-1 ring-[#2563EB]/20 dark:ring-[#60A5FA]/10'
                  : 'border-gray-100 dark:border-[#2D3A52]'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : g.courseId)}
            >
              {/* Thin colour stripe */}
              <div className="h-0.5 w-full" style={{ background: course.color }} />

              <div className="p-4">
                {/* Course header row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 truncate">{course.name}</h3>
                      <ChevronRight size={12} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.code}</p>
                      {!hideGrades && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${letterColor}15`, color: letterColor }}>
                          {letter}
                        </span>
                      )}
                    </div>
                  </div>
                  {hideGrades ? (
                    <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-[#232d42] shrink-0" />
                  ) : (
                    <CircleProgress percentage={g.percentage} color={course.color} size={44} />
                  )}
                </div>

                {/* Marks section */}
                <div className="pt-3 border-t border-gray-100 dark:border-[#2D3A52]">
                  {isExpanded ? (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                        {isFall ? 'Recent marks' : 'Final marks'}
                      </h4>
                      {g.marks.map((m, i) => {
                        const pct = Math.round((m.score / m.total) * 100)
                        const inner = (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11.5px] text-gray-700 dark:text-gray-300 truncate flex-1 mr-3 leading-snug">{m.name}</span>
                              <span className="text-[11.5px] font-bold tabular-nums shrink-0" style={{ color: course.color }}>
                                {hideGrades ? '—' : `${m.score}/${m.total}`}
                              </span>
                            </div>
                            {!hideGrades && (
                              <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color, opacity: 0.65 }} />
                              </div>
                            )}
                          </>
                        )
                        return (isFall && m.assignmentId) ? (
                          <Link
                            key={i}
                            to={`/courses/${g.courseId}/assignments/${m.assignmentId}`}
                            onClick={e => e.stopPropagation()}
                            className="block -mx-1.5 px-1.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div key={i} className="py-1">{inner}</div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      {g.marks.length} mark{g.marks.length !== 1 ? 's' : ''} · tap to expand
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
