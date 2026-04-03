import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
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

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a productivity and focus expert. Return valid JSON only, no markdown fences.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(raw)

    return NextResponse.json(parsed)
  } catch (e: any) {
    console.error('Technique generation error:', e)
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}
