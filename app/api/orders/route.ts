import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase server configuration is unavailable.')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
const allowedProjects = new Set(['interior', 'exterior', 'commercial', 'other', 'House', 'Apartment', 'Office', 'Shop', 'School', 'Hotel', 'Factory', 'Warehouse', 'Commercial Building', 'Other'])
const allowedFinishes = new Set(['matt', 'eggshell', 'satin', 'gloss', 'unsure', 'Interior', 'Exterior', 'Both'])
function text(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
function legacyProject(value: string) { return ['interior', 'exterior', 'commercial', 'other'].includes(value) ? value : 'other' }
function legacyFinish(value: string) { return ['matt', 'eggshell', 'satin', 'gloss', 'unsure'].includes(value) ? value : 'unsure' }

export async function GET() {
  try {
    const admin = getAdmin()
    const { data, error } = await admin.from('customer_orders').select('order_number,customer_name,project_type,quantity_litres,status,created_at').order('created_at', { ascending: false }).limit(100)
    if (error) return NextResponse.json({ error: 'Could not load orders.' }, { status: 500 })
    return NextResponse.json(data ?? [])
  } catch { return NextResponse.json({ error: 'Could not load orders.' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const customerName = text(body.customerName, 120)
    const email = text(body.email, 254).toLowerCase()
    const phone = text(body.phone, 40)
    const deliveryAddress = text(body.deliveryAddress, 500)
    const city = text(body.city, 100)
    const postcode = text(body.postcode, 20)
    const projectType = text(body.projectType, 40)
    const finish = text(body.finish, 20)
    const quantityLitres = Number(body.quantityLitres)
    const notes = text(body.notes, 4000)
    const paintId = text(body.paintId, 120)
    if (customerName.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || deliveryAddress.length < 4 || city.length < 2 || !allowedProjects.has(projectType) || !allowedFinishes.has(finish) || !Number.isFinite(quantityLitres) || quantityLitres <= 0 || quantityLitres > 10000 || !paintId) return NextResponse.json({ error: 'Please check the highlighted details and try again.' }, { status: 400 })

    const admin = getAdmin()
    const { data: paint } = paintId === 'custom' ? { data: null } : await admin.from('paint_catalog').select('id,name,hex').eq('id', paintId).maybeSingle()
    if (paintId !== 'custom' && !paint) return NextResponse.json({ error: 'That paint is no longer available. Please choose another.' }, { status: 400 })
    const { data: order, error: orderError } = await admin.from('customer_orders').insert({ customer_name: customerName, email, phone: phone || null, delivery_address: deliveryAddress, city, postcode, project_type: legacyProject(projectType), finish: legacyFinish(finish), quantity_litres: quantityLitres, notes: notes || null }).select('id,order_number').single()
    if (orderError || !order) return NextResponse.json({ error: 'We could not save your order. Please try again.' }, { status: 500 })
    if (paint) {
      const { error: itemError } = await admin.from('order_items').insert({ order_id: order.id, paint_id: paint.id, colour_name: paint.name, colour_hex: paint.hex, quantity_litres: quantityLitres })
      if (itemError) { await admin.from('customer_orders').delete().eq('id', order.id); return NextResponse.json({ error: 'We could not finish your order. Please try again.' }, { status: 500 }) }
    }
    return NextResponse.json({ orderNumber: order.order_number })
  } catch { return NextResponse.json({ error: 'Please try again in a moment.' }, { status: 400 }) }
}
