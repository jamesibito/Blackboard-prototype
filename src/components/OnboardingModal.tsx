import { useEffect, useRef, useState } from 'react'
import { X, Home, BookOpen, Activity, Library, ArrowRight, ChevronLeft } from './Icons'

/**
 * OnboardingModal
 * ───────────────
 * First-time-student onboarding tutorial for Blackboard, in-character for the
 * Kevin H. persona. Five-step carousel walking through what each major surface
 * does — Dashboard, course pages, Activity Stream + Notifications, Tools.
 *
 * What this is NOT: a meta-explanation of the prototype or case study — that's
 * the DemoBanner's job. This onboarding is in-narrative: a first-time GBC
 * student logging into Blackboard for the Fall 2022 semester.
 *
 * Multi-step pattern (Notion / Linear / Slack-style):
 *   - Step 1/5: Welcome
 *   - Step 2/5: Dashboard
 *   - Step 3/5: Course pages
 *   - Step 4/5: Activity Stream + Notifications
 *   - Step 5/5: Tools + Help
 *
 * Persistence: dismissal stored in localStorage. Version-suffix bumped to v3
 * so past visitors who saw v1 (meta) or v2 (navigation surfaces) get the new
 * feature-led tour.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal + aria-labelledby on the title
 *   - ESC dismisses
 *   - Click on backdrop dismisses
 *   - Body scroll locked while open
 *   - Initial focus on the Next CTA
 *   - Step indicator announced via aria-live
 */

const DISMISS_KEY = 'gbc-bb-onboarding-seen-v3'

interface OnboardingStep {
  icon: React.FC<{ size?: number; className?: string }>
  eyebrow: string
  title: string
  body: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: Home, // overridden in render — step 0 gets the special GBC Bb badge
    eyebrow: 'Welcome',
    title: "Hi Kevin — welcome to Blackboard.",
    body: "Your learning hub for the Fall 2022 semester at George Brown. A quick tour — under a minute, then you're in. You can skip anytime.",
  },
  {
    icon: Home,
    eyebrow: 'Your Dashboard',
    title: "Open Blackboard, know what to do next.",
    body: "Today's classes, upcoming deadlines, recent grades, and a Priority Card surfacing the single most urgent thing. The Dashboard answers 'what now?' before you have to look for it.",
  },
  {
    icon: BookOpen,
    eyebrow: 'Course pages',
    title: "Every course is laid out the same way.",
    body: "Same sections in every course: announcements, modules, assignments, and resources on the left — syllabus, grades, and instructor info in the sidebar. Learn one course page, you know them all.",
  },
  {
    icon: Activity,
    eyebrow: 'Staying current',
    title: "Don't miss an announcement again.",
    body: "The Activity Stream feeds new grades, announcements, and resources across all your courses in one place. The bell up top flags what specifically needs you. No hunting through sidebars.",
  },
  {
    icon: Library,
    eyebrow: 'Campus tools',
    title: "Every GBC service, one click away.",
    body: "The Tools page links you to the Library, Print Centre, Tech Lab, study rooms, Microsoft 365, Zoom, Figma, Adobe — all the apps your courses use, no separate logins to remember. Need IT help? GBC Assist lives in your profile menu.",
  },
]

const TOTAL = STEPS.length

export default function OnboardingModal() {
  // ─── Visibility ────────────────────────────────────────────────────────────
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISS_KEY) !== '1'
  })

  // ─── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  // Direction tracks which way we're sliding for the cross-fade animation
  const [direction, setDirection] = useState<1 | -1>(1)

  const nextRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // ─── Effects ───────────────────────────────────────────────────────────────

  // Focus the primary CTA on first paint and on step change
  useEffect(() => {
    if (visible && !exiting) {
      const t = setTimeout(() => nextRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [visible, exiting, step])

  // ESC dismisses
  useEffect(() => {
    if (!visible) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
      else if (e.key === 'ArrowRight' && step < TOTAL - 1) goNext()
      else if (e.key === 'ArrowLeft'  && step > 0)         goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [visible, step])

  // Lock body scroll while open
  useEffect(() => {
    if (!visible) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [visible])

  // Exit animation → unmount
  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => setVisible(false), 200)
    return () => clearTimeout(t)
  }, [exiting])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setExiting(true)
  }

  function goNext() {
    if (step === TOTAL - 1) { dismiss(); return }
    setDirection(1)
    setStep(s => Math.min(s + 1, TOTAL - 1))
  }

  function goPrev() {
    setDirection(-1)
    setStep(s => Math.max(s - 1, 0))
  }

  function goToStep(i: number) {
    setDirection(i > step ? 1 : -1)
    setStep(i)
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) dismiss()
  }

  if (!visible) return null

  // ─── Derived ───────────────────────────────────────────────────────────────
  const current = STEPS[step]
  const isFirst = step === 0
  const isLast  = step === TOTAL - 1
  const progressPct = ((step + 1) / TOTAL) * 100

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={onBackdropClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-200
        bg-black/55 backdrop-blur-sm
        ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Modal panel */}
      <div
        ref={dialogRef}
        className={`relative w-full max-w-[500px] bg-white dark:bg-[#1A2236] rounded-2xl shadow-2xl
          border border-gray-100 dark:border-[#2D3A52] overflow-hidden
          transition-all duration-200
          ${exiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* ── Progress bar (top edge) ───────────────────────────────────── */}
        <div className="h-1 w-full bg-gray-100 dark:bg-[#2D3A52]">
          <div
            className="h-full bg-gradient-to-r from-[#1B3F89] to-[#2563EB] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            aria-hidden="true"
          />
        </div>

        {/* ── Skip button (top right) ──────────────────────────────────── */}
        <button
          onClick={dismiss}
          aria-label="Skip tour"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-gray-400 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-[#232d42] hover:text-gray-600 dark:hover:text-gray-300
            transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* ── Step indicator (top left) ────────────────────────────────── */}
        <div
          className="absolute top-3.5 left-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400 tabular-nums"
          aria-live="polite"
        >
          {String(step + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </div>

        {/* ── Content (with sliding animation) ─────────────────────────── */}
        <div className="px-7 pt-14 pb-5 relative overflow-hidden">
          <div
            key={step}
            className="animate-onboarding-slide"
            style={{
              // Inline keyframe via CSS variable for direction-aware slide
              animation: direction === 1
                ? 'slide-in-right 0.32s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'slide-in-left 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Visual: GBC Bb mark on welcome, icon-in-tile on others */}
            <div className="flex items-center justify-center mb-5">
              {isFirst ? (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B3F89] to-[#2563EB] flex items-center justify-center shadow-lg">
                  <span className="text-white text-[26px] font-bold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.04em' }}>
                    Bb
                  </span>
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: '#2563EB18', color: '#2563EB' }}
                >
                  <current.icon size={26} />
                </div>
              )}
            </div>

            {/* Eyebrow */}
            <p className="text-center text-[11px] font-bold uppercase tracking-[1.4px] text-[#2563EB] dark:text-[#60A5FA] mb-2">
              {current.eyebrow}
            </p>

            {/* Title */}
            <h2
              id="onboarding-title"
              className="text-center text-[20px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-3"
            >
              {current.title}
            </h2>

            {/* Body */}
            <p className="text-center text-[13.5px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[400px] mx-auto">
              {current.body}
            </p>
          </div>
        </div>

        {/* ── Footer: step dots + nav buttons ──────────────────────────── */}
        <div className="px-7 pb-6 pt-2">
          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-5" role="tablist" aria-label="Tour steps">
            {STEPS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === step}
                aria-label={`Go to step ${i + 1}`}
                onClick={() => goToStep(i)}
                className={`h-1.5 rounded-full transition-all
                  ${i === step
                    ? 'w-6 bg-[#2563EB]'
                    : 'w-1.5 bg-gray-200 dark:bg-[#2D3A52] hover:bg-gray-300 dark:hover:bg-[#3a4761]'}`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors
                ${isFirst
                  ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#232d42]'}`}
            >
              <ChevronLeft size={14} aria-hidden="true" />
              Back
            </button>

            <button
              ref={nextRef}
              onClick={goNext}
              className="ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold
                transition-colors shadow-sm"
            >
              {isLast ? 'Open my Dashboard' : 'Next'}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Inline keyframes for slide animation ───────────────────────── */}
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
