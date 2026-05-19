import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generatePreMarketSignals, generateOwnerDossier } from '@/lib/mock-data'
import type { Tables } from '@/lib/supabase/types'

type SignalRow = Tables<'signals'>

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data: signalData, error } = await supabase
        .from('signals')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !signalData) {
        return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
      }

      const signal = signalData as SignalRow

      // Join property and owner data
      let property = null
      let owner = null

      if (signal.property_id) {
        const { data: p } = await supabase
          .from('properties')
          .select('*')
          .eq('id', signal.property_id)
          .single()
        property = p
      }

      if (signal.owner_id) {
        const { data: o } = await supabase
          .from('owners')
          .select('*')
          .eq('id', signal.owner_id)
          .single()
        owner = o
      }

      return NextResponse.json({
        data: { ...signal, property, owner },
      })
    }

    // Mock fallback
    const signals = generatePreMarketSignals(50)
    const signal = signals.find(s => s.id === id) || { ...signals[0], id }
    const dossier = generateOwnerDossier()

    return NextResponse.json({
      data: {
        ...signal,
        owner: dossier.owner,
        property: dossier.properties[0] || null,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
