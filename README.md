# Blackboard Learn — George Brown College Redesign

> A UX redesign prototype of the Blackboard LMS, built around the daily life of a 2nd-year design student at George Brown College (Fall 2022). Designed and built by **James (Jamie) Ibitoye** as a portfolio case study.

🔗 **Live demo:** [jamesibitoye.framer.website](https://jamesibitoye.framer.website) (case study) · GitHub Pages / Vercel deploy at `main`

---

## Why this exists

Blackboard is the LMS used by most Canadian colleges and universities — including George Brown, where I attend. Students live inside it for every class, every deadline, every grade. But the actual product is dense, slow, and reactive: it tells you what's already happened instead of helping you decide what to do next.

This prototype reimagines what that experience could feel like for **Kevin H.**, a 2nd-year design student (Year 2, Semester 1) trying to wrap up his Fall 2022 term. The goal wasn't to redesign every screen — it was to redesign the screens a student actually *uses*: dashboard, course pages, assignments, grades, messages, and the calendar.

## The student persona

**Kevin H.** — Year 2, Semester 1, Interaction Design program, George Brown College
- 6 active Fall 2022 courses (2D Visualization, Interactive Systems, Information Architecture, Visual Design, College English, Technical Drawing)
- Demo "today" pinned to **Wednesday, December 14, 2022 at 8:45 AM**, the week before finals
- Submission history across 8 assignments, real instructor feedback threads, grade breakdowns
- 2D class starts in 15 minutes from demo time — so the priority surfaces dynamically

Every grade, comment, deadline, and notification is fictional but consistent. The narrative is the same as a real semester: assignments early in the term are graded, some are passing well, one is struggling (IA at 25%), one is almost done (TD at 97%), and finals are right around the corner.

## Key design decisions

### A dashboard that prioritises *now*
- **Smart Priority Card** dynamically surfaces the most urgent item (assignment due tomorrow > unread grade > course almost complete)
- **Today's Schedule** widget shows current-day classes with live "Up next" badges relative to the 8:45 AM demo time
- **Semester Stats strip** (avg grade, submissions, modules done, days to break) gives an at-a-glance health check

### A course page that reads like a syllabus
- Reordered information hierarchy: **Announcements → Modules → Assignments → Resources**
- Each course has a real syllabus (weighted grade breakdown + key policies) and instructor office hours
- Module types include `lecture`, `reading`, `assignment`, `quiz`, `video`, `discussion` — colour-coded so students can scan for a specific type

### Realistic instructor feedback
- Rubric-based grading with per-criterion feedback comments
- Full feedback threads on graded assignments (instructor ↔ student back-and-forth)
- Tone written to sound like a real college instructor — specific, constructive, occasionally direct

### Multi-tenant design system
- The same redesign skinned for **four Canadian post-secondary institutions** — George Brown, York, Wilfrid Laurier, McMaster
- Floating switcher (bottom-right of the prototype) reskins in real time — sidebar logo, brand colours, gradient palettes, link colours all driven by CSS custom properties from `TenantContext`
- Demonstrates the design system holding up across distinct brand identities; matches how real Blackboard ships to thousands of institutions

### Spotlight product tour
- 9-step in-app tour walks first-time visitors through the key surfaces (Priority Card → Today's Schedule → Deadline Timeline → Courses → Sidebar → Search → Tenant switcher)
- Spotlight + tooltip pattern (Notion / Linear / Figma style) — teaches by pointing at real UI, not by describing it in a modal
- Replayable from the Profile page

### Polished states
- Loading skeletons on the Dashboard (700ms simulated load that matches the real layout)
- Empty states with personality on Notifications, Messages, Course pages
- 404 / "course not found" with a friendly recovery path

### Accessibility (WCAG 2.2 AA pass)
- Skip-to-content link
- Visible keyboard focus rings (Action Blue on light, lighter blue on dark)
- `prefers-reduced-motion` respected — disables transitions and skeleton pulses
- ARIA labels on every icon-only button, `aria-live` toast region, `role="dialog"` on the compose modal with Escape key + focus management

---

## Tech stack

- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** with custom design tokens for GBC brand colours and dark mode
- **Vite** for build tooling
- **React Router v6** for nested routes under a persistent layout
- No backend — all data is in `src/data/mockData.ts`

## Design tokens

| Token | Value |
|-------|-------|
| GBC Navy | `#1B3F89` (the brand) |
| Action Blue | `#2563EB` (primary CTA) |
| Page bg (light) | `#E8EBF0` |
| Page bg (dark) | `#0C0F1A` |
| Card bg (light) | `white` |
| Card bg (dark) | `#1A2236` |

Course-specific colours: 2D=`#F97316` · IS=`#EC4899` · IA=`#EF4444` · VD=`#8B5CF6` · CE=`#06B6D4` · TD=`#22C55E`

## Project structure

```
src/
├── pages/              # Route-level components — 15 pages including
│                       #   Dashboard, Courses, CoursePage, AssignmentPage,
│                       #   Grades, ActivityStream, Calendar, Messages,
│                       #   Notifications, Communities, Resources, Tools,
│                       #   Profile, NotFound, Changelog (standalone)
├── components/         # Shared UI primitives
│   ├── Layout, Sidebar, TopBar, Tour       # App chrome
│   ├── DemoBanner, TenantSwitcher          # Meta surfaces
│   ├── ComposeModal, ThreadDetailModal,    # Overlays
│   │   AccessibilitySettingsModal
│   ├── course/                             # CoursePage sub-components
│   └── tools/ToolLogos                     # Inline SVG brand marks
├── context/
│   ├── ThemeContext                        # Light/dark mode
│   ├── TenantContext                       # Multi-tenant skin
│   └── ToastContext                        # Action feedback
├── data/
│   └── mockData.ts     # Single source of truth (~1700 lines)
├── utils/
│   └── grades.ts       # Letter grade scale + score colour helpers
└── App.tsx             # Route registration
```

**See also:** [`DESIGN_DECISIONS.md`](DESIGN_DECISIONS.md) for design rationale organised by system, and **/changelog** inside the running prototype for version-by-version iteration history.

## Running it locally

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build to dist/
```

## Versioning

Semantic versioning, with each version branched from `main`. Notable milestones:

- **v2.5** — Realistic grade book + winter term history
- **v2.6** — Course structure deepened (announcements, syllabus, office hours; all 6 courses populated)
- **v2.7** — Student power features (Today's Schedule, Semester Stats, **Smart Priority Card**)
- **v2.8** — Empty states, error states, loading skeletons
- **v2.9** — WCAG 2.2 AA accessibility pass
- **v3.0** — Portfolio polish (README case study, demo banner)
- **v4.0–v4.1** — Dashboard restructure, copy + privacy audit
- **v4.4** — Tools page overhaul with real product logos
- **v4.5–v4.6** — Dead-end audit + real GBC integrations (real URLs, real service copy)
- **v4.8** — Dashboard rebalance — Recent Grades replaces aggregate Grades widget
- **v4.9** — Puppeteer capture pipeline (14 PNGs + 6 hover videos for the Framer case study)
- **v4.10** — Student-first onboarding rebuild + 21-fix audit pass
- **v4.11** — Typography swap: Inter → **IBM Plex Sans**
- **v4.12–v4.13** — Round 2 audit (Communities modal, Messages actions) + dark-mode contrast pass
- **v4.14** — `/changelog` page documenting every version
- **v4.15** — **Multi-tenant pivot** — same redesign skinned for 4 Canadian institutions
- **v4.16** — Spotlight product tour replaces modal-based onboarding
- **v4.17** — Per-tenant colour theming across nav, links, avatars, trim — full global sweep

**Current:** v4.17.4. Full version history with screenshots and rationale lives at `/changelog` in the running prototype.

## Acknowledgements

This is a **student portfolio project**. It is **not affiliated with Blackboard** (or its parent Anthology), **George Brown College**, or any of the third-party tools referenced inside the demo (Turnitin, Zoom, Figma, etc.). All logos and trademarks belong to their respective owners. Any teacher names, student names, and grades are entirely fictional.

Built by [James Ibitoye](https://jamesibitoye.framer.website)
