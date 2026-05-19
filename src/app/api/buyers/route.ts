import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateBuyerLeads } from '@/lib/mock-data'
import type { InsertTables, Tables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const qualificationStage = searchParams.get('qualification_stage')
    const budgetMin = searchParams.get('budgetMin') ? parseInt(searchParams.get('budgetMin')!, 10) : undefined
    const budgetMax = searchParams.get('budgetMax') ? parseInt(searchParams.get('budgetMax')!, 10) : undefined
    const propertyTypes = searchParams.get('property_types')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('buyer_leads')
        .select('*, buyer:buyer_profiles(*)', { count: 'exact' })

      if (qualificationStage) query = query.eq('qualification_stage', qualificationStage)

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
    let buyers = generateBuyerLeads(20)

    if (qualificationStage) buyers = buyers.filter(b => b.qualificationStage === qualificationStage)
    if (budgetMin !== undefined) buyers = buyers.filter(b => b.buyer.budget.max >= budgetMin)
    if (budgetMax !== undefined) buyers = buyers.filter(b => b.buyer.budget.min <= budgetMax)
    if (propertyTypes) {
      const types = propertyTypes.split(',')
      buyers = buyers.filter(b => b.buyer.propertyTypes.some(pt => types.includes(pt)))
    }

    buyers.sort((a, b) => {
      const aVal = sortBy === 'budget' ? a.buyer.budget.max : new Date(a.createdAt).getTime()
      const bVal = sortBy === 'budget' ? b.buyer.budget.max : new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    const total = buyers.length
    const offset = (page - 1) * limit
    const paged = buyers.slice(offset, offset + limit)

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

    if (!body.buyer?.name || !body.buyer?.email) {
      return NextResponse.json({ error: 'Buyer name and email are required' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const profileInsert: InsertTables<'buyer_profiles'> = {
        name: body.buyer.name,
        email: body.buyer.email,
        phone: body.buyer.phone,
        company: body.buyer.company,
        buyer_type: body.buyer.buyerType,
        budget_min: body.buyer.budget?.min,
        budget_max: body.buyer.budget?.max,
        property_types: body.buyer.propertyTypes || [],
        preferred_markets: body.buyer.preferredMarkets || [],
        pre_approval_status: body.buyer.preApprovalStatus || 'none',
        pre_approval_amount: body.buyer.preApprovalAmount,
        lender: body.buyer.lender,
        timeline: body.buyer.timeline,
        investment_criteria: body.buyer.investmentCriteria,
      }

      const { data: profileData, error: profileError } = await supabase
        .from('buyer_profiles')
        .insert(profileInsert as never)
        .select()
        .single()

      if (profileError || !profileData) {
        return NextResponse.json({ error: profileError?.message || 'Failed to create profile' }, { status: 500 })
      }

      const profile = profileData as Tables<'buyer_profiles'>

      const leadInsert: InsertTables<'buyer_leads'> = {
        buyer_id: profile.id,
        qualification_stage: body.qualificationStage || 'new',
        source: body.source || 'Manual Entry',
        assigned_to: body.assignedTo,
        notes: body.notes || [],
      }

      const { data: lead, error: leadError } = await supabase
        .from('buyer_leads')
        .insert(leadInsert as never)
        .select('*, buyer:buyer_profiles(*)')
        .single()

      if (leadError) {
        return NextResponse.json({ error: leadError.message }, { status: 500 })
      }

      return NextResponse.json({ data: lead }, { status: 201 })
    }

    // Mock fallback
    const now = new Date().toISOString()
    const mockBuyer = {
      id: `buyer-lead-${Date.now()}`,
      buyer: {
        id: `buyer-profile-${Date.now()}`,
        preApprovalStatus: 'none',
        timeline: 'flexible',
        propertyTypes: [],
        preferredMarkets: [],
        budget: { min: 0, max: 0 },
        ...body.buyer,
      },
      qualificationStage: body.qualificationStage || 'new',
      matchedProperties: [],
      source: body.source || 'Manual Entry',
      assignedTo: body.assignedTo,
      notes: body.notes || [],
      lastContactDate: undefined,
      nextFollowUp: undefined,
      createdAt: now,
      updatedAt: now,
    }

    return NextResponse.json({ data: mockBuyer }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
