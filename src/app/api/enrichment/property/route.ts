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

    if (!body.address && !body.propertyId) {
      return NextResponse.json(
        { error: 'Either address or propertyId is required' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      // In production, this would call ATTOM/CoreLogic APIs and store the result
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq(body.propertyId ? 'id' : 'address', body.propertyId || body.address)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      return NextResponse.json({ data: property })
    }

    // Mock enrichment — simulate what ATTOM/property APIs would return
    const yearBuilt = randInt(1950, 2023)
    const sqft = randInt(1000, 150000)
    const pricePerSqft = randInt(100, 800)
    const estimatedValue = sqft * pricePerSqft
    const zonings = ['C-1 Commercial', 'C-2 General Commercial', 'R-1 Residential', 'R-3 Multi-Family', 'I-1 Light Industrial', 'M-1 Mixed Use', 'PD Planned Development']

    const enriched = {
      propertyId: body.propertyId || `prop-enriched-${Date.now()}`,
      address: body.address || '123 Enriched Way',
      propertyType: pick(['Commercial', 'Office', 'Retail', 'Industrial', 'Multi-Family', 'SFR']),
      sqft,
      lotSize: randInt(sqft, sqft * 3),
      yearBuilt,
      stories: randInt(1, 30),
      units: randInt(1, 200),
      bedrooms: randInt(0, 6),
      bathrooms: randInt(1, 4),
      parkingSpaces: randInt(2, 200),
      constructionType: pick(['Concrete', 'Steel Frame', 'Wood Frame', 'Masonry', 'Pre-Cast']),
      roofType: pick(['Flat', 'Tile', 'Shingle', 'Metal', 'Membrane']),
      hvac: pick(['Central', 'Split System', 'Packaged', 'VRF']),
      estimatedValue,
      pricePerSqft,
      taxAssessedValue: Math.round(estimatedValue * 0.85),
      annualPropertyTax: Math.round(estimatedValue * 0.018),
      lastSalePrice: Math.round(estimatedValue * (0.6 + Math.random() * 0.3)),
      lastSaleDate: new Date(Date.now() - randInt(365, 3650) * 86400000).toISOString().split('T')[0],
      zoning: pick(zonings),
      floodZone: pick(['X (Minimal)', 'AE (High Risk)', 'VE (Coastal)', 'A (High Risk)', 'X500 (Moderate)']),
      occupancyStatus: pick(['Owner-Occupied', 'Tenant-Occupied', 'Vacant', 'Unknown']),
      ownerName: `${pick(['James', 'Maria', 'Robert', 'Carlos'])} ${pick(['Smith', 'Garcia', 'Johnson', 'Rodriguez'])}`,
      mailingAddress: `${randInt(100, 9999)} ${pick(['Oak', 'Main', 'Park', 'Elm'])} ${pick(['St', 'Ave', 'Dr', 'Blvd'])}`,
      mortgageBalance: estimatedValue > 500000 ? Math.round(estimatedValue * (0.3 + Math.random() * 0.4)) : undefined,
      equity: undefined as number | undefined,
      liens: randInt(0, 2) > 0 ? [
        { type: pick(['Mortgage', 'Tax Lien', 'Mechanics Lien']), amount: randInt(10000, 500000), date: new Date(Date.now() - randInt(30, 730) * 86400000).toISOString().split('T')[0] }
      ] : [],
      permits: Array.from({ length: randInt(0, 3) }, () => ({
        type: pick(['Building', 'Electrical', 'Plumbing', 'Demolition', 'Renovation']),
        status: pick(['Approved', 'Pending', 'Completed', 'Expired']),
        value: randInt(5000, 500000),
        date: new Date(Date.now() - randInt(30, 365) * 86400000).toISOString().split('T')[0],
      })),
      comparables: Array.from({ length: 3 }, (_, i) => ({
        address: `${randInt(100, 9999)} ${pick(['Oak', 'Main', 'Park'])} ${pick(['St', 'Ave'])}`,
        soldPrice: Math.round(estimatedValue * (0.85 + Math.random() * 0.3)),
        soldDate: new Date(Date.now() - randInt(30, 180) * 86400000).toISOString().split('T')[0],
        sqft: sqft + randInt(-500, 500),
        similarity: randInt(75, 98),
      })),
      enrichedAt: new Date().toISOString(),
      source: 'ATTOM API + County Records',
    }

    if (enriched.mortgageBalance) {
      enriched.equity = estimatedValue - enriched.mortgageBalance
    }

    return NextResponse.json({ data: enriched })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
