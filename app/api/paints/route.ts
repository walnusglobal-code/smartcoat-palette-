import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase server configuration is unavailable.')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function GET() {
  const admin = getAdmin()
  const { data, error } = await admin
    .from('paint_catalog')
    .select('id,name,hex,rgb,category')
    .order('category')
    .order('name')

  if (error) return NextResponse.json({ error: 'Could not load the paint catalog.' }, { status: 500 })
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } })
}

export const runtime = 'nodejs'
