import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ToastContainer from './ToastContainer'
import DemoBanner from './DemoBanner'

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
        </footer>
      </div>
      <ToastContainer />
    </div>
  )
}
