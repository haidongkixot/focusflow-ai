'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, CheckCircle, Timer, ListTodo } from 'lucide-react'

type SessionWithTask = {
  id: string
  type: string
  durationMins: number
  actualMins: number | null
  completed: boolean
  startedAt: string
  endedAt: string | null
  task: { title: string } | null
}

type TaskItem = {
  id: string
  title: string
  status: string
  priority: string
  category: string
  createdAt: string
}

type UserDetail = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  tasks: TaskItem[]
  focusSessions: SessionWithTask[]
  achievements: { id: string; name: string; type: string; earnedAt: string }[]
  stats: { completedSessions: number; totalMins: number; doneTasks: number }
}

const TYPE_COLORS: Record<string, string> = {
  focus: 'bg-accent-400/20 text-accent-400',
  short_break: 'bg-emerald-500/20 text-emerald-400',
  long_break: 'bg-blue-500/20 text-blue-400',
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'sessions'>('overview')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`)
        if (!res.ok) throw new Error('Failed to load user')
        const data = await res.json()
        setUser(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="card space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-400">{error ?? 'User not found'}</p>
        <button onClick={() => router.back()} className="mt-4 text-accent-400 hover:underline text-sm">
          Go back
        </button>
      </div>
    )
  }

  const completionRate =
    user.tasks.length > 0
      ? Math.round((user.stats.doneTasks / user.tasks.length) * 100)
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
          <p className="text-text-secondary text-sm">{user.email}</p>
        </div>
        <span
          className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-accent-400/20 text-accent-400'
              : 'bg-gray-700 text-text-muted'
          }`}
        >
          {user.role}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-surface border border-gray-800 rounded-xl p-1 w-fit">
        {(['overview', 'sessions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-accent-400 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* User card */}
          <div className="card flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-400/20 flex items-center justify-center">
              <User className="w-6 h-6 text-accent-400" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{user.name || '—'}</p>
              <p className="text-text-secondary text-sm">{user.email}</p>
              <p className="text-text-muted text-xs">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Task stats */}
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-accent-400" /> Task Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Tasks', value: user.tasks.length },
                { label: 'Completed', value: user.stats.doneTasks },
                { label: 'Completion Rate', value: `${completionRate}%` },
              ].map((s) => (
                <div key={s.label} className="card text-center">
                  <p className="text-2xl font-bold text-accent-400">{s.value}</p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Session stats */}
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Timer className="w-4 h-4 text-accent-400" /> Session Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Sessions', value: user.focusSessions.length },
                { label: 'Completed', value: user.stats.completedSessions },
                { label: 'Total Focus Mins', value: user.stats.totalMins },
              ].map((s) => (
                <div key={s.label} className="card text-center">
                  <p className="text-2xl font-bold text-accent-400">{s.value}</p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {user.achievements.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-400" /> Achievements ({user.achievements.length})
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {user.achievements.map((a) => (
                  <div key={a.id} className="card py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-text-muted">{new Date(a.earnedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'sessions' && (
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold">Recent Sessions</h2>
            <p className="text-xs text-text-muted mt-0.5">Last {user.focusSessions.length} sessions</p>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-bg-elevated">
                <tr className="text-left text-text-muted border-b border-gray-800">
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Actual</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {user.focusSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="px-6 py-3 text-text-secondary">
                      {s.task?.title ?? <span className="text-text-muted italic">No task</span>}
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
                        <span className="text-emerald-400 text-xs">Completed</span>
                      ) : (
                        <span className="text-red-400 text-xs">Incomplete</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-text-muted">
                      {new Date(s.startedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {user.focusSessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-text-muted">
                      No sessions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
