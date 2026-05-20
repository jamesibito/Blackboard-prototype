import { Link, useLocation } from 'react-router-dom'
import { Home, ArrowRight } from '../components/Icons'

/**
 * NotFound (404)
 * ──────────────
 * Catch-all page for any URL that doesn't match a registered route.
 * Wired in App.tsx as <Route path="*" element={<NotFound />} />.
 *
 * Goal: graceful recovery — give the user clear paths back rather than a
 * blank page. Mirrors the friendly empty-state pattern used elsewhere
 * (Notifications, Course-not-found, etc.).
 */
export default function NotFound() {
  const location = useLocation()

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-[440px]">

        {/* Big 404 — gradient watermark follows the active tenant */}
        <p
          className="text-[120px] font-bold leading-none tracking-tighter mb-2"
          style={{
            background: 'linear-gradient(135deg, var(--tenant-gradient-from) 0%, var(--tenant-gradient-to) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page not found
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-1 leading-relaxed">
          We couldn't find <code className="text-[13px] font-mono bg-gray-100 dark:bg-[#232d42] px-1.5 py-0.5 rounded">{location.pathname}</code> in this prototype.
        </p>
        <p className="text-[13px] text-gray-400 dark:text-gray-400 mb-6 leading-relaxed">
          Try one of the links below, or use the sidebar to navigate.
        </p>

        {/* Recovery links — primary CTA + secondary suggestions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--tenant-primary)] hover:brightness-90 text-white text-[13px] font-semibold transition-all"
          >
            <Home size={14} aria-hidden="true" />
            Back to Dashboard
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#232d42] transition-colors"
          >
            View courses
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
