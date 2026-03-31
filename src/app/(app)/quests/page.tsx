'use client'

import { useState, useEffect } from 'react'
import { Sword, CheckCircle2, Circle, Clock, Target, ListChecks, Sparkles } from 'lucide-react'

interface Quest {
  id: string
  slug: string
  title: string
  description: string | null
  type: string
  target: number
  progress: number
  completed: boolean
  xpReward: number
  completedAt: string | null
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuests()
  }, [])

  async function fetchQuests() {
    setLoading(true)
    try {
      const res = await fetch('/api/quests')
      if (res.ok) {
        const data = await res.json()
        setQuests(data.quests || [])
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  function getQuestIcon(slug: string) {
    if (slug.includes('session')) return <Clock className="w-5 h-5" />
    if (slug.includes('task')) return <ListChecks className="w-5 h-5" />
    if (slug.includes('focus')) return <Target className="w-5 h-5" />
    return <Sparkles className="w-5 h-5" />
  }

  const completed = quests.filter((q) => q.completed).length
  const total = quests.length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent-400/10">
          <Sword className="w-6 h-6 text-accent-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Daily Quests</h1>
          <p className="text-text-secondary text-sm">Complete quests to earn XP and build your streak</p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-sm font-medium">Today&apos;s Progress</span>
          <span className="text-accent-400 font-bold text-sm">
            {completed}/{total} completed
          </span>
        </div>
        <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-400 rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
          />
        </div>
        {completed === total && total > 0 && (
          <p className="text-center text-success mt-3 text-sm font-medium">
            All quests completed! Great work today.
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <div className="card text-center py-12">
          <Sword className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary mb-2">No quests yet today.</p>
          <p className="text-text-muted text-sm">Start a focus session or complete a task to generate quests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`card flex items-center gap-4 transition-all ${
                quest.completed ? 'opacity-70 border-success/30' : 'border-gray-800'
              }`}
            >
              <div
                className={`flex-shrink-0 p-2 rounded-xl ${
                  quest.completed ? 'bg-success/10 text-success' : 'bg-accent-400/10 text-accent-400'
                }`}
              >
                {quest.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  getQuestIcon(quest.slug)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${quest.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {quest.title}
                </p>
                {quest.description && (
                  <p className="text-text-muted text-xs mt-0.5">{quest.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quest.completed ? 'bg-success' : 'bg-accent-400'
                      }`}
                      style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-accent-400 font-bold text-sm">+{quest.xpReward}</span>
                <p className="text-text-muted text-xs">XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
