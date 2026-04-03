import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Providers from '@/components/providers'
import Link from 'next/link'
import { LayoutDashboard, Users, Timer, ListTodo, Trophy, Zap, BarChart2, CreditCard, FileText, Bell, AlertCircle, Lightbulb } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') redirect('/login')

  const nav = [
    { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', Icon: Users },
    { href: '/admin/sessions', label: 'Sessions', Icon: Timer },
    { href: '/admin/tasks', label: 'Tasks', Icon: ListTodo },
    { href: '/admin/achievements', label: 'Achievements', Icon: Trophy },
    { href: '/admin/analytics', label: 'Analytics', Icon: BarChart2 },
    { href: '/admin/plans', label: 'Plans', Icon: CreditCard },
    { href: '/admin/cms', label: 'Blog / CMS', Icon: FileText },
    { href: '/admin/techniques', label: 'Techniques', Icon: Lightbulb },
    { href: '/admin/logs', label: 'Logs', Icon: AlertCircle },
    { href: '/admin/notifications', label: 'Notifications', Icon: Bell },
  ]

  return (
    <Providers>
      <div className="min-h-screen bg-bg-base flex">
        <aside className="w-56 fixed left-0 top-0 h-full bg-bg-surface border-r border-gray-800 flex flex-col z-40">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2 text-accent-400 font-bold">
            <Zap className="w-5 h-5" /><span className="text-sm">FocusFlow Admin</span>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {nav.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800 space-y-2">
            <p className="text-xs text-text-muted truncate">{session.user.email}</p>
            <Link href="/dashboard" className="text-xs text-accent-400 hover:underline">
              ← Back to app
            </Link>
          </div>
        </aside>
        <main className="ml-56 flex-1 p-8">{children}</main>
      </div>
    </Providers>
  )
}
