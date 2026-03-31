import prisma from '@/lib/prisma'

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [totalUsers, totalSessions, totalTasks, doneTasks, recentUsers, topUsers] = await Promise.all([
    prisma.user.count(),
    prisma.focusSession.count({ where: { completed: true } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'done' } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 30, select: { createdAt: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { focusSessions: { _count: 'desc' } },
      select: { id: true, name: true, email: true, _count: { select: { focusSessions: true, tasks: true } } },
    }),
  ])

  const signupsPerDay = last7Days.map(d => {
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const dateStr = d.toISOString().split('T')[0]
    const count = recentUsers.filter(u => u.createdAt.toISOString().split('T')[0] === dateStr).length
    return { label, count }
  })

  const maxSignups = Math.max(...signupsPerDay.map(d => d.count), 1)
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-secondary text-sm mt-1">Platform usage and performance metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, color: 'text-blue-400' },
          { label: 'Focus Sessions', value: totalSessions, color: 'text-accent-400' },
          { label: 'Tasks Done', value: doneTasks, color: 'text-green-400' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold mb-6">New Signups — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-32">
          {signupsPerDay.map(d => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-accent-400 font-medium">{d.count}</span>
              <div className="w-full bg-bg-elevated rounded-t-sm min-h-[4px]" style={{ height: `${Math.max((d.count / maxSignups) * 100, 4)}px`, background: 'rgb(244 63 94 / 0.6)' }} />
              <span className="text-xs text-text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold mb-4">Top Users by Sessions</h2>
        <div className="space-y-2">
          {topUsers.map((u, i) => (
            <div key={u.id} className="flex items-center gap-3">
              <span className="w-5 text-xs text-text-muted">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{u.name || u.email}</p>
              </div>
              <span className="text-xs text-accent-400">{u._count.focusSessions} sessions</span>
              <span className="text-xs text-text-muted">{u._count.tasks} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
