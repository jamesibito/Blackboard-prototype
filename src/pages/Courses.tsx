import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, grades, courseModules, getCourse } from '../data/mockData'
import { ChevronRight, Clock, CheckCircle, Folder, X, BookOpen } from '../components/Icons'
import { getLetterGrade } from '../utils/grades'  // shared grading scale

// Pre-compute grade map: courseId → percentage (used by both card and slide-out)
const gradeMap: Record<string, number> = {}
grades.forEach(g => { gradeMap[g.courseId] = g.percentage })

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const selected = selectedCourse ? getCourse(selectedCourse) : null

  return (
    <div className="max-w-[1200px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Courses</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">Fall 2022 · {courses.length} enrolled</p>
        </div>
      </div>

      <div className={`flex gap-5 transition-all`}>

        {/* Course grid */}
        <div className={`grid gap-4 flex-1 ${selected ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {courses.map(c => {
            const pct = gradeMap[c.id]
            const isSelected = selectedCourse === c.id
            const lg = pct !== undefined ? getLetterGrade(pct) : null

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCourse(isSelected ? null : c.id)}
                className={`bg-white dark:bg-[#1A2236] rounded-2xl border overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-md dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.25)] ${
                  isSelected
                    ? 'border-[#2563EB]/40 dark:border-[#60A5FA]/30 ring-1 ring-[#2563EB]/20'
                    : 'border-gray-100 dark:border-[#2D3A52]'
                }`}
              >
                {/* Colour header band */}
                <div className="h-[5px] w-full" style={{ background: c.color }} />

                <div className="p-5">
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                      style={{ background: c.color }}
                    >
                      {c.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 leading-snug">{c.name}</h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{c.code}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.instructor}</p>
                    </div>
                    {lg && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                        style={{ background: `${lg.color}15`, color: lg.color }}
                      >
                        {lg.letter}
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Completion</span>
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{c.completion}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.completion}%`, background: c.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {c.completedModules}/{c.moduleCount} modules
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{c.credits} cr.</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-[#232d42]">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                      <Clock size={11} />
                      <span>{c.lastActivity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.files.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                          <Folder size={11} />
                          <span>{c.files.length}</span>
                        </div>
                      )}
                      <ChevronRight size={14} className={`text-gray-300 dark:text-gray-600 transition-transform duration-200 ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-[360px] shrink-0 bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden self-start sticky top-4">
            <div className="h-[5px]" style={{ background: selected.color }} />

            <div className="p-5 border-b border-gray-50 dark:border-[#232d42]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                    style={{ background: selected.color }}
                  >
                    {selected.abbr}
                  </div>
                  <div>
                    <h2 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 leading-tight">{selected.name}</h2>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">{selected.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">{selected.description}</p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Instructor', value: selected.instructor },
                  { label: 'Schedule',   value: selected.schedule },
                  { label: 'Room',       value: selected.room },
                  { label: 'Credits',    value: `${selected.credits} credit hrs` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 dark:bg-[#131825] rounded-xl px-3 py-2.5">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">{value}</p>
                  </div>
                ))}
              </div>

              {/* Modules */}
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                  Course Modules
                </h3>
                {courseModules[selected.id] ? (
                  <div className="space-y-1">
                    {courseModules[selected.id].map(m => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                      >
                        <CheckCircle
                          size={14}
                          className={m.completed ? 'text-emerald-500 shrink-0' : 'text-gray-300 dark:text-gray-600 shrink-0'}
                        />
                        <span className={`text-[12px] flex-1 leading-snug ${
                          m.completed
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-gray-100 font-medium'
                        }`}>
                          {m.title}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                          {m.itemCount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <BookOpen size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">Modules will appear here when published</p>
                  </div>
                )}
              </div>

              {/* Primary action: full course page with modules, assignments, resources */}
              <Link
                to={`/courses/${selected.id}`}
                className="block w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] text-center"
                style={{ background: selected.color }}
              >
                Open Full Course →
              </Link>

              {/* Secondary: jump straight to grades detail */}
              <Link
                to="/grades"
                className="block w-full py-2 rounded-xl text-[13px] font-medium text-center border transition-colors hover:opacity-80"
                style={{ borderColor: selected.color, color: selected.color }}
              >
                View Grades
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
