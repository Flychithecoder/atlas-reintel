import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generatePreMarketSignals } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const market = searchParams.get('market')
    const urgency = searchParams.get('urgency')
    const type = searchParams.get('type')
    const isFirstToSee = searchParams.get('is_first_to_see')

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('signals')
        .select('*', { count: 'exact' })

      if (market) query = query.eq('market', market.toUpperCase())
      if (urgency) query = query.eq('urgency', urgency)
      if (type) query = query.eq('type', type)
      if (isFirstToSee === 'true') query = query.eq('is_first_to_see', true)

      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)
      query = query.order('first_detected', { ascending: false })

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
    let signals = generatePreMarketSignals(50)

    if (market) signals = signals.filter(s => s.market === market.toUpperCase())
    if (urgency) signals = signals.filter(s => s.urgency === urgency)
    if (type) signals = signals.filter(s => s.signalType === type)
    if (isFirstToSee === 'true') signals = signals.filter(s => s.isFirstToSee)

    signals.sort((a, b) => new Date(b.firstDetected).getTime() - new Date(a.firstDetected).getTime())

    const total = signals.length
    const offset = (page - 1) * limit
    const paged = signals.slice(offset, offset + limit)

    return NextResponse.json({
      data: paged,
      meta: { page, limit, total },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
