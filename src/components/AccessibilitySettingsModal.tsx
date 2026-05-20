import { useEffect, useState } from 'react'
import { X, Eye } from './Icons'

/**
 * AccessibilitySettingsModal
 * ──────────────────────────
 * Real, working accessibility preferences for the prototype. Shipped as part of
 * the dead-end audit — most LMS "Accessibility" buttons just say "coming soon",
 * so giving this real working toggles is a portfolio-positive design signal.
 *
 * What it does:
 *   - Reduce motion: applies `.user-reduced-motion` to <html>. CSS in index.css
 *     disables animations + transitions when that class is present. Sits *on top
 *     of* the system-level prefers-reduced-motion media query — both are honoured.
 *   - Underline all links: applies `.user-underline-links` to <html>. CSS forces
 *     <a> tags to render with text-decoration:underline regardless of base style.
 *
 * Why these two specific controls?
 *   - Both are real WCAG concerns (motion sensitivity + link discoverability)
 *   - Both can be implemented honestly in CSS without backend / framework changes
 *   - Both have *visible* effects so a reviewer can immediately verify the
 *     toggles aren't decorative
 *
 * Persistence: localStorage keys `gbc-bb-a11y-reduced-motion` and
 * `gbc-bb-a11y-underline-links`. Applied to <html> on mount via the
 * applyA11yPreferences() helper (also called from main.tsx so settings stick
 * across navigation, not just while the modal is open).
 */

const REDUCED_MOTION_KEY  = 'gbc-bb-a11y-reduced-motion'
const UNDERLINE_LINKS_KEY = 'gbc-bb-a11y-underline-links'

// Reads localStorage and applies any saved a11y preferences to <html>.
// Exported so main.tsx can call it on app boot, before any UI paints.
export function applyA11yPreferences() {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('user-reduced-motion',  localStorage.getItem(REDUCED_MOTION_KEY)  === '1')
  root.classList.toggle('user-underline-links', localStorage.getItem(UNDERLINE_LINKS_KEY) === '1')
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function AccessibilitySettingsModal({ open, onClose }: Props) {
  // Initialise from localStorage so the modal opens reflecting current state
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem(REDUCED_MOTION_KEY) === '1',
  )
  const [underlineLinks, setUnderlineLinks] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem(UNDERLINE_LINKS_KEY) === '1',
  )

  // Apply changes immediately to <html> AND persist to localStorage on every toggle
  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('user-reduced-motion', reducedMotion)
    localStorage.setItem(REDUCED_MOTION_KEY, reducedMotion ? '1' : '0')
  }, [reducedMotion])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('user-underline-links', underlineLinks)
    localStorage.setItem(UNDERLINE_LINKS_KEY, underlineLinks ? '1' : '0')
  }, [underlineLinks])

  // ESC dismisses + lock body scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[460px] bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] shadow-2xl overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close accessibility settings"
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition-colors text-gray-400"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--tenant-link) 8%, transparent)', color: 'var(--tenant-link)' }}
            >
              <Eye size={18} />
            </div>
            <div>
              <h2 id="a11y-title" className="text-[17px] font-bold text-gray-900 dark:text-gray-100">
                Accessibility Settings
              </h2>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                These preferences apply across the whole prototype and persist between visits.
              </p>
            </div>
          </div>

          {/* Toggle list */}
          <div className="space-y-1">
            <ToggleRow
              title="Reduce motion"
              description="Disable animated transitions and the dashboard load skeleton pulse. Layered on top of your system motion preference."
              checked={reducedMotion}
              onChange={setReducedMotion}
            />
            <ToggleRow
              title="Underline all links"
              description="Force every link to render with an underline, even outside hover state. Improves link discoverability for users who don't rely on colour cues."
              checked={underlineLinks}
              onChange={setUnderlineLinks}
            />
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            autoFocus
            className="w-full mt-5 py-2.5 rounded-xl bg-[var(--tenant-primary)] hover:brightness-90 text-white text-[13px] font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ToggleRow sub-component ──────────────────────────────────────────────────
// Reusable two-line row with a pill toggle on the right. Pulled out so the
// modal body stays focused on layout and per-control wiring stays declarative.

interface ToggleRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pill toggle — same visual pattern used in TopBar's theme switch */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title}: ${checked ? 'on' : 'off'}`}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 mt-1 rounded-full shrink-0 transition-colors duration-200 ${
          checked ? 'bg-[var(--tenant-primary)]' : 'bg-gray-200 dark:bg-[#2D3A52]'
        }`}
        style={{ height: 22 }}
      >
        <div
          className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: checked ? 20 : 2 }}
        />
      </button>
    </div>
  )
}
