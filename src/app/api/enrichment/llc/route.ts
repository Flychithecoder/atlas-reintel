import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface LLCNode {
  entityName: string
  entityType: 'LLC' | 'Corporation' | 'Trust' | 'Individual' | 'Partnership'
  state: string
  registrationNumber: string
  registeredAgent: string
  filingDate: string
  status: 'Active' | 'Dissolved' | 'Suspended'
  role: string
  source: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.entityName) {
      return NextResponse.json(
        { error: 'entityName is required' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('llc_chains')
        .select('*')
        .ilike('entity_name', `%${body.entityName}%`)
        .order('chain_order', { ascending: true })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock LLC unwrapping
    const lastNames = ['Smith', 'Johnson', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Reyes']
    const firstNames = ['James', 'Maria', 'Robert', 'Carlos', 'Ana', 'Miguel', 'David', 'Jennifer']
    const entitySuffixes = ['Holdings', 'Properties', 'Capital', 'Investments', 'Management', 'Group', 'Ventures']
    const states = body.state ? [body.state] : ['FL', 'DE', 'NV', 'WY', 'PR']
    const registryMap: Record<string, string> = {
      FL: 'Sunbiz.org',
      DE: 'DE Division of Corporations',
      NV: 'NV Secretary of State',
      WY: 'WY Secretary of State',
      PR: 'Registro Mercantil',
      DR: 'Registro Mercantil RD',
    }

    const chainDepth = randInt(2, 4)
    const chain: LLCNode[] = []

    // Start with the queried entity (property holder)
    const entityState = pick(states)
    chain.push({
      entityName: body.entityName,
      entityType: 'LLC',
      state: entityState,
      registrationNumber: `${entityState}-${randInt(100000, 999999)}`,
      registeredAgent: `${pick(firstNames)} ${pick(lastNames)}, Esq.`,
      filingDate: new Date(Date.now() - randInt(365, 3650) * 86400000).toISOString().split('T')[0],
      status: 'Active',
      role: 'Property Holder',
      source: registryMap[entityState] || 'State Registry',
    })

    // Intermediate entities
    for (let i = 1; i < chainDepth - 1; i++) {
      const intermediateState = pick(states)
      const lastName = pick(lastNames)
      chain.push({
        entityName: `${lastName} ${pick(entitySuffixes)} LLC`,
        entityType: pick(['LLC', 'Corporation', 'Trust']),
        state: intermediateState,
        registrationNumber: `${intermediateState}-${randInt(100000, 999999)}`,
        registeredAgent: `${pick(firstNames)} ${pick(lastNames)}, Esq.`,
        filingDate: new Date(Date.now() - randInt(730, 5475) * 86400000).toISOString().split('T')[0],
        status: pick(['Active', 'Active', 'Active', 'Dissolved']),
        role: 'Intermediate Entity',
        source: registryMap[intermediateState] || 'State Registry',
      })
    }

    // Beneficial owner (individual)
    const beneficialFirst = pick(firstNames)
    const beneficialLast = pick(lastNames)
    chain.push({
      entityName: `${beneficialFirst} ${beneficialLast}`,
      entityType: 'Individual',
      state: pick(states),
      registrationNumber: 'N/A',
      registeredAgent: 'N/A',
      filingDate: 'N/A',
      status: 'Active',
      role: 'Beneficial Owner',
      source: 'Cross-referenced from registered agent records',
    })

    return NextResponse.json({
      data: {
        query: {
          entityName: body.entityName,
          state: body.state || 'All states',
        },
        chain,
        beneficialOwner: {
          name: `${beneficialFirst} ${beneficialLast}`,
          confidence: randInt(70, 98),
          totalEntities: chainDepth,
          statesInvolved: [...new Set(chain.map(n => n.state))],
        },
        unwrappedAt: new Date().toISOString(),
        source: 'Sunbiz + DE SOS + NV SOS cross-reference',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
