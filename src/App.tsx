import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ActivityStream from './pages/ActivityStream'
import Grades from './pages/Grades'
import CalendarPage from './pages/CalendarPage'
import Courses from './pages/Courses'
import CoursePage from './pages/CoursePage'
import AssignmentPage from './pages/AssignmentPage'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Resources from './pages/Resources'

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                                    element={<Dashboard />} />
          <Route path="/courses"                             element={<Courses />} />
          <Route path="/courses/:courseId"                   element={<CoursePage />} />
          <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentPage />} />
          <Route path="/grades"                              element={<Grades />} />
          <Route path="/activity-stream"                     element={<ActivityStream />} />
          <Route path="/calendar"                            element={<CalendarPage />} />
          <Route path="/messages"                            element={<Messages />} />
          <Route path="/notifications"                       element={<Notifications />} />
          {/* Stubs for remaining nav items */}
          <Route path="/communities"     element={<Placeholder title="Communities" description="Discussion boards and study groups for your courses." />} />
          <Route path="/resources"       element={<Resources />} />
          <Route path="/tools"           element={<Placeholder title="Tools" description="Turnitin, Zoom, Office 365, and other integrated tools." />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center max-w-[320px]">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#1A2236] border border-gray-200 dark:border-[#2D3A52] flex items-center justify-center mx-auto mb-4">
          <span className="text-[24px]">🚧</span>
        </div>
        <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>
        {description && (
          <p className="text-[14px] text-gray-400 dark:text-gray-500 leading-relaxed">{description}</p>
        )}
        <p className="text-[12px] text-gray-300 dark:text-gray-600 mt-3">Coming in a future update</p>
      </div>
    </div>
  )
}
