import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ToastContainer from './ToastContainer'
import DemoBanner from './DemoBanner'
import OnboardingModal from './OnboardingModal'

/**
 * resetDemo
 * ─────────
 * Clears the two localStorage keys that gate the onboarding modal and the
 * dismissible demo banner, then refreshes the page so both reappear. Useful
 * for reviewers viewing the prototype repeatedly, or for live interview demos
 * where you want to walk someone through the first-visit experience.
 *
 * Keys are intentionally listed inline here rather than imported, so a future
 * dev sees exactly what state gets cleared without hunting through files.
 */
function resetDemo() {
  localStorage.removeItem('gbc-bb-demo-banner-dismissed-v1')
  localStorage.removeItem('gbc-bb-onboarding-seen-v1')
  window.location.reload()
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#E8EBF0] dark:bg-[#0C0F1A] transition-colors duration-200">
      {/* Skip-to-content link — appears on Tab focus, jumps past sidebar */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Sidebar />
      <div className="ml-[220px] flex flex-col min-h-screen">
        <DemoBanner />
        <TopBar />
        {/* key={pathname} causes remount on route change → triggers page-enter animation */}
        <main
          id="main-content"
          key={location.pathname}
          tabIndex={-1}
          className="flex-1 px-8 py-7 overflow-y-auto page-enter focus:outline-none"
        >
          <Outlet />
        </main>
        {/* Footer — portfolio attribution + external links to the real products */}
        <footer className="px-8 py-3 text-[11px] text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-[#1E2A3F]">
          Redesign concept by{' '}
          <a
            href="https://jamesibitoye.framer.website"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-500 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors font-medium"
          >
            James Ibitoye
          </a>
          {' '}· Not affiliated with{' '}
          <a
            href="https://blackboard.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
          >
            Blackboard
          </a>
          {' '}or{' '}
          <a
            href="https://georgebrown.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
          >
            George Brown College
          </a>
          {' · '}
          {/* Reset demo — clears localStorage so onboarding + banner reappear.
              Helpful for live interview walk-throughs or repeat reviewers. */}
          <button
            type="button"
            onClick={resetDemo}
            className="text-gray-400 dark:text-gray-600 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
            aria-label="Reset demo — restores the first-visit onboarding modal and demo banner"
          >
            Reset demo
          </button>
        </footer>
      </div>
      <ToastContainer />
      {/* First-visit onboarding overlay — gated on localStorage inside the component */}
      <OnboardingModal />
    </div>
  )
}
