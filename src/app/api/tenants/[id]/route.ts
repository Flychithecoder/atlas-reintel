import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateTenantLeads } from '@/lib/mock-data'
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
        .from('tenant_leads')
        .select('*, tenant:tenant_profiles(*)')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Tenant lead not found' }, { status: 404 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const tenants = generateTenantLeads(15)
    const tenant = tenants.find(t => t.id === id) || { ...tenants[0], id }

    return NextResponse.json({ data: tenant })
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

    const updates: UpdateTables<'tenant_leads'> = { updated_at: new Date().toISOString() }
    if (body.leaseStage !== undefined) updates.lease_stage = body.leaseStage
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.assignedTo !== undefined) updates.assigned_to = body.assignedTo
    if (body.nextFollowUp !== undefined) updates.next_follow_up = body.nextFollowUp
    if (body.lastContactDate !== undefined) updates.last_contact_date = body.lastContactDate

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('tenant_leads')
        .update(updates as never)
        .eq('id', id)
        .select('*, tenant:tenant_profiles(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    const tenants = generateTenantLeads(15)
    const tenant = tenants.find(t => t.id === id) || tenants[0]
    const updated = {
      ...tenant,
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
