/**
 * ToolLogos
 * ─────────
 * Inline SVG components for each tool/integration card on the Tools page.
 *
 * Why inline SVG?
 *   - No external network requests at render time
 *   - Scales cleanly at any size, no rasterisation
 *   - Adapts to dark mode via currentColor where appropriate
 *   - Bundled with the JS — zero asset pipeline complexity
 *
 * Logo style:
 *   - Brand-recognisable but simplified — these are referential, not pixel-perfect
 *     reproductions. Real-product redesigns commonly use simplified marks rather
 *     than copyrighted assets.
 *   - All logos render inside a 32px square container in the card. SVGs use
 *     viewBox so they scale to whatever `size` prop is passed.
 *
 * Each logo is its own named export. Tools.tsx imports them and maps tool IDs
 * to logo components via a small registry — keeps logo lookup explicit and
 * easy to extend.
 */

interface LogoProps {
  size?: number
  className?: string
}

// ─── Helper: sizing wrapper ───────────────────────────────────────────────────
// Centralises the size + viewBox boilerplate so individual logo bodies stay focused
// on their unique paths.

function svg(
  vb: string,
  size: number | undefined,
  className: string | undefined,
  children: React.ReactNode,
) {
  return (
    <svg
      width={size ?? 28}
      height={size ?? 28}
      viewBox={vb}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// ─── Real brand marks ─────────────────────────────────────────────────────────

/** Figma — the iconic 5-shape mark in the official brand palette. */
export const FigmaLogo = ({ size, className }: LogoProps) =>
  svg('0 0 38 57', size, className, (
    <>
      <path d="M19 28.5a9.5 9.5 0 1 1 9.5 9.5A9.5 9.5 0 0 1 19 28.5z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </>
  ))

/** Microsoft 365 — 4-square colour mark. */
export const MicrosoftLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </>
  ))

/** Adobe Creative Cloud — red square with "Cc" mark. */
export const AdobeLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="3" fill="#FA0F00" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        Cc
      </text>
    </>
  ))

/** Zoom — blue square with the recognisable Z mark. */
export const ZoomLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="#2D8CFF" />
      <path
        d="M6 8.5h7.5v3L17.5 8v8l-4-3.5v3H6z"
        fill="white"
      />
    </>
  ))

/** LinkedIn Learning — blue square with the iconic "in" mark. */
export const LinkedInLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2" />
      <circle cx="7.5" cy="7" r="1.5" fill="white" />
      <rect x="6" y="10" width="3" height="9" fill="white" />
      <path
        d="M12 10h2.7v1.4c.5-.9 1.7-1.5 3-1.5 2.6 0 3.3 1.7 3.3 4V19h-3v-4.6c0-1.1-.4-1.9-1.4-1.9s-1.6.7-1.6 1.9V19h-3z"
        fill="white"
      />
    </>
  ))

// ─── Letter monograms (brands without distinct shape marks) ───────────────────

/** Turnitin — circular dark-blue T mark. */
export const TurnitinLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <circle cx="12" cy="12" r="11" fill="#1B4D89" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="white"
        fontFamily="Georgia, serif"
        fontStyle="italic"
      >
        t
      </text>
    </>
  ))

/** Grammarly — green circle with G mark. */
export const GrammarlyLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <circle cx="12" cy="12" r="11" fill="#15C39A" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        G
      </text>
    </>
  ))

/** Respondus — grey square with R mark (inactive-feeling, matches its status). */
export const RespondusLogo = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#475569" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        R
      </text>
    </>
  ))

// ─── Generic glyphs (GBC services without their own brand) ────────────────────

/** GBC Library — open-book glyph in GBC navy. */
export const LibraryGlyph = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#1B3F89" />
      <path
        d="M5 7v10c0-1 1-1.5 2.5-1.5h3.5V8.5C11 7.5 10 7 8.5 7zM19 7v10c0-1-1-1.5-2.5-1.5H13V8.5C13 7.5 14 7 15.5 7z"
        fill="white"
      />
    </>
  ))

/** Study Rooms — door / room icon. */
export const StudyRoomGlyph = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#0EA5E9" />
      <rect x="7" y="5" width="10" height="14" rx="0.5" fill="white" />
      <circle cx="14" cy="12" r="0.7" fill="#0EA5E9" />
    </>
  ))

/** Print Centre — printer icon. */
export const PrintGlyph = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#6366F1" />
      <rect x="7" y="5" width="10" height="5" fill="white" />
      <rect x="5" y="10" width="14" height="6" rx="1" fill="white" />
      <rect x="7" y="14" width="10" height="5" fill="white" />
      <circle cx="16" cy="12.5" r="0.7" fill="#6366F1" />
    </>
  ))

/** Tech Lab — camera/equipment glyph. */
export const TechLabGlyph = ({ size, className }: LogoProps) =>
  svg('0 0 24 24', size, className, (
    <>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#8B5CF6" />
      <rect x="4" y="8" width="16" height="10" rx="1.5" fill="white" />
      <circle cx="12" cy="13" r="3" fill="#8B5CF6" />
      <rect x="9" y="6" width="6" height="2" rx="0.5" fill="white" />
    </>
  ))
