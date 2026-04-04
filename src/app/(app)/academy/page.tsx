'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, CheckCircle, Lock, Activity, Clock, Coffee, Brain } from 'lucide-react'

interface Chapter {
  id: string; slug: string; title: string; category: string
  keyTakeaways: string[]; minPlanSlug: string
  progress: { completed: boolean; quizScore: number | null } | null
}

const CATEGORY_ICONS: Record<string, string> = {
  'deep_work': '🎯', 'creative': '🎨', 'learning': '📚',
  'energy': '⚡', 'mindfulness': '🧘',
}

export default function AcademyPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/academy').then(r => r.json()).then(setChapters).catch(() => {})
  }, [])

  const categories = ['all', ...Array.from(new Set(chapters.map(c => c.category)))]
  const filtered = filter === 'all' ? chapters : chapters.filter(c => c.category === filter)
  const completed = chapters.filter(c => c.progress?.completed).length
  const total = chapters.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-accent-400" />
          Academy
        </h1>
        <p className="text-text-secondary mt-1">Master the science of focus and productivity</p>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Your progress</span>
            <span className="text-sm text-text-muted">{completed}/{total} chapters</span>
          </div>
          <div className="w-full bg-bg-elevated rounded-full h-2.5">
            <div className="bg-accent-400 h-2.5 rounded-full transition-all" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === c
                ? 'bg-accent-400 text-bg-base'
                : 'bg-bg-surface text-text-secondary border border-gray-800 hover:border-accent-400/30'
            }`}>
            {c === 'all' ? 'All' : (CATEGORY_ICONS[c] || '') + ' ' + c.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Research Tools */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-3">Research Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/academy/flow-assessment', icon: <Activity className="w-6 h-6" />, title: 'Flow Assessment', desc: 'Rate Csikszentmihalyi\'s 8 flow characteristics and track your state over time' },
            { href: '/academy/chronotype', icon: <Clock className="w-6 h-6" />, title: 'Chronotype Quiz', desc: 'Discover if you\'re a Morning Lark, Third Bird, or Night Owl' },
            { href: '/academy/break-tracker', icon: <Coffee className="w-6 h-6" />, title: 'Break Tracker', desc: 'Log breaks and find which types restore your focus best' },
            { href: '/academy/procrastination', icon: <Brain className="w-6 h-6" />, title: 'Procrastination Decoder', desc: 'TMT analysis to pinpoint and fix your procrastination trigger' },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="bg-bg-surface border border-gray-800 hover:border-rose-400/30 rounded-xl p-5 transition-all group hover:shadow-lg hover:shadow-rose-400/5">
              <div className="text-rose-400 mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-text-primary group-hover:text-rose-400 transition-colors text-sm">{tool.title}</h3>
              <p className="text-xs text-text-muted mt-1 line-clamp-2">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Chapter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ch => (
          <Link key={ch.id} href={`/academy/${ch.slug}`}
            className="bg-bg-surface border border-gray-800 hover:border-accent-400/30 rounded-xl p-6 transition-all group hover:shadow-lg hover:shadow-accent-400/5 relative">
            {ch.progress?.completed && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            )}
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[ch.category] || '📖'}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                ch.minPlanSlug === 'free' ? 'bg-green-900/30 text-green-400' :
                ch.minPlanSlug === 'plus' ? 'bg-blue-900/30 text-blue-400' :
                'bg-purple-900/30 text-purple-400'
              }`}>
                {ch.minPlanSlug === 'free' ? 'Free' : (
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" />{ch.minPlanSlug.toUpperCase()}</span>
                )}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-400 transition-colors">{ch.title}</h3>
            <div className="flex flex-wrap gap-1 mt-3">
              {ch.keyTakeaways.slice(0, 2).map((t, i) => (
                <span key={i} className="text-xs bg-accent-400/10 text-accent-400 px-2 py-0.5 rounded-full font-medium line-clamp-1">{t}</span>
              ))}
            </div>
            {ch.progress?.quizScore !== null && ch.progress?.quizScore !== undefined && (
              <div className="mt-3 text-xs text-text-muted">Quiz: {ch.progress.quizScore}%</div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">No chapters available yet.</div>
      )}
    </div>
  )
}
