// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface CourseResource {
  id: string
  title: string           // Display name shown to student
  filename: string        // Original file name
  type: 'pdf' | 'ppt' | 'doc' | 'zip' | 'link'
  uploadedBy: string      // Instructor name
  uploadedOn: string      // Human-readable date
  size?: string           // e.g. "2.4 MB"
}

export interface Course {
  id: string
  abbr: string
  name: string
  code: string
  instructor: string
  color: string
  files: string[]         // Legacy — kept for Dashboard FileChip component
  description: string
  credits: number
  schedule: string
  room: string
  completion: number      // 0–100 percentage of modules completed
  moduleCount: number
  completedModules: number
  lastActivity: string
  zoomLink?: string       // Instructor's recurring Zoom URL for online sessions
  resources?: CourseResource[]  // Lecture slides, reference files, etc.
}

export interface RubricCriterion {
  name: string
  weight: number
  score?: number
  total: number
  feedback?: string
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  points: number
  status: 'submitted' | 'graded' | 'upcoming' | 'late'
  submittedDate?: string
  rubric: RubricCriterion[]
  instructions: string[]
  deliverables: string[]
}

export interface GradeMark {
  name: string
  score: number
  total: number
  assignmentId?: string
}

export interface CourseGrade {
  courseId: string
  percentage: number
  marks: GradeMark[]
}

export interface DueItem {
  id: string
  courseId: string
  title: string
  dueDay: string
  type: 'assignment' | 'quiz' | 'project'
  assignmentId?: string
}

export interface ActivityItem {
  id: string
  courseId?: string       // Optional — college-wide announcements have no course
  title: string
  date: string
  timeRange: string
  type: 'assignment' | 'announcement' | 'grade' | 'resource'
  body: string
  linkTo?: string         // Internal route to navigate to on "View details" click
}

export interface CalendarEvent {
  id: string
  courseId: string
  title: string
  day: number
  color: string
  type?: 'deadline' | 'class' | 'event'
}

export interface ClassBlock {
  courseId: string
  dayOfWeek: number // 0=Sun, 1=Mon...
  startHour: number
  endHour: number
  room: string
}

export interface Message {
  id: string
  senderName: string
  senderAbbr: string
  senderColor: string
  subject: string
  preview: string
  body: string
  time: string
  date: string
  isRead: boolean
  isStarred: boolean
  courseId?: string
  tag: 'assignment' | 'grade' | 'general' | 'office-hours'
}

export interface CourseModule {
  id: string
  title: string
  itemCount: number
  completed: boolean
  type: 'lecture' | 'assignment' | 'reading' | 'quiz'
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: '2D', abbr: '2D', name: '2D Visualization', code: 'INTR 1001',
    instructor: 'Jaron Stewart', color: '#F97316',
    files: ['Brand Ideation.docx'],
    description: 'Foundational design principles applied to 2D visual communication. Covers typography, colour theory, brand identity, and layout across print and digital media.',
    credits: 3, schedule: 'Mon / Wed  9:00 AM – 11:00 AM', room: 'SFC B108',
    completion: 72, moduleCount: 12, completedModules: 9,
    lastActivity: '2 days ago',
    zoomLink: 'https://georgebrown.zoom.us/j/96271830412',
    resources: [
      { id: 'r2d-1', title: 'Week 1 – Design Fundamentals Slides', filename: 'W1-Design-Fundamentals.pdf', type: 'pdf', uploadedBy: 'Jaron Stewart', uploadedOn: 'Sep 12', size: '4.2 MB' },
      { id: 'r2d-2', title: 'Colour Theory Reference Guide', filename: 'Colour-Theory-Guide.pdf', type: 'pdf', uploadedBy: 'Jaron Stewart', uploadedOn: 'Sep 19', size: '2.1 MB' },
      { id: 'r2d-3', title: 'Typography Systems Deck', filename: 'W4-Typography.ppt', type: 'ppt', uploadedBy: 'Jaron Stewart', uploadedOn: 'Oct 3', size: '6.8 MB' },
      { id: 'r2d-4', title: 'Brand Identity Template Pack', filename: 'Brand-Templates.zip', type: 'zip', uploadedBy: 'Jaron Stewart', uploadedOn: 'Oct 17', size: '18.4 MB' },
      { id: 'r2d-5', title: 'Final Project Brief', filename: 'Final-Project-Brief.pdf', type: 'pdf', uploadedBy: 'Jaron Stewart', uploadedOn: 'Dec 1', size: '0.9 MB' },
    ],
  },
  {
    id: 'IS', abbr: 'IS', name: 'Interactive Systems', code: 'INTR 1002',
    instructor: 'Michael Holland', color: '#EC4899',
    files: ['Image.jpg', 'Form.jpg', 'Image 2.jpg'],
    description: 'Human-computer interaction principles, UX research methods, wireframing, usability testing, and interactive prototyping using industry tools.',
    credits: 3, schedule: 'Tue / Thu  1:00 PM – 3:00 PM', room: 'SFC B112',
    completion: 88, moduleCount: 14, completedModules: 12,
    lastActivity: 'Today',
    zoomLink: 'https://georgebrown.zoom.us/j/84512093761',
    resources: [
      { id: 'ris-1', title: 'HCI Foundations – Lecture Notes', filename: 'W1-HCI-Foundations.pdf', type: 'pdf', uploadedBy: 'Michael Holland', uploadedOn: 'Sep 13', size: '3.1 MB' },
      { id: 'ris-2', title: 'User Research Methods Overview', filename: 'Research-Methods.pdf', type: 'pdf', uploadedBy: 'Michael Holland', uploadedOn: 'Sep 20', size: '2.7 MB' },
      { id: 'ris-3', title: 'Figma Prototyping Starter Kit', filename: 'Figma-Starter.zip', type: 'zip', uploadedBy: 'Michael Holland', uploadedOn: 'Oct 11', size: '12.2 MB' },
      { id: 'ris-4', title: 'Usability Testing Script Template', filename: 'Test-Script-Template.doc', type: 'doc', uploadedBy: 'Michael Holland', uploadedOn: 'Nov 7', size: '0.4 MB' },
    ],
  },
  {
    id: 'IA', abbr: 'IA', name: 'Information Architecture', code: 'INTR 1006',
    instructor: 'A.J. Singh', color: '#EF4444',
    files: [],
    description: 'Structuring and organizing information for digital products. Topics include sitemaps, card sorting, navigation design, content strategy, and taxonomy.',
    credits: 2, schedule: 'Fri  9:00 AM – 12:00 PM', room: 'SFC A209',
    completion: 45, moduleCount: 10, completedModules: 4,
    lastActivity: '1 week ago',
    zoomLink: 'https://georgebrown.zoom.us/j/71038294651',
    resources: [
      { id: 'ria-1', title: 'IA Foundations Slides', filename: 'IA-Foundations.pdf', type: 'pdf', uploadedBy: 'A.J. Singh', uploadedOn: 'Sep 16', size: '3.8 MB' },
      { id: 'ria-2', title: 'Card Sorting Workshop Guide', filename: 'Card-Sorting-Guide.pdf', type: 'pdf', uploadedBy: 'A.J. Singh', uploadedOn: 'Oct 7', size: '1.2 MB' },
    ],
  },
  {
    id: 'VD', abbr: 'VD', name: 'Visual Design', code: 'INTR 1003',
    instructor: 'Xander Messi', color: '#8B5CF6',
    files: ['Ideation Jam.docx'],
    description: 'Advanced visual composition, grid systems, motion principles, and design systems. Students develop a cohesive design language for a multi-channel campaign.',
    credits: 3, schedule: 'Mon / Wed  12:00 PM – 2:00 PM', room: 'SFC B110',
    completion: 60, moduleCount: 11, completedModules: 7,
    lastActivity: '3 days ago',
    zoomLink: 'https://georgebrown.zoom.us/j/93847201938',
    resources: [
      { id: 'rvd-1', title: 'Grid Systems & Layout Principles', filename: 'Grid-Systems.pdf', type: 'pdf', uploadedBy: 'Xander Messi', uploadedOn: 'Sep 14', size: '5.6 MB' },
      { id: 'rvd-2', title: 'Campaign Design Inspiration Pack', filename: 'Inspiration-Pack.zip', type: 'zip', uploadedBy: 'Xander Messi', uploadedOn: 'Oct 24', size: '34.1 MB' },
      { id: 'rvd-3', title: 'Motion & Transition Principles', filename: 'Motion-Principles.pdf', type: 'pdf', uploadedBy: 'Xander Messi', uploadedOn: 'Nov 2', size: '2.9 MB' },
    ],
  },
  {
    id: 'CE', abbr: 'CE', name: 'College English', code: 'COMM 1001',
    instructor: 'Erik Brown', color: '#06B6D4',
    files: ['Image.jpg', 'Form.jpg', 'Image 2.jpg'],
    description: 'Academic writing, critical reading, and research skills for design professionals. Emphasis on portfolio writing, case studies, and professional communication.',
    credits: 3, schedule: 'Tue  9:00 AM – 12:00 PM', room: 'SFC A105',
    completion: 80, moduleCount: 13, completedModules: 10,
    lastActivity: 'Yesterday',
    zoomLink: 'https://georgebrown.zoom.us/j/82910374652',
    resources: [
      { id: 'rce-1', title: 'Academic Writing Style Guide', filename: 'Writing-Style-Guide.pdf', type: 'pdf', uploadedBy: 'Erik Brown', uploadedOn: 'Sep 15', size: '1.8 MB' },
      { id: 'rce-2', title: 'APA Citation Reference Sheet', filename: 'APA-Reference.pdf', type: 'pdf', uploadedBy: 'Erik Brown', uploadedOn: 'Oct 5', size: '0.6 MB' },
      { id: 'rce-3', title: 'Week 13 Lecture Notes', filename: 'W13-Notes.pdf', type: 'pdf', uploadedBy: 'Erik Brown', uploadedOn: 'Dec 8', size: '1.1 MB' },
    ],
  },
  {
    id: 'TD', abbr: 'TD', name: 'Technical Drawing', code: 'INTR 1005',
    instructor: 'David Kim', color: '#22C55E',
    files: [],
    description: 'Orthographic projection, isometric drawing, and dimensional annotation. Students use manual and digital drafting tools to produce technical documentation.',
    credits: 2, schedule: 'Thu  1:00 PM – 4:00 PM', room: 'SFC C204',
    completion: 97, moduleCount: 9, completedModules: 9,
    lastActivity: 'Today',
    zoomLink: 'https://georgebrown.zoom.us/j/77614829304',
    resources: [
      { id: 'rtd-1', title: 'Orthographic Projection Guide', filename: 'Ortho-Projection.pdf', type: 'pdf', uploadedBy: 'David Kim', uploadedOn: 'Sep 17', size: '3.3 MB' },
      { id: 'rtd-2', title: 'ASME Y14.5 Dimensioning Standards', filename: 'ASME-Y14.5.pdf', type: 'pdf', uploadedBy: 'David Kim', uploadedOn: 'Oct 6', size: '7.2 MB' },
      { id: 'rtd-3', title: 'AutoCAD Template Files', filename: 'AutoCAD-Templates.zip', type: 'zip', uploadedBy: 'David Kim', uploadedOn: 'Oct 13', size: '2.4 MB' },
    ],
  },
]

// ─── Course Modules ───────────────────────────────────────────────────────────

export const courseModules: Record<string, CourseModule[]> = {
  '2D': [
    { id: 'm1', title: 'Week 1 – Design Fundamentals', itemCount: 4, completed: true, type: 'lecture' },
    { id: 'm2', title: 'Week 2 – Colour Theory', itemCount: 3, completed: true, type: 'reading' },
    { id: 'm3', title: 'Assignment 1 – Brand Exploration', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm4', title: 'Week 3 – Typography Systems', itemCount: 5, completed: true, type: 'lecture' },
    { id: 'm5', title: 'Assignment 2 – Brand Ideation', itemCount: 2, completed: true, type: 'assignment' },
    { id: 'm6', title: 'Week 4 – Grid & Layout', itemCount: 4, completed: true, type: 'lecture' },
    { id: 'm7', title: 'Assignment 3 – Logo Design', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm8', title: 'Week 5 – Style Guides', itemCount: 3, completed: true, type: 'reading' },
    { id: 'm9', title: 'Assignment 4 – Style Guide', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm10', title: 'Week 6 – Brand Application', itemCount: 4, completed: false, type: 'lecture' },
    { id: 'm11', title: 'Assignment 5 – Branded Design', itemCount: 1, completed: false, type: 'assignment' },
    { id: 'm12', title: 'Final Project Brief', itemCount: 2, completed: false, type: 'assignment' },
  ],
  'IS': [
    { id: 'm1', title: 'Week 1 – HCI Foundations', itemCount: 3, completed: true, type: 'lecture' },
    { id: 'm2', title: 'Week 2 – Research Methods', itemCount: 4, completed: true, type: 'lecture' },
    { id: 'm3', title: 'Assignment 1 – User Interviews', itemCount: 2, completed: true, type: 'assignment' },
    { id: 'm4', title: 'Week 3 – Personas & Journey Maps', itemCount: 3, completed: true, type: 'reading' },
    { id: 'm5', title: 'Assignment 2 – Persona Development', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm6', title: 'Week 4 – Wireframing', itemCount: 5, completed: true, type: 'lecture' },
    { id: 'm7', title: 'Assignment 3 – User Flow Diagrams', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm8', title: 'Week 5 – Prototyping', itemCount: 4, completed: true, type: 'lecture' },
    { id: 'm9', title: 'Project 2 – Wireframe Set', itemCount: 2, completed: true, type: 'assignment' },
    { id: 'm10', title: 'Week 6 – Usability Testing', itemCount: 3, completed: true, type: 'reading' },
    { id: 'm11', title: 'Assignment 4 – Usability Test Report', itemCount: 1, completed: true, type: 'assignment' },
    { id: 'm12', title: 'Week 7 – Interactive Prototyping', itemCount: 4, completed: true, type: 'lecture' },
    { id: 'm13', title: 'Project 3 – Interactive Prototype', itemCount: 1, completed: false, type: 'assignment' },
    { id: 'm14', title: 'Final Presentation Prep', itemCount: 2, completed: false, type: 'assignment' },
  ],
}

// ─── Grades ───────────────────────────────────────────────────────────────────

export const grades: CourseGrade[] = [
  {
    courseId: '2D', percentage: 75,
    marks: [
      { name: 'Assignment 5 – Branded Design', score: 18, total: 25, assignmentId: 'asgn-2d-5' },
      { name: 'Assignment 4 – Style Guide', score: 20, total: 20, assignmentId: 'asgn-2d-4' },
      { name: 'Assignment 3 – Logo Design', score: 15, total: 25 },
      { name: 'Assignment 2 – Brand Ideation', score: 12, total: 20 },
      { name: 'Assignment 1 – Brand Exploration', score: 10, total: 10 },
    ],
  },
  {
    courseId: 'IA', percentage: 25,
    marks: [
      { name: 'Assignment 2 – Card Sorting Exercise', score: 7, total: 25 },
      { name: 'Assignment 1 – Sitemap Draft', score: 5, total: 20, assignmentId: 'asgn-ia-1' },
    ],
  },
  {
    courseId: 'VD', percentage: 60,
    marks: [
      { name: 'Project 2 – Campaign Layout', score: 30, total: 50, assignmentId: 'asgn-vd-2' },
      { name: 'Assignment 3 – Typography Poster', score: 18, total: 25 },
      { name: 'Assignment 2 – Colour Theory Study', score: 14, total: 25 },
    ],
  },
  {
    courseId: 'TD', percentage: 97,
    marks: [
      { name: 'Drawing Set 3 – Mechanical Parts', score: 48, total: 50, assignmentId: 'asgn-td-3' },
      { name: 'Drawing Set 2 – Orthographic Views', score: 49, total: 50 },
      { name: 'Drawing Set 1 – Basic Drafting', score: 48, total: 50 },
    ],
  },
  {
    courseId: 'CE', percentage: 80,
    marks: [
      { name: 'Essay 3 – Research Proposal', score: 82, total: 100, assignmentId: 'asgn-ce-3' },
      { name: 'Essay 2 – Comparative Analysis', score: 79, total: 100 },
      { name: 'Essay 1 – Personal Narrative', score: 83, total: 100 },
    ],
  },
  {
    courseId: 'IS', percentage: 91,
    marks: [
      { name: 'Project 3 – Interactive Prototype', score: 47, total: 50, assignmentId: 'asgn-is-3' },
      { name: 'Project 2 – Wireframe Set', score: 28, total: 30 },
      { name: 'Assignment 4 – Usability Test Report', score: 18, total: 20, assignmentId: 'asgn-is-4' },
      { name: 'Assignment 3 – User Flow Diagrams', score: 19, total: 20 },
      { name: 'Assignment 2 – Persona Development', score: 15, total: 15 },
    ],
  },
]

// ─── Due Soon ─────────────────────────────────────────────────────────────────

export const dueSoon: DueItem[] = [
  { id: 'ds1', courseId: 'VD', title: 'User Manual', dueDay: 'WEDNESDAY, DEC 7TH', type: 'assignment' },
  { id: 'ds2', courseId: 'CE', title: 'Research Proposal', dueDay: 'THURSDAY, DEC 8TH', type: 'assignment', assignmentId: 'asgn-ce-3' },
  { id: 'ds3', courseId: 'TD', title: 'Rendering Pin-up', dueDay: 'FRIDAY, DEC 9TH', type: 'project' },
  { id: 'ds4', courseId: '2D', title: 'Branding Guide', dueDay: 'MONDAY, DEC 12TH', type: 'assignment' },
]

// ─── Activity Stream ───────────────────────────────────────────────────────────

export const activityItems: ActivityItem[] = [
  {
    id: 'a1', courseId: 'CE', title: 'Lecture Notes Posted',
    date: '8th – 10th Dec 2022', timeRange: '8 AM – 9 AM', type: 'resource',
    body: 'Professor Brown has posted the Week 13 lecture notes covering comma splices, run-on sentences, and thesis statement revision strategies. Review before Tuesday\'s workshop session.',
  },
  {
    id: 'a2', courseId: 'IS', title: 'Assignment Posted: Usability Test Report',
    date: '13th Dec 2022', timeRange: '8 AM – 9 AM', type: 'assignment',
    body: 'A new assignment has been posted for Interactive Systems. Complete a 5-participant usability test of your mid-fi prototype and submit a written report (min. 600 words). Due: December 20th at 11:59 PM.',
    linkTo: '/courses/IS/assignments/asgn-is-4',
  },
  {
    id: 'a3', courseId: 'TD', title: 'Grade Released: Drawing Set 3',
    date: '18th Dec 2022', timeRange: '8 AM – 9 AM', type: 'grade',
    body: 'Your grade for Drawing Set 3 (Mechanical Parts) has been released. You scored 48 out of 50. Excellent drafting precision on the isometric views. See instructor comments attached to your submission.',
    linkTo: '/courses/TD/assignments/asgn-td-3',
  },
  {
    id: 'a4', courseId: '2D', title: 'Announcement: Final Project Brief',
    date: '23rd Dec 2022', timeRange: '10 AM – 1 PM', type: 'announcement',
    body: 'The final project brief is now live on the course page. You will be designing a full brand identity system for a fictional startup. Deliverables include logo, colour palette, type system, and a one-page brand guide. Submission due January 10th.',
    linkTo: '/courses/2D',
  },
  {
    id: 'a5', courseId: 'VD', title: 'New Resource: Campaign Layout Examples',
    date: '20th Dec 2022', timeRange: '2 PM – 3 PM', type: 'resource',
    body: 'Xander has shared a curated gallery of campaign layout examples from Behance. Review the visual hierarchy techniques used across the examples and bring notes to the next critique session.',
  },
  {
    id: 'a6', courseId: 'IA', title: 'Grade Released: Sitemap Draft',
    date: '19th Dec 2022', timeRange: '9 AM – 10 AM', type: 'grade',
    body: 'Your grade for Assignment 1 – Sitemap Draft has been posted. Score: 5/20. Please review the feedback carefully and book office hours with A.J. before the next submission.',
    linkTo: '/courses/IA/assignments/asgn-ia-1',
  },
  {
    id: 'a7', courseId: 'CE', title: 'Grade Released: Research Proposal',
    date: '15th Dec 2022', timeRange: '10 AM – 11 AM', type: 'grade',
    body: 'Your Essay 3 – Research Proposal has been graded. Score: 82/100. Strong sources and good mix of academic and industry references. Minor comma splice issues noted.',
    linkTo: '/courses/CE/assignments/asgn-ce-3',
  },
  {
    id: 'a8', courseId: 'IS', title: 'Reminder: Final Presentation Prep',
    date: '14th Dec 2022', timeRange: '2 PM – 3 PM', type: 'announcement',
    body: 'Don\'t forget to prepare your final presentation slides. Each student will have 8 minutes to present their interactive prototype and usability findings. Presentations begin January 5th.',
    linkTo: '/courses/IS',
  },
  {
    id: 'a9', courseId: 'VD', title: 'Grade Released: Campaign Layout',
    date: '12th Dec 2022', timeRange: '3 PM – 4 PM', type: 'grade',
    body: 'Your Campaign Layout project has been graded. Score: 30/50. Concept direction is solid but execution needs work. Grid breaks in digital banners and placeholder text in 2 mockups brought down the score.',
    linkTo: '/courses/VD/assignments/asgn-vd-2',
  },

  // ── College-wide announcements (no courseId — not tied to any specific course) ──

  {
    id: 'a10', title: 'OSAP Deadline Reminder',
    date: '5th Dec 2022', timeRange: '9 AM – 10 AM', type: 'announcement',
    body: 'Reminder from the Financial Aid Office: the deadline to submit your OSAP application for the Winter 2023 semester is December 15th, 2022. Log in to your Ontario.ca account to check your status and upload any outstanding documentation. Late applications cannot be guaranteed funding.',
  },
  {
    id: 'a11', title: 'Campus Closure – Holiday Break',
    date: '9th Dec 2022', timeRange: '8 AM – 9 AM', type: 'announcement',
    body: 'George Brown College will be closed for the holiday break from December 23rd, 2022 through January 2nd, 2023. All campus facilities, libraries, and student services will be unavailable during this period. Classes resume Monday, January 9th. Have a safe and restful holiday.',
  },
  {
    id: 'a12', title: 'Spring Graduation Registration Now Open',
    date: '11th Dec 2022', timeRange: '10 AM – 11 AM', type: 'announcement',
    body: 'Eligible students in their final semester are invited to register for the Spring 2023 Convocation ceremony. Log in to STU-VIEW and complete the graduation application by January 31st, 2023. For questions about eligibility, contact the Office of the Registrar at registrar@georgebrown.ca.',
  },
  {
    id: 'a13', title: 'Library Extended Hours – Exam Season',
    date: '6th Dec 2022', timeRange: '7 AM – 8 AM', type: 'announcement',
    body: 'The Ryerson & Polytechnic Library at the St. James campus will be open extended hours during the December exam period: Monday–Friday 7 AM – 11 PM, Saturday–Sunday 9 AM – 9 PM. Quiet study rooms can be booked through the library portal up to 48 hours in advance.',
  },
]

// ─── Calendar Events ───────────────────────────────────────────────────────────

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', courseId: 'IS', title: 'Ideation Jam', day: 3, color: '#EC4899', type: 'event' },
  { id: 'e2', courseId: 'IA', title: 'Wireframes Due', day: 3, color: '#EF4444', type: 'deadline' },
  { id: 'e3', courseId: 'CE', title: 'Peer Review', day: 5, color: '#06B6D4', type: 'event' },
  { id: 'e4', courseId: 'VD', title: 'User Manual Due', day: 7, color: '#8B5CF6', type: 'deadline' },
  { id: 'e5', courseId: 'CE', title: 'Research Proposal', day: 8, color: '#06B6D4', type: 'deadline' },
  { id: 'e6', courseId: 'TD', title: 'Rendering Pin-up', day: 9, color: '#22C55E', type: 'deadline' },
  { id: 'e7', courseId: '2D', title: 'Branding Guide', day: 12, color: '#F97316', type: 'deadline' },
  { id: 'e8', courseId: '2D', title: 'Logo Critique', day: 14, color: '#F97316', type: 'event' },
  { id: 'e9', courseId: '2D', title: 'Branded Design Due', day: 20, color: '#F97316', type: 'deadline' },
  { id: 'e10', courseId: 'IS', title: 'Prototypes Due', day: 20, color: '#EC4899', type: 'deadline' },
  { id: 'e11', courseId: 'IA', title: 'Final Sitemap', day: 20, color: '#EF4444', type: 'deadline' },
  { id: 'e12', courseId: 'VD', title: 'Campaign Layout', day: 20, color: '#8B5CF6', type: 'deadline' },
  { id: 'e13', courseId: 'IS', title: 'Prototypes Review', day: 28, color: '#EC4899', type: 'event' },
]

// ─── Class Schedule Blocks ────────────────────────────────────────────────

export const classBlocks: ClassBlock[] = [
  { courseId: '2D', dayOfWeek: 1, startHour: 9, endHour: 11, room: 'SFC B108' },
  { courseId: '2D', dayOfWeek: 3, startHour: 9, endHour: 11, room: 'SFC B108' },
  { courseId: 'IS', dayOfWeek: 2, startHour: 13, endHour: 15, room: 'SFC B112' },
  { courseId: 'IS', dayOfWeek: 4, startHour: 13, endHour: 15, room: 'SFC B112' },
  { courseId: 'IA', dayOfWeek: 5, startHour: 9, endHour: 12, room: 'SFC A209' },
  { courseId: 'VD', dayOfWeek: 1, startHour: 12, endHour: 14, room: 'SFC B110' },
  { courseId: 'VD', dayOfWeek: 3, startHour: 12, endHour: 14, room: 'SFC B110' },
  { courseId: 'CE', dayOfWeek: 2, startHour: 9, endHour: 12, room: 'SFC A105' },
  { courseId: 'TD', dayOfWeek: 4, startHour: 13, endHour: 16, room: 'SFC C204' },
]

// ─── Assignments ─────────────────────────────────────────────────────────────

export const assignments: Assignment[] = [
  {
    id: 'asgn-2d-5',
    courseId: '2D',
    title: 'Assignment 5 – Branded Design',
    description: 'Apply your brand identity system to three real-world applications. Demonstrate consistency across touchpoints while adapting the brand to different contexts and media.',
    dueDate: 'Dec 20, 2022',
    points: 25,
    status: 'graded',
    submittedDate: 'Dec 18, 2022',
    rubric: [
      { name: 'Brand Consistency', weight: 30, score: 7, total: 10, feedback: 'Colour palette applied well, but type weights vary between mockups.' },
      { name: 'Application Quality', weight: 30, score: 5, total: 10, feedback: 'Mockup layouts felt rushed. Push the brand into more contexts.' },
      { name: 'Craft & Finish', weight: 20, score: 4, total: 5, feedback: 'Clean files but some alignment issues on the banner.' },
      { name: 'Concept & Rationale', weight: 20, score: 2, total: 5, feedback: 'Missing written rationale for design choices.' },
    ],
    instructions: [
      'Select 3 application touchpoints from the list: business card, letterhead, social media kit, packaging, digital ad set, signage, or web landing page.',
      'Apply your brand identity system consistently across all 3 touchpoints.',
      'Include a brief written rationale (150-200 words) explaining your design decisions.',
      'Export all deliverables as high-resolution PDFs and provide source Illustrator files.',
    ],
    deliverables: ['3 application mockups (PDF)', 'Source files (.ai)', 'Written rationale (PDF)'],
  },
  {
    id: 'asgn-2d-4',
    courseId: '2D',
    title: 'Assignment 4 – Style Guide',
    description: 'Create a comprehensive style guide document for your brand identity, including typography, colour palette, spacing, and usage rules.',
    dueDate: 'Dec 5, 2022',
    points: 20,
    status: 'graded',
    submittedDate: 'Dec 4, 2022',
    rubric: [
      { name: 'Completeness', weight: 40, score: 8, total: 8, feedback: 'All required sections present.' },
      { name: 'Typography Spec', weight: 20, score: 4, total: 4 },
      { name: 'Colour Definition', weight: 20, score: 4, total: 4 },
      { name: 'Layout & Presentation', weight: 20, score: 4, total: 4, feedback: 'Excellent layout. Clean and professional.' },
    ],
    instructions: [
      'Document your full brand system: logo usage, clear space rules, colour palette (with hex/CMYK values), typography hierarchy, and image style.',
      'Format as a designed document (not just a text doc). The guide itself should demonstrate the brand.',
      'Minimum 8 pages.',
    ],
    deliverables: ['Style guide document (PDF)', 'Source files (.indd or .ai)'],
  },
  {
    id: 'asgn-is-4',
    courseId: 'IS',
    title: 'Assignment 4 – Usability Test Report',
    description: 'Conduct a usability test with 5 participants on your mid-fi prototype and write a detailed report with findings and recommendations.',
    dueDate: 'Dec 20, 2022',
    points: 20,
    status: 'graded',
    submittedDate: 'Dec 19, 2022',
    rubric: [
      { name: 'Methodology', weight: 20, score: 4, total: 4 },
      { name: 'Participant Recruitment', weight: 15, score: 3, total: 3 },
      { name: 'Key Findings', weight: 30, score: 5, total: 6, feedback: 'Good severity ratings but could use more detail on edge cases.' },
      { name: 'Recommendations', weight: 20, score: 4, total: 4 },
      { name: 'Report Quality', weight: 15, score: 2, total: 3, feedback: 'Some grammatical issues. Proofread next time.' },
    ],
    instructions: [
      'Recruit 5 participants. Include a participant overview table with demographics.',
      'Prepare a test script with 5 task scenarios.',
      'Record key observations, errors, and quotes during each session.',
      'Use severity ratings (Critical, Major, Minor, Cosmetic) for each finding.',
      'Write actionable recommendations for each finding.',
    ],
    deliverables: ['Usability Test Report (PDF)', 'Test script (PDF)', 'Figma prototype link'],
  },
  {
    id: 'asgn-is-3',
    courseId: 'IS',
    title: 'Project 3 – Interactive Prototype',
    description: 'Build an interactive prototype in Figma based on your wireframes and usability findings. Include micro-interactions and realistic user flows.',
    dueDate: 'Dec 20, 2022',
    points: 50,
    status: 'graded',
    submittedDate: 'Dec 19, 2022',
    rubric: [
      { name: 'Interaction Design', weight: 30, score: 14, total: 15, feedback: 'Smooth flows. Great use of smart animate.' },
      { name: 'Visual Polish', weight: 25, score: 12, total: 12 },
      { name: 'User Flow Coverage', weight: 25, score: 11, total: 12, feedback: 'Missing error state for form validation.' },
      { name: 'Presentation', weight: 20, score: 10, total: 11 },
    ],
    instructions: [
      'Build a clickable prototype in Figma with at least 3 complete user flows.',
      'Include transitions, micro-interactions, and hover states.',
      'Ensure the prototype is accessible via a public view-only link.',
    ],
    deliverables: ['Figma prototype (view-only link)', 'Flow diagram (PDF)'],
  },
  {
    id: 'asgn-vd-2',
    courseId: 'VD',
    title: 'Project 2 – Campaign Layout',
    description: 'Design a multi-channel advertising campaign for a brand of your choice. Create cohesive layouts across print, digital, and social media formats.',
    dueDate: 'Nov 28, 2022',
    points: 50,
    status: 'graded',
    submittedDate: 'Nov 28, 2022',
    rubric: [
      { name: 'Concept Direction', weight: 25, score: 9, total: 12, feedback: 'Solid concept. Visual language is consistent.' },
      { name: 'Grid & Layout', weight: 25, score: 6, total: 12, feedback: 'Grid breaks in digital banner sizes.' },
      { name: 'Copy & Content', weight: 25, score: 5, total: 12, feedback: 'Placeholder text in 2 of 5 mockups.' },
      { name: 'Craft & Finish', weight: 25, score: 10, total: 14, feedback: 'Print version has inconsistent margins.' },
    ],
    instructions: [
      'Choose a real or fictional brand.',
      'Design campaign layouts for: 1 print ad, 2 digital banner sizes, 1 social media post, and 1 billboard/OOH format.',
      'All copy must be final — no placeholder text.',
      'Maintain consistent grid, type, and colour across all formats.',
    ],
    deliverables: ['5 layout mockups (PDF)', 'Source files (.ai or .psd)', 'Brand brief (1 page)'],
  },
  {
    id: 'asgn-td-3',
    courseId: 'TD',
    title: 'Drawing Set 3 – Mechanical Parts',
    description: 'Create detailed orthographic and isometric drawings of 3 mechanical assemblies with proper dimensioning and annotation.',
    dueDate: 'Dec 15, 2022',
    points: 50,
    status: 'graded',
    submittedDate: 'Dec 14, 2022',
    rubric: [
      { name: 'Orthographic Accuracy', weight: 30, score: 15, total: 15 },
      { name: 'Isometric Views', weight: 25, score: 12, total: 12, feedback: 'Excellent precision.' },
      { name: 'Dimensioning', weight: 25, score: 11, total: 12, feedback: 'Minor leader line overlap on Part C.' },
      { name: 'Title Block & Standards', weight: 20, score: 10, total: 11 },
    ],
    instructions: [
      'Draw 3 mechanical assemblies using third-angle projection.',
      'Include isometric views for each assembly.',
      'Apply ASME Y14.5 dimensioning standards.',
      'Use proper title blocks, scale notation, and tolerance callouts.',
    ],
    deliverables: ['Drawing sheets (PDF, A2 size)', 'AutoCAD source files (.dwg)'],
  },
  {
    id: 'asgn-ia-1',
    courseId: 'IA',
    title: 'Assignment 1 – Sitemap Draft',
    description: 'Create a comprehensive sitemap for a medium-complexity website. Demonstrate information hierarchy and navigation structure.',
    dueDate: 'Nov 25, 2022',
    points: 20,
    status: 'graded',
    submittedDate: 'Nov 24, 2022',
    rubric: [
      { name: 'Hierarchy Depth', weight: 30, score: 1, total: 6, feedback: 'Too shallow — users would hit dead ends.' },
      { name: 'Navigation Coverage', weight: 30, score: 2, total: 6, feedback: 'Missing "Support" and "About" nodes.' },
      { name: 'Card Sort Integration', weight: 20, score: 0, total: 4, feedback: 'Card sorting data not referenced at all.' },
      { name: 'Visual Presentation', weight: 20, score: 2, total: 4 },
    ],
    instructions: [
      'Choose a website with 30+ pages to map.',
      'Conduct a card sorting exercise with at least 5 participants.',
      'Create a visual sitemap showing all pages, organized by card sort findings.',
      'Include at least 2-3 insights from the card sort in your rationale.',
    ],
    deliverables: ['Sitemap (PDF or FigJam link)', 'Card sort results summary', 'Written rationale (250 words)'],
  },
  {
    id: 'asgn-ce-3',
    courseId: 'CE',
    title: 'Essay 3 – Research Proposal',
    description: 'Write a formal research proposal on a design-related topic of your choice. Follow academic writing conventions and cite at least 8 sources.',
    dueDate: 'Dec 8, 2022',
    points: 100,
    status: 'graded',
    submittedDate: 'Dec 8, 2022',
    rubric: [
      { name: 'Thesis & Argument', weight: 25, score: 21, total: 25 },
      { name: 'Research Quality', weight: 25, score: 20, total: 25, feedback: 'Strong sources. Good mix of academic and industry.' },
      { name: 'Writing Quality', weight: 25, score: 20, total: 25, feedback: 'Minor comma splice issues.' },
      { name: 'Citations & Format', weight: 25, score: 21, total: 25 },
    ],
    instructions: [
      'Choose a design-related research topic.',
      'Write a 1500-2000 word research proposal following APA format.',
      'Include: introduction, literature review, methodology, and expected outcomes.',
      'Cite at least 8 credible sources.',
    ],
    deliverables: ['Research Proposal (Word or PDF)', 'Annotated bibliography'],
  },
]

// Helper to get assignment by ID
export function getAssignment(id: string) {
  return assignments.find(a => a.id === id)
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages: Message[] = [
  {
    id: 'msg1',
    senderName: 'Jaron Stewart',
    senderAbbr: 'JS',
    senderColor: '#F97316',
    subject: 'Feedback on Assignment 5 – Branded Design',
    preview: 'Hey Kevin, I\'ve reviewed your submission and left detailed comments...',
    body: `Hey Kevin,

I've reviewed your Branded Design submission and left detailed comments in the rubric, but I wanted to reach out directly as well.

Your logo mark is strong — the proportions are working and the colour palette feels intentional. Where you lost points was in the brand application section. The mockup layouts felt rushed and didn't demonstrate the brand system at scale. For the final project, I'd love to see you push the brand into more contexts: packaging, digital ads, signage.

Also, your type pairing (Neue Haas Grotesk + Freight Text) is a great choice — just make sure the weights are consistent across all touchpoints.

Book office hours if you want to talk through the feedback. I have slots open Thursday afternoon.

— Jaron`,
    time: '11:42 AM',
    date: 'Dec 8, 2022',
    isRead: false,
    isStarred: true,
    courseId: '2D',
    tag: 'assignment',
  },
  {
    id: 'msg2',
    senderName: 'A.J. Singh',
    senderAbbr: 'AJ',
    senderColor: '#EF4444',
    subject: 'Office Hours Reminder – IA Sitemap Revision',
    preview: 'Hi Kevin, just a reminder that office hours are tomorrow from 2–4 PM...',
    body: `Hi Kevin,

Just a reminder that office hours are tomorrow (Thursday) from 2–4 PM in room A209. Given the feedback on your Sitemap Draft, I'd strongly recommend attending so we can work through the structural issues together.

Key things to address before resubmission:
• Your top-level navigation is missing the "Support" and "About" nodes
• The depth of the course content hierarchy is too shallow — users would hit dead ends
• Card sorting data wasn't referenced — include at least 2–3 insights from the exercise

The revision window closes December 20th, so there's still time to improve the grade.

Looking forward to seeing you there.

— A.J.`,
    time: '9:15 AM',
    date: 'Dec 7, 2022',
    isRead: false,
    isStarred: false,
    courseId: 'IA',
    tag: 'office-hours',
  },
  {
    id: 'msg3',
    senderName: 'Michael Holland',
    senderAbbr: 'MH',
    senderColor: '#EC4899',
    subject: 'Re: Usability Test Report – Submission Format',
    preview: 'Hi, yes — PDF is preferred, but Figma prototypes can be linked...',
    body: `Hi Kevin,

Yes — PDF is the preferred format for the written report. For the prototype link, just include a view-only Figma URL in the document header. Make sure the prototype is accessible (check permissions before submitting).

For the report structure, use these headings:
1. Methodology
2. Participant Overview
3. Key Findings (with severity ratings)
4. Recommendations
5. Appendix (raw notes, recordings if applicable)

5 participants minimum. If you're having trouble recruiting, check the DesignLab Slack — there are usually students happy to do a quick session.

Good luck!
— Michael`,
    time: 'Dec 6',
    date: 'Dec 6, 2022',
    isRead: true,
    isStarred: false,
    courseId: 'IS',
    tag: 'assignment',
  },
  {
    id: 'msg4',
    senderName: 'GBC Academic Services',
    senderAbbr: 'GBC',
    senderColor: '#1B3F89',
    subject: 'Winter Break Schedule & January Return Dates',
    preview: 'Please note that George Brown College will be closed from December 24th...',
    body: `Dear Students,

Please note that George Brown College will be closed from December 24th, 2022 through January 2nd, 2023 for the winter break.

Classes resume on January 3rd, 2023. Your course schedules for the Winter 2023 semester are now available in Blackboard. Please review your timetable carefully for any room or time changes.

Financial aid and OSAP information for the winter semester will be emailed separately. If you have questions, contact the Registrar's Office at registrar@georgebrown.ca.

Happy holidays,
GBC Academic Services`,
    time: 'Dec 2',
    date: 'Dec 2, 2022',
    isRead: true,
    isStarred: false,
    tag: 'general',
  },
  {
    id: 'msg5',
    senderName: 'Xander Messi',
    senderAbbr: 'XM',
    senderColor: '#8B5CF6',
    subject: 'Campaign Layout – Graded',
    preview: 'Kevin, your Campaign Layout project has been graded. Score: 30/50...',
    body: `Kevin,

Your Campaign Layout project has been graded. Score: 30/50.

Your concept direction is solid and the visual language is consistent, which is good. The main issue is execution — the grid breaks in the digital banner sizes and the print version has inconsistent margins.

Also, the copy is placeholder text in two of the five mockups, which brought down the craft score significantly. All deliverables need to be final-quality, not works-in-progress.

I've attached detailed rubric comments. Use this feedback heading into the final project — you have the design eye, just need to slow down and finish strong.

— Xander`,
    time: 'Nov 30',
    date: 'Nov 30, 2022',
    isRead: true,
    isStarred: false,
    courseId: 'VD',
    tag: 'grade',
  },
]

// ─── User ─────────────────────────────────────────────────────────────────────

export const user = {
  displayName: 'Kevin H.',
  avatarColor: '#2563EB',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCourse(id: string) {
  return courses.find(c => c.id === id)!
}

export function getOverallGPA(): number {
  const total = grades.reduce((sum, g) => sum + g.percentage, 0)
  return Math.round(total / grades.length)
}
