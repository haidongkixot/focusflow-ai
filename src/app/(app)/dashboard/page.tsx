'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Timer, ListTodo, BarChart3, Brain, Zap, Trophy } from 'lucide-react'

interface Stats {
  totalSessions: number
  todaySessions: number
  weekSessions: number
  totalTasks: number
  doneTasks: number
  completionRate: number
}

interface Achievement {
  id: string
  name: string
  description: string | null
  earnedAt: string
}

interface CoachData {
  insights: string[]
  tip: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [coach, setCoach] = useState<CoachData | null>(null)
  const [coachLoading, setCoachLoading] = useState(false)

  useEffect(() => {
    fetch('/api/progress')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then(d => {
        setStats(d.stats)
        setAchievements(d.achievements?.slice(0, 3) ?? [])
      })
      .catch(() => {})
  }, [])

  async function loadCoach() {
    setCoachLoading(true)
    const res = await fetch('/api/ai/coach', { method: 'POST' })
    const data = await res.json()
    setCoach(data)
    setCoachLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-text-secondary">Your focus overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: stats?.todaySessions ?? '—', sub: 'focus sessions' },
          { label: 'This Week', value: stats?.weekSessions ?? '—', sub: 'sessions' },
          { label: 'All Time', value: stats?.totalSessions ?? '—', sub: 'sessions' },
          { label: 'Tasks Done', value: stats ? `${stats.doneTasks}/${stats.totalTasks}` : '—', sub: `${stats?.completionRate ?? 0}% rate` },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-3xl font-bold text-accent-400">{s.value}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
            <p className="text-xs text-text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/timer" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center">
            <Timer className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <p className="font-semibold">Start Timer</p>
            <p className="text-sm text-text-secondary">Launch a focus session</p>
          </div>
        </Link>
        <Link href="/tasks" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <p className="font-semibold">Manage Tasks</p>
            <p className="text-sm text-text-secondary">{stats ? `${stats.totalTasks - stats.doneTasks} pending` : 'View all tasks'}</p>
          </div>
        </Link>
        <Link href="/analytics" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <p className="font-semibold">Analytics</p>
            <p className="text-sm text-text-secondary">View your trends</p>
          </div>
        </Link>
      </div>

      {/* AI Coach */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-400" />
            <h2 className="font-semibold">AI Coach</h2>
          </div>
          <button onClick={loadCoach} disabled={coachLoading} className="btn-secondary text-sm py-1.5 px-4">
            {coachLoading ? 'Analyzing...' : 'Get Insights'}
          </button>
        </div>
        {coach ? (
          <div className="space-y-3">
            {coach.insights.map((insight, i) => (
              <div key={i} className="flex gap-3">
                <Zap className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                <p className="text-sm text-text-secondary">{insight}</p>
              </div>
            ))}
            {coach.tip && (
              <div className="mt-4 p-3 bg-accent-400/10 border border-accent-400/20 rounded-xl">
                <p className="text-sm font-medium text-accent-300">Today&apos;s Tip</p>
                <p className="text-sm text-text-secondary mt-1">{coach.tip}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-text-muted">Click &quot;Get Insights&quot; to see personalized coaching based on your focus patterns.</p>
        )}
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-accent-400" />
            <h2 className="font-semibold">Recent Achievements</h2>
          </div>
          <div className="space-y-3">
            {achievements.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-400/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{a.description || a.name}</p>
                  <p className="text-xs text-text-muted">{new Date(a.earnedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
