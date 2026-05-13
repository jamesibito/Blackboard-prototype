import { useParams, Link } from 'react-router-dom'
import {
  getCourse,
  grades,
  courseModules,
  assignments,
  activityItems,
  courseAnnouncements,
} from '../data/mockData'
import { getLetterGrade } from '../utils/grades'
import Breadcrumbs from '../components/Breadcrumbs'
import CourseHeader from '../components/course/CourseHeader'
import CourseAnnouncements from '../components/course/CourseAnnouncements'
import CourseModules from '../components/course/CourseModules'
import CourseAssignments from '../components/course/CourseAssignments'
import CourseResources from '../components/course/CourseResources'
import CourseSidebar from '../components/course/CourseSidebar'

// ─── Course Page ──────────────────────────────────────────────────────────────

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courseId ? getCourse(courseId) : null

  // Guard: polished 404 state if the courseId doesn't match any course
  if (!course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-[320px] mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#1A2236] border border-gray-100 dark:border-[#2D3A52] flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 mb-2">Course not found</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
            This course doesn't exist or you may not be enrolled. Head back to your course list.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  const courseGrade        = grades.find(g => g.courseId === course.id)
  const lg                 = courseGrade ? getLetterGrade(courseGrade.percentage) : null
  const modules            = courseModules[course.id] || []
  const courseAssignments  = assignments.filter(a => a.courseId === course.id)
  const courseActivity     = activityItems.filter(a => a.courseId === course.id).slice(0, 4)
  const resources          = course.resources || []
  const announcements      = courseAnnouncements.filter(a => a.courseId === course.id)

  return (
    <div className="max-w-[1000px]">
      <Breadcrumbs items={[
        { label: 'Courses', to: '/courses' },
        { label: course.name },
      ]} />

      {/* Course header card */}
      <CourseHeader course={course} courseGrade={courseGrade} lg={lg} />

      {/* Two-column body */}
      <div className="grid grid-cols-[1fr_340px] gap-6">

        {/* Left column: Announcements → Modules → Assignments → Resources */}
        <div className="space-y-6">
          <CourseAnnouncements announcements={announcements} courseColor={course.color} />
          <CourseModules modules={modules} />
          <CourseAssignments courseAssignments={courseAssignments} course={course} />
          <CourseResources resources={resources} courseColor={course.color} />
        </div>

        {/* Right sidebar: Grades → Syllabus → Activity → Instructor */}
        <CourseSidebar
          course={course}
          courseGrade={courseGrade}
          lg={lg}
          courseActivity={courseActivity}
        />
      </div>
    </div>
  )
}
