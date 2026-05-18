import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from './Icons'
import { useTenant } from '../context/TenantContext'

/**
 * TenantSwitcher
 * ──────────────
 * Floating bottom-right pill that lets a viewer reskin the entire prototype
 * for a different Canadian post-secondary institution (Blackboard Learn is
 * multi-tenant — every school skins their own instance).
 *
 * Demonstrates the design system holding up across brand identities without
 * needing to rebuild the UI for each.
 *
 * Always visible on every Layout page. Hidden on standalone pages like
 * /changelog and /font-vote (which aren't part of the in-app experience).
 *
 * Dismissable for the session via the × — persists in localStorage so a
 * reviewer who's done exploring can hide it.
 */

const DISMISSED_KEY = 'gbc-bb-tenant-switcher-dismissed'

export default function TenantSwitcher() {
  const { tenant, tenantId, setTenantId, tenants } = useTenant()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISSED_KEY) === '1'
  })
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  // ESC closes
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (dismissed) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <div
        ref={popoverRef}
        className="relative flex items-stretch bg-[#0F1623] text-white rounded-2xl shadow-2xl border border-[#2D3A52] backdrop-blur-md overflow-hidden"
      >
        {/* Pill trigger — shows current tenant with its primary color dot */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Choose institution"
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

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISSED_KEY, '1')
            setDismissed(true)
          }}
          aria-label="Hide tenant switcher for this session"
          className="px-2 border-l border-[#2D3A52] hover:bg-[#1A2236] text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={14} />
        </button>

        {/* Popover */}
        {open && (
          <div
            role="dialog"
            aria-label="Institutions"
            className="absolute bottom-full right-0 mb-2 w-[280px] bg-[#0F1623] border border-[#2D3A52] rounded-2xl shadow-2xl p-2"
          >
            <div className="px-3 pt-2 pb-3 border-b border-[#2D3A52] mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-gray-400">
                Multi-tenant demo
              </p>
              <p className="text-[11.5px] text-gray-300 mt-1 leading-relaxed">
                Same redesign — different institution. See how the design system holds up across brand identities.
              </p>
            </div>
            <div className="flex flex-col gap-0.5" role="radiogroup">
              {Object.values(tenants).map(t => {
                const active = t.id === tenantId
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTenantId(t.id); setOpen(false) }}
                    role="radio"
                    aria-checked={active}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                      ${active ? 'bg-[#1A2236]' : 'hover:bg-[#1A2236]/60'}`}
                  >
                    {/* Branded swatch — preview of the tenant's primary colour */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{
                        background: t.primary,
                        boxShadow: active ? `0 0 0 2px ${t.primary}50` : undefined,
                      }}
                    >
                      {t.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-white truncate">{t.shortName}</p>
                      <p className="text-[10.5px] text-gray-400 truncate">{t.name}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold text-[#60A5FA]">✓</span>
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
