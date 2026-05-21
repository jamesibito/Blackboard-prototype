# Blackboard Redesign — Design Decisions Log

A running record of intentional design choices, tradeoffs, and rationale across the life of the prototype. Organised by system rather than version so the case study can pull from it directly.

For version-by-version iteration history with screenshots, see **[/changelog](src/pages/Changelog.tsx)** in the prototype itself.

---

## Persona & demo setting

**Kevin H.** — Year 2, Semester 1, Interaction Design program, George Brown College.

Demo "today" is pinned to **Wednesday, December 14, 2022 at 8:45 AM** — the week before finals. Every relative date in the prototype (notifications, deadlines, "due tomorrow", office-hours availability, time-of-day greetings) anchors off this fixed instant.

**Why a fixed date instead of `new Date()`:** real demos broke as the year turned over. Pinning the clock means anyone running the prototype in any year sees the same scenario the case study describes.

**Why "the week before finals":** highest-stakes moment in a student's semester. Smart Priority Card has the most signal, deadlines are dense, grades are pending, and announcements matter most.

---

## Multi-tenant theming (v4.15 → v4.17)

**Pivot.** Up through v4.14 the prototype was GBC-only. v4.15 reframed it as a multi-tenant design system that holds across four Canadian post-secondary institutions: **George Brown, York University, Wilfrid Laurier, McMaster**.

**Why.** Blackboard Learn ships to thousands of institutions and each one skins their own instance. A portfolio that ships one brand is a skin; one that holds across four is a system. The pivot also surfaced design-system weaknesses that didn't show up in the GBC-only build (hardcoded `#2563EB` in dozens of files, hardcoded "George Brown College" in the profile, etc. — see audit history in `/changelog`).

**How it works.** `TenantContext` (`src/context/TenantContext.tsx`) keeps the active tenant in localStorage and writes a set of CSS custom properties on `:root`:

```
--tenant-primary       /* sidebar brand, primary buttons */
--tenant-accent        /* secondary brand */
--tenant-gradient-from/via/to  /* welcome banner */
--tenant-nav-active    /* active sidebar item — must read on dark sidebar */
--tenant-link          /* light-mode link/action colour */
--tenant-link-dark     /* dark-mode link/action colour */
```

Components consume these via `bg-[var(--tenant-primary)]` or inline `style={{ color: 'var(--tenant-link)' }}` for dynamic surfaces. This avoids prop-drilling and means future surfaces opt-in by referencing the variable.

**Per-tenant identity:**

| | GBC | York | Laurier | McMaster |
|---|---|---|---|---|
| Brand | Navy #1B3F89 | Red #E31837 | Purple #582C83 | Maroon #7A003C |
| Accent | Blue #2563EB | Red #C8102E | Violet #7B3FB7 | Magenta #A2105E |
| Sidebar trim | rainbow stripe | white | gold #F0C03E | gold #F7A900 |
| Nav-active text | blue-400 | rose-300 | violet-400 | amber-400 |
| Logo | GBC mark | York mark | WLU mark | McMaster mark |

**Why dark text on light navigation badges for non-GBC tenants.** York/Laurier/McMaster nav-active colours (rose, violet, gold) are light because they need to read against the dark `#131825` sidebar. But white text on a light pill loses contrast — so the badge gets dark `#111827` text instead. GBC keeps white-on-blue because the blue is dark enough.

**TenantSwitcher.** Floating bottom-right pill that expands into a popover. Persists; reversible — collapse-to-chip rather than permanent dismiss (one-way dismissal was a usability trap in v4.16).

**Tradeoff.** Course-level colours (2D orange, IS pink, etc.) are explicitly NOT tenanted. Course identity is course identity — it shouldn't change when an institution skins differently. Same for dark-mode chrome (sidebar bg, page bg) which are theme-level concerns.

---

## Typography

**Final choice: IBM Plex Sans** (Google Fonts, weights 400/500/600/700).

**Iteration path:** system-ui → Inter (v2.x) → IBM Plex Sans (v4.11).

**Why Plex over Inter.** Inter is the SaaS default and reads as "I picked the safe choice" rather than "I made a typography decision." Plex has institutional warmth that fits an education product, more character than Geist or Public Sans, and is lower trend-risk than Geist (which is becoming The Cool Pick in 2024-25 portfolios).

**How the decision got made.** Five candidates evaluated side-by-side: Inter, Geist, Public Sans, Manrope, General Sans. A live `/font-vote` page (now in `tmp/`) showed the same dashboard screen rendered in each, plus a three-way comparison page for the finalists.

**Type scale:**
- `10–11px` — labels, badges, meta text (uppercase tracking for labels)
- `12–13px` — body text, list items, form inputs
- `14–15px` — card titles, section headings
- `16–17px` — page-level headings
- `22–24px` — primary H1 / hero numbers
- `48px` — Changelog hero

---

## Color system

**Brand palette (institution-agnostic constants):**
- Page bg: `#E8EBF0` (light) / `#0C0F1A` (dark)
- Card bg: `white` (light) / `#1A2236` (dark)
- Sidebar bg: `#131825` (always dark)
- Secondary surfaces / hover: `#232d42`
- Borders: `gray-100` (light) / `#2D3A52` (dark)

**Per-course colours** — chosen for distinctness at small sizes:
- 2D Visualization `#F97316` · Interactive Systems `#EC4899` · Information Architecture `#EF4444` · Visual Design `#8B5CF6` · College English `#06B6D4` · Technical Drawing `#22C55E`

**Tradeoff.** Six saturated hues risk visual noise. Mitigated by using low-opacity fills (`color + 15`–`20` hex alpha, or `color-mix(in srgb, c 8%, transparent)` for tenant-aware tints) for backgrounds and reserving full saturation for small contained elements (avatars, progress rings, left borders).

---

## Dark mode

**Implementation.** CSS class toggle (`dark`) on `<html>` via ThemeContext + localStorage. Tailwind's `darkMode: 'class'` strategy.

**Palette.** Navy-tinted ramp (`#0C0F1A → #131825 → #1A2236 → #232d42`) rather than neutral grey. Keeps the UI feeling branded vs generic. Documented above.

**Dark-mode contrast pass (v4.13).** 175 instances of `dark:text-gray-500` → `dark:text-gray-400` and 31 instances of `dark:text-gray-600` → `dark:text-gray-500`. The lower greys measured ~3.3:1 contrast on the dark ramp — failing WCAG AA for body text. The higher greys measure ~5.0:1, comfortably passing.

**Tradeoff.** Specific navy ramp is more maintenance than a neutral grey ramp would be. Documented here so future surfaces stay consistent.

---

## Navigation & sidebar

**Order:** Home → Courses → Grades → Activity Stream → Calendar → Messages → Communities → Notifications → Resources → Tools.

Ordered by daily-use frequency for a student. Home and Courses are entry points. Grades and Activity Stream are the primary value-add of the redesign (the core pain points). Calendar/Messages are supporting utilities. Communities/Resources/Tools are lower-frequency.

**Active state** uses three simultaneous signals to avoid colour-only differentiation: background fill (`var(--tenant-nav-active)` at low opacity) + left pill indicator + text colour change + icon stroke-width increase.

**Sidebar header.** GBC gets the full rainbow stripe across the top — it's their actual brand. Other tenants get a single secondary-colour stripe (white for York, gold for Laurier and McMaster). Logo files render via `brightness(0) invert(1)` filter to appear white on the dark header without per-tenant asset duplication.

**Logo size** is tuned per-mark (76/58/46/64px) because the logos have different aspect ratios and visual weight. One unified height made some marks feel cramped and others feel oversized.

---

## Dashboard

The most-iterated page in the prototype. Several restructures across v2.7 → v4.8.

**Final composition (v4.8+):**
- Welcome banner with tenant-gradient + decorative circles
- **Smart Priority Card** — surfaces one item by rule (due tomorrow > unread grade > almost-complete course)
- Today's Schedule (right column, top)
- Upcoming Deadlines horizontal timeline (Dec 14 marked TODAY)
- Courses widget (3 visible with progress bars + grades)
- **Recent Grades** (replaced aggregate Grades widget in v4.8)
- Calendar mini-month
- Activity Stream preview

**Why the Smart Priority Card.** The hardest part of a student's day is knowing what to do FIRST. A dashboard that lists ten things equally well solves nothing. The Priority Card answers "what should I do right now?" before the student looks anywhere else. Everything else on the dashboard is supporting evidence.

**Why Recent Grades replaced aggregate Grades (v4.8).** Course averages don't change day-to-day. New grade returns are exactly what students check the dashboard for. Two dashboard widgets in v4.7 weren't pulling their weight — the self-critique surfaced "this is a list of facts, not a recommendation."

**Why the dropped "Due Soon" widget (v4.8).** It duplicated the Deadline Timeline directly above it. Same data, less informative.

**Loading skeleton.** Mirrors the real layout exactly. 700ms artificial delay (was 1400ms until v4.17.2 — long enough to register, short enough not to feel laggy). The delay signals that the prototype handles real-world latency without making reviewers wait.

---

## Activity Stream

**Click-to-expand cards.** Not always-expanded as some early Figma frames showed. Reasons:
1. Scales — 6+ items would create excessive scroll
2. Allows scanning titles/types before committing to read
3. Matches how a student would actually use the stream (triage then read)

First item in each stream is pre-expanded on load to demonstrate the interaction without requiring a click.

**Dual-filter system.** Type (Resource/Assignment/Grade/Announcement) + Course (abbreviation chips). Active filters use the course colour via inline style; inactive use Tailwind classes. This keeps dark mode working for the inactive state while allowing per-course dynamic colours when active.

---

## Grades

**Letter grade system** uses the Ontario standard scale (A+ ≥ 90, A ≥ 80, B+ ≥ 73, …). Shown as a coloured badge on each course card and in the GPA summary banner.

**Hide grades toggle.** Eye icon already in the Figma, now wired to mask all numerical data. Students share screens in class and study sessions — a quick privacy toggle is genuinely useful. Profile page Academic Summary also respects this toggle (`hideGPA` state).

**GPA summary bar.** Above the card grid. Overall average prominently + per-course mini progress bars in one row. Immediate context before diving into individual cards.

---

## Calendar

**Demo "today" Dec 14** — blue filled circle on the date number.

**Side panel** — clicking a day opens a slim right panel showing that day's events + classes. Avoids hover/tooltip; works for touch and click equally. Class blocks derived from course schedule data; events from assignment deadlines.

**Event chip style.** Left border accent + low-opacity fill (`color + 18` hex alpha). Legible in both modes.

**Week/Day views.** Stubbed with polished empty state (icon + friendly copy) — looks intentional in a portfolio context vs "coming soon" filler text.

---

## Courses page + Course detail pages (v2.1)

**Courses index.** 3-column card grid. Clicking a card opens an inline slide-out detail panel from the right (grid shifts to 2-col). Chosen over a separate route to keep context — the grid stays visible while reading a course detail.

**Pinned CTAs in slide-out header (v4.16).** Primary actions ("Open Full Course" + "Grades") moved to the pinned header so they never scroll off-screen on short laptop viewports. Real bug surfaced by testing.

**Course detail page (`/courses/:id`).** Full route with:
- Header — grade badge, progress bar, info grid (instructor, schedule, room, credits, completion)
- Announcements section (pinned + recent)
- Modules list with type badges (lecture/reading/assignment/quiz/video/discussion) + completion states
- Assignments list with status pills + scores
- Resources (lecture slides, references) with download
- Right sidebar — grades summary, recent activity, instructor contact card
- Syllabus section (weighted grade breakdown + key policies)
- Office hours per instructor

**Module type colour-coding.** Six type icons let students scan for "find me the readings" or "what videos are unwatched" without reading every row.

---

## Assignment detail pages (v2.1+)

Full assignment view per route `/courses/:id/assignments/:id`:
- Instructions
- Rubric table — per-criterion weights, scores, feedback comments (score bars colour-coded ≥80% green / ≥60% orange / <60% red)
- Deliverables list — links to matching submitted files when graded
- Submission area — file upload zone for upcoming; "Submitted & Graded" confirmation for completed
- Grade card — large percentage + letter grade
- **Feedback thread** — instructor ↔ student back-and-forth, written in plausible-instructor voice ("good craft but missing the rationale doc")

**Why feedback threads matter.** A real LMS earns its keep by being where students get *coaching*, not just grades. Writing rubric-line feedback in believable instructor voice (specific, weary, action-oriented) is what makes the prototype feel real instead of clipart.

---

## Messages

Two-panel layout. Left = inbox list with sender avatar (course-coloured), subject, preview, timestamp, unread dot, tag badge, star. Right = full message body with sender context (course pill if applicable).

**Detail header actions (v4.12).** Star · Mark-as-unread · Archive · Delete. The earlier version had only a reply bar, which left every message detail as a near dead-end.

**Compose modal.** Slide-over with To, Course dropdown, Subject, Message. Triggered by Compose button on Messages and by "Email instructor" on course pages (prefilled with instructor + course code in that case). Visual-only — no actual send, with a "this is a prototype" disclaimer.

**All message content** is grounded in actual course content (instructor names, assignments, grade data match the rest of the prototype). Makes the whole system feel coherent rather than generic.

---

## Notifications

Grouped by time period: Today / This Week / Earlier. Each row has type icon (grade/assignment/announcement/resource), course pill, body, relative time, optional View link, unread dot.

**Hover-× to mark-read (v4.12).** Lets students dismiss a notification without navigating away — was a missing affordance before.

**Click row → mark-as-read AND navigate** (v4.10 fix). Was Mark-all-read only.

---

## Tools

12 real GBC integrations across 5 categories (Productivity / Assessment / Communication / Library & Research / Campus Services). Each card has logo, status chip (Active / Set up / Not active), description, show-more details, linked-courses chips, real launch URL.

**Why real URLs and real GBC service copy.** A portfolio prototype with placeholder Lorem Ipsum is a wireframe in disguise. Every tool link opens the real GBC page (Library catalogue, OSAP, STU-VIEW, Print Centre, Microsoft 365 sign-in, etc.). Reviewers can spend 10 minutes inside the prototype before they hit a dead end.

**Per-tool CTA labels.** Each tool gets a context-appropriate verb instead of a generic "Launch" — "Search Catalogue" for Library, "Book a Room" for Study Rooms, "Send a Print Job" for Print Centre. Falls back to status defaults for tools without a custom label.

**Logo treatment.** Inline SVG, brand palette where the mark is iconic (Figma's 5-shape mark, Microsoft's 4-square grid, LinkedIn "in", Zoom camera). Simpler text-monogram + brand-colour-circle for marks that don't have a distinctive shape (Turnitin "t", Grammarly "G", Respondus "R"). Path-based redraws of those text logos were tried in v4.17.3 and reverted in v4.17.4 — the originals looked cleaner at 28px.

---

## Search (TopBar)

**⌘K shortcut** focuses the search input. Industry-standard (Notion, Linear, Figma). The keybind hint displays in the empty input.

**Live-filter dropdown** for courses by name, code, instructor. Result rows go to the course detail page on click.

**Scope limitation.** Search covers courses only — not resources or activity items. Realistic v1 scope; called out as a "future enhancement" in case study notes.

---

## Onboarding evolution (v4.3 → v4.7 → v4.10 → v4.16)

Onboarding got it wrong three times before landing the right design.

**v4.3** — first OnboardingModal. Framed the prototype meta ("welcome — three things about this portfolio site"). Wrong framing: it explained the prototype to a reviewer instead of teaching the student.

**v4.7** — same modal, redesigned visuals. Still meta-framed. Still wrong.

**v4.10** — rebuilt the modal as a 5-step student tutorial (Welcome → Dashboard → Courses → Activity Stream → Tools). Tells the student how to use Blackboard, not how the prototype works. Right content, wrong medium.

**v4.16** — replaced the modal with a **spotlight Tour** component. 9 steps walking through real UI: Priority Card → Today's Schedule → Deadline Timeline → Courses → Sidebar → Search → Tenant switcher → done.

**Why spotlight beats modal.** The modal *described* the UI. The spotlight *points at it*. Notion / Linear / Figma all use spotlight for first-run because it teaches by pointing instead of explaining. Smart tooltip placement adapts to viewport edges; auto-scrolls target into view if off-screen; box-shadow cutout with a tenant-coloured glow ring spotlights each element.

**Demo banner is separate.** Top-of-page DemoBanner handles meta-context ("this is a UX redesign prototype, all data is fictional, click around freely"). The Tour handles in-app teaching. Splitting them solved the v4.3-v4.7 confusion: each surface has exactly one job.

**Replay path.** Profile page → Account → "Replay product tour" clears the localStorage flag and re-fires. Reset-demo footer link does the same plus clears the banner-seen flag.

---

## Accessibility — WCAG 2.2 AA pass (v2.9 + ongoing)

- Skip-to-content link on every page (`#main-content` target)
- Visible keyboard focus rings on every interactive element
- `prefers-reduced-motion` honoured globally via `index.css` — disables transitions and skeleton pulses
- ARIA labels on every icon-only button
- `role="dialog"` + `aria-modal` on overlays
- Escape key + focus management on modals (compose, accessibility settings, thread detail)
- Live regions on toast notifications
- Dark-mode contrast pass (v4.13) — see Dark Mode section

**Accessibility Settings modal** on Profile page lets students toggle: high-contrast mode, larger text, reduce motion. Persisted via localStorage.

---

## Believability — real data, real links, no dead ends

**Dead-end audit principle** (v4.5, v4.6, v4.10, v4.12). A prototype where buttons don't do anything fails the "I can imagine using this" test. Three sweeps of the prototype identified every interactive surface and gave each one a destination or a toast.

Examples:
- Dashboard course list → course detail page
- Dashboard "Due Soon" → assignment detail (or course page)
- Activity Stream → "View feedback" / "View assignment" inside expanded cards
- Grade marks with assignment data → assignment detail
- Search results → course detail
- "Continue Course" button → course detail
- Tool launch buttons → real external URL (Library, Microsoft 365, etc.)
- Resource downloads → toast confirmation + focus styles
- Calendar month chips → course page
- Communities thread → real detail modal (was the worst dead-end — fixed v4.12)

**Mock data coherence.** Every grade, comment, deadline, notification, message and feedback thread references things that exist elsewhere in the data. Same instructor names. Same assignment titles. Same course codes. INTR 1001 collision between Fall 2D and Winter UR caught in v4.10 audit.

---

## Page transitions

`key={location.pathname}` on `<main>` causes a remount on route change. A `page-enter` CSS animation fires on mount: `opacity 0 → 1` + `translateY 8px → 0` over 200ms.

200ms is fast enough to feel snappy but visible enough to register as a transition. Respects `prefers-reduced-motion`.

---

## 404 / Not Found

Catch-all route. Gradient watermark "404" uses `var(--tenant-gradient-*)` so it tracks the active institution. Recovery has two paths: primary CTA "Back to Dashboard" (tenant-primary background) + secondary "View courses". Mirrors the friendly empty-state pattern used in Notifications, Course-not-found, etc.

---

## Avatar (TopBar + Profile)

Iteration: "KH" letters → person silhouette with flat-bottom body → **circle-clipped silhouette in a circular frame** (v4.17.3-4 final).

Final form: head circle + body ellipse masked by a `clipPath` circle = no visible flat edge, scales clean at 32px and 80px alike. Matches how Notion / Linear / GitHub render placeholder avatars.

Container frame changed from `rounded-lg` to `rounded-full` in v4.17.4 because the squircle frame holding a circular silhouette inside was a leftover from the "KH" letters era.

---

## Project structure

```
src/
├── pages/                      # Route-level components (15 pages)
│   ├── Dashboard, Courses, CoursePage, AssignmentPage
│   ├── Grades, ActivityStream, CalendarPage
│   ├── Messages, Notifications, Communities, Resources, Tools
│   ├── ProfilePage, NotFound
│   └── Changelog (standalone, no Layout chrome)
├── components/
│   ├── Layout, Sidebar, TopBar, Tour
│   ├── DemoBanner, TenantSwitcher
│   ├── ComposeModal, ThreadDetailModal, AccessibilitySettingsModal
│   ├── Skeleton, ToastContainer, Breadcrumbs, Icons
│   ├── course/                 # CoursePage sub-components
│   │   └── CourseHeader, CourseSidebar, CourseAssignments, CourseResources
│   └── tools/
│       └── ToolLogos           # Inline SVG brand marks
├── context/
│   ├── ThemeContext            # Light/dark mode
│   ├── TenantContext           # Multi-tenant skin
│   └── ToastContext            # Action feedback
├── data/
│   └── mockData.ts             # Single source of truth — ~1700 lines
└── utils/
    └── grades.ts               # Letter grade scale + score-colour helpers
```

**Why no backend.** Mock-only by design — the prototype is about the *experience*, not the persistence. Single `mockData.ts` keeps everything coherent and lets the prototype boot in <1s.

---

## Capture pipeline (v4.9)

Three Puppeteer scripts at the repo root:
- `capture-case-study-screens.mjs` — 14 PNGs at 1440×900 @ 2x (light + dark for the major pages)
- `capture-case-study-videos.mjs` — 6 hover videos for the Framer Journey component
- `capture-type-samples.mjs` — typography exploration captures

Outputs to `public/case-study/` (~6.5 MB). The DemoBanner and onboarding are auto-dismissed via localStorage so they never appear in captures. Dark mode toggled by adding `dark` class on `<html>`.

Hand-screenshotting 14 pages × 2 themes × 6 videos was unsustainable. The scripted pipeline regenerates everything in ~30 seconds.

---

## Tradeoffs & known limitations

| Item | Status | Notes |
|------|--------|-------|
| Search covers courses only | Accepted | Realistic v1 scope |
| Week/Day calendar views | Stub | Complex to implement; stubbed gracefully |
| Reply in Messages | Visual only | Prototype — not functional |
| Compose modal | Visual only | Form renders, no actual send |
| File upload in assignment | Visual only | Upload area renders, no actual upload |
| Real authentication | N/A | Prototype only |
| Mobile responsiveness | Not implemented | Desktop-first, matching Figma; would be next phase |
| Course-level theming for non-GBC tenants | Same as GBC | Course identity not tenanted intentionally |
| Communities thread replies | Deterministic mock | Seeded from thread ID for stability across refreshes |

---

## What "done" means for the prototype

The prototype is shipped as **v4.17.4** on `main`. From here forward the work is **case study packaging** — narrative, screenshots, supporting media. The prototype itself doesn't need further iteration; this document is the reference for writing about it.
