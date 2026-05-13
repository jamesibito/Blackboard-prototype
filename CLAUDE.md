# Blackboard Prototype — Claude Instructions

## Project
React 19 + TypeScript + Tailwind CSS v4 + Vite. Portfolio prototype of a Blackboard LMS redesign for George Brown College. Student persona: Kevin H. (Fall 2022).

## Versioning

This project uses semantic versioning: **vMAJOR.MINOR.PATCH**

| Bump | When to use |
|------|-------------|
| PATCH (x.x.**1**) | Bug fixes, visual tweaks, copy changes — nothing new |
| MINOR (x.**1**.0) | New feature, new page, or meaningful new capability |
| MAJOR (**1**.0.0) | Complete redesign of a section or structural overhaul |

**Current version: v2.7.0** — update this line every time a version merges to main.

Before starting any task, determine the correct next version number and use it everywhere (branch name, commit message, and summary to the user).

## Git Workflow — ALWAYS follow this

### Before writing any code
1. Run `git branch --show-current` — confirm you're on `main` (or the right base)
2. Determine the next version number (see table above)
3. Create a branch: `git checkout -b v<next-version>`
   - Examples: `git checkout -b v2.5.1`, `git checkout -b v2.6.0`, `git checkout -b v3.0.0`
4. **Never commit directly to `main`**

### While working
- Commit logically grouped changes as you go — don't batch everything into one giant commit
- Prefix commit messages with the version: `feat(v2.6.0): ...` / `fix(v2.5.1): ...`

### After finishing a task
1. Run `npm run build` — fix all TypeScript errors before presenting work
2. Tell the user:
   - What version branch you're on (e.g. "ready on branch `v2.6.0`")
   - A plain-English bullet list of what changed
3. **Stop and wait for approval — do not merge to main**

### Merging to main (only after user approves)
1. `git checkout main`
2. `git merge v<version> --no-edit`
3. `git push origin main`
4. `git push origin v<version>` — keeps the branch visible on GitHub as a snapshot
5. Update the **Current version** line in this file

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
