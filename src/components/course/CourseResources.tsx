import type { CourseResource } from '../../data/mockData'
import { FileText } from '../Icons'

interface Props {
  resources: CourseResource[]
  courseColor: string
}

const fileTypeLabel: Record<string, string> = {
  pdf:  'PDF',
  ppt:  'PPT',
  doc:  'DOC',
  zip:  'ZIP',
  link: 'LINK',
}

export default function CourseResources({ resources, courseColor }: Props) {
  return (
    <div className="bg-white dark:bg-[#1A2236] rounded-2xl border border-gray-100 dark:border-[#2D3A52] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">Resources</h2>
      </div>
      {resources.length > 0 ? (
        <div className="divide-y divide-gray-50 dark:divide-[#232d42]">
          {resources.map(r => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#232d42] transition-colors cursor-default"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${courseColor}12` }}
              >
                <FileText size={16} style={{ color: courseColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">{r.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${courseColor}15`, color: courseColor }}
                  >
                    {fileTypeLabel[r.type] ?? r.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{r.filename}</span>
                  {r.size && (
                    <>
                      <span className="text-[11px] text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{r.size}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{r.uploadedOn}</span>
                <button
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                  style={{ borderColor: courseColor, color: courseColor }}
                  onClick={e => e.stopPropagation()}
                  title={`Download ${r.filename}`}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-5">
          <FileText size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-[13px] text-gray-400 dark:text-gray-500">No resources have been posted yet.</p>
        </div>
      )}
    </div>
  )
}
