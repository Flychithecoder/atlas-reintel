import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateCampaigns } from '@/lib/mock-data'
import type { InsertTables, UpdateTables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('outreach_campaigns')
        .select('*')

      if (status) query = query.eq('status', status)
      if (type) query = query.eq('type', type)

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock fallback
    let campaigns = generateCampaigns()

    if (status) campaigns = campaigns.filter(c => c.status === status)
    if (type) campaigns = campaigns.filter(c => c.type === type)

    return NextResponse.json({ data: campaigns })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Campaign name and type are required' },
        { status: 400 }
      )
    }

    const validTypes = ['email', 'sms', 'voice', 'direct-mail', 'linkedin'] as const
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const campaignInsert: InsertTables<'outreach_campaigns'> = {
        name: body.name,
        type: body.type,
        status: 'draft',
        total_recipients: body.totalRecipients || 0,
        sent: 0,
        opened: 0,
        replied: 0,
        meetings: 0,
      }

      const { data, error } = await supabase
        .from('outreach_campaigns')
        .insert(campaignInsert as never)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data }, { status: 201 })
    }

    // Mock fallback
    const now = new Date().toISOString()
    const mockCampaign = {
      id: `campaign-${Date.now()}`,
      name: body.name,
      type: body.type,
      status: 'draft' as const,
      totalRecipients: body.totalRecipients || 0,
      sent: 0,
      opened: 0,
      replied: 0,
      meetings: 0,
      createdAt: now,
    }

    return NextResponse.json({ data: mockCampaign }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 })
    }

    const validStatuses = ['draft', 'active', 'paused', 'completed']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const updates: UpdateTables<'outreach_campaigns'> = {
        updated_at: new Date().toISOString(),
      }
      if (body.status) updates.status = body.status
      if (body.name) updates.name = body.name

      const { data, error } = await supabase
        .from('outreach_campaigns')
        .update(updates as never)
        .eq('id', body.id)
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
        id: body.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
