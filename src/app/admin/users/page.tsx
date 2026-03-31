'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users } from 'lucide-react'

type AdminUser = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  _count: { tasks: number; focusSessions: number }
}

const ROLE_FILTERS = ['all', 'admin', 'user'] as const
type RoleFilter = (typeof ROLE_FILTERS)[number]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<RoleFilter>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function fetchUsers(role: RoleFilter) {
    setLoading(true)
    try {
      const params = role !== 'all' ? `?role=${role}` : ''
      const res = await fetch(`/api/admin/users${params}`)
      const data = await res.json()
      setUsers(data.users ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(filter)
  }, [filter])

  async function handleRoleToggle(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    setActionLoading(user.id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: newRole }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        )
      }
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-accent-400" /> Users
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {loading ? '...' : `${users.length} users`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {ROLE_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === r
                ? 'bg-accent-400 text-white'
                : 'bg-bg-surface border border-gray-700 text-text-secondary hover:text-text-primary'
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800 bg-bg-elevated">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Tasks</th>
                <th className="px-6 py-3">Sessions</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="skeleton h-4 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.map((u) => (
                    <tr key={u.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="hover:text-accent-400 font-medium"
                        >
                          {u.name || '—'}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-accent-400/20 text-accent-400'
                              : 'bg-gray-700 text-text-muted'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">{u._count.tasks}</td>
                      <td className="px-6 py-3 text-text-secondary">{u._count.focusSessions}</td>
                      <td className="px-6 py-3 text-text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={actionLoading === u.id}
                          className={`text-xs px-3 py-1 rounded-lg border transition-colors disabled:opacity-50 ${
                            u.role === 'admin'
                              ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                              : 'border-accent-400/40 text-accent-400 hover:bg-accent-400/10'
                          }`}
                        >
                          {actionLoading === u.id
                            ? '...'
                            : u.role === 'admin'
                            ? 'Demote to User'
                            : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-text-muted">
                    No users found.
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
