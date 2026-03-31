'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface GamStats {
  xp: number; level: number; xpInCurrentLevel: number; xpForNextLevel: number; progressPercent: number; currentStreak: number
}

export default function GamificationBar() {
  const [stats, setStats] = useState<GamStats | null>(null)

  useEffect(() => {
    fetch('/api/gamification').then(r => r.json()).then(d => { if (d.level) setStats(d) }).catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <div className="bg-bg-surface border-b border-gray-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-400/20 border border-accent-400/50 flex items-center justify-center">
            <span className="text-accent-400 font-bold text-xs">{stats.level}</span>
          </div>
          <span className="text-text-muted text-xs hidden sm:block">Level {stats.level}</span>
        </div>
        <div className="flex-1 max-w-xs flex items-center gap-2">
          <span className="text-text-muted text-xs whitespace-nowrap">{stats.xpInCurrentLevel}/{stats.xpForNextLevel} XP</span>
          <div className="flex-1 bg-bg-elevated rounded-full h-1.5">
            <div className="bg-accent-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.progressPercent}%` }} />
          </div>
        </div>
        {stats.currentStreak > 0 && (
          <Link href="/quests" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors">
            <span>🔥</span><span className="font-semibold text-xs">{stats.currentStreak}d</span>
            <span className="text-text-muted text-xs hidden sm:block">streak</span>
          </Link>
        )}
        <Link href="/quests" className="text-xs text-accent-400 hover:text-accent-300 transition-colors hidden sm:block">Daily Quests →</Link>
        <Link href="/leaderboard" className="text-xs text-text-muted hover:text-text-secondary transition-colors hidden sm:block">🏆 Leaderboard</Link>
      </div>
    </div>
  )
}
