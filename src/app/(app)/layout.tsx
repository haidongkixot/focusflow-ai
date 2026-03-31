import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/navbar'
import Providers from '@/components/providers'
import GamificationBar from '@/components/gamification-bar'
import AssistantButton from '@/components/assistant-button'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <Providers>
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <GamificationBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <AssistantButton />
      </div>
    </Providers>
  )
}
