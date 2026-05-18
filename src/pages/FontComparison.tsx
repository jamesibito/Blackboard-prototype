import { useEffect, useState } from 'react'
import { Clock, TrendingUp, ChevronRight } from '../components/Icons'

/**
 * FontComparison
 * ──────────────
 * Standalone (no Layout chrome) feedback page that renders the same UI
 * samples in three candidate typefaces side-by-side, so reviewers can
 * compare without flipping between live versions or screenshots.
 *
 * Lives on the `type-comparison-3way` branch only — not on main.
 *
 * Each column applies its font ONLY to itself (via `style={{ fontFamily }}`)
 * so the three render simultaneously without fighting over the global
 * --font-sans variable.
 */

interface Candidate {
  key: string
  name: string
  designer: string
  href: string
  stack: string
  blurb: string
  pros: string[]
  cons: string[]
}

const CANDIDATES: Candidate[] = [
  {
    key: 'geist',
    name: 'Geist',
    designer: 'Vercel · 2023',
    href: 'https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/geist-sans.css',
    stack: "'Geist', 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    blurb:
      "A refined sans designed for modern product UIs. Quietly more crafted than Inter — most visible in numbers and large display sizes.",
    pros: [
      'Excellent numerals (grades, percentages, dates)',
      'Reads as contemporary / current taste',
      'Free, MIT-licensed, well-maintained by Vercel',
    ],
    cons: [
      'Becoming ubiquitous in 2024–25 SaaS portfolios',
      'Less character / personality than Plex',
    ],
  },
  {
    key: 'plex',
    name: 'IBM Plex Sans',
    designer: 'Bold Monday · 2017',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
    stack: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    blurb:
      "Humanist sans with institutional warmth. Designed for IBM products — slight quirks in 'a', 'g', 'R' give text more character without sacrificing legibility.",
    pros: [
      'Subject-matter fit — feels native to an education product',
      "Reads as a 'considered' choice, not a trend",
      'Has more visible character than Geist or Public Sans',
    ],
    cons: [
      'Slightly less polished than Geist at large display sizes',
      'Heavier semantic weight — not pure neutrality',
    ],
  },
  {
    key: 'public',
    name: 'Public Sans',
    designer: 'US Web Design System · 2019',
    href: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800;900&display=swap',
    stack: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    blurb:
      "Open-source sans for the US Web Design System. Built explicitly for clarity, accessibility, and broad utility. Most neutral of the three.",
    pros: [
      "Zero aesthetic risk — accessibility-first design",
      'Closest to Inter — easiest transition',
      'Maintained by a government with strict design standards',
    ],
    cons: [
      "Looks very similar to Inter — reviewer may not notice the change",
      'Less distinct than Geist or Plex',
    ],
  },
]

// Inject all three fonts at mount so columns render correctly
function useThreeFonts() {
  useEffect(() => {
    CANDIDATES.forEach(c => {
      if (document.querySelector(`link[data-font-vote="${c.key}"]`)) return
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = c.href
      link.setAttribute('data-font-vote', c.key)
      document.head.appendChild(link)
    })
  }, [])
}

// ─── A vertical sample column (one font) ───────────────────────────────────────
function FontColumn({ candidate, voted, onVote }: {
  candidate: Candidate
  voted: boolean
  onVote: () => void
}) {
  return (
    <div
      style={{ fontFamily: candidate.stack }}
      className={`flex flex-col gap-5 p-6 rounded-3xl border transition-all
        ${voted
          ? 'bg-[#2563EB]/[0.04] border-[#2563EB]/40 ring-2 ring-[#2563EB]/30'
          : 'bg-white border-gray-200 hover:border-gray-300'}`}
    >

      {/* ── Header: name + designer ── */}
      <header className="pb-4 border-b border-gray-100">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h2 className="text-[22px] font-bold tracking-tight" style={{ letterSpacing: '-0.4px' }}>
            {candidate.name}
          </h2>
          {voted && (
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Your pick
            </span>
          )}
        </div>
        <p className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold">
          {candidate.designer}
        </p>
        <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">{candidate.blurb}</p>
      </header>

      {/* ── Sample 1: mini-dashboard banner with stats ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Welcome banner
        </p>
        <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#1B3F89] to-[#2563EB]">
          <h3 className="text-[19px] font-bold mb-1 tracking-tight">Welcome back, Kevin</h3>
          <p className="text-blue-100 text-[12.5px] leading-relaxed">
            You have <span className="font-semibold text-white">4 assignments</span> due soon.
          </p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-blue-200" />
              <span className="text-[11.5px] text-blue-100">
                Average: <strong className="text-white">71%</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] text-blue-100">
              <Clock size={11} className="text-blue-300" />
              <span>
                <strong className="text-white">2D</strong> in{' '}
                <strong className="text-white">15 min</strong>
                <span className="text-blue-200"> · SFC B108</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sample 2: grade rows (numeric-heavy) ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Recent grades
        </p>
        <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {[
            { title: 'Assignment 5 – Branded Design', course: '2D', courseColor: '#F97316', score: '18/25', pct: '72%', tone: { color: '#2563EB', bg: '#2563EB12' } },
            { title: 'Assignment 4 – Style Guide',    course: '2D', courseColor: '#F97316', score: '20/20', pct: '100%', tone: { color: '#22C55E', bg: '#22C55E12' } },
            { title: 'Project 3 – Interactive Proto', course: 'IS', courseColor: '#EC4899', score: '47/50', pct: '94%', tone: { color: '#22C55E', bg: '#22C55E12' } },
          ].map(g => (
            <div key={g.title} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[13px] text-gray-900 truncate">{g.title}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${g.courseColor}18`, color: g.courseColor }}
                  >
                    {g.course}
                  </span>
                  <span className="text-[10px] text-gray-400 tabular-nums">{g.score}</span>
                </div>
              </div>
              <div
                className="text-[12px] font-bold px-2.5 py-1 rounded-lg tabular-nums"
                style={{ background: g.tone.bg, color: g.tone.color }}
              >
                {g.pct}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample 3: long-form prose (the readability test) ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Instructor feedback (long-form readability)
        </p>
        <div className="rounded-2xl bg-gray-50 px-4 py-3.5">
          <p className="text-[12px] font-semibold text-gray-900 mb-1.5">Jaron Stewart · Dec 19</p>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            Good work overall, Kevin. The logo mark is holding up well — the proportions are solid and
            the palette feels considered. The main drag on your score was the application section. The
            mockup layouts looked like first passes rather than finished pieces, and the missing written
            rationale took your concept criterion from a 4 to a 2.
          </p>
        </div>
      </section>

      {/* ── Sample 4: type ramp (display → caption) ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Type ramp
        </p>
        <div className="rounded-2xl border border-gray-100 px-4 py-4 space-y-1.5">
          <p className="text-[32px] font-bold text-gray-900 tracking-tight leading-none" style={{ letterSpacing: '-0.5px' }}>
            Aa Gg 71%
          </p>
          <p className="text-[20px] font-semibold text-gray-800 leading-tight">
            Section heading style
          </p>
          <p className="text-[15px] text-gray-700 leading-relaxed">
            Body — the quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            Caption / supporting text · ABCDEFG 0123456789
          </p>
        </div>
      </section>

      {/* ── Pros / cons ── */}
      <section className="pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
              Pros
            </p>
            <ul className="space-y-1">
              {candidate.pros.map((p, i) => (
                <li key={i} className="text-[12px] text-gray-700 leading-relaxed flex gap-1.5">
                  <span className="text-emerald-500 shrink-0">+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1.5">
              Cons
            </p>
            <ul className="space-y-1">
              {candidate.cons.map((c, i) => (
                <li key={i} className="text-[12px] text-gray-700 leading-relaxed flex gap-1.5">
                  <span className="text-orange-400 shrink-0">−</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Vote button ── */}
      <button
        onClick={onVote}
        className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-bold transition-all
          ${voted
            ? 'bg-[#2563EB] text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        {voted ? `✓ ${candidate.name} is your pick` : `Pick ${candidate.name}`}
        {!voted && <ChevronRight size={14} />}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FontComparison() {
  useThreeFonts()

  // Local pick — purely for visual feedback. Not wired to anything.
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#F3F4F8]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page header ── */}
      <header className="bg-white border-b border-gray-200 px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[1.6px] text-[#2563EB]">
              Help me pick a font
            </span>
          </div>
          <h1 className="text-[34px] font-bold text-gray-900 tracking-tight" style={{ letterSpacing: '-0.6px', lineHeight: 1.15 }}>
            Three sans-serifs for the Blackboard redesign.
            <br />
            Which one feels right?
          </h1>
          <p className="text-[15px] text-gray-600 mt-3 leading-relaxed max-w-[640px]">
            Same content, three typefaces. Compare the welcome banner, the grade rows, the
            instructor feedback paragraph, and the type ramp. Pick whichever feels best at
            the work the app actually does. Share thoughts below.
          </p>
        </div>
      </header>

      {/* ── Three columns ── */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {CANDIDATES.map(c => (
            <FontColumn
              key={c.key}
              candidate={c}
              voted={picked === c.key}
              onVote={() => setPicked(c.key)}
            />
          ))}
        </div>

        {/* ── Footer: feedback prompt ── */}
        <footer className="mt-12 text-center pb-8">
          <p className="text-[14px] text-gray-600 leading-relaxed max-w-[520px] mx-auto">
            {picked ? (
              <>
                You picked <strong className="text-gray-900">
                  {CANDIDATES.find(c => c.key === picked)?.name}
                </strong>.
                Share thoughts with{' '}
                <a
                  href="mailto:jamie.ibitoye@gmail.com?subject=Font%20vote%20for%20Blackboard%20redesign"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Jamie
                </a>{' '}
                — what made it the right choice for you?
              </>
            ) : (
              <>
                No pressure on the vote — even a "they all look fine to me" is useful data.
                Share thoughts:{' '}
                <a
                  href="mailto:jamie.ibitoye@gmail.com?subject=Font%20vote%20for%20Blackboard%20redesign"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  jamie.ibitoye@gmail.com
                </a>
              </>
            )}
          </p>
        </footer>
      </main>
    </div>
  )
}
