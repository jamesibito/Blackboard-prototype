import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, BookOpen, BarChart3, Activity, CalendarDays,
  MessageCircle, Users, Library, Settings, LogOut, Bell,
} from './Icons'
import { notifications } from '../data/mockData'

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { to: '/',                icon: Home,          label: 'Home' },
  { to: '/courses',         icon: BookOpen,       label: 'Courses' },
  { to: '/grades',          icon: BarChart3,      label: 'Grades' },
  { to: '/activity-stream', icon: Activity,       label: 'Activity Stream' },
  { to: '/calendar',        icon: CalendarDays,   label: 'Calendar' },
  { to: '/messages',        icon: MessageCircle,  label: 'Messages', badge: 2 },
  { to: '/notifications',   icon: Bell,           label: 'Notifications',
    badge: notifications.filter(n => n.unread).length || undefined },
  { to: '/communities',     icon: Users,          label: 'Communities' },
  { to: '/resources',       icon: Library,        label: 'Resources' },
  { to: '/tools',           icon: Settings,       label: 'Tools' },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// The sidebar is ALWAYS dark regardless of the page's light/dark mode.
// Design rationale: a permanently dark sidebar creates stronger visual hierarchy
// between the navigation chrome and the content area, similar to Linear/Notion.
// The dark surface also ensures the GBC navy logo header blends seamlessly.

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#131825] border-r border-[#1E2A3F] flex flex-col z-30">

      {/* GBC Logo Header — navy background complements the sidebar's dark surface */}
      <div className="h-[72px] flex items-center justify-center border-b border-[#1E2A3F] bg-[#1B3F89] relative overflow-hidden shrink-0">
        {/* GBC four-colour identity stripe on the left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[5px] flex flex-col">
          <div className="flex-1 bg-[#E53935]" />
          <div className="flex-1 bg-[#FDD835]" />
          <div className="flex-1 bg-[#1E88E5]" />
          <div className="flex-1 bg-[#43A047]" />
        </div>
        {/* Subtle corner glow for depth */}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/[0.06]" />
        <div className="relative z-10 flex items-center justify-center w-full px-4">
          <img src="/gbc-logo.png" alt="George Brown College" className="w-full h-auto object-contain" style={{ maxHeight: 52 }} />
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 relative ${
                isActive
                  ? 'text-[#60A5FA] bg-[#2563EB]/[0.15]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Left pill — active state indicator */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#60A5FA] rounded-r-full" />
                )}
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className="shrink-0"
                />
                <span className="truncate">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-[#2563EB] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-[#1E2A3F] py-3 px-2 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all duration-150"
        >
          <LogOut size={18} strokeWidth={1.7} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
