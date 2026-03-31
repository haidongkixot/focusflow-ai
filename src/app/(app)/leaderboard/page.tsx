'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Trophy, Flame, Clock, Medal, Crown } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  totalXp: number
  focusMins: number
  sessionsCount: number
  streak: number
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'alltime'>('week')

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  async function fetchLeaderboard() {
    setLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.leaderboard || [])
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const currentUserId = (session?.user as any)?.id

  function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-text-muted font-mono text-sm w-5 text-center">{rank}</span>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent-400/10">
          <Trophy className="w-6 h-6 text-accent-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-text-secondary text-sm">Top focusers ranked by XP</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'alltime'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? 'bg-accent-400 text-white shadow-glow'
                : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
            }`}
          >
            {p === 'alltime' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No data yet. Start focusing to climb the ranks!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  entry.userId === currentUserId
                    ? 'bg-accent-400/10 border border-accent-400/30'
                    : 'hover:bg-bg-elevated'
                }`}
              >
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {entry.name || 'Anonymous'}
                    {entry.userId === currentUserId && (
                      <span className="ml-2 text-xs text-accent-400">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(entry.focusMins / 60)}h focused
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {entry.streak}d streak
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent-400">{entry.totalXp.toLocaleString()}</p>
                  <p className="text-xs text-text-muted">XP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
