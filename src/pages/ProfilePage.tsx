import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, grades, getOverallGPA, getWinterGPA } from '../data/mockData'
import { getLetterGrade } from '../utils/grades'
import { useToast } from '../context/ToastContext'
import { CheckCircle, Mail, Bell, Eye, EyeOff, ChevronRight } from '../components/Icons'
import AccessibilitySettingsModal from '../components/AccessibilitySettingsModal'

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { toast } = useToast()
  const [notifPrefs, setNotifPrefs] = useState({
    grades:        true,
    assignments:   true,
    announcements: true,
    messages:      true,
  })
  const [hideGPA, setHideGPA] = useState(false)
  const [a11yOpen, setA11yOpen] = useState(false)

  const fallGPA   = getOverallGPA()
  const winterGPA = getWinterGPA()
  const { letter: fallLetter,   color: fallColor }   = getLetterGrade(fallGPA)
  const { letter: winterLetter, color: winterColor } = getLetterGrade(winterGPA)

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0)

  function togglePref(key: keyof typeof notifPrefs) {
    setNotifPrefs(p => ({ ...p, [key]: !p[key] }))
    toast('Notification preference updated', 'success')
  }

  return (
    <div className="max-w-[820px]">

      {/* ── Header card ── */}
      <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden mb-6">
        {/* GBC navy accent */}
        <div className="h-24 bg-gradient-to-r from-[#1B3F89] to-[#2563EB]" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[#1A2236] bg-[#2563EB] flex items-center justify-center text-white font-bold text-[24px] shadow-sm">
              KH
            </div>
          </div>

          <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100">Kevin H.</h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-0.5">Interaction Design · Year 2 · George Brown College</p>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <a
              href="mailto:kevin.hutchinson@georgebrown.ca"
              className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
              title="Open in mail client"
            >
              <Mail size={13} />
              kevin.hutchinson@georgebrown.ca
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText('101-847-293')
                toast('Student ID copied to clipboard', 'success')
              }}
              className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
              title="Copy student ID"
            >
              <CheckCircle size={13} />
              Student ID: 101-847-293
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">

        {/* Left column */}
        <div className="space-y-6">

          {/* Academic summary */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Academic Summary</h2>
              <button
                onClick={() => setHideGPA(h => !h)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232d42] transition text-gray-400"
              >
                {hideGPA ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Fall 2022 GPA',   value: hideGPA ? '—' : `${fallGPA}%`,   sub: fallLetter,   color: fallColor },
                { label: 'Winter 2022 GPA', value: hideGPA ? '—' : `${winterGPA}%`, sub: winterLetter, color: winterColor },
                { label: 'Credits (Fall)',  value: `${totalCredits}`,                sub: 'enrolled',   color: '#2563EB' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 dark:bg-[#131825] rounded-xl p-3.5">
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-[22px] font-bold leading-tight mt-1" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Current courses list */}
            <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wide mb-2">Enrolled Courses — Fall 2022</h3>
            <div className="space-y-1">
              {courses.map(c => {
                const cg = grades.find(g => g.courseId === c.id)
                const { letter, color: lc } = cg ? getLetterGrade(cg.percentage) : { letter: '—', color: '#94A3B8' }
                return (
                  <Link
                    key={c.id}
                    to={`/courses/${c.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: c.color }}>
                      {c.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">{c.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-400">{c.code}</p>
                    </div>
                    <span className="text-[11px] font-bold shrink-0" style={{ color: lc }}>{hideGPA ? '—' : letter}</span>
                    <ChevronRight size={13} className="text-gray-300 dark:text-gray-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Notification preferences */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-gray-400" />
              <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Notifications</h2>
            </div>
            <div className="space-y-3">
              {(Object.entries(notifPrefs) as [keyof typeof notifPrefs, boolean][]).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-700 dark:text-gray-300 capitalize">{key}</span>
                  <button
                    onClick={() => togglePref(key)}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#2563EB]' : 'bg-gray-200 dark:bg-[#2D3A52]'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${enabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] p-5">
            <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-3">Account</h2>
            <div className="space-y-1">
              {[
                { label: 'Change Password',        action: () => { toast('Redirecting to MyGBC account settings…', 'info'); window.open('https://georgebrown.ca/portal', '_blank', 'noopener,noreferrer') } },
                { label: 'Accessibility Settings', action: () => setA11yOpen(true) },
                { label: 'Download Transcript',    action: () => { toast('Opening STU-VIEW — select Unofficial Transcript', 'info'); window.open('https://stuview.georgebrown.ca/', '_blank', 'noopener,noreferrer') } },
                { label: 'Replay product tour',    action: () => { localStorage.removeItem('gbc-bb-tour-completed-v1'); window.location.href = '/' } },
                { label: 'Help Centre',            action: () => { toast('Opening GBC IT Help…', 'info'); window.open('https://www.georgebrown.ca/current-students/services/it-help-index', '_blank', 'noopener,noreferrer') } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
                >
                  <span className="text-[13px] text-gray-700 dark:text-gray-300 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">{item.label}</span>
                  <ChevronRight size={13} className="text-gray-300 dark:text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Settings modal — opened from the Account quick-links */}
      <AccessibilitySettingsModal open={a11yOpen} onClose={() => setA11yOpen(false)} />
    </div>
  )
}
