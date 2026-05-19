import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name && !body.ownerId && !body.address) {
      return NextResponse.json(
        { error: 'At least one of name, address, or ownerId is required' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      // In production: call BatchSkipTracing / TLOxp / BeenVerified APIs
      if (body.ownerId) {
        const { data, error } = await supabase
          .from('owners')
          .select('*')
          .eq('id', body.ownerId)
          .single()

        if (error) {
          return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
        }

        return NextResponse.json({ data })
      }

      // Search by name
      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .ilike('name', `%${body.name}%`)
        .limit(5)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Mock skip trace result
    const firstNames = ['James', 'Maria', 'Robert', 'Patricia', 'Carlos', 'Ana', 'Miguel', 'Isabella']
    const lastNames = ['Smith', 'Johnson', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez']
    const cities = ['Miami', 'Fort Lauderdale', 'West Palm Beach', 'Orlando', 'Tampa', 'San Juan', 'Dorado', 'Santo Domingo', 'Punta Cana']

    const ownerName = body.name || `${pick(firstNames)} ${pick(lastNames)}`
    const city = pick(cities)

    const result = {
      ownerId: body.ownerId || `owner-traced-${Date.now()}`,
      name: ownerName,
      phones: [
        { number: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`, type: 'mobile', verified: true, lastVerified: new Date(Date.now() - randInt(1, 90) * 86400000).toISOString() },
        { number: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`, type: 'landline', verified: Math.random() > 0.3, lastVerified: new Date(Date.now() - randInt(30, 365) * 86400000).toISOString() },
      ],
      emails: [
        { address: `${ownerName.split(' ')[0].toLowerCase()}${randInt(1, 99)}@${pick(['gmail.com', 'yahoo.com', 'outlook.com', 'aol.com'])}`, verified: true },
        ...(Math.random() > 0.5 ? [{ address: `${ownerName.split(' ')[0].toLowerCase()}.${ownerName.split(' ')[1]?.toLowerCase() || 'contact'}@${pick(['company.com', 'business.com', 'realty.com'])}`, verified: false }] : []),
      ],
      mailingAddresses: [
        {
          address: `${randInt(100, 9999)} ${pick(['Oak', 'Main', 'Park', 'Elm'])} ${pick(['St', 'Ave', 'Dr'])}`,
          city,
          state: pick(['FL', 'PR', 'NY', 'TX', 'CA']),
          zip: `${randInt(10000, 99999)}`,
          type: 'primary',
          isCurrent: true,
        },
        ...(Math.random() > 0.5 ? [{
          address: `${randInt(100, 9999)} ${pick(['Cedar', 'Willow', 'Sunset'])} ${pick(['Blvd', 'Ln', 'Way'])}`,
          city: pick(cities),
          state: pick(['FL', 'PR', 'NY']),
          zip: `${randInt(10000, 99999)}`,
          type: 'previous' as const,
          isCurrent: false,
        }] : []),
      ],
      demographics: {
        age: randInt(30, 75),
        householdIncome: pick(['$75K-$100K', '$100K-$150K', '$150K-$250K', '$250K-$500K', '$500K+']),
        maritalStatus: pick(['Single', 'Married', 'Divorced', 'Unknown']),
        educationLevel: pick(['High School', 'Bachelor', 'Master', 'Doctorate', 'Unknown']),
      },
      socialProfiles: {
        linkedin: Math.random() > 0.4 ? `linkedin.com/in/${ownerName.replace(/\s+/g, '-').toLowerCase()}` : undefined,
        facebook: Math.random() > 0.5 ? true : undefined,
      },
      relatedEntities: Math.random() > 0.4 ? [
        `${pick(lastNames)} Holdings LLC`,
        ...(Math.random() > 0.5 ? [`${pick(lastNames)} Properties Inc`] : []),
      ] : [],
      confidence: randInt(70, 99),
      tracedAt: new Date().toISOString(),
      source: 'BatchSkipTracing + TLOxp',
    }

    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
