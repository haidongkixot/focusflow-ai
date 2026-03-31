import prisma from '@/lib/prisma'

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  })
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-text-secondary text-sm mt-1">{unreadCount} unread of {notifications.length} total</p>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {notifications.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No notifications yet</td></tr>
            ) : notifications.map(n => (
              <tr key={n.id} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-text-secondary text-xs">{n.user.name || n.user.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-bg-elevated text-text-muted">{n.type}</span></td>
                <td className="px-4 py-3 text-xs text-text-primary">{n.title}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${n.read ? 'text-text-muted' : 'bg-accent-400/20 text-accent-400 font-medium'}`}>{n.read ? 'read' : 'unread'}</span></td>
                <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
