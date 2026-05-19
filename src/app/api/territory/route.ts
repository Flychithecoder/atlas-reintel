import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateTerritories } from '@/lib/mock-data'
import type { UpdateTables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const market = searchParams.get('market')

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('territories')
        .select('*')

      if (market) query = query.eq('market', market.toUpperCase())

      query = query.order('signal_count', { ascending: false })

      const { data, error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    let territories = generateTerritories()

    if (market) territories = territories.filter(t => t.market === market.toUpperCase())

    return NextResponse.json({ data: territories })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.territoryId) {
      return NextResponse.json({ error: 'territoryId is required' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const updates: UpdateTables<'territories'> = {
        assigned_to: body.assignedTo,
        last_activity: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('territories')
        .update(updates as never)
        .eq('id', body.territoryId)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    return NextResponse.json({
      data: {
        id: body.territoryId,
        assignedTo: body.assignedTo,
        lastActivity: new Date().toISOString(),
        message: 'Territory claimed successfully',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
