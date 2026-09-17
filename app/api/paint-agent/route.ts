import { generateText, gateway } from 'ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT = `You are SmartCoat Paint Intelligence, a cautious paint production and manufacturing expert for Walnus Global. Answer in a practical, structured way about paint chemistry, formulation, manufacturing, quality control, suppliers, standards, calculations, application, and troubleshooting.

Separate evidence clearly: Manufacturer documented, Industry-derived, or AI proposed. Never present an unverified formula as validated. Ask for substrate, application method, batch size, target performance, region, VOC limits, and available raw materials when those details matter. Include concise safety notes for solvents, isocyanates, biocides, dust, pressure, heat, and ventilation. Do not provide instructions for prohibited or unsafe substances. Recommend SDS review, regulatory review, and lab validation before production. Prices and supplier availability are estimates unless supplied by a cited source. Use the paint catalog context when relevant.`

export async function POST(request: Request) {
  try {
    const body = await request.json() as { messages?: Array<{ role: 'user' | 'assistant'; content: string }> }
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
    if (!messages.length || messages[messages.length - 1]?.role !== 'user') {
      return NextResponse.json({ error: 'Add a paint question first.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data } = await supabase.from('paint_catalog').select('name,hex,rgb,category').order('id').limit(24)
    const catalogContext = data?.length ? `\nCurrent SmartCoat catalog sample:\n${JSON.stringify(data)}` : ''
    const result = await generateText({
      model: gateway('anthropic/claude-sonnet-4.6'),
      system: SYSTEM_PROMPT + catalogContext,
      messages,
      temperature: 0.2,
    })
    return NextResponse.json({ text: result.text })
  } catch {
    return NextResponse.json({ error: 'The paint agent is temporarily unavailable. Try again shortly.' }, { status: 503 })
  }
}
