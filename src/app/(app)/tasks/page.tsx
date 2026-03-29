'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Clock, ChevronDown } from 'lucide-react'

type Priority = 'high' | 'medium' | 'low'
type Status = 'todo' | 'in_progress' | 'done'

interface Task {
  id: string
  title: string
  description: string | null
  priority: Priority
  status: Status
  category: string | null
  estimatedMins: number | null
  dueDate: string | null
  focusSessionCount: number
  createdAt: string
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'text-red-400 bg-red-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [estimatedMins, setEstimatedMins] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadTasks() {
    const url = filter === 'all' ? '/api/tasks' : `/api/tasks?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setTasks(Array.isArray(data) ? data : [])
  }

  useEffect(() => { loadTasks() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        priority,
        estimatedMins: estimatedMins ? parseInt(estimatedMins) : undefined,
        category: category.trim() || undefined,
      }),
    })
    setTitle('')
    setPriority('medium')
    setEstimatedMins('')
    setCategory('')
    setShowForm(false)
    setSubmitting(false)
    loadTasks()
  }

  async function toggleStatus(task: Task) {
    const next: Status = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : 'done'
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: next }),
    })
    loadTasks()
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    loadTasks()
  }

  const filters: Array<'all' | Status> = ['all', 'todo', 'in_progress', 'done']

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tasks</h1>
          <p className="text-text-secondary">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="card">
          <h2 className="font-semibold mb-4">New Task</h2>
          <form onSubmit={createTask} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input-field"
              placeholder="Task title"
              required
              autoFocus
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="input-field py-2">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Est. minutes</label>
                <input
                  type="number"
                  value={estimatedMins}
                  onChange={e => setEstimatedMins(e.target.value)}
                  className="input-field py-2"
                  placeholder="25"
                  min={1} max={480}
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="input-field py-2"
                  placeholder="Work, Study..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary py-2 px-4 text-sm" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Task'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-accent-400 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 && (
          <div className="card text-center py-12">
            <CheckCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">No tasks here. Add one above!</p>
          </div>
        )}
        {tasks.map(task => (
          <div key={task.id} className={`card flex items-start gap-3 ${task.status === 'done' ? 'opacity-60' : ''}`}>
            <button onClick={() => toggleStatus(task)} className="mt-0.5 shrink-0">
              {task.status === 'done'
                ? <CheckCircle className="w-5 h-5 text-accent-400" />
                : task.status === 'in_progress'
                ? <ChevronDown className="w-5 h-5 text-yellow-400" />
                : <Circle className="w-5 h-5 text-text-muted hover:text-accent-400 transition" />
              }
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${task.status === 'done' ? 'line-through text-text-muted' : ''}`}>
                {task.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[task.priority]}`}>
                  {task.priority}
                </span>
                {task.category && (
                  <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
                    {task.category}
                  </span>
                )}
                {task.estimatedMins && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.estimatedMins}m
                  </span>
                )}
                {task.focusSessionCount != null && task.focusSessionCount > 0 && (
                  <span className="text-xs text-accent-400">{task.focusSessionCount} session{task.focusSessionCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="shrink-0 p-1 text-text-muted hover:text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
