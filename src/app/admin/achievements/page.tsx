'use client'

import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'

type AdminAchievement = {
  id: string
  type: string
  name: string
  description: string | null
  earnedAt: string
  user: { name: string | null; email: string }
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AdminAchievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch('/api/admin/achievements')
        const data = await res.json()
        setAchievements(data.achievements ?? [])
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent-400" /> Achievements
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {loading ? '...' : `${achievements.length} achievements earned`}
        </p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800 bg-bg-elevated">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Achievement</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Earned At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="skeleton h-4 w-28" />
                        </td>
                      ))}
                    </tr>
                  ))
                : achievements.map((a) => (
                    <tr key={a.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium">{a.user.name || '—'}</p>
                        <p className="text-xs text-text-muted">{a.user.email}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-text-secondary max-w-xs">
                        <p className="truncate">{a.description ?? '—'}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                          {a.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-text-muted">
                        {new Date(a.earnedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              {!loading && achievements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-muted">
                    No achievements yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
