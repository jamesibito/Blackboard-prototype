import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from './Icons'
import { useTenant } from '../context/TenantContext'
import { useToast } from '../context/ToastContext'

/**
 * TenantSwitcher
 * ──────────────
 * Floating bottom-right control that lets a viewer reskin the entire prototype
 * for a different Canadian post-secondary institution (Blackboard Learn is
 * multi-tenant — every school skins their own instance).
 *
 * Demonstrates the design system holding up across brand identities without
 * needing to rebuild the UI for each.
 *
 * UX detail (fix from v4.15.0): the previous version had a × that hid the
 * switcher to localStorage permanently — once dismissed, no way back without
 * clearing storage. Replaced with a reversible "collapse to chip" — click the
 * chevron and the full pill collapses to a tiny coloured dot you can click
 * to expand again. State persists in localStorage so it survives navigation.
 */

const STATE_KEY = 'gbc-bb-tenant-switcher-state'   // 'expanded' | 'collapsed'

export default function TenantSwitcher() {
  const { tenant, tenantId, setTenantId, tenants } = useTenant()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STATE_KEY) === 'collapsed'
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  function setCollapsedPersist(next: boolean) {
    setCollapsed(next)
    localStorage.setItem(STATE_KEY, next ? 'collapsed' : 'expanded')
    setOpen(false)
  }

  // Close popover on outside click
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  // ESC closes popover
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // ─── Collapsed state — a small floating chip in the bottom-right ────────────
  if (collapsed) {
    return (
      <button
        type="button"
        data-tour="tenant-switcher"
        onClick={() => setCollapsedPersist(false)}
        aria-label={`Expand school switcher — currently viewing as ${tenant.shortName}`}
        title={`Currently: ${tenant.shortName} · click to switch school`}
        className="fixed bottom-4 right-4 z-[60] w-12 h-12 rounded-full bg-[#0F1623] border border-[#2D3A52] shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ background: tenant.primary, boxShadow: `0 0 0 3px ${tenant.primary}40` }}
        >
          {tenant.abbr}
        </span>
      </button>
    )
  }

  // ─── Expanded state — full pill with toggle + collapse ──────────────────────
  return (
    <div data-tour="tenant-switcher" className="fixed bottom-4 right-4 z-[60]">
      <div
        ref={wrapperRef}
        className="relative flex items-stretch bg-[#0F1623] text-white rounded-2xl shadow-2xl border border-[#2D3A52] backdrop-blur-md overflow-hidden"
      >
        {/* Pill trigger — shows current tenant with its primary color dot */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Choose school"
          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#1A2236] transition-colors"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: tenant.primary, boxShadow: `0 0 0 3px ${tenant.primary}30` }}
          />
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] font-bold uppercase tracking-[1.4px] text-gray-400 leading-none">
              Viewing as
            </span>
            <span className="text-[12.5px] font-semibold text-white mt-0.5 leading-tight">
              {tenant.shortName}
            </span>
          </div>
          <ChevronDown
            size={12}
            className={`text-gray-400 transition-transform ml-1 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Collapse to chip — reversible (was the × dismiss before, but that
            was a one-way trap. The new chevron icon and "Minimise" hint make
            it clear this hides to a chip rather than killing the feature.) */}
        <button
          type="button"
          onClick={() => setCollapsedPersist(true)}
          aria-label="Minimise school switcher to a chip"
          title="Minimise (you can expand it again from the chip)"
          className="px-3 border-l border-[#2D3A52] hover:bg-[#1A2236] text-gray-500 hover:text-gray-300 transition-colors text-[10px] font-medium"
        >
          −
        </button>

        {/* Popover */}
        {open && (
          <div
            role="dialog"
            aria-label="Schools"
            className="absolute bottom-full right-0 mb-2 w-[300px] bg-[#0F1623] border border-[#2D3A52] rounded-2xl shadow-2xl p-2"
          >
            <div className="px-3 pt-2 pb-3 border-b border-[#2D3A52] mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-gray-400">
                Multi-school demo
              </p>
              <p className="text-[11.5px] text-gray-300 mt-1 leading-relaxed">
                Same redesign — different school. See how the design system holds up across brand identities.
              </p>
            </div>
            <div className="flex flex-col gap-0.5" role="radiogroup">
              {Object.values(tenants).map(t => {
                const active = t.id === tenantId
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!active) {
                        setTenantId(t.id)
                        toast(`Now viewing as ${t.shortName}`, 'success')
                      }
                      setOpen(false)
                    }}
                    role="radio"
                    aria-checked={active}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer
                      ${active ? 'bg-[#1A2236]' : 'hover:bg-[#1A2236]/60'}`}
                  >
                    {/* Branded swatch — preview of the school's primary colour */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 pointer-events-none"
                      style={{
                        background: t.primary,
                        boxShadow: active ? `0 0 0 2px ${t.primary}50` : undefined,
                      }}
                    >
                      {t.abbr}
                    </div>
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <p className="text-[12.5px] font-semibold text-white truncate">{t.shortName}</p>
                      <p className="text-[10.5px] text-gray-400 truncate">{t.name}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold text-[#60A5FA] pointer-events-none">✓ Active</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
