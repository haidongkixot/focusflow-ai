'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3, Trophy, Target, Flame } from 'lucide-react'

interface ChartData {
  date: string
  label: string
  mins: number
  sessions: number
}

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

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress')
      .then(r => r.json())
      .then(d => {
        setStats(d.stats)
        setChartData(d.chartData ?? [])
        setAchievements(d.achievements ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-64" />
      </div>
    )
  }

  const totalWeekMins = chartData.reduce((acc, d) => acc + d.mins, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-text-secondary">Your focus performance over time</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Today', value: stats?.todaySessions ?? 0, sub: 'sessions' },
          { icon: BarChart3, label: 'This Week', value: stats?.weekSessions ?? 0, sub: 'sessions' },
          { icon: Target, label: 'Task Rate', value: `${stats?.completionRate ?? 0}%`, sub: 'completion' },
          { icon: Trophy, label: 'All Time', value: stats?.totalSessions ?? 0, sub: 'sessions' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <s.icon className="w-5 h-5 text-accent-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent-400">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
            <p className="text-xs text-text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 7-Day Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Last 7 Days — Focus Minutes</h2>
          <span className="text-sm text-text-muted">{totalWeekMins}m total</span>
        </div>
        {chartData.some(d => d.mins > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #374151', borderRadius: '12px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => [`${value} min`, 'Focus']}
              />
              <Bar dataKey="mins" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.sessions > 0 ? '#f43f5e' : '#374151'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-text-muted text-sm">No sessions recorded yet. Start the timer!</p>
          </div>
        )}
      </div>

      {/* Sessions per day */}
      <div className="card">
        <h2 className="font-semibold mb-4">Sessions per Day</h2>
        <div className="space-y-3">
          {chartData.map(d => (
            <div key={d.date} className="flex items-center gap-3">
              <span className="text-sm text-text-muted w-10">{d.label}</span>
              <div className="flex-1 bg-bg-elevated rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-accent-400 rounded-full transition-all"
                  style={{ width: `${Math.min((d.sessions / 8) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm text-text-muted w-16 text-right">
                {d.sessions} session{d.sessions !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-accent-400" />
          <h2 className="font-semibold">Achievements ({achievements.length})</h2>
        </div>
        {achievements.length === 0 ? (
          <p className="text-sm text-text-muted">Complete focus sessions to earn achievements!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl">
                <div className="w-10 h-10 rounded-full bg-accent-400/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{a.description || a.name}</p>
                  <p className="text-xs text-text-muted">{new Date(a.earnedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
