'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Brain, ListChecks, BookOpen, Palette, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'

const GOALS = [
  { id: 'deep-work', label: 'Deep Work', description: 'Extended focused sessions for complex tasks', icon: Brain },
  { id: 'task-management', label: 'Task Management', description: 'Organize and crush your to-do list', icon: ListChecks },
  { id: 'study', label: 'Study', description: 'Effective study sessions with breaks', icon: BookOpen },
  { id: 'creative-focus', label: 'Creative Focus', description: 'Flow states for creative work', icon: Palette },
]

const EXPERIENCE = [
  { id: 'beginner', label: 'Beginner', description: "I'm new to productivity techniques" },
  { id: 'intermediate', label: 'Intermediate', description: "I've tried Pomodoro or similar methods" },
  { id: 'advanced', label: 'Advanced', description: 'I regularly use focus techniques' },
]

const WORK_STYLES = [
  { id: 'structured', label: 'Structured', description: 'I like schedules and clear plans' },
  { id: 'flexible', label: 'Flexible', description: 'I prefer adapting as I go' },
  { id: 'balanced', label: 'Balanced', description: 'A mix of structure and flexibility' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState('')
  const [workStyle, setWorkStyle] = useState('')
  const [loading, setLoading] = useState(false)

  const steps = [
    { title: "What's your primary goal?", subtitle: 'We will tailor your experience' },
    { title: 'Your experience level?', subtitle: 'So we set the right pace' },
    { title: 'How do you prefer to work?', subtitle: 'We will match your style' },
  ]

  async function handleFinish() {
    setLoading(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, experience, workStyle }),
      })
      router.push('/dashboard')
    } catch {
      router.push('/dashboard')
    }
  }

  function canProceed() {
    if (step === 0) return !!goal
    if (step === 1) return !!experience
    if (step === 2) return !!workStyle
    return false
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 text-accent-400 font-bold text-xl mb-8 justify-center">
          <Zap className="w-6 h-6" />
          FocusFlow
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-accent-400' : 'bg-bg-elevated'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-text-primary mb-1">{steps[step].title}</h1>
        <p className="text-text-secondary mb-8">{steps[step].subtitle}</p>

        {/* Step 0: Goal */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  goal === g.id
                    ? 'border-accent-400 bg-accent-400/10 shadow-glow'
                    : 'border-gray-800 bg-bg-surface hover:border-gray-700'
                }`}
              >
                <g.icon className={`w-6 h-6 mb-2 ${goal === g.id ? 'text-accent-400' : 'text-text-muted'}`} />
                <p className="font-medium text-text-primary text-sm">{g.label}</p>
                <p className="text-text-muted text-xs mt-1">{g.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="space-y-3">
            {EXPERIENCE.map((e) => (
              <button
                key={e.id}
                onClick={() => setExperience(e.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  experience === e.id
                    ? 'border-accent-400 bg-accent-400/10 shadow-glow'
                    : 'border-gray-800 bg-bg-surface hover:border-gray-700'
                }`}
              >
                <p className="font-medium text-text-primary">{e.label}</p>
                <p className="text-text-muted text-sm mt-1">{e.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Work Style */}
        {step === 2 && (
          <div className="space-y-3">
            {WORK_STYLES.map((w) => (
              <button
                key={w.id}
                onClick={() => setWorkStyle(w.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  workStyle === w.id
                    ? 'border-accent-400 bg-accent-400/10 shadow-glow'
                    : 'border-gray-800 bg-bg-surface hover:border-gray-700'
                }`}
              >
                <p className="font-medium text-text-primary">{w.label}</p>
                <p className="text-text-muted text-sm mt-1">{w.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`btn-secondary flex items-center gap-2 ${step === 0 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed() || loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
