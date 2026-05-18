import type { Announcement } from '../../data/mockData'

interface Props {
  announcements: Announcement[]
  courseColor: string
}

// Pin icon inline SVG
function PinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4l-4 4-6-1-1 1 4 4-5 7 7-5 4 4 1-1-1-6 4-4z" />
    </svg>
  )
}

export default function CourseAnnouncements({ announcements, courseColor }: Props) {
  if (announcements.length === 0) return null

  // Pinned first, then by date (most recent first)
  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Announcements</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
        {sorted.map(ann => (
          <div key={ann.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                {ann.title}
              </h3>
              {ann.isPinned && (
                <span
                  className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: `${courseColor}15`, color: courseColor }}
                >
                  <PinIcon />
                  Pinned
                </span>
              )}
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{ann.body}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-1.5">{ann.author} · {ann.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
