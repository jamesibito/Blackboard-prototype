import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, TrendingUp } from '../components/Icons'
import {
  courses, dueSoon, activityItems, assignments, calendarEvents,
  getCourse, getOverallGPA, getNextClass, getTodayClasses,
} from '../data/mockData'
import { Skeleton, SkeletonAvatar, SkeletonCard } from '../components/Skeleton'

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

// ─── Recent Grades widget ────────────────────────────────────────────────────
// Surfaces the most recently graded assignments at assignment-level granularity.
// Replaces the previous static per-course aggregate widget — aggregates aren't
// time-sensitive ("you have a 75% in 2D" doesn't change day-to-day) but new grade
// returns are exactly the kind of thing students check the dashboard for.

function RecentGrades() {
  // Sum the rubric → score / total → percentage. Falls back to 0/1 if rubric empty.
  function gradeFor(asgnId: string) {
    const a = assignments.find(x => x.id === asgnId)
    if (!a || !a.rubric.length) return { score: 0, total: 1, pct: 0 }
    const score = a.rubric.reduce((sum, c) => sum + (c.score ?? 0), 0)
    const total = a.rubric.reduce((sum, c) => sum + c.total, 0)
    return { score, total, pct: total > 0 ? Math.round((score / total) * 100) : 0 }
  }

  // Pull all graded assignments, newest first. Assignments are already in
  // reverse-chronological order in mockData, so we just slice the top 5.
  const recent = assignments.filter(a => a.status === 'graded').slice(0, 5)

  // Pct → swatch colour. Mirrors the Grades page convention.
  function pctTone(pct: number) {
    if (pct >= 85) return { color: '#22C55E', bg: '#22C55E12' }    // emerald
    if (pct >= 70) return { color: '#2563EB', bg: '#2563EB12' }    // blue
    if (pct >= 60) return { color: '#F59E0B', bg: '#F59E0B12' }    // amber
    return                  { color: '#EF4444', bg: '#EF444412' }  // red
  }

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Recent Grades</h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Latest returned work</p>
        </div>
        <Link to="/grades" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
        {recent.map(a => {
          const course = getCourse(a.courseId)
          const { score, total, pct } = gradeFor(a.id)
          const tone = pctTone(pct)
          return (
            <Link
              key={a.id}
              to={`/courses/${a.courseId}/assignments/${a.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[13px] text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                  {a.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${course.color}18`, color: course.color }}
                  >
                    {course.abbr}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">{score}/{total}</span>
                </div>
              </div>
              <div
                className="text-[12px] font-bold px-2.5 py-1 rounded-lg tabular-nums shrink-0"
                style={{ background: tone.bg, color: tone.color }}
              >
                {pct}%
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const overallGPA = getOverallGPA()
  const nextClass  = getNextClass()

  // Simulate a brief loading state so the skeleton is visible on first paint.
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* ── Top row: Welcome Banner + Today's Schedule ── */}
      <div className="flex gap-5 items-stretch">

        {/* Welcome Banner — fills remaining width */}
        <div className="relative flex-1 bg-gradient-to-br from-[#1B3F89] via-[#1E4DA0] to-[#2563EB] rounded-2xl p-6 text-white overflow-hidden min-w-0">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/[0.06] pointer-events-none" />
          <div className="absolute right-16 -bottom-12 w-44 h-44 rounded-full bg-white/[0.04] pointer-events-none" />
          <div className="absolute right-36 top-3 w-10 h-10 rounded-full bg-white/[0.07] pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full">
            <h1 className="text-[24px] font-bold mb-1.5 tracking-tight">Welcome back, Kevin</h1>
            <p className="text-blue-100 text-[13.5px] leading-relaxed">
              You have <span className="font-semibold text-white">{dueSoon.length}</span> assignments due soon.
              Stay on top with the activity stream.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-blue-200" />
                <span className="text-[12.5px] text-blue-100">Average: <strong className="text-white">{overallGPA}%</strong></span>
              </div>

              {nextClass && (
                <Link
                  to={`/courses/${nextClass.course.id}`}
                  className="flex items-center gap-1.5 text-[12.5px] text-blue-100 hover:text-white transition-colors group"
                >
                  <Clock size={12} className="text-blue-300" />
                  <span>
                    <strong className="text-white group-hover:underline">{nextClass.course.abbr}</strong>
                    {' '}in{' '}
                    <strong className="text-white">
                      {nextClass.minutesUntil < 60
                        ? `${nextClass.minutesUntil} min`
                        : `${Math.round(nextClass.minutesUntil / 60)}h`}
                    </strong>
                    <span className="text-blue-200"> · {nextClass.room}</span>
                  </span>
                </Link>
              )}
            </div>

            {/* Priority card — inline at bottom of banner */}
            <div className="mt-auto pt-4">
              <PriorityCard compact />
            </div>
          </div>
        </div>

        {/* Today's Schedule — fixed width sidebar */}
        <div className="w-[280px] shrink-0">
          <TodaySchedule />
        </div>
      </div>

      {/* ── Deadline Timeline ── */}
      <DeadlineTimeline />

      {/* ── Main grid: Courses | Recent Grades | Calendar + Activity ── */}
      <div className="grid grid-cols-[1fr_minmax(260px,0.65fr)_minmax(280px,0.75fr)] gap-5">

        {/* Courses */}
        <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Courses</h2>
            <Link to="/courses" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
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

        {/* Middle column: Recent Grades — assignment-level, time-sensitive
            (Replaced the previous Due Soon + aggregate Grades widgets.
             Deadline Timeline above covers "what's due"; this surfaces "what just came back".) */}
        <RecentGrades />

        {/* Right column: Mini Calendar + Activity */}
        <div className="space-y-5">
          <MiniCalendar />

          {/* Activity Stream preview */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Activity Stream</h2>
              <Link to="/activity-stream" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
                View all
              </Link>
            </div>
            <div className="px-5 pb-5 space-y-3.5">
              {activityItems.slice(0, 4).map(a => {
                const course     = a.courseId ? getCourse(a.courseId) : undefined
                const avatarAbbr  = course ? course.abbr  : 'GBC'
                const avatarColor = course ? course.color : '#1B3F89'
                const isExternal = a.linkTo?.startsWith('http')
                const dest = a.linkTo ?? '/activity-stream'
                const inner = (
                  <>
                    <CourseAvatar abbr={avatarAbbr} color={avatarColor} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                        {a.title}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{a.date}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  </>
                )
                return isExternal ? (
                  <a
                    key={a.id}
                    href={dest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={a.id}
                    to={dest}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {inner}
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

// ─── Dashboard Skeleton ───────────────────────────────────────────────────────
// Mirrors the real Dashboard layout exactly — shown for ~1.4s on first load.

function DashboardSkeleton() {
  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* Top row: Banner + Today */}
      <div className="flex gap-5">
        <div className="flex-1 bg-gray-200 dark:bg-[#1A2236] rounded-2xl p-6 animate-pulse">
          <Skeleton className="h-7 w-48 mb-3" />
          <Skeleton className="h-4 w-72 mb-5" />
          <div className="flex gap-4">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-36" />
          </div>
          <div className="mt-4 pt-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        {/* Today skeleton */}
        <div className="w-[280px] shrink-0">
          <SkeletonCard className="h-full">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3.5 w-20" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-gray-50 dark:border-[#232d42]">
                <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
            ))}
          </SkeletonCard>
        </div>
      </div>

      {/* Deadline timeline */}
      <SkeletonCard className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="flex items-start justify-between pt-2 pb-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Main 3-col grid */}
      <div className="grid grid-cols-[1fr_minmax(260px,0.65fr)_minmax(280px,0.75fr)] gap-5">

        {/* Courses */}
        <SkeletonCard>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3.5 w-14" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <SkeletonAvatar size={38} />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-1.5 w-full rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Middle col — Recent Grades */}
        <SkeletonCard>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3.5 w-14" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-3 w-7 rounded" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Right col */}
        <div className="space-y-5">
          {/* Calendar */}
          <SkeletonCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full mx-auto" />
              ))}
            </div>
          </SkeletonCard>
          {/* Activity */}
          <SkeletonCard>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3.5 w-12" />
            </div>
            <div className="px-5 pb-5 space-y-3.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonAvatar size={36} />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  )
}


// ─── Smart Priority Card ──────────────────────────────────────────────────────
// Surfaces the single most urgent item: tomorrow's deadline > unread grade >
// almost-complete course. In compact mode renders inline inside the welcome banner.

function PriorityCard({ compact = false }: { compact?: boolean }) {
  // Priority 1: assignment due tomorrow (Dec 15)
  const tomorrow = dueSoon.find(d => d.dueDay.includes('DEC 15'))

  if (tomorrow) {
    const course = getCourse(tomorrow.courseId)
    const linkTarget = tomorrow.assignmentId
      ? `/courses/${tomorrow.courseId}/assignments/${tomorrow.assignmentId}`
      : `/courses/${tomorrow.courseId}`

    if (compact) {
      return (
        <Link
          to={linkTarget}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group border border-white/20"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-300 shrink-0">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-300">Due tomorrow</span>
              {/* Course pill — makes it obvious which course the assignment belongs to */}
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                style={{ background: course.color }}
              >
                {course.abbr}
              </span>
            </div>
            <p className="text-[12.5px] font-semibold text-white truncate">{tomorrow.title}</p>
          </div>
          <ChevronRight size={13} className="text-white/50 group-hover:text-white/80 shrink-0 transition-colors" />
        </Link>
      )
    }

    return (
      <Link
        to={linkTarget}
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all hover:shadow-sm group"
        style={{ background: '#EF444408', borderColor: '#EF444430' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-red-500 dark:text-red-400">Due tomorrow</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: course.color }}>
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
    const gradeLink = `/courses/${unreadGrade.courseId}/assignments/${unreadGrade.id}`

    if (compact) {
      return (
        <Link
          to={gradeLink}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group border border-white/20"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300 shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">New grade posted</span>
              {/* Course pill matches the urgency-card pattern for visual consistency */}
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                style={{ background: course.color }}
              >
                {course.abbr}
              </span>
            </div>
            <p className="text-[12.5px] font-semibold text-white truncate">{unreadGrade.title}</p>
          </div>
          <ChevronRight size={13} className="text-white/50 group-hover:text-white/80 shrink-0 transition-colors" />
        </Link>
      )
    }

    return (
      <Link
        to={gradeLink}
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
    if (compact) {
      return (
        <Link
          to={`/courses/${nudgeCourse.id}`}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group border border-white/20"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-200 shrink-0">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-200">Almost complete</span>
            <p className="text-[12.5px] font-semibold text-white truncate">{nudgeCourse.name} — {nudgeCourse.completion}%</p>
          </div>
          <ChevronRight size={13} className="text-white/50 group-hover:text-white/80 shrink-0 transition-colors" />
        </Link>
      )
    }

    return (
      <Link
        to={`/courses/${nudgeCourse.id}`}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm group"
        style={{ background: `${nudgeCourse.color}0D`, borderColor: `${nudgeCourse.color}40` }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${nudgeCourse.color}20`, color: nudgeCourse.color }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
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
        <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
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
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] px-5 py-3">
      {/* Header with divider */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2D3A52]">
        <h2 className="font-semibold text-[14px] text-gray-900 dark:text-gray-100">Upcoming Deadlines</h2>
        <Link to="/calendar" className="text-[12px] font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline">
          Open calendar
        </Link>
      </div>

      {/* Timeline — mx-4 keeps nodes away from card edges.
          Note: no horizontal connector line — the dot row alone reads as a sequence. */}
      <div className="relative pt-3 mx-4">
        <div className="flex items-start justify-between pb-2">

          {/* Today marker */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] ring-[3px] ring-[#2563EB]/20 relative z-10" />
            <span className="text-[9px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wide mt-0.5">Today</span>
            <span className="text-[9px] text-gray-400">Dec {TODAY_DAY}</span>
          </div>

          {sorted.map(d => {
            const course     = getCourse(d.courseId)
            const dayNum     = parseDayNum(d.dueDay)
            const linkTarget = d.assignmentId
              ? `/courses/${d.courseId}/assignments/${d.assignmentId}`
              : `/courses/${d.courseId}`
            const daysOut    = dayNum - TODAY_DAY

            return (
              <Link key={d.id} to={linkTarget} className="flex flex-col items-center gap-1 shrink-0 group">
                <div
                  className="w-3.5 h-3.5 rounded-full relative z-10 transition-transform group-hover:scale-110"
                  style={{ background: course.color, boxShadow: `0 0 0 3px ${course.color}25` }}
                />
                <span
                  className="text-[10.5px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors text-center max-w-[80px] leading-tight mt-0.5"
                  style={{ minHeight: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}
                >
                  {d.title}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${course.color}18`, color: course.color }}>
                  {course.abbr}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">Dec {dayNum} · {daysOut}d</span>
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
  const today = 14
  // Derive highlights from the actual calendar events. When multiple events fall
  // on the same day, deadlines outrank events and we pick the first colour we
  // see — good enough for a tiny-pixel dot. Keeps the mini cal in sync with the
  // full Calendar page automatically.
  const highlights: Record<number, string> = (() => {
    const out: Record<number, string> = {}
    const sorted = [...calendarEvents].sort((a, b) =>
      (a.type === 'deadline' ? 0 : 1) - (b.type === 'deadline' ? 0 : 1),
    )
    for (const evt of sorted) {
      if (!out[evt.day]) out[evt.day] = evt.color
    }
    return out
  })()

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
