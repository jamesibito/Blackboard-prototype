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

  // Guard: show a friendly error if the courseId doesn't match any course
  if (!course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">Course not found</h1>
          <Link to="/courses" className="text-[13px] text-[#2563EB] dark:text-[#60A5FA] hover:underline">Back to Courses</Link>
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
