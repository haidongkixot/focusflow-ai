import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiGenerate } from '@/lib/ai-generate'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category, difficulty, theme } = await req.json()

    const prompt = `Create a unique focus/productivity technique for a Pomodoro-style focus app.
Category: ${category}
Difficulty: ${difficulty}
Theme: ${theme || 'general productivity'}

Return JSON only, no markdown:
{
  "name": "Technique Name",
  "slug": "technique-name",
  "category": "${category}",
  "description": "2-3 sentence description",
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "durationMins": 25,
  "breakMins": 5,
  "cycles": 4,
  "difficulty": "${difficulty}",
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "ambientSound": "rain"
}

Durations: 15-90 min work, 3-15 min break, 2-6 cycles.
Ambient options: rain, cafe, nature, white_noise, null`

    const { result, model, tokensUsed, durationMs } = await aiGenerate({
      contentType: 'focus_technique',
      userPrompt: prompt,
      adminId: (session.user as any).id ?? session.user?.email ?? 'admin',
      metadata: { category, difficulty, theme },
      fallbackSystemPrompt: 'You are a productivity and focus expert. Return valid JSON only, no markdown fences.',
    })

    return NextResponse.json({ ...result, _ai: { model, tokensUsed, durationMs } })
  } catch (e: any) {
    console.error('Technique generation error:', e)
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}
