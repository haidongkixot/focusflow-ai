'use client'
import { useEffect, useState } from 'react'
import { BookOpen, Sparkles, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface Chapter {
  id: string; slug: string; title: string; category: string
  sortOrder: number; minPlanSlug: string; isActive: boolean
  createdAt: string; _count: { progress: number }
}

const CATEGORIES = ['deep_work', 'creative', 'learning', 'energy', 'mindfulness']
const PLANS = ['free', 'plus', 'pro']

export default function AdminAcademyPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  const [topic, setTopic] = useState('')
  const [genCategory, setGenCategory] = useState(CATEGORIES[0])
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [genError, setGenError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    slug: '', title: '', body: '', category: CATEGORIES[0],
    sortOrder: 0, minPlanSlug: 'free', keyTakeaways: ['', '', '', '', ''],
    quizData: [
      { question: '', options: ['', '', '', ''], correctIndex: 0 },
      { question: '', options: ['', '', '', ''], correctIndex: 0 },
      { question: '', options: ['', '', '', ''], correctIndex: 0 },
      { question: '', options: ['', '', '', ''], correctIndex: 0 },
    ],
  })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/academy')
      if (res.ok) setChapters(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, isActive: boolean) {
    await fetch('/api/admin/academy', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    load()
  }

  async function deleteChapter(id: string) {
    if (!confirm('Delete this chapter permanently?')) return
    await fetch('/api/admin/academy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  async function generateChapter() {
    if (!topic.trim()) return
    setGenerating(true); setGenError(''); setPreview(null)
    try {
      const res = await fetch('/api/admin/academy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category: genCategory }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setPreview(data)
    } catch (err: any) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  function loadFromPreview() {
    if (!preview) return
    setForm({
      slug: preview.slug || '',
      title: preview.title || '',
      body: preview.body || '',
      category: preview.category || genCategory,
      sortOrder: chapters.length,
      minPlanSlug: 'free',
      keyTakeaways: preview.keyTakeaways || ['', '', '', '', ''],
      quizData: preview.quizData || form.quizData,
    })
    setShowCreate(true)
  }

  async function saveChapter() {
    setSaving(true); setSaveMsg('')
    try {
      const payload = {
        ...form,
        keyTakeaways: form.keyTakeaways.filter(Boolean),
        quizData: form.quizData.filter(q => q.question.trim()),
      }
      const res = await fetch('/api/admin/academy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSaveMsg('Chapter created!')
      setShowCreate(false)
      load()
    } catch (err: any) {
      setSaveMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Academy</h1>
          <p className="text-text-muted text-sm mt-1">Manage educational chapters for users</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-400 hover:bg-accent-500 text-bg-base rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          {showCreate ? 'Cancel' : 'New Chapter'}
        </button>
      </div>

      {/* AI Generator */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent-400" />
          <div>
            <h2 className="text-lg font-bold text-text-primary">AI Chapter Generator</h2>
            <p className="text-sm text-text-muted">Generate a chapter draft with AI, then review and save</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. How flow states boost productivity"
            className="md:col-span-2 bg-bg-base border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-400" />
          <select value={genCategory} onChange={e => setGenCategory(e.target.value)}
            className="bg-bg-base border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-400">
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <button onClick={generateChapter} disabled={generating || !topic.trim()}
          className="px-6 py-2.5 bg-accent-400 hover:bg-accent-500 text-bg-base rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2">
          {generating ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</>) : (<><Sparkles className="w-4 h-4" />Generate Chapter</>)}
        </button>
        {genError && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-400">{genError}</div>}
        {preview && (
          <div className="space-y-3 border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Preview</h3>
              {preview._ai && (
                <div className="flex gap-3 text-xs text-text-muted">
                  <span>{preview._ai.model}</span>
                  <span>{preview._ai.tokensUsed} tokens</span>
                  <span>{preview._ai.durationMs}ms</span>
                </div>
              )}
            </div>
            <div className="bg-bg-base border border-gray-700 rounded-lg p-5 space-y-2">
              <h4 className="text-lg font-bold text-text-primary">{preview.title}</h4>
              <p className="text-xs text-text-muted font-mono">/{preview.slug}</p>
              <details>
                <summary className="text-sm text-text-secondary cursor-pointer hover:text-text-primary">Show body</summary>
                <pre className="mt-2 text-xs text-text-secondary whitespace-pre-wrap max-h-60 overflow-auto bg-bg-surface rounded-lg p-4">{preview.body}</pre>
              </details>
            </div>
            <div className="flex gap-3">
              <button onClick={loadFromPreview}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
                Use & Edit
              </button>
              <button onClick={generateChapter}
                className="px-4 py-2 text-text-secondary hover:text-text-primary border border-gray-700 rounded-lg text-sm hover:bg-bg-elevated transition-colors">
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-text-primary">New Chapter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Slug</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-400" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-400" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-400">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Min Plan</label>
              <select value={form.minPlanSlug} onChange={e => setForm({ ...form, minPlanSlug: e.target.value })}
                className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-400">
                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Body (Markdown)</label>
            <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={10}
              className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-400 font-mono" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Key Takeaways</label>
            {form.keyTakeaways.map((t, i) => (
              <input key={i} value={t} onChange={e => { const k = [...form.keyTakeaways]; k[i] = e.target.value; setForm({ ...form, keyTakeaways: k }) }}
                placeholder={`Takeaway ${i + 1}`}
                className="w-full bg-bg-base border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm mb-2 focus:outline-none focus:border-accent-400" />
            ))}
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Quiz Questions</label>
            {form.quizData.map((q, qi) => (
              <div key={qi} className="bg-bg-base border border-gray-700 rounded-lg p-4 mb-3 space-y-2">
                <input value={q.question} onChange={e => { const qd = [...form.quizData]; qd[qi] = { ...qd[qi], question: e.target.value }; setForm({ ...form, quizData: qd }) }}
                  placeholder={`Question ${qi + 1}`}
                  className="w-full bg-bg-elevated border border-gray-600 rounded px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-accent-400" />
                {q.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" checked={q.correctIndex === oi} onChange={() => { const qd = [...form.quizData]; qd[qi] = { ...qd[qi], correctIndex: oi }; setForm({ ...form, quizData: qd }) }} className="accent-accent-400" />
                    <input value={o} onChange={e => { const qd = [...form.quizData]; qd[qi] = { ...qd[qi], options: qd[qi].options.map((x, xi) => xi === oi ? e.target.value : x) }; setForm({ ...form, quizData: qd }) }}
                      placeholder={`Option ${oi + 1}`}
                      className="flex-1 bg-bg-elevated border border-gray-600 rounded px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-accent-400" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {saveMsg && <div className={`text-sm ${saveMsg.includes('created') ? 'text-green-400' : 'text-red-400'}`}>{saveMsg}</div>}
          <button onClick={saveChapter} disabled={saving || !form.slug || !form.title || !form.body}
            className="px-6 py-2.5 bg-accent-400 hover:bg-accent-500 text-bg-base rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Chapter'}
          </button>
        </div>
      )}

      {/* Chapters Table */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated text-text-muted text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Readers</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-text-muted">Loading...</td></tr>
            ) : chapters.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-text-muted">No chapters yet. Generate or create one above.</td></tr>
            ) : chapters.map(ch => (
              <tr key={ch.id} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-text-muted">{ch.sortOrder}</td>
                <td className="px-4 py-3 text-text-primary font-medium">{ch.title}</td>
                <td className="px-4 py-3 text-text-secondary">{ch.category.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ch.minPlanSlug === 'free' ? 'bg-green-900/30 text-green-400' : ch.minPlanSlug === 'plus' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                    {ch.minPlanSlug}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{ch._count.progress}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(ch.id, ch.isActive)} className="text-text-secondary hover:text-text-primary">
                    {ch.isActive ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-text-muted" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteChapter(ch.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
