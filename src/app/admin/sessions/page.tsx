'use client'

import { useEffect, useState, useCallback } from 'react'
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react'

type AdminSession = {
  id: string
  type: string
  durationMins: number
  actualMins: number | null
  completed: boolean
  startedAt: string
  user: { name: string | null; email: string }
  task: { title: string } | null
}

const TYPE_OPTIONS = ['all', 'focus', 'short_break', 'long_break'] as const
const COMPLETED_OPTIONS = ['all', 'true', 'false'] as const

const TYPE_COLORS: Record<string, string> = {
  focus: 'bg-accent-400/20 text-accent-400',
  short_break: 'bg-emerald-500/20 text-emerald-400',
  long_break: 'bg-blue-500/20 text-blue-400',
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [type, setType] = useState<string>('all')
  const [completed, setCompleted] = useState<string>('all')

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), type, completed })
      const res = await fetch(`/api/admin/sessions?${params}`)
      const data = await res.json()
      setSessions(data.sessions ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, type, completed])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Timer className="w-6 h-6 text-accent-400" /> Focus Sessions
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {loading ? '...' : `${total} sessions total`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-muted">Type:</label>
          <select
            value={type}
            onChange={(e) => handleFilterChange(setType, e.target.value)}
            className="input-field py-1.5 px-3 text-sm w-auto"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === 'all' ? 'All Types' : o.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-muted">Status:</label>
          <select
            value={completed}
            onChange={(e) => handleFilterChange(setCompleted, e.target.value)}
            className="input-field py-1.5 px-3 text-sm w-auto"
          >
            <option value="all">All</option>
            <option value="true">Completed</option>
            <option value="false">Incomplete</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800 bg-bg-elevated">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Actual</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Started At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="skeleton h-4 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium">{s.user.name || '—'}</p>
                        <p className="text-xs text-text-muted">{s.user.email}</p>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">
                        {s.task?.title ?? <span className="italic text-text-muted">No task</span>}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            TYPE_COLORS[s.type] ?? 'bg-gray-700 text-text-muted'
                          }`}
                        >
                          {s.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">{s.durationMins}m</td>
                      <td className="px-6 py-3 text-text-secondary">
                        {s.actualMins != null ? `${s.actualMins}m` : '—'}
                      </td>
                      <td className="px-6 py-3">
                        {s.completed ? (
                          <span className="text-emerald-400 text-xs font-medium">✓ Done</span>
                        ) : (
                          <span className="text-red-400 text-xs font-medium">✗ Incomplete</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-text-muted">
                        {new Date(s.startedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              {!loading && sessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-text-muted">
                    No sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-700 text-text-secondary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-700 text-text-secondary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
