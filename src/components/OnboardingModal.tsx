import { useEffect, useRef, useState } from 'react'
import { X, Home, BookOpen, Bell, ArrowRight } from './Icons'

/**
 * OnboardingModal
 * ───────────────
 * First-visit "how to use this site" walkthrough. Teaches the three main
 * navigation surfaces (sidebar, course pages, top bar) so a brand-new user
 * isn't hunting for where things live.
 *
 * What this is NOT: a meta-explanation of the prototype/persona — that's
 * the DemoBanner's job. Keeping the two messages separate lets each do
 * one thing well: the banner sets context, the modal teaches the UI.
 *
 * Persistence: dismissal is stored in localStorage so the modal only appears
 * once per browser. The version suffix (`-v2`) re-prompts past visitors who
 * saw the older meta-only copy.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal + aria-labelledby on the title
 *   - ESC key dismisses
 *   - Click on backdrop dismisses
 *   - Body scroll locked while open
 *   - Initial focus on the primary CTA
 */

// localStorage key — v2 forces past v1 visitors to see the new how-to copy
const DISMISS_KEY = 'gbc-bb-onboarding-seen-v2'

interface OnboardingBullet {
  icon: React.FC<{ size?: number; className?: string }>
  title: string
  body: string
}

// Centralised content so it's easy to edit copy without hunting through JSX
const BULLETS: OnboardingBullet[] = [
  {
    icon: Home,
    title: 'Start on the Dashboard',
    body: 'Your day at a glance — today\'s classes, what\'s due soon, and the priority assignments to tackle next. Everything else is one click away in the sidebar.',
  },
  {
    icon: BookOpen,
    title: 'Open any course to drill in',
    body: 'Each course has its own modules, assignments, resources, syllabus, and instructor info. Click a course card on the Dashboard or use the Courses tab in the sidebar.',
  },
  {
    icon: Bell,
    title: 'Notifications and account live up top',
    body: 'The bell shows new grades, deadlines, and announcements. Your avatar opens settings, transcripts, and the Help Centre. The Tools page bundles every external app — Figma, Zoom, the Library, and more.',
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
            Welcome — quick tour
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Three quick things, then you're set.
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

          {/* CTA */}
          <button
            ref={ctaRef}
            onClick={dismiss}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold
              transition-colors"
          >
            Got it — start exploring
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
