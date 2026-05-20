import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, ArrowRight, ChevronLeft } from './Icons'
import { useTenant } from '../context/TenantContext'

/**
 * Tour
 * ────
 * Spotlight-style product tour that replaces the previous modal-only
 * onboarding. Walks a first-time student through the major surfaces of the
 * Dashboard with a darkened overlay + cutout + floating callout pointing
 * at each highlighted element.
 *
 * Pattern: Notion / Linear / Figma first-run tour.
 *
 * Implementation notes:
 *  - Spotlight effect uses the box-shadow trick — a small fixed-position div
 *    positioned at the target element's bounding rect with a massive outer
 *    box-shadow of rgba(0,0,0,0.65). The shadow covers the rest of the
 *    viewport while the div itself "punches a hole" through it.
 *  - Tooltip placement adapts to viewport edges (smart fallback: bottom →
 *    top → left → right).
 *  - On step change, the tour auto-navigates to / (Dashboard) so the
 *    target elements are guaranteed to exist.
 *  - Targets are referenced by `data-tour="<key>"` attribute on the
 *    elements being highlighted (see Dashboard, Sidebar, TopBar etc).
 *  - On window resize / scroll, the spotlight rect re-computes so it
 *    stays locked to the element.
 *
 * Completion is persisted to localStorage. Can be re-triggered via the
 * "Replay tour" button in ProfilePage's Account section.
 */

const TOUR_KEY = 'gbc-bb-tour-completed-v1'
const SPOTLIGHT_PADDING = 8        // px around the target rect
const TOOLTIP_GAP = 16             // px between tooltip and spotlight
const TOOLTIP_WIDTH = 340

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center'

interface TourStep {
  type: 'modal' | 'spotlight'
  target?: string                 // data-tour attribute value
  eyebrow?: string
  title: string
  body: string
  placement?: Placement           // preferred tooltip placement
}

const makeSteps = (tenantShortName: string): TourStep[] => [
  {
    type: 'modal',
    eyebrow: 'Welcome',
    title: `Hi Kevin — let's show you around ${tenantShortName}'s Blackboard.`,
    body: "Quick tour of the Dashboard — about 60 seconds. We'll point out the key parts of the app one at a time. You can skip anytime.",
  },
  {
    type: 'spotlight',
    target: 'welcome-banner',
    eyebrow: 'Priority Card',
    title: "Mission control.",
    body: "The welcome banner surfaces the single most urgent thing — assignment due tomorrow, new grade, or a course close to finishing. Open Blackboard, know what to do next.",
    placement: 'bottom',
  },
  {
    type: 'spotlight',
    target: 'today-schedule',
    eyebrow: "Today",
    title: "Your day at a glance.",
    body: "Today's classes appear here with live status — 'Up next' badges, room numbers, and how long until each one starts.",
    placement: 'left',
  },
  {
    type: 'spotlight',
    target: 'deadline-timeline',
    eyebrow: "Upcoming work",
    title: "Every deadline this month.",
    body: "A horizontal timeline of what's due, colour-coded by course. Click any deadline to jump straight to the assignment.",
    placement: 'bottom',
  },
  {
    type: 'spotlight',
    target: 'courses-list',
    eyebrow: "Your courses",
    title: "Open any course to drill in.",
    body: "Each course has the same five sections — Announcements, Modules, Assignments, Resources, Syllabus, and your Instructor. Same shape, every time.",
    placement: 'right',
  },
  {
    type: 'spotlight',
    target: 'sidebar',
    eyebrow: "Navigation",
    title: "Main nav lives here.",
    body: "Messages and Notifications show unread counts as badges. Everything else is one click away.",
    placement: 'right',
  },
  {
    type: 'spotlight',
    target: 'topbar-search',
    eyebrow: "Search",
    title: "Find anything fast.",
    body: "Search across courses, assignments, and activity items. Type to filter, click to jump.",
    placement: 'bottom',
  },
  {
    type: 'spotlight',
    target: 'tenant-switcher',
    eyebrow: "Multi-tenant demo",
    title: "Try this redesign at other schools.",
    body: "Bonus: this is the same product reskinned for four institutions — George Brown, York, Laurier, and McMaster. Click to see how the design system holds up.",
    placement: 'left',
  },
  {
    type: 'modal',
    eyebrow: 'Done',
    title: "You're set.",
    body: "Click around freely — all the data is fictional. You can replay this tour anytime from your profile page.",
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export default function Tour() {
  const { tenant } = useTenant()
  const navigate = useNavigate()
  const location = useLocation()

  const STEPS = makeSteps(tenant.shortName)
  const TOTAL = STEPS.length

  // Visible only if not yet completed
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(TOUR_KEY) !== '1'
  })
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [rect, setRect] = useState<Rect | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  const current = STEPS[step]
  const isModal = current.type === 'modal'
  const isFirst = step === 0
  const isLast  = step === TOTAL - 1

  // ─── Auto-navigate to Dashboard when tour starts (where targets live) ──
  useEffect(() => {
    if (!visible) return
    if (location.pathname !== '/') navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // ─── Body scroll lock while tour is open ──────────────────────────────
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [visible])

  // ─── Keyboard: ESC = dismiss, → / ← = step ────────────────────────────
  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
      else if (e.key === 'ArrowRight' && !isLast) goNext()
      else if (e.key === 'ArrowLeft'  && !isFirst) goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, step, isFirst, isLast])

  // ─── Focus next button on each step ──────────────────────────────────
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => nextBtnRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [visible, step])

  // ─── Compute spotlight rect when step changes / on resize / scroll ────
  // Uses useLayoutEffect so the rect is read after layout but before paint.
  useLayoutEffect(() => {
    if (!visible || isModal || !current.target) {
      setRect(null)
      return
    }

    function measure() {
      const el = document.querySelector(`[data-tour="${current.target}"]`)
      if (!el) {
        // Target not yet in DOM (e.g. tour started while still on a different
        // page). Retry on next tick.
        setTimeout(measure, 60)
        return
      }
      // Scroll the target into view if it's off-screen
      const bounds = el.getBoundingClientRect()
      const offTop    = bounds.top < 0
      const offBottom = bounds.bottom > window.innerHeight
      if (offTop || offBottom) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Re-measure after the smooth scroll settles
        setTimeout(measure, 350)
        return
      }
      setRect({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      })
    }
    measure()

    function onScrollOrResize() { measure() }
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [visible, step, isModal, current.target])

  function dismiss() {
    localStorage.setItem(TOUR_KEY, '1')
    setExiting(true)
    setTimeout(() => setVisible(false), 200)
  }

  function goNext() {
    if (isLast) { dismiss(); return }
    setStep(s => Math.min(s + 1, TOTAL - 1))
  }

  function goPrev() { setStep(s => Math.max(s - 1, 0)) }

  if (!visible) return null

  // ─── Compute tooltip position based on rect + preferred placement ─────
  function getTooltipPos(): { top: number; left: number; transform?: string; placement: Placement } {
    if (!rect) return { top: 0, left: 0, placement: 'center' }
    const pref = current.placement ?? 'bottom'
    const padding = SPOTLIGHT_PADDING + TOOLTIP_GAP
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Try preferred placement first, fall back if the tooltip would clip
    const tryPlacement = (p: Placement) => {
      switch (p) {
        case 'bottom':
          return { top: rect.top + rect.height + padding, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' }
        case 'top':
          return { top: rect.top - padding, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' }
        case 'left':
          return { top: rect.top + rect.height / 2, left: rect.left - padding, transform: 'translate(-100%, -50%)' }
        case 'right':
          return { top: rect.top + rect.height / 2, left: rect.left + rect.width + padding, transform: 'translateY(-50%)' }
        case 'center':
        default:
          return { top: vh / 2, left: vw / 2, transform: 'translate(-50%, -50%)' }
      }
    }

    // Check if the tooltip would fit at a given placement
    const TOOLTIP_HEIGHT_EST = 240   // conservative
    const fits = (p: Placement) => {
      const pos = tryPlacement(p)
      // Get effective bounds of the tooltip box accounting for transform
      let l = pos.left, t = pos.top
      if (pos.transform?.includes('translateX(-50%)')) l -= TOOLTIP_WIDTH / 2
      if (pos.transform?.includes('translate(-50%, -100%)')) { l -= TOOLTIP_WIDTH / 2; t -= TOOLTIP_HEIGHT_EST }
      if (pos.transform?.includes('translate(-100%, -50%)')) { l -= TOOLTIP_WIDTH; t -= TOOLTIP_HEIGHT_EST / 2 }
      if (pos.transform?.includes('translateY(-50%)')) t -= TOOLTIP_HEIGHT_EST / 2
      const r = l + TOOLTIP_WIDTH, b = t + TOOLTIP_HEIGHT_EST
      return l >= 16 && t >= 16 && r <= vw - 16 && b <= vh - 16
    }

    // Order: preferred, then opposite, then sides, then center as fallback
    const order: Placement[] = (() => {
      switch (pref) {
        case 'bottom': return ['bottom', 'top', 'right', 'left', 'center']
        case 'top':    return ['top', 'bottom', 'right', 'left', 'center']
        case 'left':   return ['left', 'right', 'top', 'bottom', 'center']
        case 'right':  return ['right', 'left', 'top', 'bottom', 'center']
        default:       return ['center']
      }
    })()

    for (const p of order) {
      if (fits(p)) {
        const pos = tryPlacement(p)
        return { ...pos, placement: p }
      }
    }
    // No placement fits — fall back to center even if it overlaps
    return { ...tryPlacement('center'), placement: 'center' }
  }

  const tooltipPos = isModal
    ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' as const, placement: 'center' as Placement }
    : getTooltipPos()

  const progressPct = ((step + 1) / TOTAL) * 100

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      className={`fixed inset-0 z-[110] transition-opacity duration-200 ${exiting ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* ─── Backdrop ─────────────────────────────────────────────────── */}
      {/* For modal steps: a simple dimmed full-screen overlay.
          For spotlight steps: a small rect at the target with a huge
          outer box-shadow that simulates the rest of the screen being
          darkened. The "cutout" is just the natural absence of shadow
          inside the rect. */}
      {isModal || !rect ? (
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
      ) : (
        <div
          aria-hidden="true"
          className="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top:    rect.top    - SPOTLIGHT_PADDING,
            left:   rect.left   - SPOTLIGHT_PADDING,
            width:  rect.width  + SPOTLIGHT_PADDING * 2,
            height: rect.height + SPOTLIGHT_PADDING * 2,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
            // Soft glow ring around the spotlight, in the tenant's primary
            outline: `2px solid ${tenant.accent}`,
            outlineOffset: '-1px',
          }}
        />
      )}

      {/* ─── Tooltip / Callout ────────────────────────────────────────── */}
      <div
        className={`fixed bg-white dark:bg-[#1A2236] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2D3A52] overflow-hidden transition-all duration-300 ease-out
          ${exiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        style={{
          width: TOOLTIP_WIDTH,
          maxWidth: 'calc(100vw - 32px)',
          top: tooltipPos.top,
          left: tooltipPos.left,
          transform: tooltipPos.transform,
        }}
      >
        {/* Progress strip */}
        <div className="h-1 w-full bg-gray-100 dark:bg-[#2D3A52]">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              backgroundImage: `linear-gradient(to right, ${tenant.gradient.from}, ${tenant.gradient.to})`,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Skip / close (top-right) */}
        <button
          onClick={dismiss}
          aria-label="Skip tour"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#232d42] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>

        {/* Step counter (top-left) */}
        <div
          className="absolute top-3.5 left-5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 tabular-nums"
          aria-live="polite"
        >
          {String(step + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-5">
          {current.eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[1.4px] mb-2" style={{ color: tenant.accent }}>
              {current.eyebrow}
            </p>
          )}
          <h2 id="tour-title" className="text-[17px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-2.5" style={{ letterSpacing: '-0.2px' }}>
            {current.title}
          </h2>
          <p className="text-[13.5px] text-gray-600 dark:text-gray-300 leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Footer: dots + back/next */}
        <div className="px-5 pb-4 pt-1">
          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4" role="tablist" aria-label="Tour steps">
            {STEPS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === step}
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all
                  ${i === step
                    ? 'w-5'
                    : 'w-1.5 bg-gray-200 dark:bg-[#2D3A52] hover:bg-gray-300 dark:hover:bg-[#3a4761]'}`}
                style={i === step ? { background: tenant.accent } : {}}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors
                ${isFirst
                  ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#232d42]'}`}
            >
              <ChevronLeft size={13} aria-hidden="true" />
              Back
            </button>
            <button
              ref={nextBtnRef}
              onClick={goNext}
              className="ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: tenant.accent }}
            >
              {isLast ? "Got it" : isFirst ? "Start tour" : "Next"}
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
