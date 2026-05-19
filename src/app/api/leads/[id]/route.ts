import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateLeads } from '@/lib/mock-data'
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
        .from('leads')
        .select('*, property:properties(*), owner:owners(*), signals(*)')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const leads = generateLeads(100)
    const lead = leads.find(l => l.id === id) || { ...leads[0], id }

    return NextResponse.json({ data: lead })
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

    const updates: UpdateTables<'leads'> = { updated_at: new Date().toISOString() }
    if (body.status !== undefined) updates.status = body.status
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to
    if (body.assignedTo !== undefined) updates.assigned_to = body.assignedTo
    if (body.score !== undefined) updates.score = body.score
    if (body.scoreLabel !== undefined) updates.score_label = body.scoreLabel
    if (body.nextFollowUp !== undefined) updates.next_follow_up = body.nextFollowUp
    if (body.lastContactDate !== undefined) updates.last_contact_date = body.lastContactDate

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('leads')
        .update(updates as never)
        .eq('id', id)
        .select('*, property:properties(*), owner:owners(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const leads = generateLeads(100)
    const lead = leads.find(l => l.id === id) || leads[0]
    const updated = {
      ...lead,
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const softDelete: UpdateTables<'leads'> = {
        status: 'Dead',
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('leads')
        .update(softDelete as never)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback — soft delete returns the lead with Dead status
    return NextResponse.json({
      data: { id, status: 'Dead', updatedAt: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
