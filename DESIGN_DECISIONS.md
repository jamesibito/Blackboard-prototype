# Blackboard Redesign — Design Decisions Log

A running record of intentional design choices, tradeoffs, and rationale. Useful for case study storytelling and portfolio write-ups.

---

## Typography

**Decision:** Switched from system-ui to Inter (Google Fonts CDN)
**Rationale:** Inter is designed specifically for screen readability at small sizes. It has tighter letter-spacing, a taller x-height, and more consistent weight variants than system-ui across Mac/Windows. The improvement is most visible in the data-dense Grades and Activity Stream screens.
**Tradeoff:** Adds a network request on first load. Mitigated by `display=swap` and preconnect hints — no layout shift, and subsequent loads are cached.

**Type scale used:**
- `10–11px` — labels, badges, meta text (uppercase tracking for labels)
- `12–13px` — body text, list items, form inputs
- `14–15px` — card titles, section headings
- `16px` — page-level headings (with tight tracking)
- `24px` — primary H1 headings
- `26–32px` — hero/stat numbers

---

## Color System

**Palette:**
- `#1B3F89` — GBC Navy (sidebar header, welcome banner base)
- `#2563EB` — Action Blue (CTAs, active nav, links, focus rings)
- `#60A5FA` — Dark mode blue (lighter for contrast on dark backgrounds)

**Per-course colors** were chosen to be distinct and accessible:
- 2D Visualization: `#F97316` (amber-orange)
- Interactive Systems: `#EC4899` (pink)
- Information Architecture: `#EF4444` (red)
- Visual Design: `#8B5CF6` (violet)
- College English: `#06B6D4` (cyan)
- Technical Drawing: `#22C55E` (green)

**Tradeoff:** Six distinct hues risk visual noise on screens with many course indicators. Mitigated by using low-opacity fills (color + `15`–`20` hex alpha) for backgrounds, keeping saturation in contained elements (avatars, progress rings, left borders).

---

## Dark Mode

**Implementation:** CSS class toggle (`dark`) on `<html>` via ThemeContext + localStorage. Tailwind's `darkMode: 'class'` strategy.

**Dark mode palette:**
- Main background: `#0C0F1A` (very dark navy-black, avoids pure black)
- Sidebar: `#131825`
- Card surfaces: `#1A2236`
- Secondary surfaces / hover: `#232d42`
- Borders: `#2D3A52` (light) / `#1E2A3F` (subtle dividers)

**Rationale:** The blue-navy tint in dark backgrounds keeps the UI feeling branded rather than generic grey-black. Matches the GBC navy identity.

**Tradeoff:** More specific than a simple grey ramp. Requires careful maintenance if adding new surfaces. Documented here so future screens stay consistent.

---

## Navigation & Sidebar

**Order:** Home → Courses → Grades → Activity Stream → Calendar → Messages → Communities → Resources → Tools

**Rationale:** Ordered by daily-use frequency for a student. Home and Courses are the entry points. Grades and Activity Stream are the primary value-add of the redesign (the core pain points). Calendar and Messages are supporting utilities. Communities/Resources/Tools are lower-frequency.

**Active state:** Background fill (`#2563EB` at 8–12% opacity) + left pill indicator + text color change + icon stroke-width increase. Three simultaneous signals prevent reliance on color alone.

**Tradeoff:** The Figma has slight inconsistencies in sidebar order between screens. The prototype uses one consistent order derived from the light-mode Dashboard Figma, treating it as the canonical reference.

---

## Dashboard

**Welcome Banner:** Gradient (`#1B3F89 → #2563EB`) with three decorative circles (white at 4–7% opacity) layered in the background. Gives depth without adding images or requiring assets.

**Stat cards at bottom:** Added three quick stats (Assignments Completed, Upcoming Deadlines, Semester Average) not in the Figma. Rationale: these are the most anxiety-inducing unknowns for a student on the dashboard — surfacing them reduces clicks and communicates at a glance.

**Mini calendar "today" marker:** Dec 14 is marked as today for the demo. Blue filled circle + ring glow. Distinct from event highlights which use course colors.

---

## Activity Stream

**Expand behavior:** Cards are click-to-expand (accordion), NOT always-expanded as shown in the Figma dark mode screen. The Figma light mode shows a collapsed state too, and the dark mode appears to be an earlier iteration.

**Rationale for click-to-expand:**
1. Scales better — 6+ items would create an extremely long scroll if all expanded
2. Allows scanning titles/types quickly before committing to reading
3. More aligned with how a student would actually use the stream (triage then read)

**Filter bar (new feature):** Added a dual-filter system — Type (Resource/Assignment/Grade/Announcement) and Course (abbreviation chips). First item in each stream is pre-expanded on load to demonstrate the interaction.

**Design decision:** Filters use `style` for active color (course-specific) and Tailwind for inactive state. This keeps dark mode working for the inactive state while allowing per-course dynamic colors when active.

---

## Grades

**Letter grade system added:** Converts raw percentage to letter grade using Ontario standard scale (A+ ≥ 90, A ≥ 80, B+ ≥ 73, etc.). Shown as a badge on each card and in the overall summary banner.

**"Hide grades" toggle:** Allows masking of all numerical data. UX rationale: students sometimes share their screen in class or study sessions — a quick privacy toggle is genuinely useful. The toggle is the Eye icon already present in the Figma.

**GPA summary bar:** Added above the card grid. Shows overall average prominently + per-course mini progress bars in a single row. Gives immediate context before diving into individual cards.

**Collapsed card state:** Shows horizontal skeleton bars (varied widths) instead of real data. Makes the collapsed state feel intentional rather than broken/empty.

---

## Calendar

**"Today" indicator:** Dec 14 used as the demo "today." Blue filled circle on the date number. In the side panel, a "Today" badge appears when the selected day is today.

**Side panel (new):** Clicking a day opens a slim right panel showing that day's events in detail. Avoids needing to hover/tooltip — works for touch and click equally. Not in the Figma; added for usability.

**Event chip style:** Left border accent + very low opacity fill (`color + 18` hex alpha). Matches the Figma's styling more closely than a solid colored chip, and legible in both modes.

**Week/Day views:** Stubbed with a polished empty state instead of "coming soon" text. Includes an icon and friendly copy, which looks more intentional in a portfolio context.

---

## Courses (New Page)

**Not in the Figma.** Designed from first principles based on the sidebar nav item and the course data already in the system.

**Layout:** 3-column card grid. Clicking a card opens an inline detail panel that slides in from the right (grid shifts to 2-col). Chosen over a separate route to keep context — you can still see the grid while reading a course detail.

**Card anatomy:**
- Color header band (5px) — course identity at a glance
- Avatar + name/code/instructor
- Completion progress bar with module count
- Letter grade badge (top right)
- Last activity + file count footer

**Module list in detail panel:** Shows each week/assignment as a row with completed/incomplete state. Gives a sense of where in the semester each course is. Only 2D Viz and Interactive Systems have module data (the others show a graceful empty state).

---

## Messages (New Page)

**Not in the Figma.** Designed as a standard two-panel email interface — familiar pattern that doesn't require learning.

**Left panel:** Message list with sender avatar (course-colored), subject, preview, timestamp, unread dot, tag badge, and star. Clicking marks as read.

**Right panel:** Full message body displayed as formatted paragraphs. Shows sender context (course pill if applicable). Reply bar at bottom is visual-only (not functional) — appropriate for a prototype.

**Message content:** All messages are grounded in the actual course content (instructor names, assignment names, grade data match the rest of the prototype). Makes the whole system feel coherent rather than generic.

---

## Search (TopBar Enhancement)

**Added ⌘K keyboard shortcut** to focus the search input. Industry-standard pattern (Notion, Linear, Figma all use it). The keybind hint displays in the empty input as a keyboard shortcut badge.

**Search dropdown:** Live-filters courses by name, code, or instructor as you type. Shows a "No results" state for unmatched queries. Result items are full-width with the course avatar, name, and instructor.

**Tradeoff:** Search only covers courses in this prototype — not resources or activity items. This scope limitation is realistic for a v1 feature and could be called out in the case study as a "future enhancement."

---

## Page Transitions

**Implementation:** `key={location.pathname}` on the `<main>` element causes a remount on route change. A `page-enter` CSS animation class fires on mount: `opacity: 0 → 1` + `translateY: 8px → 0` over 200ms.

**Rationale:** Provides spatial orientation (you're moving to a new "place") without being distracting. 200ms is fast enough to feel snappy but visible enough to register as a transition.

---

## v2.1 — Cross-linking & Depth

**Assignment Detail Pages (New):** Full assignment view with instructions, rubric table, deliverables list, submission area, and grade breakdown. Rubric rows show score bars with colour-coded feedback (green ≥80%, orange ≥60%, red <60%). Graded assignments show a large percentage + letter grade card. Submission area shows a file upload zone for upcoming assignments and a "Submitted & Graded" confirmation for completed ones.

**Course Detail Pages (New):** Dedicated `/courses/:id` route with full course header (grade badge, progress bar, info grid), module list with completion states and type badges, assignments list with status pills and scores, right sidebar with grades summary, recent activity, and instructor contact card. Replaces the old inline panel as the primary deep-dive view.

**Breadcrumb Navigation (New Component):** Contextual breadcrumbs on CoursePage and AssignmentPage. Pattern: Courses → Course Name → Assignment Name. Each segment is a link except the current page.

**Cross-linking:** Every dead end in v2.0 now connects somewhere:
- Dashboard course list → `/courses/:id`
- Dashboard "Due Soon" items → assignment detail (or course page if no assignment data)
- Activity Stream items → "View feedback" / "View assignment" links inside expanded cards
- Grade marks with assignment data → clickable to assignment detail pages
- Search results → navigate to course detail page
- "Continue Course" button → course detail page
- Compose button → opens a compose modal

**Compose Modal (New):** Slide-over modal with To, Course (dropdown), Subject, and Message fields. Includes a "This is a prototype" disclaimer. Triggered by the Compose button on Messages page.

**Class Schedule on Calendar (New):** Calendar side panel now shows class blocks derived from course schedule data. Classes appear under a "Classes" heading when a day is selected, separate from events/deadlines. Shows course name, time range, and room number.

**GBC Logo:** Replaced text-based "George Brown College" header in sidebar with the actual GBC logo image (`/public/gbc-logo.png`), displayed in white using CSS filters (`brightness-0 invert`).

**Footer Update:** Footer now shows "James Ibitoye" as a clickable link to the portfolio website. Opens in a new tab.

**More Activity Items:** Added 3 new activity stream items (CE grade release, IS presentation reminder, VD grade release) for a richer, more realistic stream.

**Spacing Pass:** Increased main content padding differentiation (px-8 py-7), added 0.5 spacing between sidebar nav items for better visual rhythm.

---

## Tradeoffs & Known Limitations

| Item | Status | Notes |
|------|--------|-------|
| Search covers courses only | Accepted | Realistic v1 scope |
| Week/Day calendar views | Stub | Complex to implement; stubbed gracefully |
| Communities / Resources / Tools | Stub | Out of scope for portfolio prototype |
| Reply in Messages | Visual only | Prototype — not functional |
| Compose modal | Visual only | Form renders, no actual send |
| File upload in assignment | Visual only | Upload area renders, no actual upload |
| Module data for 4 courses | Missing | Only 2D and IS have detailed modules |
| Real authentication | N/A | Prototype only |
| Mobile responsiveness | Not tested | Desktop-first, matching Figma |
