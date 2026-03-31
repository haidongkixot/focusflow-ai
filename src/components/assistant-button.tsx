'use client'
import { useState, useRef, useEffect } from 'react'
import { Brain, X, Send } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function AssistantButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.message || 'How can I help you focus?' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I ran into an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent-400 hover:bg-accent-500 shadow-glow flex items-center justify-center transition-all duration-200 ${open ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}
        title="FocusFlow Coach"
      >
        <Brain className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-bg-surface border border-gray-700 rounded-2xl shadow-glow-lg flex flex-col" style={{ height: '480px' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-text-primary">FocusFlow Coach</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-accent-400 mx-auto mb-3" />
                <p className="text-text-secondary text-sm">Hi! I&apos;m your FocusFlow AI Coach. Ask me about productivity, focus techniques, or managing your tasks!</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-accent-400 text-white' : 'bg-bg-elevated text-text-secondary'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-bg-elevated px-3 py-2 rounded-xl flex gap-1">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask your coach..."
                className="input-field py-2 text-sm"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-accent-400 hover:bg-accent-500 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
