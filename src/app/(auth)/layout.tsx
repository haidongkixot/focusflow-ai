import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <nav className="border-b border-gray-800 px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-accent-400 font-bold text-xl">
          <Zap className="w-6 h-6" />
          FocusFlow
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
