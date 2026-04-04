'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Lock, BookOpen } from 'lucide-react'

interface Chapter {
  id: string; slug: string; title: string; body: string; category: string
  keyTakeaways: string[]; minPlanSlug: string; hasAccess: boolean
  quizData: Array<{ question: string; options: string[]; correctIndex: number }> | null
  progress: { completed: boolean; quizScore: number | null; quizAnswers: any } | null
}

export default function AcademyChapterPage() {
  const { slug } = useParams<{ slug: string }>()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  const [showQuiz, setShowQuiz] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [quizResult, setQuizResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/academy/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setChapter)
      .catch(() => setChapter(null))
      .finally(() => setLoading(false))
  }, [slug])

  async function markComplete() {
    if (!chapter) return
    setMarking(true)
    await fetch('/api/academy/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: chapter.id }),
    })
    setChapter({ ...chapter, progress: { completed: true, quizScore: chapter.progress?.quizScore ?? null, quizAnswers: null } })
    setMarking(false)
  }

  async function submitQuiz() {
    if (!chapter?.quizData) return
    setSubmitting(true)
    try {
      const answerArray = chapter.quizData.map((_, i) => answers[i] ?? -1)
      const res = await fetch('/api/academy/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapter.id, answers: answerArray }),
      })
      const data = await res.json()
      setQuizResult(data)
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>
  if (!chapter) return (
    <div className="text-center py-20 text-text-muted">
      Chapter not found. <Link href="/academy" className="text-accent-400 underline">Back to Academy</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/academy" className="text-sm text-accent-400 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            chapter.minPlanSlug === 'free' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'
          }`}>{chapter.minPlanSlug === 'free' ? 'Free' : chapter.minPlanSlug.toUpperCase()}</span>
          <span className="text-xs text-text-muted">{chapter.category.replace(/_/g, ' ')}</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">{chapter.title}</h1>
      </div>

      {/* Locked banner */}
      {!chapter.hasAccess && (
        <div className="bg-purple-900/20 border border-purple-800/40 rounded-xl p-5 text-center">
          <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-purple-300 font-medium">This chapter requires a {chapter.minPlanSlug.toUpperCase()} plan.</p>
          <p className="text-purple-400/70 text-sm mt-1">Upgrade to unlock all academy content.</p>
        </div>
      )}

      {/* Body */}
      <div className="bg-bg-surface border border-gray-800 rounded-xl p-6">
        <div className="prose prose-invert prose-sm max-w-none text-text-secondary whitespace-pre-wrap leading-relaxed">
          {chapter.body}
        </div>
      </div>

      {/* Key Takeaways */}
      {chapter.hasAccess && chapter.keyTakeaways.length > 0 && (
        <div className="bg-accent-400/5 border border-accent-400/20 rounded-xl p-5">
          <h3 className="font-semibold text-accent-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Key Takeaways
          </h3>
          <ul className="space-y-2">
            {chapter.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mark complete */}
      {chapter.hasAccess && !chapter.progress?.completed && (
        <button onClick={markComplete} disabled={marking}
          className="w-full py-3 bg-accent-400 hover:bg-accent-500 text-bg-base rounded-xl font-medium transition-colors disabled:opacity-50">
          {marking ? 'Saving...' : 'Mark as Complete'}
        </button>
      )}
      {chapter.progress?.completed && (
        <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 text-center text-green-400 text-sm font-medium flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Completed {chapter.progress.quizScore !== null ? `| Quiz: ${chapter.progress.quizScore}%` : ''}
        </div>
      )}

      {/* Quiz */}
      {chapter.hasAccess && chapter.quizData && chapter.quizData.length > 0 && (
        <div className="bg-bg-surface border border-gray-800 rounded-xl p-6 space-y-5">
          <button onClick={() => setShowQuiz(!showQuiz)}
            className="text-accent-400 font-semibold hover:underline">
            {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
          </button>
          {showQuiz && (
            <div className="space-y-6">
              {chapter.quizData.map((q, qi) => (
                <div key={qi} className="space-y-2">
                  <p className="font-medium text-text-primary">{qi + 1}. {q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => {
                      const chosen = answers[qi] === oi
                      let optClass = 'border-gray-700 hover:border-accent-400/40'
                      if (quizResult) {
                        const r = quizResult.results[qi]
                        if (oi === r.correctIndex) optClass = 'border-green-500 bg-green-900/20'
                        else if (chosen && !r.isCorrect) optClass = 'border-red-500 bg-red-900/20'
                      } else if (chosen) {
                        optClass = 'border-accent-400 bg-accent-400/10'
                      }
                      return (
                        <button key={oi} onClick={() => !quizResult && setAnswers({ ...answers, [qi]: oi })}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors text-text-secondary ${optClass}`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {!quizResult ? (
                <button onClick={submitQuiz} disabled={submitting || Object.keys(answers).length < (chapter.quizData?.length ?? 0)}
                  className="w-full py-3 bg-accent-400 hover:bg-accent-500 text-bg-base rounded-xl font-medium transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Answers'}
                </button>
              ) : (
                <div className={`text-center p-4 rounded-xl font-medium ${quizResult.score >= 75 ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>
                  Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total} correct)
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
