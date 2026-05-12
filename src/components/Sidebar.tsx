import { NavLink } from 'react-router-dom'
import {
  Home, BookOpen, BarChart3, Activity, CalendarDays,
  MessageCircle, Users, Library, Settings, LogOut,
} from './Icons'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/grades', icon: BarChart3, label: 'Grades' },
  { to: '/activity-stream', icon: Activity, label: 'Activity Stream' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/messages', icon: MessageCircle, label: 'Messages', badge: 2 },
  { to: '/communities', icon: Users, label: 'Communities' },
  { to: '/resources', icon: Library, label: 'Resources' },
  { to: '/tools', icon: Settings, label: 'Tools' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-white dark:bg-[#131825] border-r border-gray-100 dark:border-[#1E2A3F] flex flex-col z-30">
      {/* GBC Logo Header */}
      <div className="h-[72px] flex items-center justify-center border-b border-gray-100 dark:border-[#1E2A3F] bg-[#1B3F89] relative overflow-hidden shrink-0">
        {/* Four-colour stripe on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[5px] flex flex-col">
          <div className="flex-1 bg-[#E53935]" />
          <div className="flex-1 bg-[#FDD835]" />
          <div className="flex-1 bg-[#1E88E5]" />
          <div className="flex-1 bg-[#43A047]" />
        </div>
        {/* Subtle radial glow in corner */}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/[0.06]" />
        <div className="relative z-10 pl-3 flex items-center gap-2.5">
          {/* Logo displays at natural colours — no filter applied */}
          <img
            src="/gbc-logo.png"
            alt="George Brown College"
            className="h-9 w-auto"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 relative ${
                isActive
                  ? 'text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/[0.08] dark:bg-[#2563EB]/[0.12]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left pill */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-r-full" />
                )}
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className="shrink-0"
                />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#2563EB] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-gray-100 dark:border-[#1E2A3F] py-3 px-2 shrink-0">
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-all duration-150">
          <LogOut size={18} strokeWidth={1.7} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
