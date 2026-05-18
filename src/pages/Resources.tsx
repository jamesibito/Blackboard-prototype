import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../data/mockData'
import { Download, LinkIcon, Search } from '../components/Icons'
import { useToast } from '../context/ToastContext'

// ─── File type badge config ────────────────────────────────────────────────────

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  pdf:  { label: 'PDF',  bg: '#FEE2E2', text: '#DC2626' },
  ppt:  { label: 'PPT',  bg: '#FEF3C7', text: '#D97706' },
  doc:  { label: 'DOC',  bg: '#DBEAFE', text: '#2563EB' },
  zip:  { label: 'ZIP',  bg: '#F3E8FF', text: '#7C3AED' },
  link: { label: 'LINK', bg: '#D1FAE5', text: '#059669' },
}

// ─── Resources Page ────────────────────────────────────────────────────────────

export default function Resources() {
  const { toast } = useToast()
  const [query, setQuery]       = useState('')
  const [activeType, setActiveType] = useState<string>('all')

  // Flatten all resources across all courses into one searchable list per course
  const coursesWithResources = courses.filter(c => c.resources && c.resources.length > 0)

  const totalFiles = coursesWithResources.reduce((n, c) => n + (c.resources?.length ?? 0), 0)

  // All unique file types present in the data
  const allTypes = Array.from(
    new Set(coursesWithResources.flatMap(c => c.resources?.map(r => r.type) ?? []))
  )

  return (
    <div className="max-w-[960px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Resources</h1>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
            Fall 2022 · {totalFiles} files across {coursesWithResources.length} courses
          </p>
        </div>
      </div>

      {/* ── Search + type filter ── */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border border-gray-200 dark:border-[#2D3A52] bg-white dark:bg-[#1A2236] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </div>

        {/* File type chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveType('all')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeType === 'all'
                ? 'bg-[#2563EB] text-white'
                : 'bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a354d]'
            }`}
          >
            All
          </button>
          {allTypes.map(t => {
            const cfg = typeConfig[t] ?? { label: t.toUpperCase(), bg: '#F3F4F6', text: '#6B7280' }
            return (
              <button
                key={t}
                onClick={() => setActiveType(t === activeType ? 'all' : t)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                  activeType === t
                    ? 'text-white'
                    : 'bg-gray-100 dark:bg-[#232d42] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a354d]'
                }`}
                style={activeType === t ? { background: cfg.text } : undefined}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Course sections ── */}
      <div className="space-y-6">
        {coursesWithResources.map(course => {
          const filtered = (course.resources ?? []).filter(r => {
            const matchesType  = activeType === 'all' || r.type === activeType
            const matchesQuery = query.trim() === '' ||
              r.title.toLowerCase().includes(query.toLowerCase()) ||
              r.filename.toLowerCase().includes(query.toLowerCase())
            return matchesType && matchesQuery
          })

          if (filtered.length === 0) return null

          return (
            <div key={course.id} className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">

              {/* Course header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 dark:border-[#232d42]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                  style={{ background: course.color }}
                >
                  {course.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 leading-tight">{course.name}</h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{course.code} · {course.instructor}</p>
                </div>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-[12px] font-medium hover:underline transition-colors shrink-0"
                  style={{ color: course.color }}
                >
                  Open course →
                </Link>
              </div>

              {/* Resource rows */}
              <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
                {filtered.map(r => {
                  const cfg = typeConfig[r.type] ?? { label: r.type.toUpperCase(), bg: '#F3F4F6', text: '#6B7280' }
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors group"
                    >
                      {/* Type badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 w-[38px] text-center"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        {cfg.label}
                      </span>

                      {/* Title + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {r.filename}
                          {r.size && <span className="ml-2 text-gray-300 dark:text-gray-600">·</span>}
                          {r.size && <span className="ml-2">{r.size}</span>}
                          <span className="ml-2 text-gray-300 dark:text-gray-600">·</span>
                          <span className="ml-2">Uploaded {r.uploadedOn}</span>
                        </p>
                      </div>

                      {/* Download / link button */}
                      <button
                        onClick={() =>
                          r.type === 'link'
                            ? toast(`Opening ${r.title}…`, 'info')
                            : toast(`Downloading ${r.filename}…`, 'info')
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
                        style={{ borderColor: course.color, color: course.color }}
                        title={r.type === 'link' ? 'Open link' : 'Download'}
                      >
                        {r.type === 'link'
                          ? <><LinkIcon size={13} /> Open</>
                          : <><Download size={13} /> Download</>
                        }
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state when nothing matches */}
      {coursesWithResources.every(c =>
        (c.resources ?? []).filter(r =>
          (activeType === 'all' || r.type === activeType) &&
          (query.trim() === '' || r.title.toLowerCase().includes(query.toLowerCase()) || r.filename.toLowerCase().includes(query.toLowerCase()))
        ).length === 0
      ) && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#232d42] flex items-center justify-center mb-4">
            <Search size={26} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">No files found</p>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 text-center max-w-[240px]">
            Try a different search term or file type.
          </p>
          {(query || activeType !== 'all') && (
            <button
              onClick={() => { setQuery(''); setActiveType('all') }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
