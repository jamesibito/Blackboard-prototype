import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, EyeOff, TrendingUp } from '../components/Icons'
import { grades, getCourse, getOverallGPA } from '../data/mockData'

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

function getLetterGrade(pct: number) {
  if (pct >= 90) return { letter: 'A+', color: '#22C55E' }
  if (pct >= 80) return { letter: 'A', color: '#22C55E' }
  if (pct >= 73) return { letter: 'B+', color: '#06B6D4' }
  if (pct >= 67) return { letter: 'B', color: '#06B6D4' }
  if (pct >= 60) return { letter: 'C+', color: '#F97316' }
  if (pct >= 53) return { letter: 'C', color: '#F97316' }
  return { letter: 'D', color: '#EF4444' }
}

export default function Grades() {
  const [expandedId, setExpandedId] = useState<string | null>('2D')
  const [hideGrades, setHideGrades] = useState(false)

  const overall = getOverallGPA()
  const { letter: overallLetter, color: overallColor } = getLetterGrade(overall)

  // Sort: highest grade first in the visual, then rest
  const sortedGrades = [...grades].sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="max-w-[1200px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Grades</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">Fall 2022 · George Brown College</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-500 dark:text-gray-400">
              <ChevronLeft size={18} />
            </button>
            <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 px-1">Fall 2022</span>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-500 dark:text-gray-400">
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={() => setHideGrades(h => !h)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400 dark:text-gray-500"
            title={hideGrades ? 'Show grades' : 'Hide grades'}
          >
            {hideGrades ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Overall GPA banner */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5 mb-5 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${overallColor}15` }}>
            <TrendingUp size={24} style={{ color: overallColor }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Semester Average</p>
            {hideGrades ? (
              <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-[#232d42] mt-1" />
            ) : (
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[32px] font-bold leading-none" style={{ color: overallColor }}>{overall}%</span>
                <span className="text-[16px] font-bold" style={{ color: overallColor }}>{overallLetter}</span>
              </div>
            )}
          </div>
        </div>

        {/* Per-course mini bars */}
        <div className="flex-1 grid grid-cols-6 gap-3 ml-4">
          {sortedGrades.map(g => {
            const course = getCourse(g.courseId)
            const { letter } = getLetterGrade(g.percentage)
            return (
              <div key={g.courseId} className="flex flex-col items-center gap-1.5">
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: hideGrades ? '0%' : `${g.percentage}%`, background: course.color }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{course.abbr}</span>
                {!hideGrades && (
                  <span className="text-[10px] font-semibold" style={{ color: course.color }}>{letter}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Course grade cards */}
      <div className="grid grid-cols-3 gap-4">
        {grades.map(g => {
          const course = getCourse(g.courseId)
          const isExpanded = expandedId === g.courseId
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
              {/* Top color strip */}
              <div className="h-1 w-full" style={{ background: course.color }} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 truncate">{course.name}</h3>
                      <ChevronRight size={13} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{course.code}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.instructor}</p>
                  </div>
                  {hideGrades ? (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#232d42] shrink-0" />
                  ) : (
                    <CircleProgress percentage={g.percentage} color={course.color} size={52} />
                  )}
                </div>

                {/* Letter grade badge */}
                {!hideGrades && (
                  <div className="mb-3 mt-2">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${letterColor}15`, color: letterColor }}
                    >
                      {letter}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-50 dark:border-[#2D3A52]">
                  <h4 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-2.5 uppercase tracking-wide">
                    Recent marks
                  </h4>

                  {isExpanded ? (
                    <div className="space-y-2">
                      {g.marks.map((m, i) => {
                        const pct = Math.round((m.score / m.total) * 100)
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-gray-700 dark:text-gray-300 truncate flex-1 mr-3 leading-tight">{m.name}</span>
                              <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: course.color }}>
                                {hideGrades ? '—' : `${m.score}/${m.total}`}
                              </span>
                            </div>
                            {!hideGrades && (
                              <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pct}%`, background: course.color, opacity: 0.6 }}
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[85, 72, 60, 45, 30].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-[#232d42] flex-1">
                            <div className="h-full rounded-full bg-gray-200 dark:bg-[#2D3A52]" style={{ width: `${w}%` }} />
                          </div>
                          <div className="w-6 h-2 rounded bg-gray-100 dark:bg-[#232d42]" />
                        </div>
                      ))}
                    </div>
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
