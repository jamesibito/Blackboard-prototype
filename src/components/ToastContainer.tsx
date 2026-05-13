import { useToast } from '../context/ToastContext'
import { CheckCircle, AlertCircle, Info, X } from './Icons'

const icons = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    Info,
}

const colors = {
  success: { bar: '#22C55E', icon: 'text-emerald-500' },
  error:   { bar: '#EF4444', icon: 'text-red-500' },
  info:    { bar: '#2563EB', icon: 'text-blue-500' },
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const Icon = icons[t.type]
        const c = colors[t.type]
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-[#1A2236] border border-gray-100 dark:border-[#2D3A52] rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-[360px] animate-[slideUp_0.2s_ease-out]"
            style={{ borderLeft: `3px solid ${c.bar}` }}
          >
            <Icon size={16} className={`${c.icon} shrink-0`} />
            <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
