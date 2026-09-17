import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('paint_catalog')
    .select('id,name,hex,rgb,category')
    .order('id')

  if (error) return NextResponse.json({ error: 'Unable to load paint catalog' }, { status: 503 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } })
}
