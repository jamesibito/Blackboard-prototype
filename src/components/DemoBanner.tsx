import { useState, useEffect } from 'react'
import { X } from './Icons'

// localStorage key — bump if the banner copy changes meaningfully
const DISMISS_KEY = 'gbc-bb-demo-banner-dismissed-v1'

/**
 * First-visit explanatory banner.
 * Sits above the TopBar on every page. Persists dismissal in localStorage so
 * it only appears once per browser. Sticky-ish but in flow so the sidebar
 * layout isn't affected.
 */
export default function DemoBanner() {
  // Lazy init from localStorage so we don't flash the banner for return visitors
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISS_KEY) !== '1'
  })
  // Drives the fade-out before unmount
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => setVisible(false), 200)
    return () => clearTimeout(t)
  }, [exiting])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setExiting(true)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Demo introduction"
      className={`relative overflow-hidden bg-gradient-to-r from-[#1B3F89] via-[#2563EB] to-[#1B3F89] text-white transition-opacity duration-200 ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="px-6 py-2.5 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-[16px] leading-none shrink-0 mt-0.5" aria-hidden="true">👋</span>
          <p className="text-[12px] leading-snug">
            <strong className="font-semibold">This is a UX redesign prototype.</strong>
            {' '}
            All data is fictional — designed around <em className="not-italic font-medium">Kevin H.</em>, a 2nd-year design student at George Brown College, Fall 2022. Click around freely.
            {' '}
            <a
              href="https://jamesibitoye.framer.website"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              See the full case study →
            </a>
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss demo banner"
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors -mr-1"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
