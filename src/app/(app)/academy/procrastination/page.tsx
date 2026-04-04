'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Brain, Zap, Target, Shield, Clock } from 'lucide-react'

const FACTORS = [
  {
    key: 'expectancy',
    label: 'Expectancy',
    question: 'How confident are you that you can complete this task?',
    low: 'Not confident',
    high: 'Very confident',
    icon: <Target className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-400',
  },
  {
    key: 'value',
    label: 'Value',
    question: 'How meaningful or rewarding is this task to you?',
    low: 'Not meaningful',
    high: 'Very meaningful',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400',
  },
  {
    key: 'impulsiveness',
    label: 'Impulsiveness',
    question: 'How distracted or impulsive do you feel right now?',
    low: 'Very focused',
    high: 'Very distracted',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-amber-400',
    bg: 'bg-amber-400',
  },
  {
    key: 'delay',
    label: 'Delay',
    question: 'How far away is the deadline or reward?',
    low: 'Due now',
    high: 'Far away',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-400',
  },
]

interface Fix {
  title: string
  steps: string[]
}

const FIXES: Record<string, Fix> = {
  expectancy: {
    title: 'Boost Your Confidence',
    steps: [
      'Break the task into 3 smaller, concrete steps',
      'Start with the easiest sub-task to build momentum',
      'Recall a similar task you completed successfully',
      'Set a 10-minute "just start" commitment -- no pressure to finish',
    ],
  },
  value: {
    title: 'Increase the Task Value',
    steps: [
      'Connect this task to a personal identity goal ("I am someone who...")',
      'Pair the task with something enjoyable (music, good coffee)',
      'Visualize how completing it moves you toward your bigger vision',
      'Promise yourself a specific reward upon completion',
    ],
  },
  impulsiveness: {
    title: 'Reduce Distractions',
    steps: [
      'Put your phone in another room (not face-down -- completely away)',
      'Use FocusFlow timer with website blockers enabled',
      'Close all unrelated browser tabs and apps',
      'Tell someone you are entering a focus block -- social accountability',
    ],
  },
  delay: {
    title: 'Shrink the Timeline',
    steps: [
      'Set an artificial 2-hour deadline for the first deliverable',
      'Use Parkinson\'s Law: give yourself half the time you think you need',
      'Create intermediate milestones with their own mini-deadlines',
      'Schedule a check-in with someone for today to report progress',
    ],
  },
}

export default function ProcrastinationPage() {
  const [scores, setScores] = useState<Record<string, number>>({
    expectancy: 5, value: 5, impulsiveness: 5, delay: 5,
  })
  const [analyzed, setAnalyzed] = useState(false)

  const expectancy = scores.expectancy
  const value = scores.value
  const impulsiveness = Math.max(scores.impulsiveness, 0.5)
  const delay = Math.max(scores.delay, 0.5)

  const motivation = (expectancy * value) / (impulsiveness * delay)

  function getInterpretation() {
    if (motivation > 5) return { label: 'High Motivation', color: 'text-green-400', desc: 'You are motivated -- just start! The math is in your favor.' }
    if (motivation >= 2) return { label: 'Moderate Risk', color: 'text-yellow-400', desc: 'There is moderate procrastination risk. Address the weakest factor below.' }
    return { label: 'High Procrastination Risk', color: 'text-rose-400', desc: 'Significant risk of procrastination. Focus on the targeted fix below.' }
  }

  function getWeakest(): string {
    // For numerator factors (expectancy, value), lower is weaker
    // For denominator factors (impulsiveness, delay), higher is weaker (drives motivation down)
    const factors = [
      { key: 'expectancy', weakness: 10 - scores.expectancy },
      { key: 'value', weakness: 10 - scores.value },
      { key: 'impulsiveness', weakness: scores.impulsiveness },
      { key: 'delay', weakness: scores.delay },
    ]
    return factors.sort((a, b) => b.weakness - a.weakness)[0].key
  }

  const interp = getInterpretation()
  const weakest = getWeakest()
  const fix = FIXES[weakest]
  const weakestFactor = FACTORS.find(f => f.key === weakest)!

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/academy" className="inline-flex items-center gap-2 text-text-muted hover:text-accent-400 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <Brain className="w-8 h-8 text-rose-400" />
          Procrastination Decoder
        </h1>
        <p className="text-text-secondary mt-1">
          Temporal Motivation Theory analysis -- find and fix your procrastination trigger
        </p>
      </div>

      {/* Formula explanation */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
        <p className="text-sm text-text-muted mb-2">Steel&apos;s Temporal Motivation Theory (TMT)</p>
        <div className="text-center py-3">
          <span className="text-xl font-mono text-text-primary">
            Motivation = <span className="text-blue-400">Expectancy</span> x <span className="text-emerald-400">Value</span> / <span className="text-amber-400">Impulsiveness</span> x <span className="text-purple-400">Delay</span>
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {FACTORS.map(f => (
          <div key={f.key} className="bg-bg-surface border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className={f.color}>{f.icon}</span>
              <h3 className="font-semibold text-text-primary">{f.label}</h3>
              <span className={`text-lg font-bold ml-auto tabular-nums ${f.color}`}>{scores[f.key]}</span>
            </div>
            <p className="text-sm text-text-muted mb-3">{f.question}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted w-20">{f.low}</span>
              <input
                type="range" min={1} max={10} step={1}
                value={scores[f.key]}
                onChange={(e) => setScores(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                className={`flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  ${f.key === 'expectancy' ? 'accent-blue-400 [&::-webkit-slider-thumb]:bg-blue-400' :
                    f.key === 'value' ? 'accent-emerald-400 [&::-webkit-slider-thumb]:bg-emerald-400' :
                    f.key === 'impulsiveness' ? 'accent-amber-400 [&::-webkit-slider-thumb]:bg-amber-400' :
                    'accent-purple-400 [&::-webkit-slider-thumb]:bg-purple-400'
                  }`}
              />
              <span className="text-xs text-text-muted w-20 text-right">{f.high}</span>
            </div>
            <div className="mt-2 w-full bg-bg-elevated rounded-full h-1.5">
              <div className={`${f.bg} h-1.5 rounded-full transition-all duration-200`} style={{ width: `${(scores[f.key] / 10) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Live score */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl p-5 text-center">
        <p className="text-sm text-text-muted mb-1">Motivation Score</p>
        <p className={`text-5xl font-bold ${interp.color}`}>{motivation.toFixed(2)}</p>
        <p className={`text-sm font-semibold mt-1 ${interp.color}`}>{interp.label}</p>
      </div>

      <button
        onClick={() => setAnalyzed(true)}
        className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors"
      >
        Analyze & Get Fix
      </button>

      {analyzed && (
        <>
          {/* Interpretation */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
            <p className={`font-semibold ${interp.color} mb-2`}>{interp.label}</p>
            <p className="text-text-secondary text-sm">{interp.desc}</p>
          </div>

          {/* Weakest factor fix */}
          <div className="bg-bg-surface border border-rose-400/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={weakestFactor.color}>{weakestFactor.icon}</span>
              <h2 className="font-semibold text-text-primary">
                Weakest Factor: <span className={weakestFactor.color}>{weakestFactor.label}</span>
              </h2>
            </div>
            <h3 className="text-rose-400 font-semibold mb-3">{fix.title}</h3>
            <ul className="space-y-2">
              {fix.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-rose-400/10 text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Factor breakdown */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-text-primary mb-3">Factor Breakdown</h2>
            <div className="grid grid-cols-2 gap-3">
              {FACTORS.map(f => {
                const isNumerator = f.key === 'expectancy' || f.key === 'value'
                const status = isNumerator
                  ? (scores[f.key] >= 7 ? 'Strong' : scores[f.key] >= 4 ? 'Moderate' : 'Weak')
                  : (scores[f.key] <= 3 ? 'Strong' : scores[f.key] <= 6 ? 'Moderate' : 'Weak')
                const statusColor = status === 'Strong' ? 'text-green-400' : status === 'Moderate' ? 'text-yellow-400' : 'text-rose-400'
                return (
                  <div key={f.key} className="bg-bg-elevated rounded-lg p-3 text-center">
                    <span className={f.color}>{f.icon}</span>
                    <p className="text-sm font-semibold text-text-primary mt-1">{f.label}</p>
                    <p className="text-2xl font-bold text-text-primary">{scores[f.key]}/10</p>
                    <p className={`text-xs font-medium ${statusColor}`}>{status}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
