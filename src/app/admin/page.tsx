import prisma from '@/lib/prisma'
import { Users, Timer, ListTodo, Trophy } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [totalUsers, totalSessions, totalTasks, totalAchievements, recentUsers, todaySessions] =
    await Promise.all([
      prisma.user.count(),
      prisma.focusSession.count({ where: { completed: true } }),
      prisma.task.count(),
      prisma.userAchievement.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { tasks: true, focusSessions: true } },
        },
      }),
      prisma.focusSession.count({ where: { completed: true, startedAt: { gte: today } } }),
    ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">{todaySessions} sessions completed today</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Users', value: totalUsers, Icon: Users, href: '/admin/users' },
          { label: 'Focus Sessions', value: totalSessions, Icon: Timer, href: '/admin/sessions' },
          { label: 'Tasks', value: totalTasks, Icon: ListTodo, href: '/admin/tasks' },
          { label: 'Achievements', value: totalAchievements, Icon: Trophy, href: '/admin/achievements' },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card text-center hover:border-accent-400/30 transition-colors"
          >
            <s.Icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-accent-400">{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2 pr-4">Tasks</th>
                <th className="pb-2 pr-4">Sessions</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-bg-elevated/50">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/users/${u.id}`} className="hover:text-accent-400">
                      {u.name || '—'}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">{u.email}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        u.role === 'admin'
                          ? 'bg-accent-400/20 text-accent-400'
                          : 'bg-gray-700 text-text-muted'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">{u._count.tasks}</td>
                  <td className="py-2 pr-4 text-text-secondary">{u._count.focusSessions}</td>
                  <td className="py-2 text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
