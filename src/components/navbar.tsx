'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-accent-400 font-bold text-xl">
            <Zap className="w-6 h-6" />
            FocusFlow
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition">Dashboard</Link>
                <Link href="/timer" className="text-text-secondary hover:text-text-primary transition">Timer</Link>
                <Link href="/tasks" className="text-text-secondary hover:text-text-primary transition">Tasks</Link>
                <Link href="/analytics" className="text-text-secondary hover:text-text-primary transition">Analytics</Link>
                <button onClick={() => signOut()} className="btn-secondary text-sm py-2 px-4">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-text-secondary hover:text-text-primary transition">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>
          <button className="md:hidden text-text-secondary" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-text-secondary">Dashboard</Link>
                <Link href="/timer" className="block py-2 text-text-secondary">Timer</Link>
                <Link href="/tasks" className="block py-2 text-text-secondary">Tasks</Link>
                <Link href="/analytics" className="block py-2 text-text-secondary">Analytics</Link>
                <button onClick={() => signOut()} className="block py-2 text-text-secondary">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-text-secondary">Sign In</Link>
                <Link href="/signup" className="block py-2 text-accent-400">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
