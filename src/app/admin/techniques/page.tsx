'use client'

import { useEffect, useState, useCallback } from 'react'
import { Zap, Plus, Trash2, Pencil, Loader2, ChevronLeft, ChevronRight, X, Bot, Sparkles } from 'lucide-react'

interface Technique {
  id: string
  name: string
  slug: string
  category: string
  description: string
  instructions: string[]
  durationMins: number
  breakMins: number
  cycles: number
  difficulty: string
  benefits: string[]
  ambientSound: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
}

const CATEGORIES = ['deep_work', 'creative', 'learning', 'energy', 'mindfulness'] as const
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
const AMBIENT_OPTIONS = ['rain', 'cafe', 'nature', 'white_noise'] as const

const CAT_LABELS: Record<string, string> = {
  deep_work: 'Deep Work',
  creative: 'Creative',
  learning: 'Learning',
  energy: 'Energy',
  mindfulness: 'Mindfulness',
}

const CAT_COLORS: Record<string, string> = {
  deep_work: 'bg-blue-900/30 text-blue-300',
  creative: 'bg-purple-900/30 text-purple-300',
  learning: 'bg-green-900/30 text-green-300',
  energy: 'bg-orange-900/30 text-orange-300',
  mindfulness: 'bg-teal-900/30 text-teal-300',
}

const DIFF_COLORS: Record<string, string> = {
  beginner: 'bg-green-900/30 text-green-300',
  intermediate: 'bg-yellow-900/30 text-yellow-300',
  advanced: 'bg-red-900/30 text-red-300',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminTechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filterCat, setFilterCat] = useState('all')
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', slug: '', category: 'deep_work', description: '',
    instructions: '', durationMins: 25, breakMins: 5, cycles: 4,
    difficulty: 'beginner', benefits: '', ambientSound: '',
    sortOrder: 0,
  })
  const [saving, setSaving] = useState(false)

  // AI Generate state
  const [showGenerate, setShowGenerate] = useState(false)
  const [genCategory, setGenCategory] = useState<string>('deep_work')
  const [genDifficulty, setGenDifficulty] = useState<string>('beginner')
  const [genTheme, setGenTheme] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedTechnique, setGeneratedTechnique] = useState<any>(null)

  const fetchTechniques = useCallback(async (p: number, cat: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), category: cat })
      const res = await fetch(`/api/admin/techniques?${params}`)
      const data = await res.json()
      setTechniques(data.techniques || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Fetch techniques error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTechniques(page, filterCat)
  }, [fetchTechniques, page, filterCat])

  function resetForm() {
    setEditingId(null)
    setForm({
      name: '', slug: '', category: 'deep_work', description: '',
      instructions: '', durationMins: 25, breakMins: 5, cycles: 4,
      difficulty: 'beginner', benefits: '', ambientSound: '',
      sortOrder: 0,
    })
    setShowForm(false)
  }

  function openEdit(t: Technique) {
    setEditingId(t.id)
    setForm({
      name: t.name,
      slug: t.slug,
      category: t.category,
      description: t.description,
      instructions: t.instructions.join('\n'),
      durationMins: t.durationMins,
      breakMins: t.breakMins,
      cycles: t.cycles,
      difficulty: t.difficulty,
      benefits: t.benefits.join('\n'),
      ambientSound: t.ambientSound || '',
      sortOrder: t.sortOrder,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        id: editingId || undefined,
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category,
        description: form.description,
        instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
        durationMins: form.durationMins,
        breakMins: form.breakMins,
        cycles: form.cycles,
        difficulty: form.difficulty,
        benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
        ambientSound: form.ambientSound || null,
        sortOrder: form.sortOrder,
      }
      const res = await fetch('/api/admin/techniques', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      resetForm()
      fetchTechniques(page, filterCat)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this technique?')) return
    await fetch(`/api/admin/techniques?id=${id}`, { method: 'DELETE' })
    fetchTechniques(page, filterCat)
  }

  async function handleToggleActive(t: Technique) {
    await fetch('/api/admin/techniques', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: t.id, isActive: !t.isActive }),
    })
    fetchTechniques(page, filterCat)
  }

  async function handleGenerate() {
    setGenerating(true)
    setGeneratedTechnique(null)
    try {
      const res = await fetch('/api/admin/techniques/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: genCategory, difficulty: genDifficulty, theme: genTheme }),
      })
      const data = await res.json()
      setGeneratedTechnique(data)
    } catch (err) {
      console.error('Generation error:', err)
    } finally {
      setGenerating(false)
    }
  }

  function loadGeneratedToForm() {
    if (!generatedTechnique) return
    const t = generatedTechnique
    setForm({
      name: t.name || '',
      slug: t.slug || slugify(t.name || ''),
      category: t.category || genCategory,
      description: t.description || '',
      instructions: (t.instructions || []).join('\n'),
      durationMins: t.durationMins || 25,
      breakMins: t.breakMins || 5,
      cycles: t.cycles || 4,
      difficulty: t.difficulty || genDifficulty,
      benefits: (t.benefits || []).join('\n'),
      ambientSound: t.ambientSound || '',
      sortOrder: 0,
    })
    setShowGenerate(false)
    setGeneratedTechnique(null)
    setShowForm(true)
  }

  async function saveGeneratedDirectly() {
    if (!generatedTechnique) return
    setSaving(true)
    try {
      const t = generatedTechnique
      const res = await fetch('/api/admin/techniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          slug: t.slug || slugify(t.name || ''),
          category: t.category || genCategory,
          description: t.description,
          instructions: t.instructions || [],
          durationMins: t.durationMins || 25,
          breakMins: t.breakMins || 5,
          cycles: t.cycles || 4,
          difficulty: t.difficulty || genDifficulty,
          benefits: t.benefits || [],
          ambientSound: t.ambientSound || null,
        }),
      })
      if (res.ok) {
        setGeneratedTechnique(null)
        setShowGenerate(false)
        fetchTechniques(page, filterCat)
      }
    } catch (err) {
      console.error('Save generated error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-accent-400" />
          <h1 className="text-2xl font-bold">Focus Techniques</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenerate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-accent-400 to-purple-500 text-white hover:opacity-90 transition-opacity"
          >
            <Bot className="w-4 h-4" />
            Generate with AI
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-400 text-white hover:bg-accent-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Technique
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => { setFilterCat(c); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterCat === c
                ? 'bg-accent-400 text-white'
                : 'bg-bg-elevated border border-gray-800 text-text-secondary hover:text-text-primary'
            }`}
          >
            {c === 'all' ? 'All' : CAT_LABELS[c] || c}
          </button>
        ))}
        <span className="ml-auto text-sm text-text-muted">{total} total</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
          </div>
        ) : techniques.length === 0 ? (
          <div className="text-center py-16 text-text-muted">No techniques found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-gray-800 bg-bg-elevated">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Difficulty</th>
                <th className="px-6 py-3 font-medium">Active</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {techniques.map(t => (
                <tr key={t.id} className="hover:bg-bg-elevated/50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-text-muted truncate max-w-[200px]">{t.description.slice(0, 80)}...</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CAT_COLORS[t.category] || 'bg-gray-700 text-text-muted'}`}>
                      {CAT_LABELS[t.category] || t.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-text-secondary text-xs">
                    {t.durationMins}m / {t.breakMins}m x {t.cycles}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DIFF_COLORS[t.difficulty] || 'bg-gray-700 text-text-muted'}`}>
                      {t.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleActive(t)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${t.isActive ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${t.isActive ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-accent-400 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-900/20 text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Technique' : 'Create Technique'}</h2>
              <button onClick={resetForm} className="p-1 hover:bg-bg-elevated rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" placeholder="Technique name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30 text-text-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30">
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30 resize-y" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Duration (min)</label>
                  <input type="number" value={form.durationMins} onChange={e => setForm(f => ({ ...f, durationMins: parseInt(e.target.value) || 25 }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Break (min)</label>
                  <input type="number" value={form.breakMins} onChange={e => setForm(f => ({ ...f, breakMins: parseInt(e.target.value) || 5 }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Cycles</label>
                  <input type="number" value={form.cycles} onChange={e => setForm(f => ({ ...f, cycles: parseInt(e.target.value) || 4 }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Instructions (one per line)</label>
                <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={4} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30 resize-y" placeholder="Step 1&#10;Step 2&#10;Step 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Benefits (one per line)</label>
                <textarea value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30 resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Ambient Sound</label>
                <select value={form.ambientSound} onChange={e => setForm(f => ({ ...f, ambientSound: e.target.value }))} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30">
                  <option value="">None</option>
                  {AMBIENT_OPTIONS.map(a => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.description} className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-400 text-white hover:bg-accent-500 disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent-400" />
                <h2 className="text-lg font-bold">Generate Technique with AI</h2>
              </div>
              <button onClick={() => { setShowGenerate(false); setGeneratedTechnique(null) }} className="p-1 hover:bg-bg-elevated rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                  <select value={genCategory} onChange={e => setGenCategory(e.target.value)} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Difficulty</label>
                  <select value={genDifficulty} onChange={e => setGenDifficulty(e.target.value)} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30">
                    {DIFFICULTIES.map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Theme (optional)</label>
                <input value={genTheme} onChange={e => setGenTheme(e.target.value)} className="w-full px-3 py-2 bg-bg-base border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" placeholder="e.g. morning focus, afternoon slump recovery" />
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-accent-400 to-purple-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
              </button>

              {/* Generated preview */}
              {generatedTechnique && (
                <div className="border border-gray-800 rounded-xl p-5 space-y-3 mt-4">
                  <h3 className="font-bold text-lg">{generatedTechnique.name}</h3>
                  <p className="text-sm text-text-secondary">{generatedTechnique.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${CAT_COLORS[generatedTechnique.category] || 'bg-gray-700 text-text-muted'}`}>{CAT_LABELS[generatedTechnique.category] || generatedTechnique.category}</span>
                    <span className={`px-2 py-0.5 rounded-full capitalize ${DIFF_COLORS[generatedTechnique.difficulty] || 'bg-gray-700 text-text-muted'}`}>{generatedTechnique.difficulty}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 text-text-muted">{generatedTechnique.durationMins}m / {generatedTechnique.breakMins}m x {generatedTechnique.cycles}</span>
                    {generatedTechnique.ambientSound && <span className="px-2 py-0.5 rounded-full bg-gray-800 text-text-muted">{generatedTechnique.ambientSound}</span>}
                  </div>
                  {generatedTechnique.instructions?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-text-muted mb-1">Instructions:</p>
                      <ol className="list-decimal list-inside text-sm text-text-secondary space-y-1">
                        {generatedTechnique.instructions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ol>
                    </div>
                  )}
                  {generatedTechnique.benefits?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-text-muted mb-1">Benefits:</p>
                      <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                        {generatedTechnique.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={loadGeneratedToForm} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-accent-400 text-accent-400 hover:bg-accent-400/10">
                      Edit Before Saving
                    </button>
                    <button onClick={saveGeneratedDirectly} disabled={saving} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-accent-400 text-white hover:bg-accent-500 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Directly'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
