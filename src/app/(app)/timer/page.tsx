'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, ListTodo } from 'lucide-react'

type SessionType = 'focus' | 'short_break' | 'long_break'

const SESSION_CONFIG: Record<SessionType, { label: string; mins: number; color: string }> = {
  focus: { label: 'Focus', mins: 25, color: 'text-accent-400' },
  short_break: { label: 'Short Break', mins: 5, color: 'text-emerald-400' },
  long_break: { label: 'Long Break', mins: 15, color: 'text-blue-400' },
}

interface Task {
  id: string
  title: string
  status: string
}

export default function TimerPage() {
  const [sessionType, setSessionType] = useState<SessionType>('focus')
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [sessionCount, setSessionCount] = useState(0)
  const [justCompleted, setJustCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSeconds = SESSION_CONFIG[sessionType].mins * 60
  const progress = (secondsLeft / totalSeconds) * 100
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')

  // Load tasks
  useEffect(() => {
    fetch('/api/tasks?status=todo')
      .then(r => r.json())
      .then(d => setTasks(Array.isArray(d) ? d : []))
  }, [])

  const saveSession = useCallback(async (completed: boolean, actualSecs: number) => {
    if (!startedAt) return
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: selectedTask || undefined,
        type: sessionType,
        durationMins: SESSION_CONFIG[sessionType].mins,
        actualMins: Math.round(actualSecs / 60),
        completed,
        startedAt: startedAt.toISOString(),
        endedAt: new Date().toISOString(),
      }),
    })
  }, [startedAt, selectedTask, sessionType])

  const handleComplete = useCallback(async () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    await saveSession(true, totalSeconds)
    setSessionCount(c => c + 1)
    setJustCompleted(true)
    setTimeout(() => setJustCompleted(false), 3000)
    setSecondsLeft(totalSeconds)
    setStartedAt(null)
  }, [saveSession, totalSeconds])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, handleComplete])

  function handleStart() {
    if (!startedAt) setStartedAt(new Date())
    setRunning(true)
  }

  function handlePause() {
    setRunning(false)
  }

  async function handleReset() {
    if (running && startedAt) {
      const elapsed = totalSeconds - secondsLeft
      await saveSession(false, elapsed)
    }
    setRunning(false)
    setStartedAt(null)
    setSecondsLeft(SESSION_CONFIG[sessionType].mins * 60)
  }

  function switchType(type: SessionType) {
    if (running) handleReset()
    setSessionType(type)
    setSecondsLeft(SESSION_CONFIG[type].mins * 60)
    setStartedAt(null)
    setRunning(false)
  }

  // SVG circle math
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-1">Pomodoro Timer</h1>
        <p className="text-text-secondary">Session #{sessionCount + 1}</p>
      </div>

      {/* Session Type Selector */}
      <div className="flex rounded-xl border border-gray-700 overflow-hidden">
        {(Object.keys(SESSION_CONFIG) as SessionType[]).map(type => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              sessionType === type
                ? 'bg-accent-400 text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            {SESSION_CONFIG[type].label}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="300" height="300" className="-rotate-90">
            <circle
              cx="150" cy="150" r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-bg-elevated"
            />
            <circle
              cx="150" cy="150" r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${SESSION_CONFIG[sessionType].color}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-mono font-bold ${justCompleted ? 'text-accent-400' : 'text-text-primary'} transition-colors`}>
              {minutes}:{seconds}
            </span>
            <span className="text-sm text-text-muted mt-2">
              {running ? 'Focusing...' : justCompleted ? '✓ Session complete!' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={running ? handlePause : handleStart}
          className="w-20 h-20 rounded-full bg-accent-400 hover:bg-accent-500 text-white flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          {running
            ? <Pause className="w-8 h-8" />
            : <Play className="w-8 h-8 ml-1" />
          }
        </button>
        {running && (
          <button
            onClick={handleComplete}
            className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-text-secondary hover:text-accent-400 hover:border-accent-400 transition"
            title="Mark complete early"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
        {!running && <div className="w-12" />}
      </div>

      {/* Task Selector */}
      {sessionType === 'focus' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium">Working on</span>
          </div>
          <select
            value={selectedTask}
            onChange={e => setSelectedTask(e.target.value)}
            className="input-field"
          >
            <option value="">— No specific task —</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          {tasks.length === 0 && (
            <p className="text-xs text-text-muted mt-2">
              No active tasks. <a href="/tasks" className="text-accent-400 hover:underline">Add some tasks</a> to track what you&apos;re working on.
            </p>
          )}
        </div>
      )}

      {/* Session summary */}
      {sessionCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-text-muted">
            {sessionCount} session{sessionCount > 1 ? 's' : ''} completed today
            {sessionCount >= 4 && ' — Time for a long break!'}
          </p>
        </div>
      )}
    </div>
  )
}
