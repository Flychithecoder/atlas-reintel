import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateCoListingProposals } from '@/lib/mock-data'
import type { InsertTables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('co_listing_proposals')
        .select('*, proposing_agent:agent_profiles!proposing_agent_id(*)', { count: 'exact' })

      if (status) query = query.eq('status', status)

      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)
      query = query.order('created_at', { ascending: false })

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
    let proposals = generateCoListingProposals(10)

    if (status) proposals = proposals.filter(p => p.status === status)

    const total = proposals.length
    const offset = (page - 1) * limit
    const paged = proposals.slice(offset, offset + limit)

    return NextResponse.json({
      data: paged,
      meta: { page, limit, total },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.propertyId || !body.receivingAgentId) {
      return NextResponse.json(
        { error: 'propertyId and receivingAgentId are required' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const proposalInsert: InsertTables<'co_listing_proposals'> = {
        property_id: body.propertyId,
        property_address: body.propertyAddress,
        proposing_agent_id: body.proposingAgentId,
        receiving_agent_id: body.receivingAgentId,
        commission_split: body.commissionSplit || '50/50',
        territory: body.territory,
        terms: body.terms || '',
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      }

      const { data, error } = await supabase
        .from('co_listing_proposals')
        .insert(proposalInsert as never)
        .select('*, proposing_agent:agent_profiles!proposing_agent_id(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data }, { status: 201 })
    }

    // Mock fallback
    const now = new Date().toISOString()
    const mockProposal = {
      id: `colisting-${Date.now()}`,
      propertyId: body.propertyId,
      propertyAddress: body.propertyAddress || '123 Main St, Miami',
      proposingAgent: {
        id: body.proposingAgentId || `agent-${Date.now()}`,
        name: 'Mock Agent',
        email: 'agent@mock.com',
        brokerage: 'Mock Brokerage',
        licenseNumber: 'FL-0000000',
        licenseState: 'FL' as const,
        specialty: 'both' as const,
        territories: ['Miami'],
        dealsClosedLTM: 0,
        avgDaysOnMarket: 0,
        totalVolumeLTM: 0,
        rating: 5.0,
        coListingAvailable: true,
      },
      receivingAgentId: body.receivingAgentId,
      commissionSplit: body.commissionSplit || '50/50',
      territory: body.territory || 'Miami',
      terms: body.terms || '',
      status: 'pending' as const,
      createdAt: now,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    }

    return NextResponse.json({ data: mockProposal }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
