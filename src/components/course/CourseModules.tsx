import type { CourseModule } from '../../data/mockData'
import { CheckCircle, BookOpen } from '../Icons'

interface Props {
  modules: CourseModule[]
}

// Module type → display config
const typeConfig: Record<CourseModule['type'], { label: string; bg: string; text: string }> = {
  lecture:    { label: 'lecture',    bg: 'bg-gray-50 dark:bg-gray-500/10',     text: 'text-gray-500 dark:text-gray-400' },
  reading:    { label: 'reading',    bg: 'bg-cyan-50 dark:bg-cyan-500/10',     text: 'text-cyan-600 dark:text-cyan-400' },
  assignment: { label: 'assignment', bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-500 dark:text-orange-400' },
  quiz:       { label: 'quiz',       bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400' },
  video:      { label: 'video',      bg: 'bg-pink-50 dark:bg-pink-500/10',     text: 'text-pink-500 dark:text-pink-400' },
  discussion: { label: 'discussion', bg: 'bg-teal-50 dark:bg-teal-500/10',     text: 'text-teal-600 dark:text-teal-400' },
}

export default function CourseModules({ modules }: Props) {
  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Modules</h2>
      </div>
      {modules.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-[#232d42]">
          {modules.map(m => {
            const tc = typeConfig[m.type] ?? typeConfig.lecture
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <CheckCircle
                  size={16}
                  className={m.completed ? 'text-emerald-500 shrink-0' : 'text-gray-300 dark:text-gray-600 shrink-0'}
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[13px] leading-snug ${
                    m.completed
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100 font-medium'
                  }`}>
                    {m.title}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 px-2 py-0.5 bg-gray-100 dark:bg-[#232d42] rounded-md">
                  {m.itemCount} items
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tc.bg} ${tc.text}`}>
                  {tc.label}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-5">
          <BookOpen size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-[13px] text-gray-400 dark:text-gray-500">Modules will appear here when published by the instructor.</p>
        </div>
      )}
    </div>
  )
}
