import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, BookOpen, BarChart3, Activity, CalendarDays,
  MessageCircle, Users, Library, Settings, LogOut, Bell, X,
} from './Icons'
import { notifications, messages } from '../data/mockData'
import { useToast } from '../context/ToastContext'
import { useTenant } from '../context/TenantContext'

// ─── Nav items ────────────────────────────────────────────────────────────────
// Badges derive from the source data so they never drift. Both Messages and
// Notifications count items where `isRead/unread` indicates user attention.

const navItems = [
  { to: '/',                icon: Home,          label: 'Home' },
  { to: '/courses',         icon: BookOpen,       label: 'Courses' },
  { to: '/grades',          icon: BarChart3,      label: 'Grades' },
  { to: '/activity-stream', icon: Activity,       label: 'Activity Stream' },
  { to: '/calendar',        icon: CalendarDays,   label: 'Calendar' },
  { to: '/messages',        icon: MessageCircle,  label: 'Messages',
    badge: messages.filter(m => !m.isRead).length || undefined },
  { to: '/notifications',   icon: Bell,           label: 'Notifications',
    badge: notifications.filter(n => n.unread).length || undefined },
  { to: '/communities',     icon: Users,          label: 'Communities' },
  { to: '/resources',       icon: Library,        label: 'Resources' },
  { to: '/tools',           icon: Settings,       label: 'Tools' },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// The sidebar is ALWAYS dark regardless of the page's light/dark mode.
// Logo header uses GBC navy + brightness/invert filter to render the logo white.

export default function Sidebar() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { tenant } = useTenant()
  const isGBC = tenant.id === 'gbc'
  // Confirmation modal visibility — gate the destructive Sign Out action
  const [confirmOpen, setConfirmOpen] = useState(false)

  // ESC closes the modal when open
  useEffect(() => {
    if (!confirmOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmOpen])

  function confirmSignOut() {
    setConfirmOpen(false)
    toast("You've been signed out (prototype demo — you stay signed in)", 'info')
    navigate('/')
  }

  return (
    <aside data-tour="sidebar" aria-label="Primary" className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#131825] border-r border-[#1E2A3F] flex flex-col z-30">

      {/* Tenant header — brand colour + institutional logo.
          All logos are transparent PNGs rendered white via brightness(0) invert(1)
          so they sit cleanly on any brand colour. GBC keeps its rainbow stripe;
          other tenants get a subtle white/20 stripe that echoes the GBC detail
          without copying institutional marks. */}
      <div
        className="h-[88px] flex items-center justify-center border-b border-[#1E2A3F] relative overflow-hidden shrink-0"
        style={{ background: tenant.primary }}
      >
        {isGBC ? (
          /* GBC — 7-segment rainbow stripe unique to the brand */
          <>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] flex flex-col">
              <div className="flex-1" style={{ background: '#3DAA35' }} />
              <div className="flex-1" style={{ background: '#8DC63F' }} />
              <div className="flex-1" style={{ background: '#FDD835' }} />
              <div className="flex-1" style={{ background: '#29ABE2' }} />
              <div className="flex-1" style={{ background: '#2E77BD' }} />
              <div className="flex-1" style={{ background: '#9B8EC4' }} />
              <div className="flex-1" style={{ background: '#F7941D' }} />
            </div>
            <div className="relative z-10 pl-3 pr-3 flex items-center w-full justify-center">
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', height: tenant.logoHeight, maxWidth: 176 }}
              />
            </div>
          </>
        ) : (
          /* Other institutions — school secondary colour stripe + logo rendered white */
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-[4px]"
              style={{ background: tenant.trimColor }}
            />
            <div className="relative z-10 px-5 flex items-center justify-center w-full">
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', height: tenant.logoHeight, maxWidth: 176 }}
              />
            </div>
          </>
        )}
      </div>

      {/* Nav links */}
      <nav aria-label="Main navigation" className="flex-1 py-3 overflow-y-auto space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 relative ${
                isActive ? '' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`
            }
            style={({ isActive }) => isActive ? {
              color: 'var(--tenant-nav-active)',
              background: `${tenant.primary}26`,
            } : {}}
          >
            {({ isActive }) => (
              <>
                {/* Left pill — colour tracks the active tenant */}
                {isActive && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                    style={{ background: 'var(--tenant-nav-active)' }}
                  />
                )}
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className="shrink-0"
                />
                <span className="truncate">{item.label}</span>
                {item.badge ? (
                  <span
                    className="ml-auto text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--tenant-nav-active)',
                      // navActive is chosen to be legible on the dark sidebar;
                      // use dark text when the badge colour is light (gold, rose, violet)
                      color: tenant.id === 'gbc' ? 'white' : '#111827',
                    }}
                    aria-label={`${item.badge} unread`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out — opens confirmation modal rather than firing immediately,
          since signing out is destructive in a real LMS. */}
      <div className="border-t border-[#1E2A3F] py-3 px-2 shrink-0">
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all duration-150"
        >
          <LogOut size={18} strokeWidth={1.7} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Sign Out confirmation modal */}
      {confirmOpen && (
        <SignOutConfirmModal
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmSignOut}
        />
      )}
    </aside>
  )
}

// ─── Sign Out confirmation modal ──────────────────────────────────────────────
// Small focused dialog. Backdrop click + ESC + Cancel button all dismiss.
// Confirm action is wired by the parent so behaviour stays in one place.

interface SignOutConfirmModalProps {
  onCancel: () => void
  onConfirm: () => void
}

function SignOutConfirmModal({ onCancel, onConfirm }: SignOutConfirmModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[380px] bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onCancel}
          aria-label="Cancel sign out"
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition-colors text-gray-400"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="p-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-3">
            <LogOut size={18} className="text-red-500" />
          </div>
          <h2 id="signout-title" className="text-[17px] font-bold text-gray-900 dark:text-gray-100">
            Sign out of Blackboard?
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
            You'll need to sign back in with your GBC credentials to access your courses.
          </p>

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#232d42] hover:bg-gray-200 dark:hover:bg-[#2a354d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
