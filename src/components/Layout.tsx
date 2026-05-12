import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0C0F1A] transition-colors duration-200">
      <Sidebar />
      <div className="ml-[220px] flex flex-col min-h-screen">
        <TopBar />
        {/* key={pathname} causes remount on route change → triggers page-enter animation */}
        <main key={location.pathname} className="flex-1 p-8 overflow-y-auto page-enter">
          <Outlet />
        </main>
        <footer className="px-8 py-3 text-[11px] text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-[#1E2A3F]">
          Redesign concept by Jamie Ibitoye · Not affiliated with Blackboard Inc. or George Brown College
        </footer>
      </div>
    </div>
  )
}
