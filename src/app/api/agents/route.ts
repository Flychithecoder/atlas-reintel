import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateAgentProfiles } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))
    const market = searchParams.get('market')
    const specialty = searchParams.get('specialty')
    const brokerage = searchParams.get('brokerage')
    const sortBy = searchParams.get('sortBy') || 'rating'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('agent_profiles')
        .select('*', { count: 'exact' })

      if (market) query = query.eq('license_state', market.toUpperCase())
      if (specialty) query = query.eq('specialty', specialty)
      if (brokerage) query = query.ilike('brokerage', `%${brokerage}%`)

      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error, count } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        data,
        meta: { page, limit, total: count || 0 },
      })
    }

    // Mock fallback
    let agents = generateAgentProfiles(24)

    if (market) agents = agents.filter(a => a.licenseState === market.toUpperCase())
    if (specialty) agents = agents.filter(a => a.specialty === specialty)
    if (brokerage) agents = agents.filter(a => a.brokerage.toLowerCase().includes(brokerage.toLowerCase()))

    agents.sort((a, b) => {
      let aVal: number = 0
      let bVal: number = 0
      switch (sortBy) {
        case 'rating': aVal = a.rating; bVal = b.rating; break
        case 'volume': aVal = a.totalVolumeLTM; bVal = b.totalVolumeLTM; break
        case 'deals': aVal = a.dealsClosedLTM; bVal = b.dealsClosedLTM; break
        default: aVal = a.rating; bVal = b.rating
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    const total = agents.length
    const offset = (page - 1) * limit
    const paged = agents.slice(offset, offset + limit)

    return NextResponse.json({
      data: paged,
      meta: { page, limit, total },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
