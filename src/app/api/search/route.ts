import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateLeads, generateBuyerLeads, generateTenantLeads, generatePreMarketSignals } from '@/lib/mock-data'
import type { Tables } from '@/lib/supabase/types'

type LeadRow = Tables<'leads'>
type BuyerProfileRow = Tables<'buyer_profiles'>
type TenantProfileRow = Tables<'tenant_profiles'>
type BuyerLeadRow = Tables<'buyer_leads'>
type TenantLeadRow = Tables<'tenant_leads'>
type PropertyRow = Tables<'properties'>
type OwnerRow = Tables<'owners'>

interface SearchResult {
  id: string
  type: 'seller' | 'buyer' | 'tenant' | 'property' | 'signal'
  title: string
  subtitle: string
  score?: number
  status?: string
  market?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.toLowerCase().trim()
    const type = searchParams.get('type') || 'all'
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    if (!q || q.length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const results: SearchResult[] = []

      if (type === 'all' || type === 'sellers') {
        // Search leads by joining properties and owners
        const { data: leads } = await supabase
          .from('leads')
          .select('id, score, status, property_id, owner_id')
          .limit(limit) as { data: LeadRow[] | null }

        if (leads) {
          for (const lead of leads) {
            if (lead.property_id) {
              const { data: prop } = await supabase
                .from('properties')
                .select('address, city')
                .eq('id', lead.property_id)
                .ilike('address', `%${q}%`)
                .maybeSingle() as { data: PropertyRow | null }

              if (prop) {
                let ownerName = 'Unknown'
                if (lead.owner_id) {
                  const { data: owner } = await supabase
                    .from('owners')
                    .select('name')
                    .eq('id', lead.owner_id)
                    .single() as { data: OwnerRow | null }
                  if (owner) ownerName = owner.name
                }
                results.push({
                  id: lead.id,
                  type: 'seller',
                  title: ownerName,
                  subtitle: `${prop.address}, ${prop.city}`,
                  score: lead.score ?? undefined,
                  status: lead.status,
                })
              }
            }
          }
        }
      }

      if (type === 'all' || type === 'buyers') {
        const { data: buyerProfiles } = await supabase
          .from('buyer_profiles')
          .select('id, name')
          .ilike('name', `%${q}%`)
          .limit(limit) as { data: BuyerProfileRow[] | null }

        if (buyerProfiles) {
          for (const profile of buyerProfiles) {
            const { data: buyerLead } = await supabase
              .from('buyer_leads')
              .select('id, qualification_stage')
              .eq('buyer_id', profile.id)
              .maybeSingle() as { data: BuyerLeadRow | null }

            if (buyerLead) {
              results.push({
                id: buyerLead.id,
                type: 'buyer',
                title: profile.name,
                subtitle: `Stage: ${buyerLead.qualification_stage}`,
                status: buyerLead.qualification_stage,
              })
            }
          }
        }
      }

      if (type === 'all' || type === 'tenants') {
        const { data: tenantProfiles } = await supabase
          .from('tenant_profiles')
          .select('id, name')
          .ilike('name', `%${q}%`)
          .limit(limit) as { data: TenantProfileRow[] | null }

        if (tenantProfiles) {
          for (const profile of tenantProfiles) {
            const { data: tenantLead } = await supabase
              .from('tenant_leads')
              .select('id, lease_stage')
              .eq('tenant_id', profile.id)
              .maybeSingle() as { data: TenantLeadRow | null }

            if (tenantLead) {
              results.push({
                id: tenantLead.id,
                type: 'tenant',
                title: profile.name,
                subtitle: `Stage: ${tenantLead.lease_stage}`,
                status: tenantLead.lease_stage,
              })
            }
          }
        }
      }

      return NextResponse.json({ data: results.slice(0, limit), meta: { total: results.length } })
    }

    // Mock fallback
    const results: SearchResult[] = []

    if (type === 'all' || type === 'sellers') {
      const leads = generateLeads(100)
      const matched = leads.filter(l =>
        l.owner.name.toLowerCase().includes(q) ||
        l.property.address.toLowerCase().includes(q) ||
        l.property.city.toLowerCase().includes(q)
      )
      for (const lead of matched.slice(0, limit)) {
        results.push({
          id: lead.id,
          type: 'seller',
          title: lead.owner.name,
          subtitle: `${lead.property.address}, ${lead.property.city}`,
          score: lead.score,
          status: lead.status,
          market: lead.property.state,
        })
      }
    }

    if (type === 'all' || type === 'buyers') {
      const buyers = generateBuyerLeads(20)
      const matched = buyers.filter(b =>
        b.buyer.name.toLowerCase().includes(q) ||
        b.buyer.email.toLowerCase().includes(q) ||
        (b.buyer.company || '').toLowerCase().includes(q)
      )
      for (const buyer of matched.slice(0, limit)) {
        results.push({
          id: buyer.id,
          type: 'buyer',
          title: buyer.buyer.name,
          subtitle: buyer.buyer.company
            ? `${buyer.buyer.company} | ${buyer.qualificationStage}`
            : `Stage: ${buyer.qualificationStage}`,
          status: buyer.qualificationStage,
        })
      }
    }

    if (type === 'all' || type === 'tenants') {
      const tenants = generateTenantLeads(15)
      const matched = tenants.filter(t =>
        t.tenant.name.toLowerCase().includes(q) ||
        t.tenant.email.toLowerCase().includes(q) ||
        (t.tenant.company || '').toLowerCase().includes(q)
      )
      for (const tenant of matched.slice(0, limit)) {
        results.push({
          id: tenant.id,
          type: 'tenant',
          title: tenant.tenant.name,
          subtitle: tenant.tenant.company
            ? `${tenant.tenant.company} | ${tenant.leaseStage}`
            : `Stage: ${tenant.leaseStage}`,
          status: tenant.leaseStage,
        })
      }
    }

    if (type === 'all') {
      const signals = generatePreMarketSignals(50)
      const matched = signals.filter(s =>
        s.propertyAddress.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.label.toLowerCase().includes(q)
      )
      for (const signal of matched.slice(0, limit)) {
        results.push({
          id: signal.id,
          type: 'signal',
          title: signal.label,
          subtitle: `${signal.propertyAddress} | ${signal.ownerName}`,
          score: signal.score,
          market: signal.market,
        })
      }
    }

    return NextResponse.json({
      data: results.slice(0, limit),
      meta: { total: results.length },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
