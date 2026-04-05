import Link from 'next/link'
import { Zap } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Mini UI Components — CSS-only product mockups                     */
/* ------------------------------------------------------------------ */

function DashboardMockup() {
  return (
    <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-5 w-full max-w-sm shadow-[0_0_40px_rgba(244,63,94,0.06)]">
      {/* Timer */}
      <div className="text-center mb-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">
          Focus Sprint
        </div>
        <div className="font-mono text-5xl text-rose-400 font-bold tracking-tight shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          18:42
        </div>
      </div>

      {/* Current task */}
      <div className="bg-[#0a0a0e] rounded px-3 py-2 mb-4 border border-gray-800/40">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Current Task</div>
        <div className="text-sm text-gray-200 font-medium">Refactor auth module</div>
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-[11px] text-gray-500 mb-4 px-1">
        <span>Sessions: <span className="text-gray-300">4</span></span>
        <span>Focused: <span className="text-gray-300">2h 14m</span></span>
        <span>Distractions: <span className="text-rose-400">3</span></span>
      </div>

      {/* Task queue */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Queue</div>
        {[
          { task: 'Write unit tests for payments', priority: 'bg-red-500' },
          { task: 'Review PR #248', priority: 'bg-yellow-500' },
          { task: 'Update API documentation', priority: 'bg-green-500' },
        ].map((item) => (
          <div key={item.task} className="flex items-center gap-2 text-xs text-gray-400 py-1 px-2 bg-[#0a0a0e]/60 rounded">
            <span className={`w-2 h-2 rounded-full ${item.priority} shrink-0`} />
            {item.task}
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanMiniUI() {
  return (
    <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-3 w-full max-w-[240px]">
      {[
        { task: 'Refactor auth module', priority: 'bg-red-500' },
        { task: 'Review PR #248', priority: 'bg-yellow-500' },
        { task: 'Update docs', priority: 'bg-green-500' },
      ].map((item) => (
        <div key={item.task} className="flex items-center gap-2 text-xs text-gray-400 py-1.5 px-2 border-b border-gray-800/40 last:border-0">
          <span className="text-gray-600 cursor-grab">::</span>
          <span className={`w-2 h-2 rounded-full ${item.priority} shrink-0`} />
          <span className="text-gray-300">{item.task}</span>
        </div>
      ))}
    </div>
  )
}

function SprintMiniUI() {
  return (
    <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-4 w-full max-w-[240px] text-center">
      {/* Timer ring */}
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#1f1f2e" strokeWidth="4" />
          <circle cx="40" cy="40" r="35" fill="none" stroke="#f43f5e" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 35 * 0.6} ${2 * Math.PI * 35 * 0.4}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-rose-400 font-bold">
          15:00
        </div>
      </div>
      <div className="text-xs text-gray-300 font-medium mb-1">Refactor auth module</div>
      <div className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-[#0a0a0e] rounded px-2 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Do not disturb
      </div>
    </div>
  )
}

function BreakMiniUI() {
  return (
    <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-4 w-full max-w-[240px] text-center">
      <div className="font-mono text-2xl text-gray-400 mb-2">3:22</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Break</div>
      <div className="flex justify-between text-[11px] text-gray-500 px-2">
        <span>25m focused</span>
        <span className="text-green-500">0 distractions</span>
      </div>
    </div>
  )
}

function ReviewMiniUI() {
  return (
    <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-4 w-full max-w-[240px]">
      <div className="flex items-end gap-1.5 h-16 mb-2 px-2">
        {[
          { h: '75%', distractions: 0 },
          { h: '100%', distractions: 1 },
          { h: '90%', distractions: 0 },
          { h: '60%', distractions: 2 },
        ].map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="relative w-full">
              {bar.distractions > 0 && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {Array.from({ length: bar.distractions }).map((_, j) => (
                    <span key={j} className="w-1 h-1 rounded-full bg-red-500" />
                  ))}
                </div>
              )}
              <div
                className="w-full bg-rose-500/70 rounded-sm min-h-[4px]"
                style={{ height: bar.h }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 px-2">
        <span>S1</span><span>S2</span><span>S3</span><span>S4</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phases data                                                       */
/* ------------------------------------------------------------------ */

const PHASES = [
  {
    num: '01',
    name: 'Plan',
    desc: 'Queue your tasks. Set priorities. Choose your first sprint.',
    ui: <PlanMiniUI />,
  },
  {
    num: '02',
    name: 'Sprint',
    desc: '25 minutes. One task. Full attention.',
    ui: <SprintMiniUI />,
  },
  {
    num: '03',
    name: 'Break',
    desc: '5 minutes. Step away. Your progress is saved.',
    ui: <BreakMiniUI />,
  },
  {
    num: '04',
    name: 'Review',
    desc: 'See where your focus held. See where it broke.',
    ui: <ReviewMiniUI />,
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0e] text-gray-200">
      {/* Nav */}
      <nav className="border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-lg tracking-tight">
            <Zap className="w-5 h-5" />
            FocusFlow
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-500 hover:text-gray-300 transition text-sm">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — copy */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Measure your focus.
              <br />
              <span className="text-rose-400">Protect your time.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              A structured sprint system that turns scattered effort into
              deep work you can measure, repeat, and improve.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="font-semibold bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg transition-colors text-sm tracking-tight"
              >
                Start a focus sprint
              </Link>
              <Link
                href="#workflow"
                className="font-semibold border border-gray-700 hover:border-gray-600 text-gray-300 px-6 py-2.5 rounded-lg transition-colors text-sm tracking-tight"
              >
                See today&#39;s workflow
              </Link>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="flex-shrink-0">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 2 — A workday in four phases                        */}
      {/* ============================================================ */}
      <section id="workflow" className="py-20 bg-[#0c0c12]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-2">
            A workday in four phases
          </h2>
          <p className="text-gray-500 text-center text-sm mb-14 max-w-md mx-auto">
            The same cycle, every session. Plan, execute, rest, learn.
          </p>

          {/* Timeline — desktop horizontal, mobile vertical */}
          <div className="hidden lg:grid grid-cols-4 gap-0 relative">
            {/* Connector line */}
            <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-px bg-gray-700" />

            {PHASES.map((phase, i) => (
              <div key={phase.num} className="relative flex flex-col items-center text-center px-3">
                {/* Phase number dot */}
                <div className="w-9 h-9 rounded-full bg-[#111118] border border-gray-700 flex items-center justify-center text-xs font-mono text-rose-400 font-bold mb-5 relative z-10">
                  {phase.num}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-200 mb-1">
                  {phase.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4 max-w-[200px] leading-relaxed">
                  {phase.desc}
                </p>
                {phase.ui}
              </div>
            ))}
          </div>

          {/* Mobile — vertical */}
          <div className="lg:hidden space-y-8">
            {PHASES.map((phase, i) => (
              <div
                key={phase.num}
                className={`flex flex-col sm:flex-row items-start gap-4 p-5 rounded-lg ${
                  i % 2 === 0 ? 'bg-[#111118]' : 'bg-[#0e0e16]'
                }`}
              >
                <div className="shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#0a0a0e] border border-gray-700 flex items-center justify-center text-xs font-mono text-rose-400 font-bold">
                    {phase.num}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-200 mb-1">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{phase.desc}</p>
                  {phase.ui}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 3 — The difference is measurable                    */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-2">
            The difference is measurable
          </h2>
          <p className="text-gray-500 text-center text-sm mb-14 max-w-md mx-auto">
            Real metrics from a 4-week structured sprint workflow.
          </p>

          {/* Before / After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Before */}
            <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-6">
              <div className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold mb-5">
                Before FocusFlow
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Context switches / day', value: '42' },
                  { label: 'Deep work hours / day', value: '2.1' },
                  { label: 'Task completion rate', value: '67%' },
                ].map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">{m.label}</span>
                    <span className="font-mono text-xl font-bold text-red-400/70">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="bg-[#111118] border border-rose-500/20 rounded-lg p-6">
              <div className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 font-semibold mb-5">
                After 4 weeks
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Context switches / day', value: '11', color: 'text-green-400' },
                  { label: 'Deep work hours / day', value: '5.4', color: 'text-green-400' },
                  { label: 'Task completion rate', value: '94%', color: 'text-rose-400' },
                ].map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">{m.label}</span>
                    <span className={`font-mono text-xl font-bold ${m.color}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly progression chart */}
          <div className="bg-[#111118] border border-gray-800/60 rounded-lg p-5">
            <div className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold mb-4">
              Deep work hours / week
            </div>
            <div className="flex items-end gap-2 h-24">
              {[
                { w: 'W1', h: 25, val: '10.5' },
                { w: 'W2', h: 45, val: '18.2' },
                { w: 'W3', h: 65, val: '23.1' },
                { w: 'W4', h: 90, val: '27.0' },
              ].map((bar) => (
                <div key={bar.w} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-mono">{bar.val}h</span>
                  <div
                    className="w-full bg-gradient-to-t from-rose-500/60 to-rose-400/80 rounded-sm"
                    style={{ height: `${bar.h}%` }}
                  />
                  <span className="text-[10px] text-gray-600">{bar.w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION: Academy                                             */}
      {/* ============================================================ */}
      <section className="py-16 bg-[#0a0a10]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-rose-400/80 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
              Academy
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Learn the Science
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Master the research behind focus and productivity with structured lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { title: 'Attention Science', subtitle: 'How your brain allocates focus and why it fails', icon: '🧠' },
              { title: 'Deep Work', subtitle: 'Cal Newport\'s framework for distraction-free productivity', icon: '📵' },
              { title: 'The Procrastination Brain', subtitle: 'Why we delay and how to rewire the pattern', icon: '⏳' },
            ].map((ch) => (
              <div key={ch.title} className="bg-[#111118] border border-gray-800/60 rounded-lg p-5 hover:border-rose-500/20 hover:shadow-[0_0_30px_rgba(244,63,94,0.06)] transition-all duration-300">
                <div className="text-2xl mb-3">{ch.icon}</div>
                <h3 className="text-gray-200 font-semibold text-sm mb-1.5">{ch.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{ch.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/academy"
              className="inline-block border border-gray-800 hover:border-rose-500/30 text-gray-400 hover:text-rose-400 px-7 py-2.5 rounded-lg text-sm transition-all"
            >
              Explore Academy &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 4 — CTA                                             */}
      {/* ============================================================ */}
      <section className="py-16 bg-[#0c0c12]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Stop planning to focus. <span className="text-rose-400">Start.</span>
          </h2>
          <Link
            href="/signup"
            className="inline-block font-semibold bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg transition-colors text-sm tracking-tight"
          >
            Begin your first sprint
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/40 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <Zap className="w-3.5 h-3.5" />
            FocusFlow -- Part of the <span className="text-rose-400/70 ml-0.5">HumanOS</span> ecosystem
          </div>
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} HumanOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
