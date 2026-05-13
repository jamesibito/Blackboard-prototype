# Blackboard Prototype — Claude Instructions

## Project
React 19 + TypeScript + Tailwind CSS v4 + Vite. Portfolio prototype of a Blackboard LMS redesign for George Brown College. Student persona: Kevin H. (Fall 2022).

## Git Workflow — ALWAYS follow this

### Before writing any code
1. Check the current branch: `git branch --show-current`
2. If already on `main`, create a feature branch: `git checkout -b <descriptive-name>`
   - Name format: `feat/short-description`, `fix/short-description`, `polish/short-description`
   - Examples: `feat/grade-detail-view`, `fix/logo-sizing`, `polish/dashboard-layout`
3. Never commit directly to `main`

### While working
- Commit logically grouped changes as you go — don't batch everything into one giant commit
- Use clear commit messages: what changed and why, not just what files were touched

### After finishing a task
1. Run `npm run build` — fix any TypeScript errors before presenting work
2. Tell the user: what branch you're on, what changed, and a short plain-English summary
3. **Stop here and wait for approval** — do not merge to main

### Merging to main
- Only merge after the user explicitly says they're happy (e.g. "looks good", "ship it", "merge it")
- Then: `git checkout main && git merge <branch> --no-edit && git push origin main`
- Then: `git push origin <branch>` so the branch is also visible on GitHub

## Code standards
- TypeScript strict — fix all `error TS6133` unused import errors before presenting
- No `console.log` left in committed code
- Tailwind classes preferred; inline `style={{}}` only for dynamic values (colors, sizes from data)
- Dark mode: all new UI elements must have `dark:` variants

## File structure
- Pages: `src/pages/`
- Shared components: `src/components/`
- All mock data: `src/data/mockData.ts` — no hardcoded data in components
- Context providers: `src/context/`
- Route registration: `src/App.tsx`

## Design tokens
- GBC Navy: `#1B3F89` | Action Blue: `#2563EB` | Dark Blue (hover): `#1D4ED8`
- Sidebar bg: `#131825` | Page bg: `#E8EBF0` (light) / `#0C0F1A` (dark)
- Card bg: `white` (light) / `#1A2236` (dark) | Border: `gray-100` (light) / `#2D3A52` (dark)
- Course colours — 2D: `#F97316` | IS: `#EC4899` | IA: `#EF4444` | VD: `#8B5CF6` | CE: `#06B6D4` | TD: `#22C55E`

## Demo reference
- Date: Wednesday, Dec 14 2022 at 8:45 AM
- Current semester: Fall 2022 | Past semester: Winter 2022
- Demo user: Kevin H. (student)
