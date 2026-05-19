import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateLeads } from '@/lib/mock-data'
import type { InsertTables, UpdateTables, Tables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const market = searchParams.get('market')
    const scoreMin = searchParams.get('scoreMin') ? parseInt(searchParams.get('scoreMin')!, 10) : undefined
    const scoreMax = searchParams.get('scoreMax') ? parseInt(searchParams.get('scoreMax')!, 10) : undefined
    const assignedTo = searchParams.get('assigned_to')
    const sortBy = searchParams.get('sortBy') || 'score'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('leads')
        .select('*, property:properties(*), owner:owners(*), signals(*)', { count: 'exact' })

      if (status) query = query.eq('status', status)
      if (assignedTo) query = query.eq('assigned_to', assignedTo)
      if (scoreMin !== undefined) query = query.gte('score', scoreMin)
      if (scoreMax !== undefined) query = query.lte('score', scoreMax)

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
    let leads = generateLeads(100)

    if (status) leads = leads.filter(l => l.status === status)
    if (type) leads = leads.filter(l => l.property.propertyType === type)
    if (market) {
      const marketMap: Record<string, string[]> = {
        fl: ['FL'],
        pr: ['PR'],
        dr: ['DN', 'LC', 'ST', 'LR', 'PP', 'SM'],
      }
      const states = marketMap[market.toLowerCase()] || []
      if (states.length) leads = leads.filter(l => states.includes(l.property.state))
    }
    if (scoreMin !== undefined) leads = leads.filter(l => l.score >= scoreMin)
    if (scoreMax !== undefined) leads = leads.filter(l => l.score <= scoreMax)
    if (assignedTo) leads = leads.filter(l => l.assignedTo === assignedTo)

    leads.sort((a, b) => {
      let aVal: number = 0
      let bVal: number = 0
      switch (sortBy) {
        case 'score': aVal = a.score; bVal = b.score; break
        case 'value': aVal = a.property.estimatedValue; bVal = b.property.estimatedValue; break
        case 'date': aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break
        default: aVal = a.score; bVal = b.score
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })

    const total = leads.length
    const offset = (page - 1) * limit
    const paged = leads.slice(offset, offset + limit)

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

    if (!body.property?.address) {
      return NextResponse.json({ error: 'Property address is required' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const propInsert: InsertTables<'properties'> = {
        address: body.property.address,
        city: body.property.city || '',
        property_type: body.property.propertyType || 'Commercial',
        state: body.property.state,
        zip: body.property.zip,
        country: body.property.country,
        sqft: body.property.sqft,
        year_built: body.property.yearBuilt,
        estimated_value: body.property.estimatedValue,
      }

      const { data: propertyData, error: propError } = await supabase
        .from('properties')
        .insert(propInsert as never)
        .select()
        .single()

      if (propError || !propertyData) {
        return NextResponse.json({ error: propError?.message || 'Failed to create property' }, { status: 500 })
      }

      const property = propertyData as Tables<'properties'>

      const leadInsert: InsertTables<'leads'> = {
        property_id: property.id,
        owner_id: body.owner?.id ?? null,
        score: body.score ?? 50,
        score_label: body.scoreLabel ?? 'Warm',
        status: body.status ?? 'New',
        source: body.source ?? 'Manual Entry',
        assigned_to: body.assignedTo ?? null,
        notes: body.notes ?? [],
      }

      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadInsert as never)
        .select('*, property:properties(*), owner:owners(*)')
        .single()

      if (leadError) {
        return NextResponse.json({ error: leadError.message }, { status: 500 })
      }

      return NextResponse.json({ data: lead }, { status: 201 })
    }

    // Mock fallback
    const now = new Date().toISOString()
    const mockLead = {
      id: `lead-${Date.now()}`,
      property: {
        id: `prop-${Date.now()}`,
        ...body.property,
        coordinates: body.property.coordinates || { lat: 25.7617, lng: -80.1918 },
      },
      owner: body.owner || {
        id: `owner-${Date.now()}`,
        name: 'Unknown Owner',
        entityType: 'Individual',
        portfolioSize: 1,
        totalEquity: 0,
        ownershipTenure: 0,
        outOfState: false,
      },
      score: body.score || 50,
      scoreLabel: body.scoreLabel || 'Warm',
      signals: [],
      status: body.status || 'New',
      assignedTo: body.assignedTo,
      lastContactDate: undefined,
      nextFollowUp: undefined,
      notes: body.notes || [],
      createdAt: now,
      updatedAt: now,
      source: body.source || 'Manual Entry',
    }

    return NextResponse.json({ data: mockLead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
