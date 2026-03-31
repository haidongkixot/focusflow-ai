import Link from 'next/link'
import { Zap, ExternalLink } from 'lucide-react'

const ecosystemApps = [
  { name: 'PeeTeeAI', url: 'https://peeteeai-web.vercel.app', desc: 'AI Personal Trainer' },
  { name: 'BreathMaster', url: 'https://breathmaster-ai.vercel.app', desc: 'Breathing Coach' },
  { name: 'HabitOS', url: 'https://habitos-ai.vercel.app', desc: 'Habit Tracker' },
  { name: 'MemoryForge', url: 'https://memoryforge-ai.vercel.app', desc: 'Memory Training' },
  { name: 'HarmonyMap', url: 'https://harmonymap-ai.vercel.app', desc: 'Life Balance' },
  { name: 'Seeneyu', url: 'https://seeneyu.vercel.app', desc: 'Social Platform' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0e] border-t border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo + tagline */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-accent-400 font-bold text-xl mb-3">
            <Zap className="w-5 h-5" />
            FocusFlow AI
          </div>
          <p className="text-text-muted text-sm max-w-md">
            A <a href="https://peeteeai-web.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 transition">PeeTeeAI</a> Product &middot; Part of the HumanOS Ecosystem
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Product */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm tracking-wide uppercase mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/timer" className="text-text-muted text-sm hover:text-text-primary transition">Timer</Link></li>
              <li><Link href="/tasks" className="text-text-muted text-sm hover:text-text-primary transition">Tasks</Link></li>
              <li><Link href="/pricing" className="text-text-muted text-sm hover:text-text-primary transition">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-text-muted text-sm hover:text-text-primary transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm tracking-wide uppercase mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-text-muted text-sm hover:text-text-primary transition">About</Link></li>
              <li><Link href="/contact" className="text-text-muted text-sm hover:text-text-primary transition">Contact</Link></li>
              <li>
                <a href="https://peeteeai-web.vercel.app/team" target="_blank" rel="noopener noreferrer" className="text-text-muted text-sm hover:text-text-primary transition inline-flex items-center gap-1">
                  Team <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm tracking-wide uppercase mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-text-muted text-sm hover:text-text-primary transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-muted text-sm hover:text-text-primary transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm tracking-wide uppercase mb-4">Ecosystem</h4>
            <ul className="space-y-3">
              {ecosystemApps.map((app) => (
                <li key={app.name}>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted text-sm hover:text-text-primary transition inline-flex items-center gap-1"
                  >
                    {app.name} <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; 2026 PeeTeeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-text-muted text-xs hover:text-text-primary transition">Privacy</Link>
            <Link href="/terms" className="text-text-muted text-xs hover:text-text-primary transition">Terms</Link>
            <Link href="/contact" className="text-text-muted text-xs hover:text-text-primary transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
