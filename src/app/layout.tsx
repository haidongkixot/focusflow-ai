import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FocusFlow AI — Deep Work, Powered by AI',
  description: 'AI-powered productivity and focus management. Pomodoro timer, task tracking, and intelligent coaching to help you achieve deep work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
