import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Bell, ChevronDown, X } from './Icons'
import { useTheme } from '../context/ThemeContext'
import { user, courses, assignments, activityItems, notifications, getCourse } from '../data/mockData'

// Colours to show in the notification dot for each type
const typeColors: Record<string, string> = {
  grade:        '#22C55E',
  assignment:   '#F97316',
  announcement: '#8B5CF6',
  resource:     '#06B6D4',
}

// Show only the 3 most recent in the dropdown — full list lives on /notifications
const dropdownNotifs = notifications.slice(0, 3)

export default function TopBar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  // Tracks which notifications the user has marked read in this session.
  // Initialised empty — combined with `notification.unread` to compute the badge.
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  // Computed unread = base unread minus anything the user marked read this session
  const unreadCount = notifications.filter(n => n.unread && !readIds.has(n.id)).length

  function markAllRead() {
    setReadIds(new Set(notifications.filter(n => n.unread).map(n => n.id)))
  }

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

  const q = searchQuery.toLowerCase()
  const courseResults = searchQuery.length > 1
    ? courses.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      )
    : []
  const assignmentResults = searchQuery.length > 1
    ? assignments.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      ).slice(0, 4)
    : []
  const activityResults = searchQuery.length > 1
    ? activityItems.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q)
      ).slice(0, 3)
    : []
  const hasResults = courseResults.length > 0 || assignmentResults.length > 0 || activityResults.length > 0

  return (
    <header className="h-[64px] flex items-center justify-between px-6 bg-[#E8EBF0] dark:bg-[#131825] border-b border-[#D4D8E0] dark:border-[#1E2A3F] shrink-0 relative z-20">

      {/* Search */}
      <div data-tour="topbar-search" ref={searchRef} role="search" className="relative w-[380px]">
        <label htmlFor="global-search" className="sr-only">Search courses, resources, and activities</label>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          id="global-search"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search courses, resources, activities…"
          aria-controls="global-search-results"
          aria-expanded={searchFocused && searchQuery.length > 1}
          className="w-full h-[40px] pl-10 pr-20 rounded-lg bg-white dark:bg-[#1A2236] border border-gray-300 dark:border-[#2D3A52] text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]/50 dark:focus:border-[#60A5FA]/30 transition-all duration-150"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-400 font-medium">
            <span className="px-1 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded border border-gray-200 dark:border-[#2D3A52]">⌘</span>
            <span className="px-1 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded border border-gray-200 dark:border-[#2D3A52]">K</span>
          </kbd>
        )}

        {/* Search dropdown */}
        {searchFocused && searchQuery.length > 1 && (
          <div id="global-search-results" role="listbox" className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-lg overflow-hidden z-50 max-h-[420px] overflow-y-auto">
            {hasResults ? (
              <>
                {/* Courses */}
                {courseResults.length > 0 && (
                  <>
                    <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                      Courses
                    </div>
                    {courseResults.map(c => (
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
                          <p className="text-[11px] text-gray-400 dark:text-gray-400">{c.code} · {c.instructor}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Assignments */}
                {assignmentResults.length > 0 && (
                  <>
                    <div className={`px-3 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider ${courseResults.length > 0 ? 'pt-2 border-t border-gray-100 dark:border-[#2D3A52]' : 'pt-2.5'}`}>
                      Assignments
                    </div>
                    {assignmentResults.map(a => {
                      const course = getCourse(a.courseId)
                      return (
                        <button
                          key={a.id}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition text-left"
                          onClick={() => { setSearchQuery(''); setSearchFocused(false); navigate(`/courses/${a.courseId}/assignments/${a.id}`) }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: course.color }}>
                            {course.abbr}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{a.title}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate">{course.name} · Due {a.dueDate}</p>
                          </div>
                        </button>
                      )
                    })}
                  </>
                )}

                {/* Activity stream */}
                {activityResults.length > 0 && (
                  <>
                    <div className={`px-3 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider ${(courseResults.length > 0 || assignmentResults.length > 0) ? 'pt-2 border-t border-gray-100 dark:border-[#2D3A52]' : 'pt-2.5'}`}>
                      Activity Stream
                    </div>
                    {activityResults.map(a => {
                      const course = a.courseId ? getCourse(a.courseId) : undefined
                      const isExternal = a.linkTo?.startsWith('http')
                      const dest = a.linkTo ?? '/activity-stream'
                      const handleSelect = () => {
                        setSearchQuery('')
                        setSearchFocused(false)
                        if (isExternal) {
                          window.open(dest, '_blank', 'noopener,noreferrer')
                        } else {
                          navigate(dest)
                        }
                      }
                      return (
                        <button
                          key={a.id}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition text-left"
                          onClick={handleSelect}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: course ? course.color : '#1B3F89' }}
                          >
                            {course ? course.abbr : 'GBC'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{a.title}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-400">{a.date}</p>
                          </div>
                        </button>
                      )
                    })}
                  </>
                )}
              </>
            ) : (
              <div className="px-4 py-5 text-center text-[13px] text-gray-400 dark:text-gray-400">
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
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
        >
          <Sun size={15} aria-hidden="true" className={theme === 'light' ? 'text-amber-500' : 'text-gray-400'} />
          {/* Toggle track */}
          <div className="relative w-9 h-5 rounded-full bg-gray-300 transition-colors duration-200 mx-0.5" style={theme === 'dark' ? { background: 'var(--tenant-primary)' } : {}}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
          <Moon size={15} aria-hidden="true" className={theme === 'dark' ? 'text-[#60A5FA]' : 'text-gray-400'} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 dark:bg-[#2D3A52] mx-1" />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2236] transition-colors duration-150"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            aria-expanded={notifOpen}
            aria-haspopup="menu"
          >
            <Bell size={19} aria-hidden="true" className="text-gray-700 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span aria-hidden="true" className="absolute top-1.5 right-1.5 min-w-[8px] h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[340px] bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2D3A52]">
                <span className="font-semibold text-[13px] text-gray-900 dark:text-gray-100">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)] font-medium hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Show 3 most recent notifications. Read state combines base data
                  + anything marked read in this session (via Mark all read). */}
              {dropdownNotifs.map(n => {
                const course = n.courseId ? getCourse(n.courseId) : undefined
                const dotColor = typeColors[n.type]
                const isUnread = n.unread && !readIds.has(n.id)
                return (
                  <button
                    key={n.id}
                    className="flex items-start gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#232d42] text-left border-b border-gray-50 dark:border-[#2D3A52] last:border-b-0 transition-colors"
                    onClick={() => {
                      setNotifOpen(false)
                      // Mark this notification read so the badge count drops immediately,
                      // regardless of whether the link is internal or external
                      setReadIds(prev => new Set([...prev, n.id]))
                      if (n.linkTo) {
                        n.linkTo.startsWith('http')
                          ? window.open(n.linkTo, '_blank', 'noopener,noreferrer')
                          : navigate(n.linkTo)
                      }
                    }}
                  >
                    {/* Coloured dot: filled = unread, ring = read */}
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: isUnread ? dotColor : 'transparent', border: isUnread ? 'none' : '1.5px solid #94a3b8' }} />
                    <div className="flex-1 min-w-0">
                      {/* Course pill if applicable */}
                      {course && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded mr-1" style={{ background: `${course.color}18`, color: course.color }}>
                          {course.abbr}
                        </span>
                      )}
                      <span className={`text-[13px] leading-snug line-clamp-2 ${isUnread ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        {n.title}
                      </span>
                      <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                )
              })}

              {/* Footer: link to full Notifications page */}
              <div className="px-4 py-2.5 text-center border-t border-gray-100 dark:border-[#2D3A52]">
                <button
                  className="text-[12px] text-[var(--tenant-link)] dark:text-[var(--tenant-link-dark)] font-medium hover:underline"
                  onClick={() => { setNotifOpen(false); navigate('/notifications') }}
                >
                  View all {notifications.length} notifications
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
            aria-label={`Account menu for ${user.displayName}`}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 overflow-hidden"
              style={{ background: user.avatarColor }}
            >
              {/* Person silhouette — circle-clipped so body has no flat edge */}
              <svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="avatar-clip">
                    <circle cx="16" cy="16" r="16" />
                  </clipPath>
                </defs>
                <g clipPath="url(#avatar-clip)">
                  <circle cx="16" cy="11.5" r="5.5" fill="white" fillOpacity="0.92" />
                  <ellipse cx="16" cy="30" rx="11.5" ry="8" fill="white" fillOpacity="0.92" />
                </g>
              </svg>
            </div>
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {user.displayName}
            </span>
            <ChevronDown size={13} aria-hidden="true" className={`text-gray-400 transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[190px] bg-white dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-[#2D3A52] mb-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{user.displayName}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-400">Student · Fall 2022</p>
              </div>
              {/* Internal nav items — single canonical destination per item */}
              {[
                { label: 'Profile & Settings', to: '/profile' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setProfileOpen(false); navigate(item.to) }}
                  className="w-full px-4 py-2 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {/* Help Centre — external GBC student services site (opens new tab) */}
              <a
                href="https://www.georgebrown.ca/current-students/services"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-2 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors"
              >
                Help Centre ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
