import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateTenantLeads } from '@/lib/mock-data'
import type { InsertTables, Tables } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const leaseStage = searchParams.get('lease_stage')
    const tenantType = searchParams.get('tenant_type')
    const budgetMin = searchParams.get('budgetMin') ? parseInt(searchParams.get('budgetMin')!, 10) : undefined
    const budgetMax = searchParams.get('budgetMax') ? parseInt(searchParams.get('budgetMax')!, 10) : undefined
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      let query = supabase
        .from('tenant_leads')
        .select('*, tenant:tenant_profiles(*)', { count: 'exact' })

      if (leaseStage) query = query.eq('lease_stage', leaseStage)

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
    let tenants = generateTenantLeads(15)

    if (leaseStage) tenants = tenants.filter(t => t.leaseStage === leaseStage)
    if (tenantType) tenants = tenants.filter(t => t.tenant.tenantType === tenantType)
    if (budgetMin !== undefined) tenants = tenants.filter(t => t.tenant.leaseBudget.max >= budgetMin)
    if (budgetMax !== undefined) tenants = tenants.filter(t => t.tenant.leaseBudget.min <= budgetMax)

    tenants.sort((a, b) => {
      const aVal = sortBy === 'budget' ? a.tenant.leaseBudget.max : new Date(a.createdAt).getTime()
      const bVal = sortBy === 'budget' ? b.tenant.leaseBudget.max : new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    const total = tenants.length
    const offset = (page - 1) * limit
    const paged = tenants.slice(offset, offset + limit)

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

    if (!body.tenant?.name || !body.tenant?.email) {
      return NextResponse.json({ error: 'Tenant name and email are required' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const profileInsert: InsertTables<'tenant_profiles'> = {
        name: body.tenant.name,
        email: body.tenant.email,
        phone: body.tenant.phone,
        company: body.tenant.company,
        tenant_type: body.tenant.tenantType,
        min_sqft: body.tenant.spaceRequirements?.minSqft,
        max_sqft: body.tenant.spaceRequirements?.maxSqft,
        preferred_layout: body.tenant.spaceRequirements?.preferredLayout,
        lease_budget_min: body.tenant.leaseBudget?.min,
        lease_budget_max: body.tenant.leaseBudget?.max,
        preferred_term: body.tenant.preferredTerm,
        move_in_date: body.tenant.moveInDate,
        industry: body.tenant.industry,
        employee_count: body.tenant.employeeCount,
        preferred_markets: body.tenant.preferredMarkets || [],
        special_requirements: body.tenant.specialRequirements || [],
      }

      const { data: profileData, error: profileError } = await supabase
        .from('tenant_profiles')
        .insert(profileInsert as never)
        .select()
        .single()

      if (profileError || !profileData) {
        return NextResponse.json({ error: profileError?.message || 'Failed to create profile' }, { status: 500 })
      }

      const profile = profileData as Tables<'tenant_profiles'>

      const leadInsert: InsertTables<'tenant_leads'> = {
        tenant_id: profile.id,
        lease_stage: body.leaseStage || 'new',
        source: body.source || 'Manual Entry',
        assigned_to: body.assignedTo,
        notes: body.notes || [],
      }

      const { data: lead, error: leadError } = await supabase
        .from('tenant_leads')
        .insert(leadInsert as never)
        .select('*, tenant:tenant_profiles(*)')
        .single()

      if (leadError) {
        return NextResponse.json({ error: leadError.message }, { status: 500 })
      }

      return NextResponse.json({ data: lead }, { status: 201 })
    }

    // Mock fallback
    const now = new Date().toISOString()
    const mockTenant = {
      id: `tenant-lead-${Date.now()}`,
      tenant: {
        id: `tenant-profile-${Date.now()}`,
        tenantType: 'commercial',
        spaceRequirements: { minSqft: 0, maxSqft: 0 },
        leaseBudget: { min: 0, max: 0 },
        preferredTerm: 'flexible',
        preferredMarkets: [],
        ...body.tenant,
      },
      leaseStage: body.leaseStage || 'new',
      matchedSpaces: [],
      source: body.source || 'Manual Entry',
      assignedTo: body.assignedTo,
      notes: body.notes || [],
      lastContactDate: undefined,
      nextFollowUp: undefined,
      createdAt: now,
      updatedAt: now,
    }

    return NextResponse.json({ data: mockTenant }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
