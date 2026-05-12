// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Course {
  id: string
  abbr: string
  name: string
  code: string
  instructor: string
  color: string
  files: string[]
  description: string
  credits: number
  schedule: string
  room: string
  completion: number     // 0-100
  moduleCount: number
  completedModules: number
  lastActivity: string
}

export interface GradeMark {
  name: string
  score: number
  total: number
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
}

export interface ActivityItem {
  id: string
  courseId: string
  title: string
  date: string
  timeRange: string
  type: 'assignment' | 'announcement' | 'grade' | 'resource'
  body: string
}

export interface CalendarEvent {
  id: string
  courseId: string
  title: string
  day: number
  color: string
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
  },
  {
    id: 'IS', abbr: 'IS', name: 'Interactive Systems', code: 'INTR 1002',
    instructor: 'Michael Holland', color: '#EC4899',
    files: ['Image.jpg', 'Form.jpg', 'Image 2.jpg'],
    description: 'Human-computer interaction principles, UX research methods, wireframing, usability testing, and interactive prototyping using industry tools.',
    credits: 3, schedule: 'Tue / Thu  1:00 PM – 3:00 PM', room: 'SFC B112',
    completion: 88, moduleCount: 14, completedModules: 12,
    lastActivity: 'Today',
  },
  {
    id: 'IA', abbr: 'IA', name: 'Information Architecture', code: 'INTR 1006',
    instructor: 'A.J. Singh', color: '#EF4444',
    files: [],
    description: 'Structuring and organizing information for digital products. Topics include sitemaps, card sorting, navigation design, content strategy, and taxonomy.',
    credits: 2, schedule: 'Fri  9:00 AM – 12:00 PM', room: 'SFC A209',
    completion: 45, moduleCount: 10, completedModules: 4,
    lastActivity: '1 week ago',
  },
  {
    id: 'VD', abbr: 'VD', name: 'Visual Design', code: 'INTR 1003',
    instructor: 'Xander Messi', color: '#8B5CF6',
    files: ['Ideation Jam.docx'],
    description: 'Advanced visual composition, grid systems, motion principles, and design systems. Students develop a cohesive design language for a multi-channel campaign.',
    credits: 3, schedule: 'Mon / Wed  12:00 PM – 2:00 PM', room: 'SFC B110',
    completion: 60, moduleCount: 11, completedModules: 7,
    lastActivity: '3 days ago',
  },
  {
    id: 'CE', abbr: 'CE', name: 'College English', code: 'COMM 1001',
    instructor: 'Erik Brown', color: '#06B6D4',
    files: ['Image.jpg', 'Form.jpg', 'Image 2.jpg'],
    description: 'Academic writing, critical reading, and research skills for design professionals. Emphasis on portfolio writing, case studies, and professional communication.',
    credits: 3, schedule: 'Tue  9:00 AM – 12:00 PM', room: 'SFC A105',
    completion: 80, moduleCount: 13, completedModules: 10,
    lastActivity: 'Yesterday',
  },
  {
    id: 'TD', abbr: 'TD', name: 'Technical Drawing', code: 'INTR 1005',
    instructor: 'David Kim', color: '#22C55E',
    files: [],
    description: 'Orthographic projection, isometric drawing, and dimensional annotation. Students use manual and digital drafting tools to produce technical documentation.',
    credits: 2, schedule: 'Thu  1:00 PM – 4:00 PM', room: 'SFC C204',
    completion: 97, moduleCount: 9, completedModules: 9,
    lastActivity: 'Today',
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
      { name: 'Assignment 5 – Branded Design', score: 18, total: 25 },
      { name: 'Assignment 4 – Style Guide', score: 20, total: 20 },
      { name: 'Assignment 3 – Logo Design', score: 15, total: 25 },
      { name: 'Assignment 2 – Brand Ideation', score: 12, total: 20 },
      { name: 'Assignment 1 – Brand Exploration', score: 10, total: 10 },
    ],
  },
  {
    courseId: 'IA', percentage: 25,
    marks: [
      { name: 'Assignment 2 – Card Sorting Exercise', score: 7, total: 25 },
      { name: 'Assignment 1 – Sitemap Draft', score: 5, total: 20 },
    ],
  },
  {
    courseId: 'VD', percentage: 60,
    marks: [
      { name: 'Project 2 – Campaign Layout', score: 30, total: 50 },
      { name: 'Assignment 3 – Typography Poster', score: 18, total: 25 },
      { name: 'Assignment 2 – Colour Theory Study', score: 14, total: 25 },
    ],
  },
  {
    courseId: 'TD', percentage: 97,
    marks: [
      { name: 'Drawing Set 3 – Mechanical Parts', score: 48, total: 50 },
      { name: 'Drawing Set 2 – Orthographic Views', score: 49, total: 50 },
      { name: 'Drawing Set 1 – Basic Drafting', score: 48, total: 50 },
    ],
  },
  {
    courseId: 'CE', percentage: 80,
    marks: [
      { name: 'Essay 3 – Research Proposal', score: 82, total: 100 },
      { name: 'Essay 2 – Comparative Analysis', score: 79, total: 100 },
      { name: 'Essay 1 – Personal Narrative', score: 83, total: 100 },
    ],
  },
  {
    courseId: 'IS', percentage: 91,
    marks: [
      { name: 'Project 3 – Interactive Prototype', score: 47, total: 50 },
      { name: 'Project 2 – Wireframe Set', score: 28, total: 30 },
      { name: 'Assignment 4 – Usability Test Report', score: 18, total: 20 },
      { name: 'Assignment 3 – User Flow Diagrams', score: 19, total: 20 },
      { name: 'Assignment 2 – Persona Development', score: 15, total: 15 },
    ],
  },
]

// ─── Due Soon ─────────────────────────────────────────────────────────────────

export const dueSoon: DueItem[] = [
  { id: 'ds1', courseId: 'VD', title: 'User Manual', dueDay: 'WEDNESDAY, DEC 7TH', type: 'assignment' },
  { id: 'ds2', courseId: 'CE', title: 'Research Proposal', dueDay: 'THURSDAY, DEC 8TH', type: 'assignment' },
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
  },
  {
    id: 'a3', courseId: 'TD', title: 'Grade Released: Drawing Set 3',
    date: '18th Dec 2022', timeRange: '8 AM – 9 AM', type: 'grade',
    body: 'Your grade for Drawing Set 3 (Mechanical Parts) has been released. You scored 48 out of 50. Excellent drafting precision on the isometric views. See instructor comments attached to your submission.',
  },
  {
    id: 'a4', courseId: '2D', title: 'Announcement: Final Project Brief',
    date: '23rd Dec 2022', timeRange: '10 AM – 1 PM', type: 'announcement',
    body: 'The final project brief is now live on the course page. You will be designing a full brand identity system for a fictional startup. Deliverables include logo, colour palette, type system, and a one-page brand guide. Submission due January 10th.',
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
  },
]

// ─── Calendar Events ───────────────────────────────────────────────────────────

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', courseId: 'IS', title: 'Ideation Jam', day: 3, color: '#EC4899' },
  { id: 'e2', courseId: 'IA', title: 'Wireframes Due', day: 3, color: '#EF4444' },
  { id: 'e3', courseId: 'CE', title: 'Peer Review', day: 5, color: '#06B6D4' },
  { id: 'e4', courseId: 'VD', title: 'User Manual Due', day: 7, color: '#8B5CF6' },
  { id: 'e5', courseId: 'CE', title: 'Research Proposal', day: 8, color: '#06B6D4' },
  { id: 'e6', courseId: 'TD', title: 'Rendering Pin-up', day: 9, color: '#22C55E' },
  { id: 'e7', courseId: '2D', title: 'Branding Guide', day: 12, color: '#F97316' },
  { id: 'e8', courseId: '2D', title: 'Logo Critique', day: 14, color: '#F97316' },
  { id: 'e9', courseId: '2D', title: 'Branded Design Due', day: 20, color: '#F97316' },
  { id: 'e10', courseId: 'IS', title: 'Prototypes Due', day: 20, color: '#EC4899' },
  { id: 'e11', courseId: 'IA', title: 'Final Sitemap', day: 20, color: '#EF4444' },
  { id: 'e12', courseId: 'VD', title: 'Campaign Layout', day: 20, color: '#8B5CF6' },
  { id: 'e13', courseId: 'IS', title: 'Prototypes Review', day: 28, color: '#EC4899' },
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
