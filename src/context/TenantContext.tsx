import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * TenantContext
 * ─────────────
 * Multi-tenant theming system. Blackboard Learn is licensed to thousands of
 * institutions worldwide, each of which skins the product in their own brand.
 * This system simulates that — the same redesign as it would look for four
 * Canadian post-secondary institutions:
 *
 *   - George Brown College   — navy + action blue (the default / case study)
 *   - York University        — York red
 *   - Wilfrid Laurier        — purple + accent
 *   - McMaster University    — Mac maroon
 *
 * What it skins:
 *  - Sidebar header colour + wordmark
 *  - Welcome banner gradient on the Dashboard
 *  - The "Bb" mark in the OnboardingModal welcome step
 *  - References to the institution name throughout (DemoBanner, modal copy)
 *  - Primary brand pill colour in a handful of high-visibility surfaces
 *
 * What it does NOT skin (intentional):
 *  - Per-course accent colours (2D orange, IS pink, etc.) — these are
 *    course-level, not institution-level
 *  - Dark-mode chrome (sidebar bg, page bg) — these are theme-level
 *  - Action-blue everywhere — would be a project-wide refactor; the most
 *    impactful surfaces use the tenant primary; secondary buttons keep blue
 *
 * Persists via localStorage so the choice survives navigation.
 */

export interface Tenant {
  id: string
  name: string           // Full official name
  shortName: string      // For inline references ("George Brown", "York")
  abbr: string           // 2-3 letter ("GBC", "YU", "WLU", "Mac")
  tagline: string        // Small text under sidebar wordmark (always uppercase)
  primary: string        // Replaces #1B3F89 (institution dark/brand)
  accent: string         // Replaces #2563EB (action) where visible
  gradient: {            // Welcome banner gradient
    from: string
    via: string
    to: string
  }
  logo: string           // Public path to the institutional logo (transparent PNG)
  logoHeight: number     // Rendered height in px — controls visual scale in the sidebar header
  trimColor: string      // Sidebar header left-stripe colour (GBC uses rainbow instead)
  navActive: string      // Active nav item text/pill colour — must read on dark bg (#131825)
  link: string           // Light-mode action/link text colour (replaces #2563EB on white cards)
  linkDark: string       // Dark-mode action/link text colour (replaces #60A5FA on dark cards)
}

export const TENANTS: Record<string, Tenant> = {
  gbc: {
    id:         'gbc',
    name:       'George Brown College',
    shortName:  'George Brown',
    abbr:       'GBC',
    tagline:    'POLYTECHNIC',
    primary:    '#1B3F89',
    accent:     '#2563EB',
    gradient:   { from: '#1B3F89', via: '#1E4DA0', to: '#2563EB' },
    logo:       '/gbc-logo.png',
    logoHeight: 76,
    trimColor:  '#60A5FA',  // unused — GBC renders rainbow instead
    navActive:  '#60A5FA',  // blue-400 on dark sidebar ✓
    link:       '#2563EB',  // blue-600 on white cards ✓
    linkDark:   '#60A5FA',  // blue-400 on dark cards ✓
  },
  york: {
    id:         'york',
    name:       'York University',
    shortName:  'York',
    abbr:       'YU',
    tagline:    'TORONTO · KEELE CAMPUS',
    primary:    '#E31837',
    accent:     '#C8102E',
    gradient:   { from: '#8B0F1F', via: '#C8102E', to: '#E31837' },
    logo:       '/Logo_York_University.svg.png',
    logoHeight: 58,
    trimColor:  '#FFFFFF',  // York white — clean contrast on red
    navActive:  '#FCA5A5',  // rose-300: warm light red readable on dark sidebar
    link:       '#B91C1C',  // red-700: dark enough for AA on white
    linkDark:   '#FCA5A5',  // rose-300: readable on dark cards
  },
  laurier: {
    id:         'laurier',
    name:       'Wilfrid Laurier University',
    shortName:  'Laurier',
    abbr:       'WLU',
    tagline:    'WATERLOO',
    primary:    '#582C83',
    accent:     '#7B3FB7',
    gradient:   { from: '#3C1D5C', via: '#582C83', to: '#7B3FB7' },
    logo:       '/WLU_Primary_Logo.png',
    logoHeight: 46,
    trimColor:  '#F0C03E',  // Laurier gold — their official secondary
    navActive:  '#A78BFA',  // violet-400: light purple readable on dark sidebar
    link:       '#5B21B6',  // violet-800: dark enough for AA on white
    linkDark:   '#C4B5FD',  // violet-300: readable on dark cards
  },
  mcmaster: {
    id:         'mcmaster',
    name:       'McMaster University',
    shortName:  'McMaster',
    abbr:       'Mac',
    tagline:    'HAMILTON',
    primary:    '#7A003C',
    accent:     '#A2105E',
    gradient:   { from: '#5A002B', via: '#7A003C', to: '#A2105E' },
    logo:       '/McMaster_University_logo.svg.png',
    logoHeight: 64,
    trimColor:  '#F7A900',  // McMaster official gold — excellent on maroon
    navActive:  '#FBBF24',  // amber-400: McMaster gold, pops on dark sidebar
    link:       '#7A003C',  // maroon: dark enough for AA on white
    linkDark:   '#FBBF24',  // amber-400: gold links in dark mode — distinctive
  },
}

const STORAGE_KEY = 'gbc-bb-tenant'
const DEFAULT_TENANT_ID = 'gbc'

interface TenantContextType {
  tenant: Tenant
  tenantId: string
  setTenantId: (id: string) => void
  tenants: typeof TENANTS
}

const TenantContext = createContext<TenantContextType | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_TENANT_ID
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && TENANTS[stored] ? stored : DEFAULT_TENANT_ID
  })

  const tenant = TENANTS[tenantId] ?? TENANTS[DEFAULT_TENANT_ID]

  // Persist + sync CSS custom properties on the root element. Components that
  // want tenant-aware colors can use `var(--tenant-primary)` etc. in className
  // (Tailwind v4 supports arbitrary CSS variable references).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tenantId)
    const root = document.documentElement
    root.style.setProperty('--tenant-primary',       tenant.primary)
    root.style.setProperty('--tenant-accent',        tenant.accent)
    root.style.setProperty('--tenant-gradient-from', tenant.gradient.from)
    root.style.setProperty('--tenant-gradient-via',  tenant.gradient.via)
    root.style.setProperty('--tenant-gradient-to',   tenant.gradient.to)
    root.style.setProperty('--tenant-nav-active',    tenant.navActive)
    root.style.setProperty('--tenant-link',          tenant.link)
    root.style.setProperty('--tenant-link-dark',     tenant.linkDark)
  }, [tenant, tenantId])

  return (
    <TenantContext.Provider value={{ tenant, tenantId, setTenantId, tenants: TENANTS }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
