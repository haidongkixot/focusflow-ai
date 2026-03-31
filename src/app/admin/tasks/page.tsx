'use client'

import { useEffect, useState, useCallback } from 'react'
import { ListTodo, ChevronLeft, ChevronRight } from 'lucide-react'

type AdminTask = {
  id: string
  title: string
  priority: string
  status: string
  category: string
  focusSessionCount: number
  createdAt: string
  user: { name: string | null; email: string }
}

const STATUS_OPTIONS = ['all', 'todo', 'in_progress', 'done'] as const
const PRIORITY_OPTIONS = ['all', 'high', 'medium', 'low'] as const

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-700 text-text-muted',
  in_progress: 'bg-blue-500/20 text-blue-400',
  done: 'bg-emerald-500/20 text-emerald-400',
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<string>('all')
  const [priority, setPriority] = useState<string>('all')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), status, priority })
      const res = await fetch(`/api/admin/tasks?${params}`)
      const data = await res.json()
      setTasks(data.tasks ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, status, priority])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-accent-400" /> Tasks
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {loading ? '...' : `${total} tasks total`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-muted">Status:</label>
          <select
            value={status}
            onChange={(e) => handleFilterChange(setStatus, e.target.value)}
            className="input-field py-1.5 px-3 text-sm w-auto"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === 'all' ? 'All Statuses' : o.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-muted">Priority:</label>
          <select
            value={priority}
            onChange={(e) => handleFilterChange(setPriority, e.target.value)}
            className="input-field py-1.5 px-3 text-sm w-auto"
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === 'all' ? 'All Priorities' : o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800 bg-bg-elevated">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Sessions</th>
                <th className="px-6 py-3">Created</th>
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
                : tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium">{t.user.name || '—'}</p>
                        <p className="text-xs text-text-muted">{t.user.email}</p>
                      </td>
                      <td className="px-6 py-3 font-medium max-w-xs">
                        <p className="truncate">{t.title}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            PRIORITY_COLORS[t.priority] ?? 'bg-gray-700 text-text-muted'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[t.status] ?? 'bg-gray-700 text-text-muted'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-text-secondary capitalize">{t.category}</td>
                      <td className="px-6 py-3 text-text-secondary">{t.focusSessionCount}</td>
                      <td className="px-6 py-3 text-text-muted">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-text-muted">
                    No tasks found.
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
