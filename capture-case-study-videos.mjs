/**
 * capture-case-study-videos.mjs
 * Records short MP4 clips of key interactions for the Journey component
 * (06-Blackboard_Journey.tsx). Each video plays on hover over the matching
 * static PNG in Framer, then cross-fades back to the still.
 *
 * Run:
 *   1. Start the dev server: npm run dev   (port 5174)
 *   2. node capture-case-study-videos.mjs
 *
 * Output: public/case-study/videos/*.mp4
 *
 * Videos generated (5):
 *   journey-1-dashboard.mp4    — Scroll the dashboard (priority card → timeline)
 *   journey-2-course.mp4       — Click between sub-nav tabs on a course page
 *   journey-3-assignment.mp4   — Scroll assignment (instructions → rubric → deliverables)
 *   journey-4-submit.mp4       — Click into submission area (modal/state change)
 *   journey-5-feedback.mp4     — Scroll the instructor↔student feedback thread
 *
 * Bonus:
 *   before-after-after.mp4     — Dashboard skeleton → real content reveal
 */
import puppeteer from 'puppeteer'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const BASE = 'http://localhost:5174'
const OUT  = path.resolve('public/case-study/videos')

fs.mkdirSync(OUT, { recursive: true })

// ── Kill DemoBanner + OnboardingModal via localStorage ───────────────────────
async function dismissOverlays(page) {
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('gbc-bb-demo-banner-dismissed-v1', '1')
      localStorage.setItem('gbc-bb-onboarding-seen-v2', '1')
      localStorage.setItem('gbc-bb-onboarding-seen-v1', '1')
    } catch {}
  })
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, theme)
  await sleep(250)
}

// ── Find and click an element whose text contains the search string ──────────
async function clickByText(page, text) {
  await page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('a, button, [role="button"], [role="tab"]'))
    const match = els.find(e => e.textContent?.trim().toLowerCase().includes(t.toLowerCase()))
    match?.click()
  }, text)
  await sleep(500)
}

// ── Smooth scroll the page's main scroll container ──────────────────────────
async function smoothScroll(page, targetY, steps = 30, stepMs = 22) {
  await page.evaluate(async ({ targetY, steps, stepMs }) => {
    // Try common scroll containers in order: main content area, then body
    const candidates = [
      document.querySelector('main'),
      document.querySelector('[role="main"]'),
      document.querySelector('.overflow-y-auto'),
      document.scrollingElement,
    ].filter(Boolean)
    const el = candidates[0]
    if (!el) return
    const startY = el.scrollTop || 0
    for (let i = 0; i <= steps; i++) {
      const y = startY + ((targetY - startY) * i) / steps
      el.scrollTop = y
      await new Promise(r => setTimeout(r, stepMs))
    }
  }, { targetY, steps, stepMs })
}

// ── Recorder config — desktop 1440×900 capture at 30fps ─────────────────────
function recorderConfig() {
  return {
    followNewTab: false,
    fps: 30,
    videoFrame: { width: 1440, height: 900 },
    videoCrf: 20,
    videoCodec: 'libx264',
    videoPreset: 'medium',
    aspectRatio: '16:10',
    autopad: { color: 'white' },
  }
}

async function record(page, name, fn) {
  const recorder = new PuppeteerScreenRecorder(page, recorderConfig())
  const out = path.join(OUT, name)
  await recorder.start(out)
  await fn()
  await recorder.stop()
  const size = fs.statSync(out).size
  console.log(`  ✓ ${name} (${Math.round(size / 1024)}KB)`)
}

async function goto(page, route, settleMs = 1700) {
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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

  // ─── 1. JOURNEY 1 — Dashboard scroll ──────────────────────────────────────
  console.log('\n[1/6] journey-1-dashboard.mp4 (Dashboard scroll)')
  await goto(page, '/')
  await setTheme(page, 'light')
  await record(page, 'journey-1-dashboard.mp4', async () => {
    await sleep(700)
    await smoothScroll(page, 400, 35, 22)
    await sleep(600)
  })

  // ─── 2. JOURNEY 2 — Course sub-nav tabs ───────────────────────────────────
  console.log('[2/6] journey-2-course.mp4 (Course sub-nav)')
  await goto(page, '/courses/2D', 800)
  await record(page, 'journey-2-course.mp4', async () => {
    await sleep(800)
    // Click through the sub-nav tabs to demonstrate the standardised structure
    await clickByText(page, 'Assignments')
    await sleep(900)
    await clickByText(page, 'Resources')
    await sleep(900)
    await clickByText(page, 'Syllabus')
    await sleep(800)
  })

  // ─── 3. JOURNEY 3 — Assignment scroll ─────────────────────────────────────
  console.log('[3/6] journey-3-assignment.mp4 (Assignment scroll)')
  await goto(page, '/courses/2D/assignments/asgn-2d-5', 800)
  await record(page, 'journey-3-assignment.mp4', async () => {
    await sleep(700)
    await smoothScroll(page, 500, 40, 22)
    await sleep(500)
  })

  // ─── 4. JOURNEY 4 — Submit (scrolls past submission history to feedback) ──
  console.log('[4/6] journey-4-submit.mp4 (Submission area)')
  await goto(page, '/courses/2D/assignments/asgn-2d-5', 800)
  await record(page, 'journey-4-submit.mp4', async () => {
    await sleep(600)
    // Scroll down to the submission/rubric section
    await smoothScroll(page, 900, 40, 25)
    await sleep(600)
  })

  // ─── 5. JOURNEY 5 — Feedback thread reveal ────────────────────────────────
  console.log('[5/6] journey-5-feedback.mp4 (Feedback thread)')
  await goto(page, '/courses/2D/assignments/asgn-2d-5', 800)
  await record(page, 'journey-5-feedback.mp4', async () => {
    await sleep(400)
    // Scroll to bottom where instructor↔student thread lives
    await smoothScroll(page, 1600, 45, 24)
    await sleep(700)
  })

  // ─── 6. Bonus — Skeleton → real dashboard reveal ──────────────────────────
  console.log('[6/6] before-after-after.mp4 (Skeleton → dashboard reveal)')
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
  // Don't wait — start recording immediately to catch the 1.4s skeleton
  await record(page, 'before-after-after.mp4', async () => {
    await sleep(2400) // covers skeleton + paint + initial settle
  })

  await browser.close()

  console.log(`\n✅ All videos saved to:\n${OUT}\n`)
  fs.readdirSync(OUT)
    .filter(f => f.endsWith('.mp4'))
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
