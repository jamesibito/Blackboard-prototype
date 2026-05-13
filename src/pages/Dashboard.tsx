import { Link } from 'react-router-dom'
import { ChevronRight, Clock, TrendingUp } from '../components/Icons'
import {
  courses, dueSoon, grades, activityItems, assignments,
  getCourse, getOverallGPA, getNextClass, getTodayClasses, getSemesterStats,
} from '../data/mockData'

// ─── Sub-components ───────────────────────────────────────────────────────────

function CourseAvatar({ abbr, color, size = 40 }: { abbr: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
    >
      {abbr}
    </div>
  )
}

function CircleProgress({ percentage, color, size = 48 }: { percentage: number; color: string; size?: number }) {
  const r      = (size - 7) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (percentage / 100) * circ
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          className="text-gray-100 dark:text-gray-800" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-bold tabular-nums" style={{ color }}>{percentage}%</span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const overallGPA = getOverallGPA()
  const nextClass  = getNextClass()

  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-gradient-to-br from-[#1B3F89] via-[#1E4DA0] to-[#2563EB] rounded-2xl p-7 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute right-20 -bottom-16 w-56 h-56 rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute right-48 top-3 w-14 h-14 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute left-1/2 -bottom-8 w-32 h-32 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-[26px] font-bold mb-1.5 tracking-tight">Welcome back, Kevin 👋</h1>
          <p className="text-blue-100 text-[14px] leading-relaxed max-w-[440px]">
            You have <span className="font-semibold text-white">{dueSoon.length}</span> assignments due this week.
            Check the Activity Stream to stay on track.
          </p>

          {/* Row: overall average + next-class countdown + activity link */}
          <div className="flex items-center gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-200" />
              <span className="text-[13px] text-blue-100">Overall average: <strong className="text-white">{overallGPA}%</strong></span>
            </div>

            {nextClass && (
              <Link
                to={`/courses/${nextClass.course.id}`}
                className="flex items-center gap-1.5 text-[13px] text-blue-100 hover:text-white transition-colors group"
              >
                <Clock size={13} className="text-blue-300" />
                <span>
                  Next class:{' '}
                  <strong className="text-white group-hover:underline">{nextClass.course.name}</strong>
                  {' '}in{' '}
                  <strong className="text-white">
                    {nextClass.minutesUntil < 60
                      ? `${nextClass.minutesUntil} min`
                      : `${Math.round(nextClass.minutesUntil / 60)}h`}
                  </strong>
                  {' '}· {nextClass.room}
                </span>
              </Link>
            )}

            <Link
              to="/activity-stream"
              className="flex items-center gap-1 text-[13px] font-semibold text-white/90 hover:text-white transition-colors ml-auto"
            >
              View activity <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Semester Stats strip ── */}
      <SemesterStats />

      {/* ── Deadline Timeline ── */}
      <DeadlineTimeline />

      {/* ── Smart Priority Card ── */}
      <PriorityCard />

      {/* ── Main grid: Courses | Due Soon + Grades | Today + Calendar + Activity ── */}
      <div className="grid grid-cols-[1fr_minmax(260px,0.65fr)_minmax(280px,0.75fr)] gap-5">

        {/* Courses */}
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Courses</h2>
            <Link to="/courses" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-[#232d42]">
            {courses.map(c => (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors cursor-pointer group"
              >
                <CourseAvatar abbr={c.abbr} color={c.color} size={38} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-[13px] text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                      {c.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{c.instructor.split(' ')[1]}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{c.code}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.completion}%`, background: c.color }} />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">{c.completion}%</span>
                    {c.resources && c.resources.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 shrink-0 font-medium">
                        {c.resources.length} files
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle column: Due Soon + Grades */}
        <div className="space-y-5">

          {/* Due Soon */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Due Soon</h2>
              <Link to="/calendar" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                Calendar
              </Link>
            </div>
            <div className="px-4 pb-4 space-y-2">
              {dueSoon.map(d => {
                const course = getCourse(d.courseId)
                const linkTarget = d.assignmentId
                  ? `/courses/${d.courseId}/assignments/${d.assignmentId}`
                  : `/courses/${d.courseId}`
                return (
                  <Link
                    key={d.id}
                    to={linkTarget}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors
                      bg-gray-50 dark:bg-[#232d42] hover:bg-gray-100 dark:hover:bg-[#2a354d]
                      border-l-[3px]"
                    style={{ borderLeftColor: course.color }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[13px] text-gray-900 dark:text-gray-100 truncate">{d.title}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-gray-400 dark:text-gray-500" />
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{d.dueDay}</p>
                      </div>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white shrink-0"
                      style={{ background: course.color }}
                    >
                      {course.abbr}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Grades summary */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Grades</h2>
              <Link to="/grades" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                View all
              </Link>
            </div>
            <div className="px-5 pb-5 space-y-3.5">
              {grades.slice(0, 4).map(g => {
                const course = getCourse(g.courseId)
                return (
                  <div key={g.courseId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{course.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.code}</p>
                    </div>
                    <CircleProgress percentage={g.percentage} color={course.color} size={44} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: Today's Schedule + Mini Calendar + Activity */}
        <div className="space-y-5">
          <TodaySchedule />
          <MiniCalendar />

          {/* Activity Stream preview */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Activity Stream</h2>
              <Link to="/activity-stream" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                See all
              </Link>
            </div>
            <div className="px-5 pb-5 space-y-3.5">
              {activityItems.slice(0, 4).map(a => {
                const course     = a.courseId ? getCourse(a.courseId) : undefined
                const avatarAbbr  = course ? course.abbr  : 'GBC'
                const avatarColor = course ? course.color : '#1B3F89'
                return (
                  <Link
                    key={a.id}
                    to="/activity-stream"
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <CourseAvatar abbr={avatarAbbr} color={avatarColor} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                        {a.title}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{a.date}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Semester Stats ───────────────────────────────────────────────────────────
// Four quick-stat chips between the welcome banner and deadline timeline.

function SemesterStats() {
  const { avgGrade, submittedCount, modulesComplete, modulesTotal, daysToBreak } = getSemesterStats()

  const stats = [
    {
      label: 'Semester avg',
      value: `${avgGrade}%`,
      sub: 'across 6 courses',
      color: avgGrade >= 80 ? '#22C55E' : avgGrade >= 60 ? '#F97316' : '#EF4444',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      label: 'Submitted',
      value: String(submittedCount),
      sub: 'assignments handed in',
      color: '#2563EB',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: 'Modules done',
      value: `${modulesComplete}/${modulesTotal}`,
      sub: 'across all courses',
      color: '#8B5CF6',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      label: 'Break in',
      value: `${daysToBreak}d`,
      sub: 'Winter break Dec 23',
      color: '#06B6D4',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(s => (
        <div
          key={s.label}
          className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] px-4 py-3.5 flex items-center gap-3"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${s.color}15`, color: s.color }}
          >
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-none mb-1">{s.label}</p>
            <p className="text-[18px] font-bold leading-none tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-tight">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Smart Priority Card ──────────────────────────────────────────────────────
// Surfaces the single most urgent item: tomorrow's deadline > unread grade >
// almost-complete course. Returns null if nothing notable.

function PriorityCard() {
  // Priority 1: assignment due tomorrow (Dec 15)
  const tomorrow = dueSoon.find(d => d.dueDay.includes('DEC 15'))
  if (tomorrow) {
    const course = getCourse(tomorrow.courseId)
    const linkTarget = tomorrow.assignmentId
      ? `/courses/${tomorrow.courseId}/assignments/${tomorrow.assignmentId}`
      : `/courses/${tomorrow.courseId}`
    return (
      <Link
        to={linkTarget}
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm group"
        style={{ background: '#EF444408', borderColor: '#EF444430' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500">
          {/* Bell icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-red-500 dark:text-red-400">Due tomorrow</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
              style={{ background: course.color }}
            >
              {course.abbr}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 mt-0.5 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
            {tomorrow.title}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{tomorrow.dueDay} · {course.name}</p>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0" />
      </Link>
    )
  }

  // Priority 2: unread graded assignment
  const unreadGrade = assignments.find(a => a.status === 'graded')
  if (unreadGrade) {
    const course = getCourse(unreadGrade.courseId)
    return (
      <Link
        to={`/courses/${unreadGrade.courseId}/assignments/${unreadGrade.id}`}
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm group"
        style={{ background: '#22C55E08', borderColor: '#22C55E30' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 11.08 22 12 12 22 2 12 2.08 11.08" /><polyline points="12 2 12 12" /><polyline points="20 6 12 12 4 6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">New grade</span>
          <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 mt-0.5 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors truncate">
            {unreadGrade.title}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{course.name}</p>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0" />
      </Link>
    )
  }

  // Priority 3: course almost complete
  const nudgeCourse = courses
    .filter(c => c.completion >= 85 && c.completion < 100)
    .sort((a, b) => b.completion - a.completion)[0]
  if (nudgeCourse) {
    return (
      <Link
        to={`/courses/${nudgeCourse.id}`}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm group"
        style={{ background: `${nudgeCourse.color}0D`, borderColor: `${nudgeCourse.color}40` }}
      >
        <div className="text-[24px]">🎓</div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
            Almost there! <span style={{ color: nudgeCourse.color }}>{nudgeCourse.name}</span> is {nudgeCourse.completion}% complete.
          </p>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
            {nudgeCourse.moduleCount - nudgeCourse.completedModules} module{nudgeCourse.moduleCount - nudgeCourse.completedModules !== 1 ? 's' : ''} left to finish.
          </p>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0 transition-colors" />
      </Link>
    )
  }

  return null
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────
// Shows all class blocks scheduled for the demo day (Wednesday Dec 14).
// Status badge: "Up next" (within 3h) | "Later today" | "Done"

function TodaySchedule() {
  const todayClasses = getTodayClasses()

  const statusConfig = {
    upcoming: { label: 'Up next',    bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    later:    { label: 'Later today', bg: 'bg-gray-100 dark:bg-[#232d42]',        text: 'text-gray-500 dark:text-gray-400' },
    done:     { label: 'Done',        bg: 'bg-gray-100 dark:bg-[#232d42]',        text: 'text-gray-400 dark:text-gray-500' },
  }

  const fmt = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM'
    const display = h > 12 ? h - 12 : h
    return `${display}:00 ${period}`
  }

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Today</h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Wed, Dec 14</p>
        </div>
        <Link to="/calendar" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
          Full schedule
        </Link>
      </div>

      {todayClasses.length > 0 ? (
        <div className="divide-y divide-gray-50 dark:divide-[#232d42]">
          {todayClasses.map(cls => {
            const sc = statusConfig[cls.status]
            return (
              <Link
                key={cls.course.id}
                to={`/courses/${cls.course.id}`}
                className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#232d42] group ${cls.status === 'done' ? 'opacity-50' : ''}`}
              >
                {/* Colour dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: cls.status === 'done' ? '#94A3B8' : cls.course.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors truncate ${cls.status === 'done' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {cls.course.name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {fmt(cls.startHour)} – {fmt(cls.endHour)} · {cls.room}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                  {sc.label}
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="px-5 pb-5 text-center py-6">
          <p className="text-[13px] text-gray-400 dark:text-gray-500">No classes scheduled today.</p>
        </div>
      )}
    </div>
  )
}

// ─── Deadline Timeline ────────────────────────────────────────────────────────

function DeadlineTimeline() {
  const TODAY_DAY  = 14
  const parseDayNum = (dayStr: string): number => {
    const match = dayStr.match(/DEC (\d+)/i)
    return match ? parseInt(match[1], 10) : 99
  }
  const sorted = [...dueSoon].sort((a, b) => parseDayNum(a.dueDay) - parseDayNum(b.dueDay))

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[14px] text-gray-900 dark:text-gray-100">Upcoming Deadlines</h2>
        <Link to="/calendar" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
          Open calendar
        </Link>
      </div>

      <div className="relative pt-2">
        <div className="absolute left-0 right-0 top-[26px] h-px bg-gray-100 dark:bg-[#2D3A52]" />
        <div className="flex items-start justify-between pb-1">
          {/* Today marker */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#2563EB] ring-4 ring-[#2563EB]/20 relative z-10" />
            <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wide">Today</span>
            <span className="text-[10px] text-gray-400">Dec {TODAY_DAY}</span>
          </div>

          {sorted.map(d => {
            const course     = getCourse(d.courseId)
            const dayNum     = parseDayNum(d.dueDay)
            const linkTarget = d.assignmentId
              ? `/courses/${d.courseId}/assignments/${d.assignmentId}`
              : `/courses/${d.courseId}`
            const daysOut    = dayNum - TODAY_DAY

            return (
              <Link key={d.id} to={linkTarget} className="flex flex-col items-center gap-1.5 shrink-0 group">
                <div
                  className="w-4 h-4 rounded-full relative z-10 ring-2 transition-all group-hover:scale-110"
                  style={{ background: course.color, outline: `3px solid ${course.color}30`, outlineOffset: '2px' }}
                />
                <span
                  className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors text-center max-w-[84px] leading-tight"
                  style={{ minHeight: 30, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}
                >
                  {d.title}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${course.color}18`, color: course.color }}>
                  {course.abbr}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">Dec {dayNum}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500">in {daysOut}d</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Mini Calendar ─────────────────────────────────────────────────────────────

function MiniCalendar() {
  const days  = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const weeks = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ]
  const today      = 14
  const highlights: Record<number, string> = { 8: '#06B6D4', 12: '#F97316', 20: '#EC4899', 28: '#22C55E' }

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Calendar</h2>
        <Link to="/calendar" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
          Dec 2022
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {days.map(d => (
          <div key={d} className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 pb-1">{d}</div>
        ))}
        {weeks.flat().map((day, i) => {
          const hl      = day ? highlights[day] : undefined
          const isToday = day === today
          return (
            <div key={i} className="flex items-center justify-center">
              {day ? (
                <Link
                  to="/calendar"
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all
                    ${isToday
                      ? 'bg-[#2563EB] text-white font-bold ring-2 ring-[#2563EB]/30'
                      : hl
                        ? 'text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232d42]'
                    }`}
                  style={(!isToday && hl) ? { background: hl } : undefined}
                >
                  {day}
                </Link>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
