import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from '../components/Icons'

/**
 * Changelog
 * ─────────
 * Standalone (no Layout chrome) page documenting every meaningful version of
 * the Blackboard redesign prototype — what changed, why, and what it looked
 * like. Lives at /changelog.
 *
 * Designed to be a one-page reference for anyone reviewing the case study or
 * trying to understand the iteration history.
 *
 * Visual examples reference assets in public/case-study/ (captured by the
 * v4.9 puppeteer pipeline) plus the live prototype's own screens.
 */

// ─── Version data ────────────────────────────────────────────────────────────

interface ChangelogVersion {
  version: string
  theme: string                  // Short tagline
  era: string                    // Loose date / phase tag
  what: string[]                 // 3-6 bullet points of what changed
  why: string                    // 1-2 sentences explaining the design decision
  screenshot?: string            // Relative path to image (under /case-study/)
  screenshotCaption?: string
  highlight?: boolean            // Tag this as a "major" version for visual weight
}

const VERSIONS: ChangelogVersion[] = [
  {
    version: 'v4.15.0',
    theme: 'Multi-tenant skin — same redesign, four institutions',
    era: 'Latest',
    what: [
      'TenantContext provider — 4 Canadian post-secondary institutions ship-ready (George Brown, York, Wilfrid Laurier, McMaster)',
      'Floating TenantSwitcher (bottom-right) reskins the prototype in real-time',
      'Each tenant: own brand colour, gradient palette, sidebar wordmark, tagline',
      'Sidebar header: GBC keeps its rainbow stripe + logo; other tenants get a clean typeset wordmark (avoids using real institutional logos)',
      'Dashboard welcome banner gradient, DemoBanner gradient, OnboardingModal Bb badge all driven by active tenant',
      'Persists via localStorage; dismissable for the session',
    ],
    why: 'Blackboard Learn IS multi-tenant — every school skins their own instance. Demonstrating the design system holding up across four brand identities shows the prototype isn\'t a one-off skin but a system. The active tenant drives CSS custom properties (--tenant-primary, --tenant-gradient-*) so future surfaces can opt in without prop drilling.',
    highlight: true,
  },
  {
    version: 'v4.14.0',
    theme: 'Documentation pass — this page',
    era: 'Documentation',
    what: [
      'Standalone /changelog route documenting every version, decision, and screenshot',
      'Sidebar logo header tightened (104px → 88px) for shorter laptop viewports',
      'Profile email format corrected to GBC convention (firstname.lastname@georgebrown.ca)',
      'Notification timing tightened: n1 "2 hours ago" → "Yesterday" (8:45 AM demo would mean a 6:45 AM grade post)',
    ],
    why: 'A changelog page is the right place to surface the iteration story — over a dozen distinct versions, each with a real design decision. Portfolio reviewers shouldn\'t have to read git history.',
  },
  {
    version: 'v4.13.0',
    theme: 'Dark-mode contrast pass + remaining polish',
    era: 'Polish round 3',
    what: [
      '175 instances of dark:text-gray-500 → dark:text-gray-400 (WCAG AA fix)',
      '31 instances of dark:text-gray-600 → dark:text-gray-500 (was unreadable)',
      'RecentGrades widget: explicit Date.parse sort by submittedDate desc',
      'DeadlineTimeline labels: alignItems center inside the 28px box (was flex-start)',
      'Today\'s Schedule done classes: "Review →" hover overlay replaces static Done pill',
    ],
    why: 'User flagged that course codes on the dashboard and dates in upcoming deadlines were too dark to read. gray-500 on the app\'s dark backgrounds measured ~3.3:1 contrast — failing WCAG AA for body text. gray-400 measures ~5.0:1, comfortably passing.',
    screenshot: '/case-study/dashboard-dark.png',
    screenshotCaption: 'Dashboard in dark mode after contrast fix — every muted label readable',
    highlight: true,
  },
  {
    version: 'v4.12.0',
    theme: 'Round 2 audit fixes — Communities modal, Messages actions',
    era: 'Polish round 2',
    what: [
      'Communities thread detail modal (the page\'s primary affordance was a dead-end toast)',
      'Messages detail header: Star, Mark-as-unread, Archive, Delete',
      'Notifications: hover-× button to mark-read without navigating',
      'Assignment deliverables: Open links to matching submitted files when graded',
      'Course sidebar inert grade rows visually muted (no longer look clickable)',
      'CourseHeader: Email [instructor] secondary action — opens ComposeModal prefilled',
    ],
    why: 'A comprehensive audit had flagged the Communities thread modal as the biggest remaining dead-end — the primary affordance of an entire page was going nowhere. Built a real modal with deterministic generated replies (seeded from thread ID so they stay stable across refreshes).',
    screenshot: '/case-study/communities-light.png',
    screenshotCaption: 'Communities discussion list — threads now open into a working detail modal',
    highlight: true,
  },
  {
    version: 'v4.11.0',
    theme: 'Typography swap — Inter → IBM Plex Sans',
    era: 'Typography decision',
    what: [
      'Replaced --font-sans with IBM Plex Sans throughout',
      'Loaded weights 400/500/600/700 from Google Fonts',
      'Inter and 4 other candidates (Geist, Public Sans, Manrope, General Sans) tested via live switcher (type-exploration branch) and 3-way comparison page (/font-vote)',
    ],
    why: 'Inter is the SaaS default and reads as "I picked the safe choice" rather than "I made a typography decision." Plex has institutional warmth that fits an education product, has more visible character than Geist or Public Sans, and is lower trend-risk than Geist (which is becoming The Cool Pick in 2024-25 portfolios).',
  },
  {
    version: 'v4.10.0',
    theme: 'Student-first onboarding + 21 audit fixes',
    era: 'Polish round 1',
    what: [
      'Rebuilt OnboardingModal as a 5-step student tutorial (Welcome → Dashboard → Courses → Activity Stream → Tools)',
      'Dashboard activity items + TopBar search activity results: use item.linkTo instead of hardcoded /activity-stream',
      'Sidebar Messages badge derived from data (was hardcoded 2 while data had 3 unread)',
      'CourseResources Download button: toast + focus styles (was stopPropagation only, no feedback)',
      'Calendar month-view chips → navigate to course; side panel cards → navigate too',
      'Course modules: removed cursor-pointer + hover bg on inactive rows (in 2 places)',
      'Profile email mailto link + Student ID copy-to-clipboard',
      'Send Message button on courses prepopulates ComposeModal with instructor + course code',
      'Mock data fixes: INTR 1001 collision (Fall 2D / Winter UR), calendar event dates, lastActivity drift',
    ],
    why: 'A page-by-page audit surfaced 62 distinct findings. Top 21 priorities cleared in one pass. The OnboardingModal misunderstanding was the most pointed feedback: a "Welcome — three quick things about this site" message wasn\'t teaching the student how to use Blackboard, it was meta-explaining the prototype.',
    screenshot: '/case-study/dashboard-light.png',
    screenshotCaption: 'Dashboard after audit fixes — every clickable surface now goes somewhere real',
    highlight: true,
  },
  {
    version: 'v4.9.0',
    theme: 'Case-study capture pipeline',
    era: 'Asset generation',
    what: [
      'capture-case-study-screens.mjs — Puppeteer script generating 14 PNGs at 1440×900 @ 2x',
      'capture-case-study-videos.mjs — 6 hover videos for the Journey component',
      'DemoBanner + OnboardingModal auto-dismissed via localStorage so they never appear in captures',
      'Dark mode toggled by adding `dark` class on <html>',
      'Outputs to public/case-study/ — ~6.5 MB total',
    ],
    why: 'The Framer case study components reference image slots. Hand-screenshotting 14 pages × 2 themes × 6 videos was unsustainable. The scripted pipeline regenerates everything in ~30s.',
  },
  {
    version: 'v4.8.0',
    theme: 'Dashboard rebalance — drop redundancy, time-sensitive grades',
    era: 'Self-critique fixes',
    what: [
      'Removed Due Soon widget — same data as DeadlineTimeline above, less informative',
      'Replaced aggregate Grades widget (per-course averages) with Recent Grades (assignment-level)',
      'Middle column went from 2 short widgets → 1 taller widget',
      'Skeleton updated to match the new shape',
    ],
    why: 'A self-critique pass (acting as a senior design reviewer) flagged that two dashboard widgets weren\'t pulling their weight. Due Soon duplicated the Deadline Timeline. The aggregate Grades widget wasn\'t time-sensitive — course averages don\'t change day-to-day, but new grade returns are exactly what students check the dashboard for.',
  },
  {
    version: 'v4.7.0',
    theme: 'Final polish — onboarding redesign + cross-page consistency',
    era: 'Polish',
    what: [
      'OnboardingModal v2 — redesigned from "this is a portfolio prototype" framing to "how to use the site" (later replaced again in v4.10 with the proper student tutorial)',
      'TopBar notification badge: clicking individual notification now marks it as read (was Mark all read only)',
      'Tools IT support email corrected: gbcassist@georgebrown.ca (real GBC service)',
      'Communities empty filter state unified to icon-box pattern used elsewhere',
    ],
    why: 'The DemoBanner already handles meta-context ("this is a prototype for a portfolio case study"). The OnboardingModal was duplicating that message instead of teaching the user the actual UI.',
  },
  {
    version: 'v4.6.0',
    theme: 'Real GBC integration + page completeness',
    era: 'Believability pass',
    what: [
      'Real tool URLs sourced from georgebrown.ca — Library, Print Centre, Tech Lab, Microsoft 365, Zoom, Figma, Adobe',
      'Real GBC service copy: Print Centre locations (SJC Bldg A Rm 114, Casa Loma C210), Study Room capacities, Tech Lab loan policies',
      'Activity items + notifications get real external linkTos (OSAP, STU-VIEW, LLC)',
      'Page completeness audit — empty states, dead-end fixes on secondary pages',
      'Logo 25% larger in sidebar',
    ],
    why: 'A portfolio prototype with placeholder Lorem Ipsum is a wireframe in disguise. Every tool link should open the real GBC page. Reviewers can spend 10 minutes inside the prototype before they hit a dead end.',
    screenshot: '/case-study/tools-light.png',
    screenshotCaption: 'Tools page — 12 real GBC integrations, status chips, working URLs',
  },
  {
    version: 'v4.5.0',
    theme: 'Dead-end audit + functional wiring (14 fixes)',
    era: 'First audit pass',
    what: [
      'Audited every clickable element across the prototype',
      '14 specific dead-end fixes — broken links, missing toasts, inconsistent nav',
      'Every link now goes somewhere real or shows feedback',
    ],
    why: 'A prototype where buttons don\'t do anything fails the "I can imagine using this" test. The audit forced a systematic pass to ensure every interactive surface has a destination.',
  },
  {
    version: 'v4.4.0',
    theme: 'Tools page overhaul with real logos',
    era: 'Identity pass',
    what: [
      'Real product logos: Figma, Adobe CC, Microsoft 365, Zoom, LinkedIn Learning, Turnitin, Grammarly, Respondus',
      'Status chips: Active / Set up / Not active',
      'Reset-demo footer link clears localStorage so onboarding + banner reappear',
    ],
    why: 'A "tools" page in a real LMS is a dumping ground of plain-text links. Treating it as a real product feature — with real logos, real URLs, real status — signals product literacy.',
  },
  {
    version: 'v4.3.0',
    theme: 'Onboarding modal + priority assignments + quiz modules',
    era: 'Feature pass',
    what: [
      'First OnboardingModal (meta-prototype framing — later iterated)',
      'Priority Assignments concept',
      'Quiz module type added to course modules',
    ],
    why: 'Started thinking about onboarding too soon — the meta-framing version was wrong, but the localStorage gate + dismissal pattern was right and carried through to the final v4.10 version.',
  },
  {
    version: 'v4.0.0–v4.1.0',
    theme: 'Dashboard redesign + copy/privacy audit',
    era: 'Major restructure',
    what: [
      'Significant Dashboard layout restructure',
      'Copy audit across all pages (tightened, less corny, fewer placeholders)',
      'Privacy review — no real personal data in mock content',
      'Deadline timeline compression',
      'Grades card condensing',
    ],
    why: 'The first version of the dashboard was reasonable but cluttered. v4.0 was the first time I treated the dashboard as the central design problem rather than a list of widgets.',
  },
  {
    version: 'v3.0.0',
    theme: 'Portfolio framing — Demo banner + README',
    era: 'Portfolio focus',
    what: [
      'First-visit DemoBanner with dismissal persistence (localStorage)',
      'Portfolio README scaffolded as case study',
      'Project context separated from in-app onboarding',
    ],
    why: 'The DemoBanner exists because a portfolio prototype needs to set context for the reviewer ("you\'re looking at a redesign concept, not the real product"). Separating that from the in-app onboarding modal — which teaches a student how to use the site — is the right split.',
  },
  {
    version: 'v2.9.0',
    theme: 'WCAG 2.2 AA accessibility pass',
    era: 'Quality pass',
    what: [
      'Skip-to-content link on every page',
      'prefers-reduced-motion honoured globally via index.css',
      'ARIA labels on every icon-only button',
      'Focus rings on all interactive elements',
      'role="dialog" + aria-modal on overlays',
      'Live regions on toast notifications',
      '13+ files updated',
    ],
    why: 'Accessibility built in, not bolted on. The whole point of redesigning Blackboard is that the original product wasn\'t built for everyone — keyboard users, screen reader users, reduced-motion users all deserve the same experience.',
    highlight: true,
  },
  {
    version: 'v2.8.0',
    theme: 'Skeleton loading system + polished empty states',
    era: 'Polish',
    what: [
      'Skeleton component family (Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard)',
      'Dashboard skeleton mirrors the real layout exactly — shown for ~1.4s on first load',
      'Polished empty states for Notifications, Messages, Courses (icon-box pattern)',
    ],
    why: 'Skeletons make the loading state feel intentional. The 1.4s artificial delay on the dashboard is a portfolio call — it lets reviewers see the loading shell on every visit, signalling the prototype handles real-world latency.',
  },
  {
    version: 'v2.7.0',
    theme: 'Smart Priority Card — the central design move',
    era: 'Design decision',
    what: [
      'Today\'s Schedule widget on Dashboard',
      'Semester Stats strip',
      'Smart Priority Card — surfaces one item by rule (due tomorrow → unread grade → almost-complete course)',
    ],
    why: 'The hardest part of a student\'s day is knowing what to do FIRST. A dashboard that lists ten things equally well solves nothing. The Priority Card answers "what should I do right now?" before the student looks anywhere else. Everything else on the dashboard is supporting evidence.',
    highlight: true,
  },
  {
    version: 'v2.6.0',
    theme: 'Course content depth — announcements, syllabus, modules',
    era: 'Content',
    what: [
      'Per-course Announcement model (pinned + recent)',
      'Full Syllabus data per course (grading weights, policies)',
      'Office Hours per instructor',
      'Module data for all six courses',
      'CoursePage split into sub-components (CourseHeader, CourseSidebar, CourseAnnouncements, etc.) for maintainability',
      'Tone pass on instructor feedback — specific, weary, action-oriented voice throughout',
    ],
    why: 'Announcements being buried was the worst-performing task in the usability test (72% error-free, 3.0/5 satisfaction). Surfacing them at three layers — course page, dashboard activity stream, notifications — directly answered the research finding.',
  },
  {
    version: 'v2.5.0',
    theme: 'Real grades, Communities, Tools, Calendar, Profile',
    era: 'Feature parity',
    what: [
      'Real grade data with per-course rubrics',
      'Toast notification system for action feedback',
      'Communities page — per-course discussion threads',
      'First pass of Tools page',
      'Calendar with Month and List views (Month default per research)',
      'Profile/Settings pages',
    ],
    why: 'The usability test said students wanted more courses + assignments visible at a glance on the Grades page. Real graded data with rubrics makes the page navigable and informative instead of clipart-y.',
  },
  {
    version: 'v2.3.0',
    theme: 'Notifications + instructor feedback threads',
    era: 'Communication layer',
    what: [
      'Notifications Centre with grouped time periods (Today / This Week / Earlier)',
      'Instructor↔student feedback threads on assignments',
      'Class countdown ("Next class in 12 min")',
      'Horizontal Deadline Timeline on Dashboard',
      'Navy dark sidebar',
    ],
    why: 'Feedback threads are where a real LMS earns its keep — students don\'t just get a grade, they get coaching. Writing rubric-line feedback in plausible-instructor voice ("good craft but missing the rationale doc") makes the prototype feel real.',
    screenshot: '/case-study/assignment-light.png',
    screenshotCaption: 'Assignment page with rubric + instructor↔student feedback thread',
  },
  {
    version: 'v2.1.0–v2.2.0',
    theme: 'Course & assignment detail pages',
    era: 'Depth',
    what: [
      'CoursePage with Modules, Assignments, Resources, Syllabus, Instructor sections',
      'AssignmentPage with rubric, instructions, deliverables, submission history',
      'ComposeModal for new messages',
      'GBC logo integration in sidebar',
      'Resources page',
      'Zoom links per course',
    ],
    why: 'Real Blackboard\'s biggest navigation problem is that every course\'s left rail is configured differently — 8 to 25 items, same content in different places. Standardising the course page structure is the single biggest navigation win.',
  },
  {
    version: 'v2.0.0',
    theme: 'Initial React build',
    era: 'Day 1',
    what: [
      'Translated team Figma exploration into working React prototype',
      'React 19 + TypeScript + Tailwind CSS v4 + Vite',
      'Fixed 220px sidebar mirroring Blackboard\'s left rail (standardised across pages)',
      '72px topbar with search, notifications, profile dropdown',
      'Dark mode considered from start (CSS custom properties)',
      'Six courses with realistic GBC course codes, instructors, schedules',
      'Initial pages: Dashboard, Activity Stream, Grades, Calendar + placeholder pages',
    ],
    why: 'React + Vite + Tailwind chosen for rapid iteration. CSS custom properties for theming so dark mode works without component duplication. Six full courses (not one stub) so the data feels like a real semester.',
  },
]

// ─── Page component ─────────────────────────────────────────────────────────

export default function Changelog() {
  // Group by major version for the "table of contents" rail
  const highlights = VERSIONS.filter(v => v.highlight)

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>

      {/* ── Sticky top nav ── */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 text-gray-700 hover:text-[#2563EB] transition-colors">
            <span className="w-7 h-7 rounded-lg bg-[#1B3F89] text-white flex items-center justify-center text-[13px] font-bold tracking-tight" style={{ letterSpacing: '-0.04em' }}>
              Bb
            </span>
            <span className="text-[13px] font-semibold">Back to prototype</span>
            <ArrowRight size={12} />
          </Link>
          <a
            href="https://github.com/jamesibito/Blackboard-prototype"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            View source ↗
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-[1280px] mx-auto px-8 pt-16 pb-12">
        <p className="text-[12px] font-bold uppercase tracking-[1.8px] text-[#2563EB] mb-4">
          Project changelog
        </p>
        <h1 className="text-[48px] font-bold text-gray-900 leading-[1.05] tracking-tight max-w-[840px]" style={{ letterSpacing: '-0.8px' }}>
          Every decision, every version, every screenshot.
        </h1>
        <p className="text-[17px] text-gray-600 mt-5 leading-relaxed max-w-[680px]">
          A documented iteration history for the Blackboard Learn redesign at George Brown College.
          Newest at top, going back to v2.0 when the first React build replaced the original team Figma.
          Each version: what changed, what design decision drove it, and a screenshot where useful.
        </p>

        {/* Stat strip */}
        <div className="flex items-center gap-3 mt-8 flex-wrap">
          {[
            { value: VERSIONS.length, label: 'documented versions' },
            { value: '~8,700', label: 'lines of TypeScript' },
            { value: '14', label: 'interactive pages' },
            { value: '12', label: 'real GBC integrations' },
          ].map(s => (
            <div key={s.label} className="px-4 py-2 rounded-full bg-white border border-gray-200 flex items-center gap-2 shadow-sm">
              <span className="text-[16px] font-bold text-[#1B3F89] tabular-nums">{s.value}</span>
              <span className="text-[13px] text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Highlight TOC */}
        <div className="mt-12 rounded-2xl bg-white border border-gray-200 p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
            Jump to a key version
          </p>
          <div className="flex flex-wrap gap-2">
            {highlights.map(v => (
              <a
                key={v.version}
                href={`#${v.version}`}
                className="px-3 py-1.5 rounded-lg bg-[#EEF2FB] hover:bg-[#1B3F89] hover:text-white text-[#1B3F89] text-[12.5px] font-semibold transition-colors"
              >
                <span className="tabular-nums">{v.version}</span>
                <span className="mx-1.5 opacity-50">·</span>
                <span className="font-medium">{v.theme}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why this project ── */}
      <section className="max-w-[1280px] mx-auto px-8 mb-16">
        <div className="bg-[#0F1A2E] text-white rounded-3xl p-10 lg:p-14 grid lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-[#60A5FA] mb-3">
              Project context
            </p>
            <h2 className="text-[28px] font-bold leading-tight tracking-tight mb-4" style={{ letterSpacing: '-0.5px' }}>
              Why redesign Blackboard
            </h2>
            <p className="text-[15px] text-gray-300 leading-relaxed mb-3">
              George Brown College runs 30,000+ students through Blackboard Learn — a 1997-era LMS that
              hasn't kept up with how students actually work. Our team ran user research as part of an
              Information Architecture course project; I followed it up with a 5-participant walkthrough
              usability test in Interaction Design the following semester.
            </p>
            <p className="text-[15px] text-gray-300 leading-relaxed">
              The findings pointed to the same three problems every time: nothing is prioritized,
              everything takes too many clicks, and the interface looks like it was last designed in
              2010. This prototype is the response — student-side first, with a documented design
              decision behind every meaningful change.
            </p>
          </div>
          <div className="space-y-3 text-[13px]">
            {[
              { label: 'Role',         value: 'UX & Product Designer' },
              { label: 'Team',         value: '3 (IA course); solo for build' },
              { label: 'Build window', value: 'Dec 2024 → May 2026' },
              { label: 'Tools',        value: 'Figma · React · TypeScript · Tailwind · Claude Code' },
            ].map(it => (
              <div key={it.label}>
                <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#60A5FA] mb-1">{it.label}</p>
                <p className="font-medium text-white">{it.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Versions list ── */}
      <section className="max-w-[1280px] mx-auto px-8 pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-gray-500 mb-3">
          Version history · newest first
        </p>
        <h2 className="text-[24px] font-bold text-gray-900 tracking-tight mb-10" style={{ letterSpacing: '-0.4px' }}>
          {VERSIONS.length} versions over the project's lifetime
        </h2>

        <div className="space-y-12">
          {VERSIONS.map((v, i) => (
            <VersionEntry key={v.version} v={v} last={i === VERSIONS.length - 1} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-8 py-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[13px] font-semibold text-gray-700">
              Blackboard Learn Redesign — built by{' '}
              <a
                href="https://jamesibitoye.framer.website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B3F89] hover:underline"
              >
                James Ibitoye
              </a>
            </p>
            <p className="text-[12px] text-gray-500 mt-1">
              Not affiliated with Blackboard or George Brown College. All data is fictional.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="text-[12.5px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Open the prototype
              <ArrowRight size={12} />
            </Link>
            <a
              href="https://jamesibitoye.framer.website/blackboard_v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-semibold text-gray-700 hover:text-[#1B3F89] transition-colors"
            >
              Read the case study ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Sub-component: one version entry ─────────────────────────────────────────
function VersionEntry({ v, last }: { v: ChangelogVersion; last: boolean }) {
  return (
    <article
      id={v.version}
      className={`relative pl-8 pb-12 ${last ? '' : 'border-l-2 border-gray-200'} -ml-2`}
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Timeline dot */}
      <div
        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm
          ${v.highlight ? 'bg-[#1B3F89]' : 'bg-gray-300'}`}
      />

      {/* Header row */}
      <div className="flex items-baseline gap-3 flex-wrap mb-1">
        <h3 className={`text-[22px] font-bold tracking-tight tabular-nums ${v.highlight ? 'text-[#1B3F89]' : 'text-gray-900'}`} style={{ letterSpacing: '-0.4px' }}>
          {v.version}
        </h3>
        {v.highlight && (
          <span className="text-[10px] font-bold uppercase tracking-[1.2px] px-2 py-0.5 rounded-full bg-[#1B3F89]/10 text-[#1B3F89]">
            Key milestone
          </span>
        )}
        <span className="text-[12px] text-gray-400 ml-auto font-medium">{v.era}</span>
      </div>

      <p className="text-[17px] font-semibold text-gray-900 mb-4 tracking-tight" style={{ letterSpacing: '-0.2px' }}>
        {v.theme}
      </p>

      <div className={`grid gap-6 ${v.screenshot ? 'lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        <div>
          {/* What changed */}
          <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-gray-500 mb-2">
            What changed
          </p>
          <ul className="space-y-1.5 mb-5">
            {v.what.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 leading-relaxed">
                <ChevronRight size={12} className="text-gray-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Why */}
          <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-gray-500 mb-2">
            Design decision
          </p>
          <p className="text-[14px] text-gray-600 leading-relaxed italic">{v.why}</p>
        </div>

        {/* Screenshot column */}
        {v.screenshot && (
          <figure className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <img
                src={v.screenshot}
                alt={v.screenshotCaption ?? `${v.version} screenshot`}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
            {v.screenshotCaption && (
              <figcaption className="text-[11px] text-gray-500 mt-2 leading-snug">
                {v.screenshotCaption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </article>
  )
}
