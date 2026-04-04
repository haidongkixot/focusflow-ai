'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Coffee, Plus, Star, BarChart3, Trash2 } from 'lucide-react'

const BREAK_TYPES = [
  { key: 'nature', label: 'Nature', emoji: '🌿' },
  { key: 'movement', label: 'Movement', emoji: '🏃' },
  { key: 'social', label: 'Social', emoji: '💬' },
  { key: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { key: 'screen', label: 'Screen', emoji: '📱' },
  { key: 'food', label: 'Food', emoji: '🍎' },
]

const DURATIONS = [2, 5, 10, 15, 20]
const STORAGE_KEY = 'focusflow-break-tracker'

interface BreakEntry {
  id: string
  type: string
  duration: number
  focusRating: number
  date: string
}

const RESEARCH_RANK = ['nature', 'movement', 'social', 'mindfulness', 'food', 'screen']

export default function BreakTrackerPage() {
  const [entries, setEntries] = useState<BreakEntry[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(5)
  const [focusRating, setFocusRating] = useState<number>(0)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setEntries(JSON.parse(stored))
    } catch {}
  }, [])

  function saveEntries(updated: BreakEntry[]) {
    setEntries(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  function handleLog() {
    if (!selectedType || focusRating === 0) return
    const entry: BreakEntry = {
      id: Date.now().toString(36),
      type: selectedType,
      duration: selectedDuration,
      focusRating,
      date: new Date().toISOString(),
    }
    saveEntries([...entries, entry])
    setSelectedType(null)
    setSelectedDuration(5)
    setFocusRating(0)
    setShowForm(false)
  }

  function handleDelete(id: string) {
    saveEntries(entries.filter(e => e.id !== id))
  }

  // Last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo)

  // Averages by type
  const avgByType = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {}
    for (const e of recentEntries) {
      if (!map[e.type]) map[e.type] = { total: 0, count: 0 }
      map[e.type].total += e.focusRating
      map[e.type].count += 1
    }
    return Object.entries(map)
      .map(([type, { total, count }]) => ({ type, avg: total / count, count }))
      .sort((a, b) => b.avg - a.avg)
  }, [recentEntries])

  const bestType = avgByType[0]
  const bestLabel = BREAK_TYPES.find(t => t.key === bestType?.type)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/academy" className="inline-flex items-center gap-2 text-text-muted hover:text-accent-400 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Coffee className="w-8 h-8 text-rose-400" />
            Break Quality Tracker
          </h1>
          <p className="text-text-secondary mt-1">
            Log your breaks and discover which types restore your focus best
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Log Break
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="bg-bg-surface border border-rose-400/30 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-text-primary">Log a Break</h3>

          {/* Type */}
          <div>
            <p className="text-sm text-text-muted mb-2">Break type</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BREAK_TYPES.map(bt => (
                <button
                  key={bt.key}
                  onClick={() => setSelectedType(bt.key)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border text-sm transition-all ${
                    selectedType === bt.key
                      ? 'bg-rose-400/10 border-rose-400 text-rose-400'
                      : 'bg-bg-elevated border-gray-700 text-text-secondary hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl">{bt.emoji}</span>
                  <span className="text-xs">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-sm text-text-muted mb-2">Duration</p>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedDuration === d
                      ? 'bg-rose-400/10 border-rose-400 text-rose-400'
                      : 'bg-bg-elevated border-gray-700 text-text-secondary hover:border-gray-600'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Focus rating */}
          <div>
            <p className="text-sm text-text-muted mb-2">Post-break focus restoration</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  onClick={() => setFocusRating(r)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${r <= focusRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLog}
            disabled={!selectedType || focusRating === 0}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Save Break
          </button>
        </div>
      )}

      {/* Best break type */}
      {bestType && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-sm text-text-muted mb-1">Your best break type (last 7 days)</p>
          <p className="text-2xl font-bold text-rose-400">
            {bestLabel?.emoji} {bestLabel?.label}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            avg {bestType.avg.toFixed(1)} focus restoration ({bestType.count} breaks)
          </p>
        </div>
      )}

      {/* Bar chart: avg focus by type */}
      {avgByType.length > 0 && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-rose-400" /> Average Focus Restoration by Break Type
          </h2>
          <div className="space-y-3">
            {avgByType.map(({ type, avg, count }) => {
              const bt = BREAK_TYPES.find(b => b.key === type)
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">{bt?.emoji} {bt?.label}</span>
                    <span className="text-text-muted">{avg.toFixed(1)}/5 ({count}x)</span>
                  </div>
                  <div className="w-full bg-bg-elevated rounded-full h-3">
                    <div
                      className="bg-rose-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(avg / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Research comparison */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
        <h2 className="font-semibold text-text-primary mb-3">Research Says</h2>
        <p className="text-sm text-text-secondary mb-4">
          Studies show break types ranked by focus restoration effectiveness:
        </p>
        <div className="space-y-2">
          {RESEARCH_RANK.map((key, i) => {
            const bt = BREAK_TYPES.find(b => b.key === key)
            const width = 100 - i * 14
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-6 text-right text-sm text-text-muted font-medium">{i + 1}.</span>
                <span className="text-sm w-24">{bt?.emoji} {bt?.label}</span>
                <div className="flex-1 bg-bg-elevated rounded-full h-2">
                  <div className="bg-rose-400/60 h-2 rounded-full" style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent breaks */}
      {recentEntries.length > 0 && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-text-primary mb-3">Last 7 Days ({recentEntries.length} breaks)</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...recentEntries].reverse().map(e => {
              const bt = BREAK_TYPES.find(b => b.key === e.type)
              return (
                <div key={e.id} className="flex items-center justify-between bg-bg-elevated rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{bt?.emoji}</span>
                    <div>
                      <p className="text-sm text-text-primary font-medium">{bt?.label} -- {e.duration} min</p>
                      <p className="text-xs text-text-muted">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= e.focusRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <button onClick={() => handleDelete(e.id)} className="text-gray-600 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-12 text-text-muted">
          No breaks logged yet. Click &quot;Log Break&quot; to start tracking.
        </div>
      )}
    </div>
  )
}
