import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
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
import Communities from './pages/Communities'
import Tools from './pages/Tools'
import ProfilePage from './pages/ProfilePage'
import NotFound from './pages/NotFound'
import FontComparison from './pages/FontComparison'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          {/* Standalone comparison page (no app chrome) — lives on the
              `type-comparison-3way` branch only. Shareable URL for collecting
              typography feedback. Not present on main. */}
          <Route path="/font-vote" element={<FontComparison />} />

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
            <Route path="/resources"                           element={<Resources />} />
            <Route path="/communities"                         element={<Communities />} />
            <Route path="/tools"                               element={<Tools />} />
            <Route path="/profile"                             element={<ProfilePage />} />
            {/* Catch-all 404 — keep last so registered routes take precedence */}
            <Route path="*"                                    element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  )
}
