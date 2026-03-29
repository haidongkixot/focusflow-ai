import Link from 'next/link'
import { Zap, Timer, ListTodo, BarChart3, Brain } from 'lucide-react'

const FEATURES = [
  { icon: Timer, title: 'Pomodoro Timer', desc: 'Customizable focus sessions with work/break cycles. Stay in the zone.' },
  { icon: ListTodo, title: 'Smart Task Management', desc: 'Prioritize, categorize, and track tasks with estimated focus time.' },
  { icon: Brain, title: 'AI Coaching', desc: 'GPT-powered productivity insights based on your focus patterns.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Track focus hours, completion rates, and streaks over time.' },
]

const STEPS = [
  { num: 1, title: 'Add Tasks', desc: 'Create and prioritize what needs your attention.' },
  { num: 2, title: 'Start Timer', desc: 'Launch a focus session — 25 min work, 5 min break.' },
  { num: 3, title: 'Stay Focused', desc: 'The timer keeps you accountable. No distractions.' },
  { num: 4, title: 'Review & Improve', desc: 'AI analyzes your patterns and suggests optimizations.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-accent-400 font-bold text-xl">
            <Zap className="w-6 h-6" />
            FocusFlow
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-text-secondary hover:text-text-primary transition text-sm">Sign In</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-400/10 border border-accent-400/20 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-4 h-4 text-accent-400" />
          <span className="text-sm text-accent-300">Part of the HumanOS Ecosystem</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Deep Work,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
            Powered by AI
          </span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
          Pomodoro timer, smart task management, and AI-powered productivity coaching —
          everything you need to achieve focused, meaningful work.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn-primary text-lg py-3 px-8">Start Focusing</Link>
          <Link href="#features" className="btn-secondary text-lg py-3 px-8">Learn More</Link>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Everything You Need to Focus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="card-hover">
                <Icon className="w-8 h-8 text-accent-400 mb-3" />
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-text-secondary">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-400/20 text-accent-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Zap className="w-4 h-4" /> FocusFlow AI — Part of HumanOS
          </div>
          <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} HumanOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
