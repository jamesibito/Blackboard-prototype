import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock } from '../components/Icons'
import { calendarEvents, classBlocks, getCourse } from '../data/mockData'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
type ViewMode = 'Month' | 'Week' | 'Day' | 'List'

// Dec 14, 2022 = "today" in this demo
const TODAY = 14

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfWeek(year: number, month: number) { return new Date(year, month, 1).getDay() }

export default function CalendarPage() {
  const [year, setYear] = useState(2022)
  const [month, setMonth] = useState(11) // December
  const [view, setView] = useState<ViewMode>('Month')
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1)

  const goToPrev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const goToNext = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1)

  // Build grid cells
  const cells: { day: number; isCurrentMonth: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, isCurrentMonth: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, isCurrentMonth: true })
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) for (let d = 1; d <= remaining; d++) cells.push({ day: d, isCurrentMonth: false })

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const getEventsForDay = (day: number) =>
    year === 2022 && month === 11 ? calendarEvents.filter(e => e.day === day) : []

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : []

  // Get class blocks for selected day's day-of-week
  const getClassesForDay = (day: number) => {
    if (year !== 2022 || month !== 11) return []
    const date = new Date(year, month, day)
    const dow = date.getDay()
    return classBlocks.filter(b => b.dayOfWeek === dow)
  }
  const selectedClasses = selectedDay ? getClassesForDay(selectedDay) : []

  return (
    <div className="max-w-[1200px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={goToPrev} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-500 dark:text-gray-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={goToNext} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-500 dark:text-gray-400">
            <ChevronRight size={18} />
          </button>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 ml-1 tracking-tight">
            {MONTHS[month]} {year}
          </h1>
          {year === 2022 && month === 11 && (
            <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]">
              Current month
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232d42] transition border border-gray-200 dark:border-[#2D3A52]">
            Filter
          </button>
          {/* View mode tabs */}
          <div className="flex border border-gray-200 dark:border-[#2D3A52] rounded-xl overflow-hidden">
            {(['Month','Week','Day','List'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-[12px] font-medium transition-colors ${
                  view === v
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white dark:bg-[#1A2236] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#232d42]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month View */}
      {view === 'Month' && (
        <div className="flex gap-5">
          <div className="flex-1 bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#2D3A52]">
              {DAY_HEADERS.map(d => (
                <div key={d} className="px-3 py-2.5 text-[12px] font-semibold text-gray-400 dark:text-gray-500 text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 border-b border-gray-50 dark:border-[#1E2A3F] last:border-b-0">
                {week.map((cell, ci) => {
                  const events = cell.isCurrentMonth ? getEventsForDay(cell.day) : []
                  const visible = events.slice(0, 2)
                  const more = events.length - 2
                  const isToday = cell.isCurrentMonth && cell.day === TODAY && year === 2022 && month === 11
                  const isSelected = cell.isCurrentMonth && cell.day === selectedDay

                  return (
                    <div
                      key={ci}
                      onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day === selectedDay ? null : cell.day)}
                      className={`min-h-[100px] px-2 py-2 border-r border-gray-50 dark:border-[#1E2A3F] last:border-r-0 transition-colors cursor-pointer
                        ${cell.isCurrentMonth ? 'hover:bg-gray-50 dark:hover:bg-[#232d42]' : ''}
                        ${isSelected ? 'bg-[#2563EB]/[0.04] dark:bg-[#2563EB]/[0.08]' : ''}
                        ${!cell.isCurrentMonth ? 'bg-gray-50/50 dark:bg-[#131825]/50' : ''}
                      `}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between mb-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium transition-colors
                            ${isToday
                              ? 'bg-[#2563EB] text-white font-bold'
                              : cell.isCurrentMonth
                                ? 'text-gray-700 dark:text-gray-300'
                                : 'text-gray-300 dark:text-gray-700'
                            }`}
                        >
                          {cell.day}
                        </div>
                      </div>

                      {/* Events */}
                      {visible.length > 0 && (
                        <div className="space-y-0.5">
                          {visible.map(evt => (
                            <div
                              key={evt.id}
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate"
                              style={{ color: evt.color, background: `${evt.color}18`, borderLeft: `2px solid ${evt.color}` }}
                            >
                              {evt.title}
                            </div>
                          ))}
                          {more > 0 && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 pl-1">
                              +{more} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Side panel: selected day events */}
          <div className="w-[220px] shrink-0">
            <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-4">
              {selectedDay ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">{MONTHS[month]}</p>
                      <p className="text-[28px] font-bold text-gray-900 dark:text-gray-100 leading-none">{selectedDay}</p>
                    </div>
                    {selectedDay === TODAY && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Class schedule */}
                  {selectedClasses.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Classes</p>
                      <div className="space-y-1.5">
                        {selectedClasses.map((cb, i) => {
                          const course = getCourse(cb.courseId)
                          const formatHour = (h: number) => h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`
                          return (
                            <div key={i} className="p-2.5 rounded-xl border" style={{ borderColor: `${course.color}30`, background: `${course.color}08` }}>
                              <p className="text-[11px] font-semibold" style={{ color: course.color }}>{course.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-gray-400 dark:text-gray-500" />
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                  {formatHour(cb.startHour)} – {formatHour(cb.endHour)} · {cb.room}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {selectedEvents.length > 0 ? (
                    <div>
                      {selectedClasses.length > 0 && (
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Events & Deadlines</p>
                      )}
                      <div className="space-y-2">
                        {selectedEvents.map(evt => {
                          const course = getCourse(evt.courseId)
                          return (
                            <div key={evt.id} className="p-3 rounded-xl border" style={{ borderColor: `${evt.color}40`, background: `${evt.color}0A` }}>
                              <p className="text-[12px] font-semibold" style={{ color: evt.color }}>{evt.title}</p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{course.name}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : selectedClasses.length === 0 ? (
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center py-4">No events</p>
                  ) : null}
                </>
              ) : (
                <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center py-6">Select a day to see events</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'List' && (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
          <div className="divide-y divide-gray-50 dark:divide-[#2D3A52]">
            {(year === 2022 && month === 11 ? calendarEvents : [])
              .sort((a, b) => a.day - b.day)
              .map(evt => {
                const course = getCourse(evt.courseId)
                const isToday = evt.day === TODAY
                return (
                  <div key={evt.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#232d42] transition cursor-pointer ${isToday ? 'bg-[#2563EB]/[0.03] dark:bg-[#2563EB]/[0.06]' : ''}`}>
                    <div className="text-center w-12 shrink-0">
                      <div className={`text-[22px] font-bold leading-none ${isToday ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-gray-900 dark:text-gray-100'}`}>
                        {evt.day}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-medium mt-0.5">Dec</div>
                    </div>
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ background: evt.color }} />
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{evt.title}</h3>
                      <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">{course.name} · {course.code}</p>
                    </div>
                    {isToday && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
                        Today
                      </span>
                    )}
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

      {/* Week / Day stubs — polished placeholder */}
      {(view === 'Week' || view === 'Day') && (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#232d42] flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-[15px] font-semibold text-gray-500 dark:text-gray-400">{view} view</p>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1">Coming in the next update</p>
        </div>
      )}
    </div>
  )
}
