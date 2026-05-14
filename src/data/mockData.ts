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
  officeHours?: string    // e.g. "Thu 2:00–4:00 PM, SFC A209 or by appointment"
  syllabus?: CourseSyllabus
  resources?: CourseResource[]  // Lecture slides, reference files, etc.
}

export interface RubricCriterion {
  name: string
  weight: number
  score?: number
  total: number
  feedback?: string
}

// A single message in the instructor/student feedback thread on an assignment
export interface FeedbackMessage {
  id: string
  author: string
  authorType: 'instructor' | 'student'
  authorInitials: string
  body: string
  date: string
}

// One file-submission attempt (students may submit multiple times)
export interface SubmissionAttempt {
  id: string
  submittedDate: string  // Human-readable: "Dec 18, 2022 at 11:42 PM"
  files: string[]        // File names submitted
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
  feedbackThread?: FeedbackMessage[]    // Instructor ↔ student comment thread
  previousSubmissions?: SubmissionAttempt[]  // Submission history log
}

// A single item in the notification centre
export interface Notification {
  id: string
  title: string
  body: string
  time: string          // Human-readable relative time: "2 hours ago", "Dec 5"
  timeGroup: 'today' | 'this-week' | 'earlier'
  type: 'grade' | 'assignment' | 'announcement' | 'resource'
  courseId?: string     // Optional — college-wide notifications have no course
  unread: boolean
  linkTo?: string       // Internal route for "View" action
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
  type: 'lecture' | 'assignment' | 'reading' | 'quiz' | 'video' | 'discussion'
}

export interface SyllabusWeight {
  category: string
  weight: number
  description?: string
}

export interface CourseSyllabus {
  weights: SyllabusWeight[]
  policies: string[]
}

export interface Announcement {
  id: string
  courseId: string
  title: string
  body: string
  date: string
  isPinned: boolean
  author: string
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: '2D', abbr: '2D', name: '2D Visualization', code: 'INTR 1001',
    instructor: 'Jaron Stewart', color: '#F97316',
    files: ['Brand Ideation.docx'],
    description: 'Foundational design principles applied to 2D visual communication. Covers typography, colour theory, brand identity, and layout across print and digital media.',
    credits: 3, schedule: 'Mon / Wed  9:00 AM – 11:00 AM', room: 'SFC B108',
    completion: 72, moduleCount: 13, completedModules: 10,
    lastActivity: '2 days ago',
    zoomLink: 'https://georgebrown.zoom.us/j/96271830412',
    officeHours: 'Mon 2:00–4:00 PM · SFC B108 (or by appointment)',
    syllabus: {
      weights: [
        { category: 'Assignments 1–5', weight: 50, description: 'Weekly studio assignments' },
        { category: 'Final Project', weight: 30, description: 'Full brand identity system' },
        { category: 'Critique Participation', weight: 20, description: 'In-class feedback and peer reviews' },
      ],
      policies: [
        'Late submissions lose 10% per calendar day',
        'Attendance required for all critique sessions',
        'Source files must be submitted alongside PDFs',
      ],
    },
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
    completion: 88, moduleCount: 15, completedModules: 13,
    lastActivity: 'Today',
    zoomLink: 'https://georgebrown.zoom.us/j/84512093761',
    officeHours: 'Wed 3:00–5:00 PM · Online via Zoom (book via email)',
    syllabus: {
      weights: [
        { category: 'Assignments (4)', weight: 40, description: 'Research, personas, flows, usability report' },
        { category: 'Projects (3)', weight: 45, description: 'Wireframe set, interactive prototype, final presentation' },
        { category: 'Participation', weight: 15, description: 'In-class critiques and discussion' },
      ],
      policies: [
        'Late work accepted up to 48 hours with a 15% penalty',
        'All Figma files must be shared as view-only links before submission',
        'Peer critique participation is mandatory — two absences maximum',
      ],
    },
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
    completion: 45, moduleCount: 11, completedModules: 5,
    lastActivity: '1 week ago',
    zoomLink: 'https://georgebrown.zoom.us/j/71038294651',
    officeHours: 'Thu 2:00–4:00 PM · SFC A209 (walk-ins welcome)',
    syllabus: {
      weights: [
        { category: 'Assignments (3)', weight: 60, description: 'Sitemap, card sort, navigation audit' },
        { category: 'Final Sitemap Project', weight: 30, description: 'Full IA deliverable with rationale' },
        { category: 'Participation', weight: 10, description: 'Workshop exercises and peer feedback' },
      ],
      policies: [
        'Late submissions accepted with 10% deduction per day (max 3 days)',
        'Card sort data must include minimum 5 participants',
        'All deliverables must be submitted as PDF or FigJam links',
      ],
    },
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
    completion: 60, moduleCount: 12, completedModules: 8,
    lastActivity: '3 days ago',
    zoomLink: 'https://georgebrown.zoom.us/j/93847201938',
    officeHours: 'Tue 11:00 AM–1:00 PM · SFC B110 (or by appointment)',
    syllabus: {
      weights: [
        { category: 'Assignments (3)', weight: 35, description: 'Typography poster, colour study, design audit' },
        { category: 'Projects (2)', weight: 50, description: 'Campaign layout and final design system' },
        { category: 'Participation', weight: 15, description: 'Critique sessions and peer feedback' },
      ],
      policies: [
        'No late work accepted without prior written approval',
        'All final files must include source files (.ai or .psd)',
        'Placeholder copy is not acceptable in any final submission',
      ],
    },
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
    completion: 80, moduleCount: 14, completedModules: 11,
    lastActivity: 'Yesterday',
    zoomLink: 'https://georgebrown.zoom.us/j/82910374652',
    officeHours: 'Mon & Wed 10:00–11:00 AM · SFC A105',
    syllabus: {
      weights: [
        { category: 'Essays (3)', weight: 75, description: 'Personal narrative, comparative analysis, research proposal' },
        { category: 'Workshop Participation', weight: 15, description: 'In-class writing exercises and peer workshops' },
        { category: 'Peer Reviews (2)', weight: 10, description: 'Written feedback on classmates\' drafts' },
      ],
      policies: [
        'Essays submitted after the deadline receive a letter-grade deduction per day',
        'Academic integrity policy strictly enforced — all essays run through Turnitin',
        'APA 7th edition format required for all citations',
      ],
    },
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
    completion: 97, moduleCount: 10, completedModules: 9,
    lastActivity: 'Today',
    zoomLink: 'https://georgebrown.zoom.us/j/77614829304',
    officeHours: 'Thu 12:00–1:00 PM · SFC C204 (or by appointment)',
    syllabus: {
      weights: [
        { category: 'Drawing Sets (3)', weight: 75, description: 'Basic drafting, orthographic views, mechanical parts' },
        { category: 'Final Drawing Submission', weight: 20, description: 'Complete assembly drawing package' },
        { category: 'In-Class Exercises', weight: 5, description: 'Weekly drawing drills and pin-ups' },
      ],
      policies: [
        'All drawings must meet ASME Y14.5 standards to receive full marks',
        'Late submissions accepted within 24 hours with a 20% deduction',
        'AutoCAD source files (.dwg) required alongside all PDF submissions',
      ],
    },
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
    { id: 'm2q', title: 'Quiz – Colour Theory Fundamentals', itemCount: 1, completed: true, type: 'quiz' },
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
    { id: 'm2q', title: 'Quiz – HCI Heuristics & Principles', itemCount: 1, completed: true, type: 'quiz' },
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
  'IA': [
    { id: 'm1', title: 'Week 1 – What Is Information Architecture?', itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm2', title: 'Week 2 – Mental Models & User Needs',         itemCount: 2, completed: true,  type: 'reading' },
    { id: 'm2q', title: 'Quiz – IA Foundations',                       itemCount: 1, completed: true,  type: 'quiz' },
    { id: 'm3', title: 'Week 3 – Card Sorting Methods',               itemCount: 4, completed: true,  type: 'video' },
    { id: 'm4', title: 'Assignment 1 – Sitemap Draft',                itemCount: 1, completed: true,  type: 'assignment' },
    { id: 'm5', title: 'Week 4 – Navigation Patterns',                itemCount: 3, completed: false, type: 'lecture' },
    { id: 'm6', title: 'Week 5 – Taxonomy & Labelling Systems',       itemCount: 3, completed: false, type: 'reading' },
    { id: 'm7', title: 'Discussion – Card Sort Findings Debrief',     itemCount: 1, completed: false, type: 'discussion' },
    { id: 'm8', title: 'Assignment 2 – Card Sorting Exercise',        itemCount: 2, completed: false, type: 'assignment' },
    { id: 'm9', title: 'Week 6 – Content Strategy & Metadata',        itemCount: 3, completed: false, type: 'lecture' },
    { id: 'm10', title: 'Final Sitemap Project',                      itemCount: 2, completed: false, type: 'assignment' },
  ],
  'VD': [
    { id: 'm1', title: 'Week 1 – Visual Principles & Composition',   itemCount: 4, completed: true,  type: 'lecture' },
    { id: 'm2', title: 'Week 2 – Grid Systems',                      itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm2q', title: 'Quiz – Visual Hierarchy & Grid Basics',      itemCount: 1, completed: true,  type: 'quiz' },
    { id: 'm3', title: 'Assignment 2 – Colour Theory Study',         itemCount: 1, completed: true,  type: 'assignment' },
    { id: 'm4', title: 'Week 3 – Typography in Visual Design',       itemCount: 3, completed: true,  type: 'reading' },
    { id: 'm5', title: 'Assignment 3 – Typography Poster',           itemCount: 1, completed: true,  type: 'assignment' },
    { id: 'm6', title: 'Week 4 – Design Systems & Component Logic',  itemCount: 4, completed: true,  type: 'lecture' },
    { id: 'm7', title: 'Design Audit Video – Industry Examples',     itemCount: 2, completed: true,  type: 'video' },
    { id: 'm8', title: 'Project 2 – Campaign Layout',                itemCount: 3, completed: true,  type: 'assignment' },
    { id: 'm9', title: 'Week 5 – Motion & Transition Principles',    itemCount: 3, completed: false, type: 'lecture' },
    { id: 'm10', title: 'Discussion – Campaign Critique',            itemCount: 1, completed: false, type: 'discussion' },
    { id: 'm11', title: 'Final Design System Project',               itemCount: 2, completed: false, type: 'assignment' },
  ],
  'CE': [
    { id: 'm1',  title: 'Week 1 – Academic Writing Fundamentals',    itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm2',  title: 'Week 2 – Paragraph Structure & Argument',   itemCount: 2, completed: true,  type: 'reading' },
    { id: 'm3',  title: 'Essay 1 – Personal Narrative',              itemCount: 1, completed: true,  type: 'assignment' },
    { id: 'm4',  title: 'Week 3 – Research Skills & Source Eval',    itemCount: 4, completed: true,  type: 'lecture' },
    { id: 'm5',  title: 'Workshop – Peer Review Process',            itemCount: 1, completed: true,  type: 'discussion' },
    { id: 'm6',  title: 'Week 4 – APA Citations & Formatting',       itemCount: 3, completed: true,  type: 'video' },
    { id: 'm6q', title: 'Quiz – APA 7th Edition Citation Format',    itemCount: 1, completed: true,  type: 'quiz' },
    { id: 'm7',  title: 'Essay 2 – Comparative Analysis',            itemCount: 1, completed: true,  type: 'assignment' },
    { id: 'm8',  title: 'Week 5 – Writing for Design Portfolios',    itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm9',  title: 'Week 6 – Research Proposals',               itemCount: 4, completed: true,  type: 'lecture' },
    { id: 'm10', title: 'Peer Review 2 – Research Proposal Drafts',  itemCount: 1, completed: true,  type: 'discussion' },
    { id: 'm11', title: 'Essay 3 – Research Proposal',               itemCount: 1, completed: false, type: 'assignment' },
    { id: 'm12', title: 'Week 7 – Revision Strategies',              itemCount: 3, completed: false, type: 'reading' },
    { id: 'm13', title: 'Final Portfolio Writing Workshop',           itemCount: 2, completed: false, type: 'discussion' },
  ],
  'TD': [
    { id: 'm1', title: 'Week 1 – Drawing Standards & Title Blocks',  itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm2', title: 'Week 2 – Orthographic Projection',           itemCount: 4, completed: true,  type: 'lecture' },
    { id: 'm3', title: 'Drawing Set 1 – Basic Drafting',             itemCount: 2, completed: true,  type: 'assignment' },
    { id: 'm4', title: 'Week 3 – Dimensioning & Tolerancing',        itemCount: 3, completed: true,  type: 'reading' },
    { id: 'm5', title: 'ASME Standards Video Reference',             itemCount: 1, completed: true,  type: 'video' },
    { id: 'm5q', title: 'Quiz – ASME Standards & Title Block Rules',  itemCount: 1, completed: true,  type: 'quiz' },
    { id: 'm6', title: 'Drawing Set 2 – Orthographic Views',         itemCount: 2, completed: true,  type: 'assignment' },
    { id: 'm7', title: 'Week 4 – Isometric & Sectional Views',       itemCount: 3, completed: true,  type: 'lecture' },
    { id: 'm8', title: 'Drawing Set 3 – Mechanical Parts',           itemCount: 2, completed: true,  type: 'assignment' },
    { id: 'm9', title: 'Final Drawing Submission',                   itemCount: 2, completed: false, type: 'assignment' },
  ],
}

// ─── Course Announcements ─────────────────────────────────────────────────────
// Pinned announcements appear first; recent announcements follow.
// Used by the CoursePage Announcements section.

export const courseAnnouncements: Announcement[] = [
  // 2D Visualization
  {
    id: 'ann-2d-1', courseId: '2D', isPinned: true,
    author: 'Jaron Stewart', date: 'Dec 1, 2022',
    title: 'Final Project Brief is Live',
    body: 'The final project brief is now posted on the course page. You will be designing a complete brand identity system — logo, type system, colour palette, and a one-page brand guide — for a fictional startup of your choice. Start early; this is 30% of your grade. Submission due January 10th.',
  },
  {
    id: 'ann-2d-2', courseId: '2D', isPinned: false,
    author: 'Jaron Stewart', date: 'Dec 12, 2022',
    title: 'In-Class Logo Critique – Wednesday Dec 14',
    body: 'We\'ll be running a round-robin logo critique this Wednesday. Bring your logo at three iterations minimum — printed or displayed on your laptop. Come ready to give and receive specific, actionable feedback.',
  },
  // Interactive Systems
  {
    id: 'ann-is-1', courseId: 'IS', isPinned: true,
    author: 'Michael Holland', date: 'Dec 5, 2022',
    title: 'Final Presentations – January 5th',
    body: 'Final presentations begin Thursday, January 5th. Each student has 8 minutes to present their interactive prototype and key usability findings, followed by 4 minutes of Q&A. Presentation order will be posted one week in advance. Attendance is mandatory for the full session.',
  },
  {
    id: 'ann-is-2', courseId: 'IS', isPinned: false,
    author: 'Michael Holland', date: 'Dec 13, 2022',
    title: 'Project 3 Feedback Posted in Figma',
    body: 'I\'ve added inline comments to everyone\'s Project 3 Figma files. Review the feedback before your final presentation — several recurring issues around error states and loading behaviour that should be addressed if time permits.',
  },
  // Information Architecture
  {
    id: 'ann-ia-1', courseId: 'IA', isPinned: true,
    author: 'A.J. Singh', date: 'Nov 28, 2022',
    title: 'Grades Posted – Assignment 1 Sitemap Draft',
    body: 'Grades for Assignment 1 are now available. Several submissions were missing secondary navigation levels and card sort references. If your grade is below 50%, please book office hours before submitting Assignment 2. The revision window for Assignment 1 closes December 20th.',
  },
  {
    id: 'ann-ia-2', courseId: 'IA', isPinned: false,
    author: 'A.J. Singh', date: 'Dec 9, 2022',
    title: 'Final Sitemap – Clarification on Depth Requirements',
    body: 'A few questions came in about the final sitemap depth. Your IA should include at minimum three levels (primary, secondary, tertiary). All utility pages (Login, 404, Search Results) must appear as nodes. Include a brief written rationale alongside the visual sitemap.',
  },
  // Visual Design
  {
    id: 'ann-vd-1', courseId: 'VD', isPinned: true,
    author: 'Xander Messi', date: 'Dec 1, 2022',
    title: 'Campaign Layout Rubric Feedback Available',
    body: 'Detailed rubric comments for Project 2 are now attached to your submissions. Key takeaways across the class: (1) grid consistency is critical across formats, (2) all copy must be final before submission, (3) print and digital margins are different — check your specs. Use this feedback for the final project.',
  },
  {
    id: 'ann-vd-2', courseId: 'VD', isPinned: false,
    author: 'Xander Messi', date: 'Dec 10, 2022',
    title: 'User Manual Revision Due Friday Dec 16',
    body: 'The User Manual Revision is due this Friday at 11:59 PM. This is your last graded deliverable before the final. Include a brief design rationale (150–200 words) explaining your layout and typographic choices.',
  },
  // College English
  {
    id: 'ann-ce-1', courseId: 'CE', isPinned: true,
    author: 'Erik Brown', date: 'Dec 6, 2022',
    title: 'Voluntary APA Workshop – Friday Dec 16, SFC A105',
    body: 'I\'m running a voluntary APA 7th edition workshop this Friday from 11 AM – 12:30 PM in SFC A105. We\'ll work through citation formats, in-text references, and reference list formatting. Attendance is optional but strongly recommended if you lost marks on citations in Essay 2. Pizza provided.',
  },
  {
    id: 'ann-ce-2', courseId: 'CE', isPinned: false,
    author: 'Erik Brown', date: 'Dec 8, 2022',
    title: 'Week 13 Lecture Notes Posted',
    body: 'Lecture notes from today\'s session on revision strategies are now in the Resources tab. Key topics: comma splices, run-on sentences, and thesis statement sharpening. These are common issues in Essay 2 — apply these fixes in your Research Proposal.',
  },
  // Technical Drawing
  {
    id: 'ann-td-1', courseId: 'TD', isPinned: true,
    author: 'David Kim', date: 'Dec 14, 2022',
    title: 'Drawing Set 3 Graded – Strong Semester!',
    body: 'Drawing Set 3 grades are released. The class average was 45.5/50 — well done. A few notes: watch leader line overlaps on complex assemblies (Part C was a common issue), and confirm your title block is fully populated. See you Thursday for the final submission guidelines.',
  },
  {
    id: 'ann-td-2', courseId: 'TD', isPinned: false,
    author: 'David Kim', date: 'Dec 12, 2022',
    title: 'Final Drawing Submission – Format Requirements',
    body: 'The final drawing package must include: (1) PDF export at A2 paper size, (2) AutoCAD source files (.dwg), and (3) a completed title block with your name, student ID, scale, and date. Submit both files together in a single ZIP. Due date: January 12th, 2023.',
  },
]

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

// Due dates are all after the demo "today" of Dec 14, 2022 so the deadline
// timeline and Due Soon widget show upcoming (not past) items.
export const dueSoon: DueItem[] = [
  { id: 'ds1', courseId: 'IS', title: 'Final Presentation',  dueDay: 'THURSDAY, DEC 15TH',  type: 'assignment', assignmentId: 'asgn-is-5' },
  { id: 'ds2', courseId: 'VD', title: 'User Manual Revision', dueDay: 'FRIDAY, DEC 16TH',    type: 'assignment', assignmentId: 'asgn-vd-3' },
  { id: 'ds3', courseId: 'IA', title: 'Final Sitemap',        dueDay: 'TUESDAY, DEC 20TH',   type: 'project',    assignmentId: 'asgn-ia-2' },
  { id: 'ds4', courseId: '2D', title: 'Final Project Brief',  dueDay: 'WEDNESDAY, DEC 21ST', type: 'assignment', assignmentId: 'asgn-2d-6' },
]

// ─── Activity Stream ───────────────────────────────────────────────────────────

export const activityItems: ActivityItem[] = [
  {
    id: 'a1', courseId: 'CE', title: 'Lecture Notes Posted',
    date: '8th – 10th Dec 2022', timeRange: '8 AM – 9 AM', type: 'resource',
    body: 'Erik Brown has posted the Week 13 lecture notes covering comma splices, run-on sentences, and thesis statement revision strategies. Review before Tuesday\'s workshop session.',
  },
  {
    id: 'a2', courseId: 'IS', title: 'Assignment Posted: Usability Test Report',
    date: '13th Dec 2022', timeRange: '8 AM – 9 AM', type: 'assignment',
    body: 'A new assignment has been posted for Interactive Systems. Complete a 5-participant usability test of your mid-fi prototype and submit a written report (min. 600 words). Due: December 20th at 11:59 PM.',
    linkTo: '/courses/IS/assignments/asgn-is-4',
  },
  {
    id: 'a3', courseId: 'TD', title: 'Grade Released: Drawing Set 3',
    date: '12th Dec 2022', timeRange: '8 AM – 9 AM', type: 'grade',
    body: 'Your grade for Drawing Set 3 (Mechanical Parts) has been released. You scored 48 out of 50. Excellent drafting precision on the isometric views. See instructor comments attached to your submission.',
    linkTo: '/courses/TD/assignments/asgn-td-3',
  },
  {
    id: 'a4', courseId: '2D', title: 'Announcement: Final Project Brief',
    date: '1st Dec 2022', timeRange: '10 AM – 1 PM', type: 'announcement',
    body: 'The final project brief is now live on the course page. You will be designing a full brand identity system for a fictional startup. Deliverables include logo, colour palette, type system, and a one-page brand guide. Submission due January 10th.',
    linkTo: '/courses/2D',
  },
  {
    id: 'a5', courseId: 'VD', title: 'New Resource: Campaign Layout Examples',
    date: '11th Dec 2022', timeRange: '2 PM – 3 PM', type: 'resource',
    body: 'Xander has shared a curated gallery of campaign layout examples from Behance. Review the visual hierarchy techniques used across the examples and bring notes to the next critique session.',
  },
  {
    id: 'a6', courseId: 'IA', title: 'Grade Released: Sitemap Draft',
    date: '3rd Dec 2022', timeRange: '9 AM – 10 AM', type: 'grade',
    body: 'Your grade for Assignment 1 – Sitemap Draft has been posted. Score: 5/20. Please review the feedback carefully and book office hours with A.J. before the next submission.',
    linkTo: '/courses/IA/assignments/asgn-ia-1',
  },
  {
    id: 'a7', courseId: 'CE', title: 'Grade Released: Research Proposal',
    date: '14th Dec 2022', timeRange: '10 AM – 11 AM', type: 'grade',
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
  // Includes school admin notices AND campus events like competitions, seminars, career fairs.

  {
    id: 'a10', title: 'OSAP Deadline Reminder',
    date: '5th Dec 2022', timeRange: '9 AM – 10 AM', type: 'announcement',
    body: 'Reminder from the Financial Aid Office: the deadline to submit your OSAP application for the Winter 2023 semester is December 15th, 2022. Log in to your Ontario.ca account to check your status and upload any outstanding documentation. Late applications cannot be guaranteed funding.',
  },
  {
    id: 'a11', title: 'Campus Closure – Holiday Break',
    date: '9th Dec 2022', timeRange: '8 AM – 9 AM', type: 'announcement',
    body: 'George Brown College will be closed for the holiday break from December 23rd, 2022 through January 8th, 2023. All campus facilities, libraries, and student services will be unavailable during this period. Classes resume Monday, January 9th. Have a safe and restful holiday.',
  },
  {
    id: 'a12', title: 'Spring Graduation Registration Now Open',
    date: '11th Dec 2022', timeRange: '10 AM – 11 AM', type: 'announcement',
    body: 'Eligible students in their final semester are invited to register for the Spring 2023 Convocation ceremony. Log in to STU-VIEW and complete the graduation application by January 31st, 2023. For questions about eligibility, contact the Office of the Registrar at registrar@georgebrown.ca.',
  },
  {
    id: 'a13', title: 'Library Extended Hours – Exam Season',
    date: '6th Dec 2022', timeRange: '7 AM – 8 AM', type: 'announcement',
    body: 'The St. James Campus Library will be open extended hours during the December exam period: Monday–Friday 7 AM – 11 PM, Saturday–Sunday 9 AM – 9 PM. Quiet study rooms can be booked through the library portal up to 48 hours in advance.',
  },
  {
    id: 'a14', title: 'GBC Design Hackathon 2023 – Registration Open',
    date: '13th Dec 2022', timeRange: '12 PM – 1 PM', type: 'announcement',
    body: 'George Brown\'s annual 48-hour Design Hackathon returns January 20–22, 2023. Teams of 2–4 students tackle a real brief from a local non-profit partner. Prizes include industry mentorship, portfolio features, and $500 in design software credits. Register by January 10th via the Student Life portal. All programs welcome.',
  },
  {
    id: 'a15', title: 'Winter Career Fair – On-Campus Recruiting',
    date: '10th Dec 2022', timeRange: '9 AM – 10 AM', type: 'announcement',
    body: 'The Winter 2023 Career Fair will be held February 2nd in the Student Centre Atrium, 10 AM – 4 PM. Over 40 design, tech, and media studios will be recruiting for co-op, internship, and full-time positions. Bring printed portfolios and business cards. Register at georgebrown.ca/careerfair to receive a pre-event studio list.',
  },
  {
    id: 'a16', title: 'UX Research Seminar Series – Session 2',
    date: '7th Dec 2022', timeRange: '3 PM – 4 PM', type: 'announcement',
    body: 'The Centre for Arts, Design & Information Technology is hosting its second UX Research Seminar on January 18th, 5:30–7:30 PM in room D301. Guest speaker: Maya Osei, Senior UX Researcher at Shopify, presenting "Mixed Methods in Practice: When to Qual, When to Quant." Free for all GBC students. RSVP via Eventbrite.',
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
    previousSubmissions: [
      { id: 'sub-2d5-1', submittedDate: 'Dec 18, 2022 at 11:42 PM', files: ['BrandedDesign-Final.pdf', 'Source-Files.zip'] },
    ],
    feedbackThread: [
      { id: 'f1', author: 'Jaron Stewart', authorType: 'instructor', authorInitials: 'JS', date: 'Dec 19', body: 'Good work overall, Kevin. The logo mark is holding up well — the proportions are solid and the palette feels considered. The main drag on your score was the application section. The mockup layouts looked like first passes rather than finished pieces, and the missing written rationale took your concept criterion from a 4 to a 2. Going into the final project, the rationale carries even more weight, so don\'t skip it.' },
      { id: 'f2', author: 'Kevin H.',      authorType: 'student',    authorInitials: 'KH', date: 'Dec 19', body: 'Thanks Jaron, really helpful. Is there any chance I can resubmit the rationale document for partial credit on the concept criterion, or is the grade locked at this point?' },
      { id: 'f3', author: 'Jaron Stewart', authorType: 'instructor', authorInitials: 'JS', date: 'Dec 20', body: 'Grade\'s locked — that\'s the policy for completed submissions, and I need to be consistent across the class. That said, the feedback stands and I\'d rather you take it into the final than stress about this one. Book office hours if you want to talk through where to take the brand before you build out the final applications.' },
    ],
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
    previousSubmissions: [
      { id: 'sub-is4-1', submittedDate: 'Dec 19, 2022 at 10:15 PM', files: ['Usability-Test-Report.pdf', 'Test-Script.pdf'] },
    ],
    feedbackThread: [
      { id: 'f1', author: 'Michael Holland', authorType: 'instructor', authorInitials: 'MH', date: 'Dec 20', body: 'Solid report overall — methodology section is clean, your task scenarios were realistic, and the severity ratings show you understand triage. The gap that cost you the most was depth in Key Findings. Sessions 3 and 4 surfaced some interesting edge cases around the form validation flow that didn\'t make it into the report. As a rule: if a participant struggled with something twice, it\'s a finding. Also tighten up the recommendations section before the final — a few run-on sentences in there.' },
      { id: 'f2', author: 'Kevin H.',        authorType: 'student',    authorInitials: 'KH', date: 'Dec 21', body: 'That makes sense — I remember those moments in sessions 3 and 4 but wasn\'t sure if they were significant enough to include. Good to know the threshold. I\'ll be more aggressive about capturing edge cases in the final round and will proofread the recommendations before submitting. Thanks!' },
    ],
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
    feedbackThread: [
      { id: 'f1', author: 'A.J. Singh', authorType: 'instructor', authorInitials: 'AJ', date: 'Nov 28', body: 'Kevin, I want to give you honest feedback here: this sitemap needs significant revision before it reflects a workable IA. The top-level navigation is missing core nodes — Support and About aren\'t there at all — and the depth doesn\'t go past two levels in most branches, which means users would dead-end on important content. The bigger concern is that the card sort data you collected doesn\'t appear anywhere in the map or the rationale. Card sorting should be driving your groupings, not just sitting in a spreadsheet. Please book office hours before Assignment 2 so we can work through this together.' },
      { id: 'f2', author: 'Kevin H.', authorType: 'student', authorInitials: 'KH', date: 'Nov 29', body: 'Hi A.J., I\'ve booked the Thursday 2 PM slot. I\'ll be honest — I wasn\'t sure how to translate the card sort clusters into the sitemap structure. Is there anything I should read or review beforehand so I come in prepared?' },
      { id: 'f3', author: 'A.J. Singh', authorType: 'instructor', authorInitials: 'AJ', date: 'Nov 29', body: 'Good that you booked in. Read chapters 4 and 5 of Rosenfeld & Morville — specifically the section on navigation systems and the three-level rule. And if you can, bring a rough revised hierarchy on paper or in FigJam. Even a messy draft gives us something concrete to work from.' },
    ],
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

  // ── Upcoming assignments (status: 'upcoming') ────────────────────────────────
  // These power the dashboard "Due Soon" widget AND the Grades page "Priority
  // Assignments" panel (largest-weight upcoming work where the student's grade
  // has the most room to climb). Mirrors entries in the `dueSoon` array.
  {
    id: 'asgn-is-5',
    courseId: 'IS',
    title: 'Final Presentation',
    description: '8-minute live presentation of your interactive prototype, research findings, and usability outcomes.',
    dueDate: 'Dec 15, 2022',
    points: 80,
    status: 'upcoming',
    rubric: [
      { name: 'Presentation Quality', weight: 30, total: 30 },
      { name: 'Prototype Demonstration', weight: 30, total: 30 },
      { name: 'Research Insights', weight: 20, total: 20 },
      { name: 'Q&A Handling', weight: 20, total: 20 },
    ],
    instructions: [
      'Prepare 8 minutes of slides — strict cap, no extensions.',
      'Include a live walkthrough of your interactive Figma prototype.',
      'Summarise your top 3 usability findings and how they shaped iteration.',
      'Budget 2 minutes for Q&A at the end.',
    ],
    deliverables: ['Slide deck (PDF)', 'Figma prototype view-only link'],
  },
  {
    id: 'asgn-vd-3',
    courseId: 'VD',
    title: 'User Manual Revision',
    description: 'Revise and resubmit your user manual project applying the feedback from the first review round.',
    dueDate: 'Dec 16, 2022',
    points: 40,
    status: 'upcoming',
    rubric: [
      { name: 'Application of Feedback', weight: 40, total: 40 },
      { name: 'Visual Consistency', weight: 30, total: 30 },
      { name: 'Information Hierarchy', weight: 30, total: 30 },
    ],
    instructions: [
      'Re-read the rubric feedback from your first submission.',
      'Address every flagged issue in the rewrite.',
      'Submit a written change log alongside the new PDF.',
    ],
    deliverables: ['Revised User Manual (PDF)', 'Change log (1 page)'],
  },
  {
    id: 'asgn-ia-2',
    courseId: 'IA',
    title: 'Final Sitemap Project',
    description: 'Complete IA deliverable: full sitemap, taxonomy, navigation rationale, and grounded research notes.',
    dueDate: 'Dec 20, 2022',
    points: 100,
    status: 'upcoming',
    rubric: [
      { name: 'Sitemap Structure', weight: 30, total: 30 },
      { name: 'Taxonomy & Labelling', weight: 25, total: 25 },
      { name: 'Research Integration', weight: 25, total: 25 },
      { name: 'Rationale Writing', weight: 20, total: 20 },
    ],
    instructions: [
      'Build a complete sitemap covering at least 4 hierarchy levels.',
      'Reference your card sort data in the labelling decisions.',
      'Write a 500-word rationale defending key structural choices.',
      'Submit as a FigJam link or annotated PDF.',
    ],
    deliverables: ['Sitemap (FigJam or PDF)', 'Written rationale (500 words)'],
  },
  {
    id: 'asgn-2d-6',
    courseId: '2D',
    title: 'Final Project Brief',
    description: 'Kickoff submission for the final brand identity project — logo direction, palette, type system.',
    dueDate: 'Dec 21, 2022',
    points: 30,
    status: 'upcoming',
    rubric: [
      { name: 'Concept Direction', weight: 40, total: 40 },
      { name: 'Brand Strategy', weight: 30, total: 30 },
      { name: 'Visual Exploration', weight: 30, total: 30 },
    ],
    instructions: [
      'Pick a fictional startup from the brief deck.',
      'Submit 2-3 concept directions with rationale (~300 words each).',
      'Include initial logo sketches and a draft type/colour palette.',
    ],
    deliverables: ['Concept document (PDF)', 'Sketch board (Figma link)'],
  },
]

// Helper to get assignment by ID
export function getAssignment(id: string) {
  return assignments.find(a => a.id === id)
}

// ─── Notifications ────────────────────────────────────────────────────────────
// Grouped by recency so the Notifications page can render Today / This Week / Earlier.
// The TopBar dropdown also reads from this array for the unread badge count.

export const notifications: Notification[] = [
  // ── Today ──
  { id: 'n1', title: 'Assignment 5 – Branded Design graded', body: 'Your grade has been posted. Score: 18/25 (72%). Review the rubric feedback from Jaron Stewart.', time: '2 hours ago', timeGroup: 'today', type: 'grade', courseId: '2D', unread: true, linkTo: '/courses/2D/assignments/asgn-2d-5' },
  { id: 'n2', title: 'New resource: Figma Prototyping Starter Kit', body: 'Michael Holland posted a new resource to Interactive Systems. Download it from the course page.', time: '5 hours ago', timeGroup: 'today', type: 'resource', courseId: 'IS', unread: true, linkTo: '/courses/IS' },
  // ── This Week ──
  { id: 'n3', title: 'Reminder: Final Presentation due tomorrow', body: 'Your Interactive Systems Final Presentation is due Dec 15. Slides must be shared as a view-only Figma link by 11:59 PM.', time: 'Yesterday at 3 PM', timeGroup: 'this-week', type: 'assignment', courseId: 'IS', unread: false, linkTo: '/courses/IS' },
  { id: 'n4', title: 'Drawing Set 3 graded — 48/50', body: 'David Kim has released your grade for Drawing Set 3 – Mechanical Parts. Excellent drafting precision!', time: '2 days ago', timeGroup: 'this-week', type: 'grade', courseId: 'TD', unread: false, linkTo: '/courses/TD/assignments/asgn-td-3' },
  { id: 'n5', title: 'OSAP deadline approaching', body: 'Your OSAP application deadline for Winter 2023 is December 15th. Log in to Ontario.ca to check your status.', time: '3 days ago', timeGroup: 'this-week', type: 'announcement', unread: false },
  // ── Earlier ──
  { id: 'n6', title: 'Assignment 4 – Style Guide: Perfect Score!', body: 'Jaron Stewart graded your Style Guide — 20/20. Excellent layout and professional presentation.', time: 'Dec 5', timeGroup: 'earlier', type: 'grade', courseId: '2D', unread: false, linkTo: '/courses/2D/assignments/asgn-2d-4' },
  { id: 'n7', title: 'Assignment Posted: Usability Test Report', body: 'A new assignment has been posted in Interactive Systems. Due: December 20th.', time: 'Dec 4', timeGroup: 'earlier', type: 'assignment', courseId: 'IS', unread: false, linkTo: '/courses/IS/assignments/asgn-is-4' },
  { id: 'n8', title: 'Sitemap Draft graded — 5/20', body: 'A.J. Singh has released your grade for Assignment 1 – Sitemap Draft. Please book office hours before the next submission.', time: 'Dec 3', timeGroup: 'earlier', type: 'grade', courseId: 'IA', unread: false, linkTo: '/courses/IA/assignments/asgn-ia-1' },
]

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

Please note that George Brown College will be closed from December 23rd, 2022 through January 8th, 2023 for the winter break.

Classes resume on Monday, January 9th, 2023. Your course schedules for the Winter 2023 semester are now available in Blackboard. Please review your timetable carefully for any room or time changes.

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

// ─── Semester registry ────────────────────────────────────────────────────────
// Used by the Grades page for prev/next term navigation.

export interface SemesterInfo {
  id: string
  label: string
  isCurrent: boolean
}

export const semesters: SemesterInfo[] = [
  { id: 'winter-2022', label: 'Winter 2022', isCurrent: false },
  { id: 'fall-2022',   label: 'Fall 2022',   isCurrent: true  },
]

// ─── Winter 2022 courses ──────────────────────────────────────────────────────
// Kevin's Year 1 Semester 2 courses (Jan – Apr 2022), before the current term.
// Intentionally lighter structure than Course — no modules, assignments, or zoom.

export interface PastCourse {
  id: string
  abbr: string
  name: string
  code: string
  instructor: string
  color: string
  credits: number
  description: string
}

export const winterCourses: PastCourse[] = [
  {
    id: 'DT', abbr: 'DT', name: 'Design Thinking', code: 'DSGN 1001',
    instructor: 'Maria Okonkwo', color: '#D97706', credits: 3,
    description: 'Human-centred design methodology covering empathy mapping, ideation, rapid prototyping, and iterative testing. Students ship a tested prototype by end of term.',
  },
  {
    id: 'UR', abbr: 'UR', name: 'UX Research Foundations', code: 'INTR 1001',
    instructor: 'Carlos Reyes', color: '#4338CA', credits: 3,
    description: 'Core qualitative and quantitative research methods: user interviews, surveys, diary studies, affinity diagramming, and usability testing with real participants.',
  },
  {
    id: 'WF', abbr: 'WF', name: 'Web Fundamentals', code: 'COMP 1002',
    instructor: 'Priya Nair', color: '#0D9488', credits: 3,
    description: 'Semantic HTML, CSS layout (flexbox, grid), responsive design, and introductory JavaScript. Students build and publish a personal portfolio site by Week 12.',
  },
  {
    id: 'SF', abbr: 'SF', name: 'Studio Foundation', code: 'DSGN 1002',
    instructor: 'James Webb', color: '#BE185D', credits: 2,
    description: 'Traditional drawing, perspective, composition, and material exploration. Develops observational skills and a critical visual vocabulary through weekly studio work.',
  },
]

// ─── Winter 2022 grades ───────────────────────────────────────────────────────
// Uses the same CourseGrade/GradeMark shape as Fall 2022 grades.
// IDs reference winterCourses, not the active courses array.

export const winterGrades: CourseGrade[] = [
  {
    courseId: 'DT', percentage: 83,
    marks: [
      { name: 'Assignment 1 – Concept Sketches',   score: 21,  total: 25  },
      { name: 'Midterm – Process Documentation',   score: 37,  total: 45  },
      { name: 'Final – Working Prototype',         score: 67,  total: 80  },
    ],
  },
  {
    courseId: 'UR', percentage: 91,
    marks: [
      { name: 'User Interview Assignment',         score: 27,  total: 30  },
      { name: 'Affinity Diagram Lab',              score: 18,  total: 20  },
      { name: 'Usability Test Report',             score: 64,  total: 70  },
    ],
  },
  {
    courseId: 'WF', percentage: 74,
    marks: [
      { name: 'HTML/CSS Lab 1',                    score: 15,  total: 20  },
      { name: 'Responsive Layout Project',         score: 33,  total: 45  },
      { name: 'Final Portfolio Site',              score: 26,  total: 35  },
    ],
  },
  {
    courseId: 'SF', percentage: 88,
    marks: [
      { name: 'Life Drawing Series',               score: 21,  total: 25  },
      { name: 'Material Exploration',              score: 39,  total: 45  },
      { name: 'Process Journal',                   score: 50,  total: 55  },
    ],
  },
]

// ─── Discussion threads ───────────────────────────────────────────────────────
// Backs the Communities page. courseId: null = college-wide board.

export interface DiscussionThread {
  id: string
  courseId: string | null
  title: string
  preview: string
  author: string
  authorType: 'student' | 'instructor' | 'college'
  date: string
  replyCount: number
  isPinned: boolean
  isRead: boolean
  tag: 'question' | 'discussion' | 'announcement' | 'resource'
}

export const discussionThreads: DiscussionThread[] = [
  // 2D Visualization
  {
    id: 'dt1', courseId: '2D', isPinned: true, isRead: true, replyCount: 5, date: 'Dec 1',
    title: 'Final Project Brief – Updated Rubric Posted',
    preview: "Hi everyone — I've updated the final project rubric to clarify the \"brand application\" criteria. Please re-read Section 3 before you finalize your mockups.",
    author: 'Jaron Stewart', authorType: 'instructor', tag: 'announcement',
  },
  {
    id: 'dt2', courseId: '2D', isPinned: false, isRead: false, replyCount: 8, date: 'Dec 9',
    title: 'My logo iteration 4 — feedback welcome!',
    preview: 'Posted my latest logo revision in the shared Figma. I\'m torn between the wordmark and the icon-only version. What do you all think for the brand application section?',
    author: 'Aisha M.', authorType: 'student', tag: 'discussion',
  },
  // Interactive Systems
  {
    id: 'dt3', courseId: 'IS', isPinned: true, isRead: true, replyCount: 12, date: 'Dec 5',
    title: 'Usability Test Participants Needed – Sign Up Here',
    preview: 'I need 5 participants for my usability test this week. Sessions are 20 min via Zoom. All feedback is confidential. Reply below or DM me to book a slot.',
    author: 'Michael Holland', authorType: 'instructor', tag: 'resource',
  },
  {
    id: 'dt4', courseId: 'IS', isPinned: false, isRead: false, replyCount: 15, date: 'Dec 10',
    title: 'Figma vs. Adobe XD for prototyping — which do you prefer?',
    preview: 'Starting the interactive prototype for Assignment 4 and debating which tool to use. Our course uses Figma but my placement employer uses XD. Pros/cons?',
    author: 'Dante R.', authorType: 'student', tag: 'question',
  },
  // Information Architecture
  {
    id: 'dt5', courseId: 'IA', isPinned: false, isRead: true, replyCount: 4, date: 'Dec 7',
    title: 'Card sort results — am I reading these right?',
    preview: 'Used OptimalSort for the card sort exercise and the dendrogram is confusing me. Three clusters seem right but the "Support" category keeps splitting. Anyone else see this?',
    author: 'Priya S.', authorType: 'student', tag: 'question',
  },
  // Visual Design
  {
    id: 'dt6', courseId: 'VD', isPinned: false, isRead: false, replyCount: 6, date: 'Dec 8',
    title: 'Campaign concept direction — thoughts?',
    preview: 'Going with a brutalist editorial aesthetic for the campaign. Very high contrast, bold type, intentional misalignment. Worried it might be too niche — would love critique.',
    author: 'Lena K.', authorType: 'student', tag: 'discussion',
  },
  // College English
  {
    id: 'dt7', courseId: 'CE', isPinned: true, isRead: true, replyCount: 3, date: 'Dec 6',
    title: 'APA Citation Workshop — Friday Dec 16, SFC A105',
    preview: 'Voluntary workshop to run through APA 7th edition rules before the Research Proposal deadline. Pizza provided. Attendance optional but highly recommended.',
    author: 'Erik Brown', authorType: 'instructor', tag: 'announcement',
  },
  // Technical Drawing
  {
    id: 'dt8', courseId: 'TD', isPinned: false, isRead: false, replyCount: 9, date: 'Dec 11',
    title: 'AutoCAD keeps crashing on Mac — anyone else?',
    preview: 'AutoCAD 2023 crashes every time I try to hatch a region. Running macOS Ventura. I\'ve tried reinstalling but same issue. Is anyone else on Mac having this problem?',
    author: 'Omar J.', authorType: 'student', tag: 'question',
  },
  // College-wide
  {
    id: 'dt9', courseId: null, isPinned: true, isRead: true, replyCount: 22, date: 'Dec 3',
    title: 'Hackathon @ The Forge — Find your team here!',
    preview: 'GBC Hackathon is Jan 14–15. 36 hours, cross-disciplinary teams of 3–5. Designers especially needed. Post your skills and availability below to find teammates.',
    author: 'GBC Student Union', authorType: 'college', tag: 'announcement',
  },
  {
    id: 'dt10', courseId: null, isPinned: false, isRead: false, replyCount: 11, date: 'Dec 9',
    title: 'Winter semester registration tips — which sections fill first?',
    preview: 'Registering for Winter 2023 courses next week. Anyone know which sections of INTR 2001 fill up fastest? Last year I missed the Tuesday morning section.',
    author: 'Felix T.', authorType: 'student', tag: 'question',
  },
]

// ─── Tools / integrations ─────────────────────────────────────────────────────
// Backs the Tools page. status drives the CTA: active = Launch, setup-required = Set Up.

export interface ToolItem {
  id: string
  name: string
  description: string
  category: 'assessment' | 'communication' | 'productivity' | 'library' | 'campus'
  status: 'active' | 'inactive' | 'setup-required'
  color: string
  abbr: string
  url: string
  linkedCourses?: string[]   // course IDs — omit if available to all
}

export const tools: ToolItem[] = [
  // ── Assessment ──
  {
    id: 'turnitin', name: 'Turnitin', abbr: 'TII',
    description: 'Originality checking and peer review for written assignments. Required for Interactive Systems, College English, and Information Architecture submissions.',
    category: 'assessment', status: 'active', color: '#0077B6',
    url: 'https://turnitin.com',
    linkedCourses: ['IS', 'CE', 'IA'],
  },
  {
    id: 'respondus', name: 'Respondus LockDown Browser', abbr: 'RLB',
    description: 'Required for online proctored exams. Not currently needed this semester — will activate automatically if a monitored assessment is scheduled.',
    category: 'assessment', status: 'inactive', color: '#64748B',
    url: 'https://respondus.com/products/lockdown-browser',
  },
  // ── Communication ──
  {
    id: 'zoom', name: 'Zoom', abbr: 'ZM',
    description: 'Video conferencing for online office hours, remote lectures, and group project meetings. Integrated with your course schedule.',
    category: 'communication', status: 'active', color: '#2D8CFF',
    url: 'https://georgebrown.zoom.us',
  },
  // ── Productivity ──
  {
    id: 'adobe-cc', name: 'Adobe Creative Cloud', abbr: 'ACC',
    description: 'Photoshop, Illustrator, InDesign, After Effects, and the full CC suite. Subsidised student licence — complete account setup to activate.',
    category: 'productivity', status: 'setup-required', color: '#FA0F00',
    url: 'https://adobe.com/creativecloud',
    linkedCourses: ['2D', 'VD', 'IA', 'IS'],
  },
  {
    id: 'figma', name: 'Figma', abbr: 'FIG',
    description: 'Collaborative UI design and prototyping. Used for wireframes, component libraries, and interactive mockups across design courses.',
    category: 'productivity', status: 'active', color: '#F24E1E',
    url: 'https://figma.com',
    linkedCourses: ['IA', 'VD', '2D', 'IS'],
  },
  {
    id: 'microsoft365', name: 'Microsoft 365', abbr: 'M365',
    description: 'Word, Excel, PowerPoint, Teams, and 1 TB OneDrive storage — free for all enrolled students. Sign in with your GBC student email.',
    category: 'productivity', status: 'active', color: '#D83B01',
    url: 'https://microsoft.com/education',
  },
  {
    id: 'grammarly', name: 'Grammarly', abbr: 'GR',
    description: 'AI writing assistant for grammar, clarity, and citation suggestions. Connect your account to unlock the Premium tier included in your tuition.',
    category: 'productivity', status: 'setup-required', color: '#15C39A',
    url: 'https://grammarly.com',
    linkedCourses: ['CE', 'IS', 'IA'],
  },
  // ── Library & Research ──
  {
    id: 'library', name: 'GBC Library', abbr: 'LIB',
    description: 'Access e-journals, databases (JSTOR, Emerald), interlibrary loans, and book a research consultation with a librarian.',
    category: 'library', status: 'active', color: '#1B3F89',
    url: 'https://library.georgebrown.ca',
  },
  {
    id: 'linkedin-learning', name: 'LinkedIn Learning', abbr: 'LiL',
    description: 'Unlimited access to 16,000+ courses in design, technology, and business. Certificates count toward co-op readiness requirements.',
    category: 'library', status: 'active', color: '#0A66C2',
    url: 'https://linkedin.com/learning',
  },
  // ── Campus Services ──
  {
    id: 'study-rooms', name: 'Study Room Booking', abbr: 'SR',
    description: 'Reserve a study room at St. James, Waterfront, or Casa Loma campus. Rooms seat 2–10 people and include whiteboards and display screens.',
    category: 'campus', status: 'active', color: '#0EA5E9',
    url: 'https://georgebrown.ca/student-life/study-spaces',
  },
  {
    id: 'print-centre', name: 'GBC Print Centre', abbr: 'PRT',
    description: 'Print, scan, and large-format plot. Bring your design files for presentation boards, technical drawings, and mounted portfolio pieces.',
    category: 'campus', status: 'active', color: '#6366F1',
    url: 'https://georgebrown.ca/services/print',
    linkedCourses: ['2D', 'VD', 'IA', 'TD'],
  },
  {
    id: 'tech-lab', name: 'Tech Lab Rentals', abbr: 'TLR',
    description: 'Borrow cameras, drawing tablets, VR headsets, tripods, microphones, gaming consoles, and other equipment from the campus tech lab.',
    category: 'campus', status: 'active', color: '#8B5CF6',
    url: 'https://georgebrown.ca/services/tech-lab',
    linkedCourses: ['VD', '2D', 'IS'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCourse(id: string) {
  return courses.find(c => c.id === id)!
}

export function getWinterCourse(id: string) {
  return winterCourses.find(c => c.id === id)!
}

export function getWinterGPA(): number {
  const totalWeighted = winterGrades.reduce((sum, g) => {
    const course = winterCourses.find(c => c.id === g.courseId)!
    return sum + g.percentage * course.credits
  }, 0)
  const totalCredits = winterCourses.reduce((sum, c) => sum + c.credits, 0)
  return Math.round(totalWeighted / totalCredits)
}

export function getOverallGPA(): number {
  const total = grades.reduce((sum, g) => sum + g.percentage, 0)
  return Math.round(total / grades.length)
}

/**
 * getNextClass — returns the next upcoming class block relative to the demo
 * reference time of Wednesday Dec 14, 2022 at 8:45 AM.
 *
 * At that time, 2D Visualization starts in 15 minutes (9:00 AM Wed, SFC B108).
 * This drives the "Next class in X min" countdown in the dashboard welcome banner.
 *
 * To change the demo time, adjust DEMO_DOW and DEMO_MIN.
 */
export function getNextClass(): {
  course: Course
  minutesUntil: number
  room: string
  startHour: number
} | null {
  const DEMO_DOW = 3            // Wednesday (0=Sun…6=Sat)
  const DEMO_MIN = 8 * 60 + 45 // 8:45 AM in minutes since midnight

  const nowInWeek = DEMO_DOW * 24 * 60 + DEMO_MIN

  let closest: { course: Course; minutesUntil: number; room: string; startHour: number } | null = null

  for (const block of classBlocks) {
    const blockStart = block.dayOfWeek * 24 * 60 + block.startHour * 60
    if (blockStart <= nowInWeek) continue

    const minutesUntil = blockStart - nowInWeek
    if (!closest || minutesUntil < closest.minutesUntil) {
      closest = {
        course: courses.find(c => c.id === block.courseId)!,
        minutesUntil,
        room: block.room,
        startHour: block.startHour,
      }
    }
  }
  return closest
}

/**
 * getTodayClasses — all class blocks scheduled for the demo day (Wednesday),
 * each annotated with status relative to 8:45 AM.
 *   'upcoming' = starts within 3 h  |  'later' = later today  |  'done' = already over
 */
export interface TodayClass {
  course: Course
  startHour: number
  endHour: number
  room: string
  status: 'upcoming' | 'later' | 'done'
  minutesUntil: number   // negative if done
}

export function getTodayClasses(): TodayClass[] {
  const DEMO_DOW = 3
  const DEMO_MIN = 8 * 60 + 45   // 8:45 AM

  return classBlocks
    .filter(b => b.dayOfWeek === DEMO_DOW)
    .map(b => {
      const startMin = b.startHour * 60
      const endMin   = b.endHour   * 60
      const minutesUntil = startMin - DEMO_MIN
      let status: TodayClass['status']
      if (DEMO_MIN >= endMin)      status = 'done'
      else if (minutesUntil <= 180) status = 'upcoming'   // within 3 h
      else                          status = 'later'
      return {
        course: courses.find(c => c.id === b.courseId)!,
        startHour: b.startHour,
        endHour: b.endHour,
        room: b.room,
        status,
        minutesUntil,
      }
    })
    .sort((a, b) => a.startHour - b.startHour)
}

/**
 * getPriorityAssignments — ranks upcoming assignments by which would help
 * Kevin's grade most. Surfaces the "if you're falling behind, do these first"
 * recommendation on the Grades page.
 *
 * Ranking rules (in order):
 *   1. Course's CURRENT grade ascending — the lower your grade, the higher the
 *      payoff per point. A 25% course climbing to 35% feels bigger than 90%→92%.
 *   2. Assignment point value descending — higher-weight work moves the needle
 *      more than smaller deliverables.
 *
 * Inputs: reads `assignments` (filtered to status:'upcoming') and `grades`.
 * Returns: top N enriched rows the UI can render directly.
 */
export interface PriorityAssignment {
  assignment: Assignment
  course: Course
  currentGrade: number     // course's current % grade — drives ranking
  weightLabel: 'High' | 'Medium' | 'Low'
  weightColor: string      // pill colour for the weight label
}

export function getPriorityAssignments(limit = 4): PriorityAssignment[] {
  const upcoming = assignments.filter(a => a.status === 'upcoming')

  // Pair each upcoming assignment with its course + current grade
  const enriched: PriorityAssignment[] = upcoming.map(a => {
    const course = getCourse(a.courseId)
    const grade  = grades.find(g => g.courseId === a.courseId)

    // Bucket points → human-readable weight label
    const points = a.points
    const weightLabel: PriorityAssignment['weightLabel'] =
      points >= 70 ? 'High' : points >= 35 ? 'Medium' : 'Low'
    const weightColor =
      weightLabel === 'High' ? '#EF4444' : weightLabel === 'Medium' ? '#F97316' : '#94A3B8'

    return {
      assignment: a,
      course,
      currentGrade: grade?.percentage ?? 0,
      weightLabel,
      weightColor,
    }
  })

  // Sort: lowest grade first, then highest points
  return enriched
    .sort((a, b) => {
      if (a.currentGrade !== b.currentGrade) return a.currentGrade - b.currentGrade
      return b.assignment.points - a.assignment.points
    })
    .slice(0, limit)
}

/**
 * getSemesterStats — four at-a-glance numbers for the stats strip.
 */
export function getSemesterStats() {
  const avgGrade         = getOverallGPA()
  const submittedCount   = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length
  const modulesComplete  = courses.reduce((s, c) => s + c.completedModules, 0)
  const modulesTotal     = courses.reduce((s, c) => s + c.moduleCount, 0)
  // Demo "today" is Dec 14; winter break starts Dec 23
  const daysToBreak      = 23 - 14
  return { avgGrade, submittedCount, modulesComplete, modulesTotal, daysToBreak }
}
