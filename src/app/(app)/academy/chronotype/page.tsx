'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sun, Moon, Bird, Clock } from 'lucide-react'

interface Question {
  id: number
  text: string
  options: { label: string; score: number }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1, text: 'I feel most alert at:',
    options: [
      { label: 'Early morning (6-8am)', score: 4 },
      { label: 'Late morning (8-10am)', score: 3 },
      { label: 'Afternoon (12-4pm)', score: 2 },
      { label: 'Evening (6pm+)', score: 1 },
    ],
  },
  {
    id: 2, text: 'I prefer to wake up at:',
    options: [
      { label: 'Before 6am', score: 5 },
      { label: '6-7am', score: 4 },
      { label: '7-8am', score: 3 },
      { label: '8-9am', score: 2 },
      { label: 'After 9am', score: 1 },
    ],
  },
  {
    id: 3, text: 'My best creative work happens:',
    options: [
      { label: '6-9am', score: 5 },
      { label: '9am-12pm', score: 4 },
      { label: '12-3pm', score: 3 },
      { label: '3-6pm', score: 2 },
      { label: 'After 6pm', score: 1 },
    ],
  },
  {
    id: 4, text: 'I naturally feel sleepy at:',
    options: [
      { label: 'Before 9pm', score: 5 },
      { label: '9-10pm', score: 4 },
      { label: '10-11pm', score: 3 },
      { label: '11pm-12am', score: 2 },
      { label: 'After midnight', score: 1 },
    ],
  },
  {
    id: 5, text: 'Weekend wake-up without alarm:',
    options: [
      { label: 'Before 7am', score: 5 },
      { label: '7-8am', score: 4 },
      { label: '8-9am', score: 3 },
      { label: '9-10am', score: 2 },
      { label: 'After 10am', score: 1 },
    ],
  },
  {
    id: 6, text: 'Energy dip in the afternoon:',
    options: [
      { label: 'Severe -- I can barely function', score: 1 },
      { label: 'Moderate -- noticeably slower', score: 2 },
      { label: 'Mild -- slightly less sharp', score: 3 },
      { label: 'None -- I stay strong all day', score: 4 },
    ],
  },
  {
    id: 7, text: 'Exercise preference:',
    options: [
      { label: 'Early morning (before 7am)', score: 4 },
      { label: 'Morning (7-10am)', score: 3 },
      { label: 'Afternoon (12-5pm)', score: 2 },
      { label: 'Evening (5pm+)', score: 1 },
    ],
  },
  {
    id: 8, text: 'Most productive meeting time:',
    options: [
      { label: '8-10am', score: 4 },
      { label: '10am-12pm', score: 3 },
      { label: '1-3pm', score: 2 },
      { label: '3-5pm', score: 1 },
    ],
  },
]

interface Chronotype {
  name: string
  icon: React.ReactNode
  color: string
  desc: string
  schedule: { label: string; time: string; note: string }[]
}

function getChronotype(score: number): Chronotype {
  if (score >= 30) {
    return {
      name: 'Morning Lark',
      icon: <Sun className="w-8 h-8" />,
      color: 'text-amber-400',
      desc: 'You peak early and thrive in the morning hours. Your cortisol and alertness rise sharply at dawn.',
      schedule: [
        { label: 'Deep Work', time: '6:00 - 10:00 AM', note: 'Your cognitive peak -- tackle the hardest problems here' },
        { label: 'Meetings', time: '10:00 AM - 12:00 PM', note: 'Good social energy, ride the morning momentum' },
        { label: 'Light Tasks', time: '1:00 - 3:00 PM', note: 'Handle emails, admin, and low-stakes work' },
        { label: 'Exercise', time: '3:00 - 4:00 PM', note: 'Physical activity helps combat afternoon dip' },
        { label: 'Wind-Down', time: '8:00 - 9:00 PM', note: 'Start relaxing early -- your melatonin rises soon' },
      ],
    }
  }
  if (score >= 20) {
    return {
      name: 'Third Bird',
      icon: <Bird className="w-8 h-8" />,
      color: 'text-emerald-400',
      desc: 'You follow the most common pattern -- a mid-morning peak with steady energy through afternoon.',
      schedule: [
        { label: 'Warm-Up', time: '8:00 - 9:00 AM', note: 'Light planning, email triage, set daily goals' },
        { label: 'Deep Work', time: '9:00 AM - 12:00 PM', note: 'Your cognitive sweet spot -- protect this time' },
        { label: 'Meetings', time: '1:00 - 3:00 PM', note: 'Social tasks when deep focus naturally dips' },
        { label: 'Creative Work', time: '3:00 - 5:00 PM', note: 'Second wind for creative and collaborative tasks' },
        { label: 'Exercise', time: '5:30 - 6:30 PM', note: 'Ideal time for physical activity' },
        { label: 'Wind-Down', time: '9:30 - 10:30 PM', note: 'Reflect on the day, prepare for tomorrow' },
      ],
    }
  }
  return {
    name: 'Night Owl',
    icon: <Moon className="w-8 h-8" />,
    color: 'text-indigo-400',
    desc: 'You come alive in the evening. Your peak cognitive hours are later than most, but that is a superpower.',
    schedule: [
      { label: 'Gentle Start', time: '9:00 - 10:30 AM', note: 'Ease in -- light admin, planning, no deep decisions' },
      { label: 'Ramp Up', time: '10:30 AM - 12:30 PM', note: 'Building momentum -- moderately demanding tasks' },
      { label: 'Meetings', time: '1:00 - 3:00 PM', note: 'Good energy window for collaboration' },
      { label: 'Deep Work', time: '4:00 - 8:00 PM', note: 'Your golden hours -- protect this block fiercely' },
      { label: 'Exercise', time: '8:00 - 9:00 PM', note: 'Evening workout boosts next-day energy' },
      { label: 'Wind-Down', time: '11:00 PM - 12:00 AM', note: 'Journal, read, prepare for sleep' },
    ],
  }
}

export default function ChronotypePage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const answered = Object.keys(answers).length
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const result = getChronotype(totalScore)

  function handleAnswer(qId: number, score: number) {
    setAnswers(a => ({ ...a, [qId]: score }))
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/academy" className="inline-flex items-center gap-2 text-text-muted hover:text-accent-400 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <Clock className="w-8 h-8 text-rose-400" />
          Chronotype Discovery Quiz
        </h1>
        <p className="text-text-secondary mt-1">
          Find your biological peak hours and optimize your daily schedule
        </p>
      </div>

      {!submitted ? (
        <>
          {/* Progress */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Progress</span>
              <span className="text-sm text-text-muted">{answered}/{QUESTIONS.length} questions</span>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-2">
              <div className="bg-rose-400 h-2 rounded-full transition-all" style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="bg-bg-surface border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-text-primary mb-3">
                  <span className="text-rose-400 mr-2">{q.id}.</span>{q.text}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(q.id, opt.score)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        answers[q.id] === opt.score
                          ? 'bg-rose-400/10 border-rose-400 text-rose-400 font-medium'
                          : 'bg-bg-elevated border-gray-700 text-text-secondary hover:border-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={answered < QUESTIONS.length}
            className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {answered < QUESTIONS.length ? `Answer all ${QUESTIONS.length} questions to continue` : 'Discover My Chronotype'}
          </button>
        </>
      ) : (
        <>
          {/* Result */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-8 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-elevated ${result.color} mb-4`}>
              {result.icon}
            </div>
            <h2 className={`text-3xl font-bold ${result.color}`}>{result.name}</h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">{result.desc}</p>
            <p className="text-text-muted text-sm mt-2">Score: {totalScore}/{QUESTIONS.length * 5}</p>
          </div>

          {/* Schedule */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-text-primary mb-4">Your Optimal Daily Schedule</h2>
            <div className="space-y-3">
              {result.schedule.map((block, i) => (
                <div key={i} className="flex items-start gap-4 border border-gray-700 rounded-lg p-4">
                  <div className="min-w-[140px]">
                    <p className="text-sm font-semibold text-rose-400">{block.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{block.time}</p>
                  </div>
                  <p className="text-sm text-text-secondary">{block.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-text-primary mb-3">Research-Backed Tips</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">*</span>
                <span>Schedule your most demanding cognitive tasks during your identified peak hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">*</span>
                <span>Exposure to bright light in the morning helps reinforce your natural rhythm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">*</span>
                <span>Consistent sleep/wake times (even weekends) strengthen your circadian clock.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">*</span>
                <span>A 10-20 minute nap during your natural dip can restore alertness for 2-3 hours.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => { setSubmitted(false); setAnswers({}) }}
            className="w-full py-3 px-6 bg-bg-surface border border-gray-800 hover:border-rose-400/30 text-text-primary font-semibold rounded-xl transition-colors"
          >
            Retake Quiz
          </button>
        </>
      )}
    </div>
  )
}
