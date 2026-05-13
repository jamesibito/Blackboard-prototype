import { Link } from 'react-router-dom'
import { ChevronRight, Clock, CheckCircle, TrendingUp, MessageCircle } from '../components/Icons'
import { courses, dueSoon, grades, activityItems, getCourse, getOverallGPA, getNextClass } from '../data/mockData'

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
  const r = (size - 7) / 2
  const circ = 2 * Math.PI * r
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

  // Completion nudge: find the course closest to 100% that isn't quite there
  const nudgeCourse = courses
    .filter(c => c.completion >= 85 && c.completion < 100)
    .sort((a, b) => b.completion - a.completion)[0]

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

            {/*
              Next class countdown — computed from the demo reference time.
              Shows course name, minutes away, and room number.
            */}
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

      {/*
        ── Due Date Timeline ──
        Horizontal strip showing all upcoming deadlines across courses, ordered by date.
        Gives a at-a-glance "next 2 weeks" view so Kevin doesn't have to open the calendar.
      */}
      <DeadlineTimeline />

      {/*
        ── Completion Nudge ──
        Appears when a course is ≥ 85% complete but not finished.
        Encourages the student and links directly to the course.
      */}
      {nudgeCourse && (
        <Link
          to={`/courses/${nudgeCourse.id}`}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all hover:shadow-sm group"
          style={{ background: `${nudgeCourse.color}0D`, borderColor: `${nudgeCourse.color}40` }}
        >
          <div className="text-[24px]">🎓</div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
              Almost there! <span style={{ color: nudgeCourse.color }}>{nudgeCourse.name}</span> is {nudgeCourse.completion}% complete.
            </p>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              {nudgeCourse.moduleCount - nudgeCourse.completedModules} module{nudgeCourse.moduleCount - nudgeCourse.completedModules !== 1 ? 's' : ''} left to finish the course.
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0 transition-colors" />
        </Link>
      )}

      {/* Main grid: Courses | Due Soon + Grades | Calendar + Activity */}
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
                  {/* Completion bar + resource count */}
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
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
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

        {/* Right column: Mini Calendar + Activity Stream preview */}
        <div className="space-y-5">
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
                // courseId is optional — college-wide announcements have no course
                const course = a.courseId ? getCourse(a.courseId) : undefined
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
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                        {a.date}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick stats */}
      <div className="grid grid-cols-2 gap-5">
        <StatCard
          label="Assignments Completed"
          value="12 / 18"
          sub="this semester"
          icon={<CheckCircle size={18} className="text-emerald-500" />}
          accent="#22C55E"
        />
        <StatCard
          label="Unread Messages"
          value="2"
          sub="new in your inbox"
          icon={<MessageCircle size={18} className="text-[#2563EB]" />}
          accent="#2563EB"
          linkTo="/messages"
        />
      </div>
    </div>
  )
}

// ─── Deadline Timeline ────────────────────────────────────────────────────────
// Horizontal strip showing all deadlines from dueSoon, ordered by day.
// Gives a mini Gantt-style overview without opening the calendar.

function DeadlineTimeline() {
  // Demo "today" = Dec 14
  const TODAY_DAY = 14

  // Parse day number from strings like "WEDNESDAY, DEC 7TH"
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

      {/* Scrollable horizontal track */}
      <div className="relative overflow-x-auto">
        {/* Connector line */}
        <div className="absolute left-0 right-0 top-[18px] h-px bg-gray-100 dark:bg-[#2D3A52]" />

        <div className="flex items-start gap-8 pb-1 min-w-max">
          {/* "Today" marker */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#2563EB] ring-4 ring-[#2563EB]/20 relative z-10" />
            <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wide">Today</span>
            <span className="text-[10px] text-gray-400">Dec {TODAY_DAY}</span>
          </div>

          {sorted.map(d => {
            const course   = getCourse(d.courseId)
            const dayNum   = parseDayNum(d.dueDay)
            const linkTarget = d.assignmentId
              ? `/courses/${d.courseId}/assignments/${d.assignmentId}`
              : `/courses/${d.courseId}`
            const daysOut  = dayNum - TODAY_DAY

            return (
              <Link key={d.id} to={linkTarget} className="flex flex-col items-center gap-2 shrink-0 group">
                {/* Dot — course colour */}
                <div
                  className="w-4 h-4 rounded-full relative z-10 ring-2 transition-all group-hover:scale-110"
                  style={{ background: course.color, outline: `3px solid ${course.color}30`, outlineOffset: '2px' }}
                />
                {/* Assignment name */}
                <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors text-center max-w-[80px] leading-tight">
                  {d.title}
                </span>
                {/* Course abbreviation */}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${course.color}18`, color: course.color }}>
                  {course.abbr}
                </span>
                {/* Date + days away */}
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
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const weeks = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ]
  // Dec 14 = "today" in this demo
  const today = 14
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
          const hl = day ? highlights[day] : undefined
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

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent, linkTo }: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent: string; linkTo?: string
}) {
  const inner = (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] px-5 py-4 flex items-center gap-4 transition-shadow hover:shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}15` }}>
        {icon}
      </div>
      <div>
        <div className="text-[22px] font-bold text-gray-900 dark:text-gray-100 leading-none">{value}</div>
        <div className="text-[12px] font-medium text-gray-700 dark:text-gray-300 mt-0.5">{label}</div>
        <div className="text-[11px] text-gray-400 dark:text-gray-500">{sub}</div>
      </div>
    </div>
  )
  return linkTo ? <Link to={linkTo}>{inner}</Link> : inner
}
