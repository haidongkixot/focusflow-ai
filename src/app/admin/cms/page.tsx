'use client'
import { useState } from 'react'

const TONES = ['informative and engaging', 'casual and fun', 'scientific and authoritative', 'motivational', 'beginner-friendly']

export default function AdminCmsPage() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState(TONES[0])
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [genError, setGenError] = useState('')

  async function generateBlog() {
    if (!topic.trim()) return
    setGenerating(true)
    setGenError('')
    setPreview(null)
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setPreview(data)
    } catch (err: any) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Blog / CMS</h1>
        <p className="text-text-secondary text-sm mt-1">Manage published content and blog posts</p>
      </div>

      {/* AI Blog Generation */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-lg font-bold">Generate Blog Post</h2>
            <p className="text-sm text-text-secondary">Use AI to draft a blog post about focus, productivity, or deep work</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. How deep work sessions boost creative output"
              className="w-full bg-bg-elevated border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full bg-bg-elevated border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-400"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={generateBlog}
          disabled={generating || !topic.trim()}
          className="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Generating...
            </>
          ) : '🤖 Generate Blog Post'}
        </button>

        {genError && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-400">{genError}</div>
        )}

        {preview && (
          <div className="space-y-4 border-t border-gray-700 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview</h3>
              {preview._ai && (
                <div className="flex gap-3 text-xs text-text-muted">
                  <span>{preview._ai.model}</span>
                  <span>{preview._ai.tokensUsed} tokens</span>
                  <span>{preview._ai.durationMs}ms</span>
                </div>
              )}
            </div>
            <div className="bg-bg-elevated border border-gray-700 rounded-lg p-5 space-y-3">
              <h4 className="text-xl font-bold">{preview.title}</h4>
              <p className="text-xs text-text-muted font-mono">/{preview.slug}</p>
              <p className="text-sm text-text-secondary italic">{preview.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {preview.tags?.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 bg-accent-500/20 text-accent-400 rounded-full text-xs">{t}</span>
                ))}
              </div>
              <details className="mt-3">
                <summary className="text-sm text-text-secondary cursor-pointer hover:text-text-primary">Show full body</summary>
                <pre className="mt-2 text-xs text-text-secondary whitespace-pre-wrap max-h-80 overflow-auto bg-bg-base rounded-lg p-4">{preview.body}</pre>
              </details>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateBlog}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-gray-700 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(JSON.stringify(preview, null, 2)) }}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-gray-700 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                Copy JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder for future CMS */}
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">Full Blog CMS</h2>
        <p className="text-text-secondary mb-6 max-w-sm mx-auto">Full blog CMS with drafts, publishing, and scheduling will be available once the BlogPost model is added.</p>
      </div>
    </div>
  )
}
