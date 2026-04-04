'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity, TrendingUp, AlertTriangle } from 'lucide-react'

const DIMENSIONS = [
  { key: 'goals', label: 'Clear Goals', desc: 'You know exactly what to do at each step' },
  { key: 'feedback', label: 'Immediate Feedback', desc: 'You can tell how well you are doing' },
  { key: 'balance', label: 'Challenge-Skill Balance', desc: 'The task matches your ability level' },
  { key: 'merging', label: 'Action-Awareness Merging', desc: 'Actions feel automatic and effortless' },
  { key: 'concentration', label: 'Concentration', desc: 'You are fully focused on the task' },
  { key: 'control', label: 'Sense of Control', desc: 'You feel in charge of the situation' },
  { key: 'selfConsciousness', label: 'Loss of Self-Consciousness', desc: 'You are not worried about yourself' },
  { key: 'time', label: 'Time Distortion', desc: 'Time seems to pass differently than normal' },
]

const STORAGE_KEY = 'focusflow-flow-assessments'

interface Assessment {
  date: string
  scores: Record<string, number>
  total: number
}

function getInterpretation(score: number) {
  if (score >= 33) return { label: 'Deep Flow', color: 'text-green-400', bg: 'bg-green-400', desc: 'You are experiencing strong flow states. Maintain your current environment and challenge level.' }
  if (score >= 25) return { label: 'Moderate Flow', color: 'text-yellow-400', bg: 'bg-yellow-400', desc: 'You have good flow foundations. Focus on your weakest dimensions to deepen the experience.' }
  if (score >= 17) return { label: 'Emerging Flow', color: 'text-orange-400', bg: 'bg-orange-400', desc: 'Flow is intermittent. Work on establishing clearer goals and reducing distractions.' }
  return { label: 'Flow Blocked', color: 'text-rose-400', bg: 'bg-rose-400', desc: 'Significant barriers to flow exist. Start with the basics: clear goals and eliminating interruptions.' }
}

function getImprovementTip(key: string) {
  const tips: Record<string, string> = {
    goals: 'Before each session, write down exactly what you will accomplish. Break vague tasks into concrete next actions.',
    feedback: 'Use visible progress markers -- checklists, word counts, test results. Track output every 15 minutes.',
    balance: 'If too easy, add constraints (time limits, higher standards). If too hard, break into smaller sub-tasks.',
    merging: 'Reduce context switching. Close all unrelated tabs. Practice single-tasking for one week.',
    concentration: 'Use the FocusFlow timer with phone in another room. Start with shorter sessions and build up.',
    control: 'Prepare your environment before starting. Have all materials ready. Eliminate uncertainty.',
    selfConsciousness: 'Practice self-compassion. Remind yourself that mistakes are part of learning. Focus on process, not judgment.',
    time: 'Engage with tasks that are intrinsically motivating. If time drags, increase the challenge level slightly.',
  }
  return tips[key] || 'Focus on this dimension in your next session.'
}

export default function FlowAssessmentPage() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(DIMENSIONS.map(d => [d.key, 3]))
  )
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory] = useState<Assessment[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const interp = getInterpretation(total)

  const lowest = [...DIMENSIONS].sort((a, b) => scores[a.key] - scores[b.key]).slice(0, 2)

  function handleSubmit() {
    const assessment: Assessment = { date: new Date().toISOString(), scores: { ...scores }, total }
    const updated = [...history, assessment].slice(-30)
    setHistory(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
    setSubmitted(true)
  }

  function handleReset() {
    setScores(Object.fromEntries(DIMENSIONS.map(d => [d.key, 3])))
    setSubmitted(false)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/academy" className="inline-flex items-center gap-2 text-text-muted hover:text-accent-400 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <Activity className="w-8 h-8 text-rose-400" />
          Flow State Self-Assessment
        </h1>
        <p className="text-text-secondary mt-1">
          Rate Csikszentmihalyi&apos;s 8 characteristics of flow (1-5 each)
        </p>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-4">
            {DIMENSIONS.map((dim) => (
              <div key={dim.key} className="bg-bg-surface border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-text-primary">{dim.label}</h3>
                    <p className="text-sm text-text-muted">{dim.desc}</p>
                  </div>
                  <span className="text-2xl font-bold text-rose-400 ml-4 tabular-nums w-8 text-right">
                    {scores[dim.key]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-text-muted w-12">Rarely</span>
                  <input
                    type="range" min={1} max={5} step={1}
                    value={scores[dim.key]}
                    onChange={(e) => setScores(s => ({ ...s, [dim.key]: Number(e.target.value) }))}
                    className="flex-1 accent-rose-400 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-xs text-text-muted w-12 text-right">Always</span>
                </div>
                {/* Mini bar */}
                <div className="mt-2 w-full bg-bg-elevated rounded-full h-1.5">
                  <div
                    className="bg-rose-400 h-1.5 rounded-full transition-all duration-200"
                    style={{ width: `${(scores[dim.key] / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-text-muted text-sm mb-1">Current Flow Score</p>
            <p className="text-4xl font-bold text-rose-400">{total}<span className="text-lg text-text-muted">/40</span></p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors"
          >
            Submit Assessment
          </button>
        </>
      ) : (
        <>
          {/* Results */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-6 text-center">
            <p className={`text-lg font-semibold ${interp.color}`}>{interp.label}</p>
            <p className="text-5xl font-bold text-text-primary mt-2">{total}<span className="text-xl text-text-muted">/40</span></p>
            <p className="text-text-secondary mt-3 max-w-md mx-auto">{interp.desc}</p>
          </div>

          {/* Dimension bars */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" /> Dimension Breakdown
            </h2>
            {DIMENSIONS.map((dim) => (
              <div key={dim.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">{dim.label}</span>
                  <span className="text-text-primary font-medium">{scores[dim.key]}/5</span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      scores[dim.key] >= 4 ? 'bg-green-400' :
                      scores[dim.key] >= 3 ? 'bg-yellow-400' :
                      scores[dim.key] >= 2 ? 'bg-orange-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${(scores[dim.key] / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Improvement suggestions */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Improve Your Lowest Dimensions
            </h2>
            {lowest.map((dim) => (
              <div key={dim.key} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-400 font-semibold">{dim.label}</span>
                  <span className="text-xs bg-rose-400/10 text-rose-400 px-2 py-0.5 rounded-full">Score: {scores[dim.key]}/5</span>
                </div>
                <p className="text-sm text-text-secondary">{getImprovementTip(dim.key)}</p>
              </div>
            ))}
          </div>

          {/* History */}
          {history.length > 1 && (
            <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-text-primary mb-3">Assessment History</h2>
              <div className="flex items-end gap-1 h-24">
                {history.slice(-14).map((a, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-rose-400/80 rounded-t transition-all"
                      style={{ height: `${(a.total / 40) * 100}%` }}
                      title={`${new Date(a.date).toLocaleDateString()}: ${a.total}/40`}
                    />
                    <span className="text-[10px] text-text-muted">{a.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-bg-surface border border-gray-800 hover:border-rose-400/30 text-text-primary font-semibold rounded-xl transition-colors"
          >
            Take Again
          </button>
        </>
      )}
    </div>
  )
}
