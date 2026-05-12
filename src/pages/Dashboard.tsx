import { Link } from 'react-router-dom'
import { ChevronRight, FileText, ImageIcon, Clock, CheckCircle, TrendingUp } from '../components/Icons'
import { courses, dueSoon, grades, activityItems, getCourse, getOverallGPA } from '../data/mockData'

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

function FileChip({ name }: { name: string }) {
  const isImage = name.match(/\.(jpg|png|gif)$/i)
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#2D3A52] font-medium">
      {isImage ? <ImageIcon size={10} /> : <FileText size={10} />}
      {name}
    </span>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const overallGPA = getOverallGPA()

  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* Welcome Banner */}
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
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-200" />
              <span className="text-[13px] text-blue-100">Overall average: <strong className="text-white">{overallGPA}%</strong></span>
            </div>
            <Link
              to="/activity-stream"
              className="flex items-center gap-1 text-[13px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              View activity <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

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
                  {c.files.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.files.slice(0, 2).map(f => <FileChip key={f} name={f} />)}
                      {c.files.length > 2 && (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">+{c.files.length - 2} more</span>
                      )}
                    </div>
                  )}
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
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0" />
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
                const course = getCourse(a.courseId)
                return (
                  <Link
                    key={a.id}
                    to="/activity-stream"
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <CourseAvatar abbr={course.abbr} color={course.color} size={36} />
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
      <div className="grid grid-cols-3 gap-5">
        <StatCard
          label="Assignments Completed"
          value="12"
          sub="this semester"
          icon={<CheckCircle size={18} className="text-emerald-500" />}
          accent="#22C55E"
        />
        <StatCard
          label="Upcoming Deadlines"
          value={String(dueSoon.length)}
          sub="in the next 7 days"
          icon={<Clock size={18} className="text-amber-500" />}
          accent="#F59E0B"
        />
        <StatCard
          label="Semester Average"
          value={`${overallGPA}%`}
          sub="across all courses"
          icon={<TrendingUp size={18} className="text-[#2563EB]" />}
          accent="#2563EB"
        />
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

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent: string
}) {
  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] px-5 py-4 flex items-center gap-4">
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
}
