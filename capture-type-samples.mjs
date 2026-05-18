/**
 * capture-type-samples.mjs
 * Renders the SAME dashboard with different font-family overrides so we can
 * evaluate which typeface improves visual quality / readability.
 *
 * Dismisses the demo banner + onboarding modal so they don't distract.
 * Injects each candidate font via <link> tag, overrides --font-sans,
 * waits for fonts to load, screenshots.
 *
 * Output: tmp/type-samples/<font-key>.png
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const BASE = 'http://localhost:5173'
const OUT = path.resolve('tmp/type-samples')
fs.mkdirSync(OUT, { recursive: true })

// Candidate typefaces. Each entry:
//   key     — filename
//   name    — display name
//   href    — CSS @import URL (Google Fonts unless noted)
//   stack   — value to inject as --font-sans
const CANDIDATES = [
  {
    key: '01-inter-current',
    name: 'Inter (current)',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    stack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: '02-geist',
    name: 'Geist (Vercel)',
    // Geist isn't on Google Fonts; use jsDelivr's NPM-served stylesheet
    href: 'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/geist-sans.css',
    stack: "'Geist', 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: '03-ibm-plex-sans',
    name: 'IBM Plex Sans',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
    stack: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: '04-public-sans',
    name: 'Public Sans (US Gov OSS)',
    href: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800;900&display=swap',
    stack: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: '05-manrope',
    name: 'Manrope (softer alt)',
    href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
    stack: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  {
    key: '06-general-sans',
    name: 'General Sans (Indian Type Foundry)',
    // General Sans free via Fontshare CDN
    href: 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap',
    stack: "'General Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
]

async function dismissOverlays(page) {
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('gbc-bb-demo-banner-dismissed-v1', '1')
      localStorage.setItem('gbc-bb-onboarding-seen-v2', '1')
      localStorage.setItem('gbc-bb-onboarding-seen-v1', '1')
    } catch {}
  })
}

async function applyFont(page, cand) {
  // Inject the <link> tag
  await page.evaluate(({ href }) => {
    // Clean up previous override
    document.querySelectorAll('link[data-type-test]').forEach(l => l.remove())
    const existing = document.querySelectorAll('style[data-type-test]')
    existing.forEach(s => s.remove())

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-type-test', '1')
    document.head.appendChild(link)
  }, cand)

  // Wait for the new stylesheet to load. Fonts API tells us when font face fully loaded.
  await page.waitForFunction(
    () => {
      // Check if at least one of the new fonts is in document.fonts
      return document.fonts.ready.then(() => true)
    },
    { timeout: 10000 }
  ).catch(() => {})
  await sleep(500)

  // Override the CSS variable that drives the whole app
  await page.evaluate(({ stack }) => {
    const style = document.createElement('style')
    style.setAttribute('data-type-test', '1')
    style.textContent = `
      :root { --font-sans: ${stack} !important; }
      html, body, * { font-family: ${stack} !important; }
    `
    document.head.appendChild(style)
  }, cand)

  await sleep(800)
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

  // Load the dashboard once; we'll just swap fonts between captures
  console.log('Loading dashboard…')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1700) // wait through the skeleton

  for (const cand of CANDIDATES) {
    console.log(`\nApplying: ${cand.name}`)
    await applyFont(page, cand)
    const out = path.join(OUT, `${cand.key}.png`)
    await page.screenshot({ path: out, type: 'png' })
    const size = fs.statSync(out).size
    console.log(`  ✓ ${cand.key}.png (${Math.round(size / 1024)}KB)`)
  }

  await browser.close()

  console.log(`\n✅ All samples saved to:\n${OUT}\n`)
  fs.readdirSync(OUT).filter(f => f.endsWith('.png')).sort().forEach(f => {
    console.log('  ' + f)
  })
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
