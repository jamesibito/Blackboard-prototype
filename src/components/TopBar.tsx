import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Bell, ChevronDown, X } from './Icons'
import { useTheme } from '../context/ThemeContext'
import { user, courses } from '../data/mockData'

const notifications = [
  { text: 'Assignment 5 – Branded Design graded', time: '2 hours ago', color: '#F97316', unread: true },
  { text: 'New resource posted in Interactive Systems', time: '5 hours ago', color: '#EC4899', unread: true },
  { text: 'Reminder: Research Proposal due tomorrow', time: '1 day ago', color: '#06B6D4', unread: false },
]

const unreadCount = notifications.filter(n => n.unread).length

export default function TopBar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keyboard shortcut hint: ⌘K or Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = searchRef.current?.querySelector('input')
        input?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const searchResults = searchQuery.length > 1
    ? courses.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <header className="h-[64px] flex items-center justify-between px-6 bg-white dark:bg-[#131825] border-b border-gray-100 dark:border-[#1E2A3F] shrink-0 relative z-20">

      {/* Search */}
      <div ref={searchRef} className="relative w-[380px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search courses, resources, activities…"
          className="w-full h-[40px] pl-10 pr-20 rounded-lg bg-gray-50 dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 dark:focus:border-[#60A5FA]/30 transition-all duration-150"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            <span className="px-1 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded border border-gray-200 dark:border-[#2D3A52]">⌘</span>
            <span className="px-1 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded border border-gray-200 dark:border-[#2D3A52]">K</span>
          </kbd>
        )}

        {/* Search dropdown */}
        {searchFocused && searchQuery.length > 1 && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-lg overflow-hidden z-50">
            {searchResults.length > 0 ? (
              <>
                <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Courses
                </div>
                {searchResults.map(c => (
                  <button
                    key={c.id}
                    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition text-left"
                    onClick={() => { setSearchQuery(''); setSearchFocused(false); navigate(`/courses/${c.id}`) }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background: c.color }}>
                      {c.abbr}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.code} · {c.instructor}</p>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-5 text-center text-[13px] text-gray-400 dark:text-gray-500">
                No results for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">

        {/* Dark/light toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2236] transition-colors duration-150"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle theme"
        >
          <Sun size={15} className={theme === 'light' ? 'text-amber-500' : 'text-gray-400'} />
          {/* Toggle track */}
          <div className="relative w-9 h-5 rounded-full bg-gray-200 dark:bg-[#2563EB] transition-colors duration-200 mx-0.5">
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
          <Moon size={15} className={theme === 'dark' ? 'text-[#60A5FA]' : 'text-gray-400'} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-[#2D3A52] mx-1" />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2236] transition-colors duration-150"
            aria-label="Notifications"
          >
            <Bell size={19} className="text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[320px] bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2D3A52]">
                <span className="font-semibold text-[13px] text-gray-900 dark:text-gray-100">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                )}
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#232d42] cursor-pointer border-b border-gray-50 dark:border-[#2D3A52] last:border-b-0 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.unread ? n.color : 'transparent', border: n.unread ? 'none' : '1.5px solid #94a3b8' }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-snug ${n.unread ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {n.text}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-[12px] text-[#2563EB] dark:text-[#60A5FA] font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1A2236] transition-colors duration-150"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: user.avatarColor }}
            >
              KH
            </div>
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {user.displayName}
            </span>
            <ChevronDown size={13} className={`text-gray-400 transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[190px] bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-[#2D3A52] mb-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{user.displayName}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Student · Fall 2022</p>
              </div>
              {['My Profile', 'Account Settings', 'Help Centre'].map((item, i) => (
                <button key={i} className="w-full px-4 py-2 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
