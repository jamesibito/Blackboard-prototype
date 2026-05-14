/**
 * capture-case-study-screens.mjs
 * Captures Blackboard prototype screenshots for the Framer case study.
 * Desktop web app — viewport is 1440×900 @ 2x scale, output PNGs are flat
 * full-page renders meant to drop into the browser-frame mockups in the
 * Framer code components.
 *
 * Run:
 *   1. Start the dev server: npm run dev   (port 5174)
 *   2. node capture-case-study-screens.mjs
 *
 * Output: public/case-study/*.png
 *
 * Notes:
 *  • DemoBanner + OnboardingModal are dismissed via localStorage before paint
 *    so they never appear in the screenshots.
 *  • Dark mode is toggled by adding `dark` class to <html> (matches ThemeContext).
 *  • Skeleton loading on Dashboard runs ~1.4s — we wait it out before capture.
 *  • The DemoBanner localStorage key is bumped per version in source, so we
 *    set all known historical keys to '1' to be future-proof.
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const BASE = 'http://localhost:5174'
const OUT  = path.resolve('public/case-study')

fs.mkdirSync(OUT, { recursive: true })

// ── localStorage prep — kills the demo banner + onboarding modal globally ────
async function dismissOverlays(page) {
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('gbc-bb-demo-banner-dismissed-v1', '1')
      localStorage.setItem('gbc-bb-onboarding-seen-v2', '1')
      // Future-proof: any other keys that might exist
      localStorage.setItem('gbc-bb-onboarding-seen-v1', '1')
    } catch {}
  })
}

// ── Dark mode toggle (matches ThemeContext.tsx) ──────────────────────────────
async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, theme)
  await sleep(250)
}

// ── Reset to light (between captures so theme state is predictable) ──────────
async function resetLight(page) {
  await setTheme(page, 'light')
}

// ── Screenshot with consistent options ───────────────────────────────────────
async function shot(page, filename, opts = {}) {
  const { fullPage = false, waitMs = 700 } = opts
  await sleep(waitMs)
  const out = path.join(OUT, filename)
  await page.screenshot({
    path: out,
    type: 'png',
    fullPage,
    captureBeyondViewport: fullPage,
  })
  const size = fs.statSync(out).size
  console.log(`  ✓ ${filename} (${Math.round(size / 1024)}KB)`)
}

// ── Navigate to a path, wait for skeleton + paint settle ─────────────────────
async function goto(page, route, opts = {}) {
  const { settleMs = 1700 } = opts  // covers the 1.4s Dashboard skeleton + paint
  await page.goto(BASE + route, { waitUntil: 'networkidle0' })
  await sleep(settleMs)
}

async function run() {
  console.log('Launching Chrome…')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--window-size=1440,900'],
  })

  const page = await browser.newPage()
  await dismissOverlays(page)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  console.log('\n[1/14] Dashboard — light')
  await goto(page, '/')
  await resetLight(page)
  await shot(page, 'dashboard-light.png')

  console.log('[2/14] Dashboard — dark')
  await setTheme(page, 'dark')
  await shot(page, 'dashboard-dark.png')

  // ─── COURSE PAGE ───────────────────────────────────────────────────────────
  console.log('[3/14] Course (2D Visualization) — light')
  await resetLight(page)
  await goto(page, '/courses/2D', { settleMs: 800 })
  await shot(page, 'course-light.png')

  console.log('[4/14] Course — dark')
  await setTheme(page, 'dark')
  await shot(page, 'course-dark.png')

  // ─── ASSIGNMENT PAGE ───────────────────────────────────────────────────────
  console.log('[5/14] Assignment (graded with feedback) — light')
  await resetLight(page)
  await goto(page, '/courses/2D/assignments/asgn-2d-5', { settleMs: 800 })
  await shot(page, 'assignment-light.png', { fullPage: true })

  console.log('[6/14] Assignment — dark')
  await setTheme(page, 'dark')
  await shot(page, 'assignment-dark.png', { fullPage: true })

  // ─── ACTIVITY STREAM ───────────────────────────────────────────────────────
  console.log('[7/14] Activity Stream — light')
  await resetLight(page)
  await goto(page, '/activity-stream', { settleMs: 800 })
  await shot(page, 'activity-stream-light.png')

  // ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
  console.log('[8/14] Notifications — light')
  await goto(page, '/notifications', { settleMs: 800 })
  await shot(page, 'notifications-light.png')

  // ─── GRADES ────────────────────────────────────────────────────────────────
  console.log('[9/14] Grades — light')
  await goto(page, '/grades', { settleMs: 800 })
  await shot(page, 'grades-light.png')

  // ─── CALENDAR (month view default per research recommendation) ─────────────
  console.log('[10/14] Calendar — light')
  await goto(page, '/calendar', { settleMs: 800 })
  await shot(page, 'calendar-light.png')

  // ─── COURSES INDEX ─────────────────────────────────────────────────────────
  console.log('[11/14] Courses index — light')
  await goto(page, '/courses', { settleMs: 800 })
  await shot(page, 'courses-light.png')

  // ─── TOOLS ─────────────────────────────────────────────────────────────────
  console.log('[12/14] Tools — light')
  await goto(page, '/tools', { settleMs: 800 })
  await shot(page, 'tools-light.png', { fullPage: true })

  // ─── COMMUNITIES ───────────────────────────────────────────────────────────
  console.log('[13/14] Communities — light')
  await goto(page, '/communities', { settleMs: 800 })
  await shot(page, 'communities-light.png')

  // ─── MESSAGES ──────────────────────────────────────────────────────────────
  console.log('[14/14] Messages — light')
  await goto(page, '/messages', { settleMs: 800 })
  await shot(page, 'messages-light.png')

  await browser.close()

  console.log(`\n✅ All screenshots saved to:\n${OUT}\n`)
  fs.readdirSync(OUT)
    .filter(f => f.endsWith('.png'))
    .sort()
    .forEach(f => {
      const size = fs.statSync(path.join(OUT, f)).size
      console.log(`  ${f}  (${Math.round(size / 1024)}KB)`)
    })
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
