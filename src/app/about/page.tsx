import Link from 'next/link'
import { Zap, Timer, ListTodo, Bot, ArrowRight, ExternalLink } from 'lucide-react'

const ecosystemApps = [
  { name: 'BreathMaster AI', url: 'https://breathmaster-ai.vercel.app', desc: 'Guided breathing exercises and stress management' },
  { name: 'HabitOS', url: 'https://habitos-ai.vercel.app', desc: 'Intelligent habit tracking and behavior design' },
  { name: 'MemoryForge AI', url: 'https://memoryforge-ai.vercel.app', desc: 'Spaced repetition and memory training' },
  { name: 'HarmonyMap AI', url: 'https://harmonymap-ai.vercel.app', desc: 'Life balance visualization and planning' },
  { name: 'Seeneyu', url: 'https://seeneyu.vercel.app', desc: 'Social connection platform' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-400/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent-400/10 rounded-xl">
              <Zap className="w-8 h-8 text-accent-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">
              About FocusFlow
            </h1>
          </div>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
            A precision instrument for deep work. FocusFlow AI combines a Pomodoro timer,
            intelligent task management, and AI-powered productivity coaching to help you
            achieve sustained, meaningful focus.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-10">Core Capabilities</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: Timer,
              title: 'Pomodoro Timer',
              desc: 'Structured focus sessions with intelligent break scheduling. Track your deep work rhythm and build consistency.',
            },
            {
              icon: ListTodo,
              title: 'Task Management',
              desc: 'Priority-driven task lists that integrate with your timer sessions. Break complex goals into focused work blocks.',
            },
            {
              icon: Bot,
              title: 'AI Coach',
              desc: 'Personalized productivity insights powered by AI. Get actionable feedback on your focus patterns and habits.',
            },
          ].map((feature) => (
            <div key={feature.title} className="card">
              <feature.icon className="w-6 h-6 text-accent-400 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HumanOS Ecosystem */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card border-accent-400/20">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Part of HumanOS</h2>
          <p className="text-text-secondary mb-8 max-w-2xl">
            FocusFlow AI is one module in the HumanOS ecosystem -- a suite of AI-powered tools
            designed to optimize every dimension of human performance. Each app works independently
            and connects to form a complete personal operating system.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {ecosystemApps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition group"
              >
                <div className="flex-1">
                  <div className="text-text-primary font-medium text-sm flex items-center gap-1.5">
                    {app.name}
                    <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 transition" />
                  </div>
                  <p className="text-text-muted text-xs mt-1">{app.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Built by PeeTeeAI */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Built by PeeTeeAI</h2>
        <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
          PeeTeeAI builds AI-powered tools that serve as a personal trainer for every aspect
          of human performance. From physical fitness to mental focus, breathing to memory,
          our mission is to help people operate at their best through intelligent, adaptive technology.
        </p>
        <a
          href="https://peeteeai-web.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-medium transition"
        >
          Visit PeeTeeAI <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  )
}
