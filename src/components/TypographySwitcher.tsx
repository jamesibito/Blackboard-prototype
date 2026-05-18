import { useEffect, useState } from 'react'
import { X, ChevronDown } from './Icons'

/**
 * TypographySwitcher
 * ──────────────────
 * Dev-only toolbar that lives only on the `type-exploration` branch.
 * Lets a reviewer swap the entire app's font in real-time so we can A/B
 * candidate typefaces against every surface (dashboard, course pages,
 * assignment view, etc.) instead of just one screenshot.
 *
 * Implementation:
 *  - Injects a Google Fonts (or jsDelivr) <link> for each candidate
 *  - Overrides the `--font-sans` CSS custom property + body font-family
 *  - Persists selection to localStorage so navigation/refresh keeps the pick
 *  - Renders as a collapsible pill in the bottom-right corner
 *
 * Not present on `main` — kill this file before merging back.
 */

interface FontCandidate {
  key: string
  name: string
  description: string
  href: string         // CSS @import URL
  stack: string        // font-family value to inject
}

const CANDIDATES: FontCandidate[] = [
  {
    key: 'inter',
    name: 'Inter',
    description: 'Current default — the SaaS workhorse',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    stack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: 'geist',
    name: 'Geist',
    description: 'Vercel\'s refined Inter alternative',
    href: 'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/geist-sans.css',
    stack: "'Geist', 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: 'plex',
    name: 'IBM Plex Sans',
    description: 'Institutional warmth — fits the LMS context',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
    stack: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: 'public',
    name: 'Public Sans',
    description: 'US Government open-source, clean',
    href: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800;900&display=swap',
    stack: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: 'manrope',
    name: 'Manrope',
    description: 'Softer / rounder — friendlier feel',
    href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
    stack: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: 'general',
    name: 'General Sans',
    description: 'Designer-favourite compressed sans',
    href: 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap',
    stack: "'General Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
]

const STORAGE_KEY = 'gbc-bb-type-test-font'
const DISMISSED_KEY = 'gbc-bb-type-test-dismissed'

export default function TypographySwitcher() {
  const [currentKey, setCurrentKey] = useState<string>(() => {
    if (typeof window === 'undefined') return 'inter'
    return localStorage.getItem(STORAGE_KEY) || 'inter'
  })
  const [expanded, setExpanded] = useState(true)
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISSED_KEY) === '1'
  })

  const current = CANDIDATES.find(c => c.key === currentKey) ?? CANDIDATES[0]

  // ─── Apply the selected font ─────────────────────────────────────────────────
  // Inject the stylesheet (idempotent), then override the CSS variable so the
  // whole app picks up the new font. We DON'T set body { font-family } directly
  // because Tailwind v4 + the app's index.css already consume --font-sans.
  useEffect(() => {
    // Clean up previous test stylesheets (keep only the one we want)
    document.querySelectorAll('link[data-type-switcher]').forEach(el => {
      if (el.getAttribute('data-type-switcher') !== current.key) el.remove()
    })

    // Inject the new font if it's not already there
    if (!document.querySelector(`link[data-type-switcher="${current.key}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = current.href
      link.setAttribute('data-type-switcher', current.key)
      document.head.appendChild(link)
    }

    // Wait one tick for the font to register, then apply
    const t = setTimeout(() => {
      document.documentElement.style.setProperty('--font-sans', current.stack)
      // Also patch body in case anything bypassed the variable
      document.body.style.fontFamily = current.stack
    }, 50)

    localStorage.setItem(STORAGE_KEY, current.key)
    return () => clearTimeout(t)
  }, [current])

  if (dismissed) return null

  return (
    <div
      role="region"
      aria-label="Typography test switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-stretch
                 bg-[#0F1623] text-white rounded-2xl shadow-2xl border border-[#2D3A52]
                 backdrop-blur-md overflow-hidden"
      style={{ maxWidth: 'calc(100vw - 32px)' }}
    >
      {/* Toggle / handle */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-2 px-4 py-2.5 border-r border-[#2D3A52] hover:bg-[#1A2236] transition-colors"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse font switcher' : 'Expand font switcher'}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Type test
        </span>
        <ChevronDown
          size={12}
          className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Font options — render inline when expanded */}
      {expanded && (
        <>
          <div className="flex items-center gap-1 px-1 py-1 overflow-x-auto" role="radiogroup" aria-label="Choose a typeface">
            {CANDIDATES.map(c => {
              const active = c.key === currentKey
              return (
                <button
                  key={c.key}
                  onClick={() => setCurrentKey(c.key)}
                  role="radio"
                  aria-checked={active}
                  title={c.description}
                  className={`flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors
                    ${active
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-[#1A2236]'}`}
                >
                  {/* Render each label in its own font so the button itself previews the typeface */}
                  <span style={{ fontFamily: c.stack }}>{c.name}</span>
                  {active && <span className="text-[10px] opacity-70">✓</span>}
                </button>
              )
            })}
          </div>

          {/* Description of currently-selected font */}
          <div className="flex items-center px-3 border-l border-[#2D3A52]">
            <p className="text-[11px] text-gray-400 max-w-[200px] leading-snug">
              {current.description}
            </p>
          </div>
        </>
      )}

      {/* Dismiss for the rest of the session (until localStorage cleared) */}
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(DISMISSED_KEY, '1')
          setDismissed(true)
        }}
        aria-label="Hide font switcher for this session"
        className="px-2 border-l border-[#2D3A52] hover:bg-[#1A2236] text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
