import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateOwnerDossier } from '@/lib/mock-data'
import type { Tables } from '@/lib/supabase/types'

type SignalRow = Tables<'signals'>
type OwnerRow = Tables<'owners'>

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      // Get the signal to find owner
      const { data: signalData, error: sigError } = await supabase
        .from('signals')
        .select('owner_id')
        .eq('id', id)
        .single()

      const signal = signalData as SignalRow | null
      if (sigError || !signal) {
        return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
      }

      const ownerId = signal.owner_id
      if (!ownerId) {
        return NextResponse.json({ error: 'Signal has no associated owner' }, { status: 404 })
      }

      // Get the full owner
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('*')
        .eq('id', ownerId)
        .single()

      const owner = ownerData as OwnerRow | null
      if (ownerError || !owner) {
        return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
      }

      // Get all properties linked to this owner via property_owners junction
      const { data: propertyLinks } = await supabase
        .from('property_owners')
        .select('property_id')
        .eq('owner_id', ownerId) as { data: Array<{ property_id: string }> | null }

      const propertyIds = (propertyLinks || []).map(pl => pl.property_id)

      let properties: unknown[] = []
      if (propertyIds.length > 0) {
        const { data: props } = await supabase
          .from('properties')
          .select('*')
          .in('id', propertyIds)
        properties = (props as unknown[]) || []
      }

      // Get signals for this owner's properties
      const { data: ownerSignals } = await supabase
        .from('signals')
        .select('*')
        .eq('owner_id', ownerId)

      // Get competitor contact count
      const { count: competitorContacts } = await supabase
        .from('signals')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .gt('contacted_by_count', 0)

      const totalPortfolioValue = (properties as Array<{ estimated_value?: number | null }>).reduce(
        (sum, p) => sum + (p.estimated_value || 0), 0
      )

      return NextResponse.json({
        data: {
          owner,
          properties,
          llcChain: [],
          motivationScore: 50,
          motivationFactors: [],
          outreachHistory: [],
          competitorContacts: competitorContacts || 0,
          totalPortfolioValue,
          totalEquity: owner.total_equity || 0,
          ownerSince: owner.created_at,
          signals: ownerSignals || [],
        },
      })
    }

    // Mock fallback
    const dossier = generateOwnerDossier()

    return NextResponse.json({
      data: {
        ...dossier,
        signalId: id,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
