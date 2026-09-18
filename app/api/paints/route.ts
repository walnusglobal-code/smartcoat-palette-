import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

export async function GET() {
  const { data, error } = await admin
    .from('paint_catalog')
    .select('id,name,hex,rgb,category')
    .order('category')
    .order('name')

  if (error) return NextResponse.json({ error: 'Could not load the paint catalog.' }, { status: 500 })
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } })
}

export const runtime = 'nodejs'
