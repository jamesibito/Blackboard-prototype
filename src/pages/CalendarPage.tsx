import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, Filter, CheckCircle } from '../components/Icons'
import { calendarEvents, classBlocks, dueSoon, getCourse } from '../data/mockData'
import type { CalendarEvent } from '../data/mockData'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
type ViewMode = 'Month' | 'Week' | 'Day' | 'List'

// Filter options for the event-type dropdown — drives which events render across the page
type EventTypeFilter = 'all' | 'deadline' | 'class' | 'event'
const filterLabels: Record<EventTypeFilter, string> = {
  all:      'All events',
  deadline: 'Deadlines only',
  class:    'Classes only',
  event:    'Events only',
}

// Dec 14, 2022 = "today" in this demo
const TODAY = 14

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfWeek(year: number, month: number) { return new Date(year, month, 1).getDay() }

export default function CalendarPage() {
  const navigate = useNavigate()
  const [year, setYear] = useState(2022)
  const [month, setMonth] = useState(11) // December
  const [view, setView] = useState<ViewMode>('Month')
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY)
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Close filter dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Apply the active type filter to any list of events.
  // Note: only `type` field on CalendarEvent — items without a type are
  // treated as `event` for filtering purposes.
  function applyTypeFilter(events: CalendarEvent[]): CalendarEvent[] {
    if (typeFilter === 'all') return events
    return events.filter(e => (e.type ?? 'event') === typeFilter)
  }

  // Clicking a List-view event row navigates to its course
  function handleEventClick(event: CalendarEvent) {
    navigate(`/courses/${event.courseId}`)
  }

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
    year === 2022 && month === 11
      ? applyTypeFilter(calendarEvents.filter(e => e.day === day))
      : []

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
            <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--tenant-primary)]/10 text-[var(--tenant-link)] dark:bg-[var(--tenant-primary)]/20 dark:text-[var(--tenant-link-dark)]">
              Current month
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter — dropdown of event types. Active filter shown in the button label. */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition border ${
                typeFilter !== 'all'
                  ? 'border-[var(--tenant-primary)]/40 text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)] bg-[var(--tenant-primary)]/[0.06]'
                  : 'border-gray-200 dark:border-[#2D3A52] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232d42]'
              }`}
            >
              <Filter size={13} aria-hidden="true" />
              {typeFilter === 'all' ? 'Filter' : filterLabels[typeFilter]}
            </button>

            {filterOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+6px)] w-[180px] bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {(Object.entries(filterLabels) as [EventTypeFilter, string][]).map(([key, label]) => {
                  const active = typeFilter === key
                  return (
                    <button
                      key={key}
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => { setTypeFilter(key); setFilterOpen(false) }}
                      className={`flex items-center justify-between w-full px-4 py-2 text-left text-[13px] transition-colors ${
                        active
                          ? 'text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)] bg-[var(--tenant-primary)]/[0.06] font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#232d42]'
                      }`}
                    >
                      {label}
                      {active && <CheckCircle size={13} aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* View mode tabs */}
          <div className="flex border border-gray-200 dark:border-[#2D3A52] rounded-xl overflow-hidden">
            {(['Month','Week','Day','List'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-[12px] font-medium transition-colors ${
                  view === v
                    ? 'bg-[var(--tenant-primary)] text-white'
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
                <div key={d} className="px-3 py-2.5 text-[12px] font-semibold text-gray-400 dark:text-gray-400 text-center">
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
                        ${isSelected ? 'bg-[var(--tenant-primary)]/[0.04] dark:bg-[var(--tenant-primary)]/[0.08]' : ''}
                        ${!cell.isCurrentMonth ? 'bg-gray-50/50 dark:bg-[#131825]/50' : ''}
                      `}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between mb-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium transition-colors
                            ${isToday
                              ? 'bg-[var(--tenant-primary)] text-white font-bold'
                              : cell.isCurrentMonth
                                ? 'text-gray-700 dark:text-gray-300'
                                : 'text-gray-300 dark:text-gray-700'
                            }`}
                        >
                          {cell.day}
                        </div>
                      </div>

                      {/* Events — each chip jumps to its course; +N more selects the day */}
                      {visible.length > 0 && (
                        <div className="space-y-0.5">
                          {visible.map(evt => (
                            <Link
                              key={evt.id}
                              to={`/courses/${evt.courseId}`}
                              onClick={e => e.stopPropagation()}
                              className="block text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate hover:opacity-80 transition-opacity"
                              style={{ color: evt.color, background: `${evt.color}18`, borderLeft: `2px solid ${evt.color}` }}
                              title={`${evt.title} — open course`}
                            >
                              {evt.title}
                            </Link>
                          ))}
                          {more > 0 && (
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setSelectedDay(cell.day) }}
                              className="text-[10px] text-gray-400 dark:text-gray-400 pl-1 hover:text-[var(--tenant-link)] dark:hover:text-[var(--tenant-link-dark)] transition-colors"
                            >
                              +{more} more
                            </button>
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
                      <p className="text-[12px] text-gray-400 dark:text-gray-400 font-medium">{MONTHS[month]}</p>
                      <p className="text-[28px] font-bold text-gray-900 dark:text-gray-100 leading-none">{selectedDay}</p>
                    </div>
                    {selectedDay === TODAY && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--tenant-primary)]/10 text-[var(--tenant-link)] dark:bg-[var(--tenant-primary)]/20 dark:text-[var(--tenant-link-dark)]">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Class schedule */}
                  {selectedClasses.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide mb-2">Classes</p>
                      <div className="space-y-1.5">
                        {selectedClasses.map((cb, i) => {
                          const course = getCourse(cb.courseId)
                          const formatHour = (h: number) => h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`
                          return (
                            <div key={i} className="p-2.5 rounded-xl border" style={{ borderColor: `${course.color}30`, background: `${course.color}08` }}>
                              <p className="text-[11px] font-semibold" style={{ color: course.color }}>{course.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-gray-400 dark:text-gray-400" />
                                <p className="text-[10px] text-gray-400 dark:text-gray-400">
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
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide mb-2">Events & Deadlines</p>
                      )}
                      <div className="space-y-2">
                        {selectedEvents.map(evt => {
                          const course = getCourse(evt.courseId)
                          return (
                            <Link
                              key={evt.id}
                              to={`/courses/${evt.courseId}`}
                              className="block p-3 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-sm"
                              style={{ borderColor: `${evt.color}40`, background: `${evt.color}0A` }}
                              title={`Open ${course.name}`}
                            >
                              <p className="text-[12px] font-semibold" style={{ color: evt.color }}>{evt.title}</p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">{course.name}</p>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ) : selectedClasses.length === 0 ? (
                    <p className="text-[12px] text-gray-400 dark:text-gray-400 text-center py-4">No events</p>
                  ) : null}
                </>
              ) : (
                <p className="text-[12px] text-gray-400 dark:text-gray-400 text-center py-6">Select a day to see events</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View — chronological list of all events for the visible month.
          Honours the active type filter; clicking a row navigates to the course. */}
      {view === 'List' && (
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
          {(() => {
            const events = applyTypeFilter(year === 2022 && month === 11 ? calendarEvents : [])
              .sort((a, b) => a.day - b.day)
            if (events.length === 0) {
              return (
                <div className="text-center py-12 px-5">
                  <p className="text-[13px] text-gray-400 dark:text-gray-400">
                    No events match the active filter.
                  </p>
                </div>
              )
            }
            return (
              <div className="divide-y divide-gray-100 dark:divide-[#2D3A52]">
                {events.map(evt => {
                  const course = getCourse(evt.courseId)
                  const isToday = evt.day === TODAY
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => handleEventClick(evt)}
                      className={`flex items-center gap-4 w-full px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#232d42] transition text-left ${isToday ? 'bg-[var(--tenant-primary)]/[0.03] dark:bg-[var(--tenant-primary)]/[0.06]' : ''}`}
                    >
                      <div className="text-center w-12 shrink-0">
                        <div className={`text-[22px] font-bold leading-none ${isToday ? 'text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)]' : 'text-gray-900 dark:text-gray-100'}`}>
                          {evt.day}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-400 uppercase font-medium mt-0.5">Dec</div>
                      </div>
                      <div className="w-1 h-8 rounded-full shrink-0" style={{ background: evt.color }} />
                      <div className="flex-1">
                        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{evt.title}</h3>
                        <p className="text-[12px] text-gray-400 dark:text-gray-400 mt-0.5">{course.name} · {course.code}</p>
                      </div>
                      {isToday && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--tenant-primary)]/10 text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)]">
                          Today
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })()}
        </div>
      )}

      {/* Week View */}
      {view === 'Week' && <WeekView />}

      {/* Day View — shows selected day as a single-column schedule */}
      {view === 'Day' && <DayView selectedDay={selectedDay ?? TODAY} month={month} year={year} />}
    </div>
  )
}

// ─── Shared constants ─────────────────────────────────────────────────────────

const HOUR_HEIGHT = 60  // px per hour in the time grid
const DAY_START   = 8   // 8 AM
const DAY_END     = 18  // 6 PM

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Week of Dec 11–17, 2022 (demo week — today = Dec 14 = Wednesday = index 3)
const WEEK_DATES = [11, 12, 13, 14, 15, 16, 17]

function fmt12(h: number) {
  if (h === 0)  return '12 AM'
  if (h === 12) return '12 PM'
  return h > 12 ? `${h - 12} PM` : `${h} AM`
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView() {
  const hours = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)

  // Due-soon items that fall in this demo week (Dec 11-17)
  const parseDec = (s: string) => { const m = s.match(/DEC (\d+)/i); return m ? +m[1] : 0 }
  const weekDeadlines = dueSoon.filter(d => {
    const day = parseDec(d.dueDay)
    return day >= 11 && day <= 17
  })

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">

      {/* Column headers */}
      <div className="grid border-b border-gray-100 dark:border-[#2D3A52]" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div />
        {WEEK_DATES.map((date, dow) => {
          const isToday = date === TODAY
          return (
            <div key={dow} className="py-3 text-center border-l border-gray-50 dark:border-[#1E2A3F] first:border-l-0">
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-400">{SHORT_DAYS[dow]}</p>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 text-[13px] font-bold ${
                isToday ? 'bg-[var(--tenant-primary)] text-white' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {date}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day strip: deadlines */}
      {weekDeadlines.length > 0 && (
        <div className="grid border-b border-gray-100 dark:border-[#2D3A52]" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
          <div className="flex items-center justify-end pr-2 py-1.5">
            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide">Due</span>
          </div>
          {WEEK_DATES.map((date, dow) => {
            const deadlinesOnDay = weekDeadlines.filter(d => parseDec(d.dueDay) === date)
            return (
              <div key={dow} className="border-l border-gray-50 dark:border-[#1E2A3F] px-1 py-1 min-h-[24px]">
                {deadlinesOnDay.map(d => {
                  const course = getCourse(d.courseId)
                  const target = d.assignmentId ? `/courses/${d.courseId}/assignments/${d.assignmentId}` : `/courses/${d.courseId}`
                  return (
                    <Link
                      key={d.id}
                      to={target}
                      className="block text-[10px] font-semibold px-1.5 py-0.5 rounded truncate mb-0.5 hover:opacity-80 transition-opacity"
                      style={{ background: `${course.color}18`, color: course.color }}
                      title={d.title}
                    >
                      {d.title}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
        <div className="grid relative" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>

          {/* Hour labels */}
          <div>
            {hours.map(h => (
              <div key={h} className="flex items-start justify-end pr-2 pt-0.5" style={{ height: HOUR_HEIGHT }}>
                <span className="text-[10px] text-gray-400 dark:text-gray-400 font-medium tabular-nums">{fmt12(h)}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WEEK_DATES.map((date, dow) => {
            const isToday    = date === TODAY
            const dayBlocks  = classBlocks.filter(b => b.dayOfWeek === dow)

            return (
              <div
                key={dow}
                className={`relative border-l border-gray-50 dark:border-[#1E2A3F] ${isToday ? 'bg-[var(--tenant-primary)]/[0.02] dark:bg-[var(--tenant-primary)]/[0.04]' : ''}`}
                style={{ height: HOUR_HEIGHT * hours.length }}
              >
                {/* Hour grid lines */}
                {hours.map(h => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-50 dark:border-[#1E2A3F]"
                    style={{ top: (h - DAY_START) * HOUR_HEIGHT }}
                  />
                ))}

                {/* Class blocks */}
                {dayBlocks.map((block, i) => {
                  const course = getCourse(block.courseId)
                  const top    = (block.startHour - DAY_START) * HOUR_HEIGHT
                  const height = (block.endHour - block.startHour) * HOUR_HEIGHT
                  return (
                    <Link
                      key={i}
                      to={`/courses/${block.courseId}`}
                      className="absolute left-1 right-1 rounded-lg px-2 py-1.5 overflow-hidden hover:opacity-90 transition-opacity"
                      style={{ top: top + 2, height: height - 4, background: `${course.color}20`, borderLeft: `3px solid ${course.color}` }}
                    >
                      <p className="text-[11px] font-bold leading-tight truncate" style={{ color: course.color }}>{course.abbr}</p>
                      <p className="text-[10px] leading-tight truncate" style={{ color: course.color, opacity: 0.8 }}>{course.name}</p>
                      {height >= 80 && (
                        <p className="text-[10px] mt-0.5" style={{ color: course.color, opacity: 0.7 }}>
                          {fmt12(block.startHour)} – {fmt12(block.endHour)} · {block.room}
                        </p>
                      )}
                    </Link>
                  )
                })}

                {/* "Now" line on today at 8:45 AM */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 flex items-center z-10 pointer-events-none"
                    style={{ top: (8.75 - DAY_START) * HOUR_HEIGHT }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--tenant-primary)] shrink-0 -ml-1" />
                    <div className="flex-1 h-px bg-[var(--tenant-primary)]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({ selectedDay, month, year }: { selectedDay: number; month: number; year: number }) {
  const date    = new Date(year, month, selectedDay)
  const dow     = date.getDay()
  const isToday = selectedDay === TODAY && year === 2022 && month === 11
  const hours   = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)

  const dayBlocks    = classBlocks.filter(b => b.dayOfWeek === dow)
  const parseDec     = (s: string) => { const m = s.match(/DEC (\d+)/i); return m ? +m[1] : 0 }
  const dayDeadlines = year === 2022 && month === 11
    ? dueSoon.filter(d => parseDec(d.dueDay) === selectedDay)
    : []

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-[#2D3A52]">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[18px] ${isToday ? 'bg-[var(--tenant-primary)] text-white' : 'bg-gray-100 dark:bg-[#232d42] text-gray-700 dark:text-gray-300'}`}>
          {selectedDay}
        </div>
        <div>
          <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{SHORT_DAYS[dow]}, {MONTHS[month]} {selectedDay}</p>
          {isToday && <span className="text-[11px] text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)] font-medium">Today</span>}
        </div>
      </div>

      {/* Deadlines strip */}
      {dayDeadlines.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-50 dark:border-[#1E2A3F] flex gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wide self-center">Due</span>
          {dayDeadlines.map(d => {
            const course = getCourse(d.courseId)
            const target = d.assignmentId ? `/courses/${d.courseId}/assignments/${d.assignmentId}` : `/courses/${d.courseId}`
            return (
              <Link key={d.id} to={target} className="text-[11px] font-semibold px-2 py-0.5 rounded hover:opacity-80 transition-opacity" style={{ background: `${course.color}18`, color: course.color }}>
                {d.title}
              </Link>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="flex overflow-y-auto" style={{ maxHeight: '480px' }}>
        {/* Hour labels */}
        <div className="shrink-0 w-14">
          {hours.map(h => (
            <div key={h} className="flex items-start justify-end pr-2 pt-0.5" style={{ height: HOUR_HEIGHT }}>
              <span className="text-[10px] text-gray-400 dark:text-gray-400 tabular-nums">{fmt12(h)}</span>
            </div>
          ))}
        </div>

        {/* Single-day column */}
        <div className="flex-1 relative border-l border-gray-100 dark:border-[#2D3A52]" style={{ height: HOUR_HEIGHT * hours.length }}>
          {hours.map(h => (
            <div key={h} className="absolute left-0 right-0 border-t border-gray-50 dark:border-[#1E2A3F]" style={{ top: (h - DAY_START) * HOUR_HEIGHT }} />
          ))}

          {dayBlocks.map((block, i) => {
            const course = getCourse(block.courseId)
            const top    = (block.startHour - DAY_START) * HOUR_HEIGHT
            const height = (block.endHour - block.startHour) * HOUR_HEIGHT
            return (
              <Link
                key={i}
                to={`/courses/${block.courseId}`}
                className="absolute left-2 right-2 rounded-xl px-3 py-2 overflow-hidden hover:opacity-90 transition-opacity"
                style={{ top: top + 2, height: height - 4, background: `${course.color}15`, borderLeft: `4px solid ${course.color}` }}
              >
                <p className="text-[13px] font-bold" style={{ color: course.color }}>{course.name}</p>
                <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: course.color, opacity: 0.8 }}>
                  <Clock size={10} />
                  {fmt12(block.startHour)} – {fmt12(block.endHour)} · {block.room}
                </p>
              </Link>
            )
          })}

          {isToday && (
            <div className="absolute left-0 right-0 flex items-center z-10 pointer-events-none" style={{ top: (8.75 - DAY_START) * HOUR_HEIGHT }}>
              <div className="w-2 h-2 rounded-full bg-[var(--tenant-primary)] shrink-0 -ml-1" />
              <div className="flex-1 h-px bg-[var(--tenant-primary)]" />
            </div>
          )}

          {dayBlocks.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[13px] text-gray-400 dark:text-gray-400">No classes scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
