import { useEffect, useRef, useState } from 'react'
import { X, GraduationCap, Info, MessageCircle, ArrowRight } from './Icons'

/**
 * OnboardingModal
 * ───────────────
 * First-visit explanatory modal. Sets context for portfolio viewers landing
 * on the dashboard cold — what this prototype is, what they can interact with,
 * and what to expect.
 *
 * Persistence: dismissal is stored in localStorage so the modal only appears
 * once per browser. The version suffix (`-v1`) lets us re-prompt visitors if
 * the onboarding copy ever changes meaningfully — just bump it.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal + aria-labelledby on the title
 *   - ESC key dismisses
 *   - Click on backdrop dismisses
 *   - Body scroll locked while open
 *   - Initial focus on the primary CTA
 *
 * Coexistence with DemoBanner:
 *   - DemoBanner is a thin in-flow strip ("dismiss me to keep going")
 *   - OnboardingModal is the heavier first-impression overlay
 *   - They use *different* localStorage keys, so dismissing one does not
 *     dismiss the other. A return visitor with both keys set sees neither.
 */

// localStorage key — bump the version suffix to re-prompt past visitors
// after meaningful copy or content changes.
const DISMISS_KEY = 'gbc-bb-onboarding-seen-v1'

interface OnboardingBullet {
  icon: React.FC<{ size?: number; className?: string }>
  title: string
  body: string
}

// Centralised content so it's easy to edit copy without hunting through JSX
const BULLETS: OnboardingBullet[] = [
  {
    icon: GraduationCap,
    title: "You're viewing Kevin's account",
    body: 'A fictional 2nd-year design student at George Brown College — Fall 2022, the week before finals. Every grade, message, and deadline is made up but internally consistent.',
  },
  {
    icon: Info,
    title: 'Most pages are fully interactive',
    body: 'Click any course, assignment, grade card, or notification to drill in. The dashboard, course pages, grades, and messages all have real depth.',
  },
  {
    icon: MessageCircle,
    title: 'Some buttons are decorative',
    body: "Things like Submit Assignment, Send Message, or Download Syllabus are styled but won't actually do anything — this is a portfolio prototype, not a live LMS.",
  },
]

export default function OnboardingModal() {
  // ─── Visibility state ──────────────────────────────────────────────────────
  // Lazy init from localStorage so we never flash the modal for return visitors.
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISS_KEY) !== '1'
  })

  // Tracks whether we're in the fade-out animation (200ms) before unmounting
  const [exiting, setExiting] = useState(false)

  const ctaRef = useRef<HTMLButtonElement>(null)

  // ─── Effects ───────────────────────────────────────────────────────────────

  // Auto-focus the primary CTA on first paint so keyboard users land on
  // the most likely action ("Start exploring")
  useEffect(() => {
    if (visible && !exiting) {
      // Delay one frame so the focus ring lands AFTER the open transition
      const t = setTimeout(() => ctaRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [visible, exiting])

  // ESC key dismisses the modal
  useEffect(() => {
    if (!visible) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [visible])

  // Lock body scroll while the modal is open so background can't be scrolled
  useEffect(() => {
    if (!visible) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [visible])

  // Handle the exit animation → unmount sequence
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

  // Backdrop click — only dismiss when the click lands on the backdrop itself,
  // not bubbled up from inside the modal panel
  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) dismiss()
  }

  if (!visible) return null

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={onBackdropClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-200
        bg-black/50 backdrop-blur-sm
        ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Modal panel */}
      <div
        className={`relative w-full max-w-[480px] bg-white dark:bg-[#1A2236] rounded-2xl shadow-2xl
          border border-gray-100 dark:border-[#2D3A52] overflow-hidden
          transition-all duration-200
          ${exiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Gradient header strip — matches the welcome banner palette */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1B3F89] via-[#2563EB] to-[#1B3F89]" />

        {/* Close button (top right) — secondary dismissal path */}
        <button
          onClick={dismiss}
          aria-label="Close onboarding"
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition-colors text-gray-400 dark:text-gray-500"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="px-7 pt-6 pb-6">
          {/* Title + subtitle */}
          <h2
            id="onboarding-title"
            className="text-[18px] font-bold text-gray-900 dark:text-gray-100 tracking-tight"
          >
            Welcome to the Blackboard prototype
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Quick context before you start clicking around.
          </p>

          {/* Bullet list */}
          <ul className="mt-5 space-y-4">
            {BULLETS.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#2563EB15', color: '#2563EB' }}
                >
                  <bullet.icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                    {bullet.title}
                  </h3>
                  <p className="text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
                    {bullet.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div className="mt-6 flex items-center gap-3">
            <button
              ref={ctaRef}
              onClick={dismiss}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold
                transition-colors"
            >
              Start exploring
              <ArrowRight size={14} aria-hidden="true" />
            </button>
            <a
              href="https://jamesibitoye.framer.website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors px-2"
            >
              Case study →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
