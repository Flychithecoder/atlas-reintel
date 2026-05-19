import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateBuyerLeads } from '@/lib/mock-data'
import type { UpdateTables } from '@/lib/supabase/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('buyer_leads')
        .select('*, buyer:buyer_profiles(*)')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Buyer lead not found' }, { status: 404 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const buyers = generateBuyerLeads(20)
    const buyer = buyers.find(b => b.id === id) || { ...buyers[0], id }

    return NextResponse.json({ data: buyer })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updates: UpdateTables<'buyer_leads'> = { updated_at: new Date().toISOString() }
    if (body.qualificationStage !== undefined) updates.qualification_stage = body.qualificationStage
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.assignedTo !== undefined) updates.assigned_to = body.assignedTo
    if (body.nextFollowUp !== undefined) updates.next_follow_up = body.nextFollowUp
    if (body.lastContactDate !== undefined) updates.last_contact_date = body.lastContactDate

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('buyer_leads')
        .update(updates as never)
        .eq('id', id)
        .select('*, buyer:buyer_profiles(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const buyers = generateBuyerLeads(20)
    const buyer = buyers.find(b => b.id === id) || buyers[0]
    const updated = {
      ...buyer,
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
