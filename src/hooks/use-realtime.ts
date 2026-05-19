"use client"

import { useEffect, useState } from 'react'

interface RealtimeSignal {
  id: string
  type: string
  label: string
  urgency: 'imminent' | 'near-term' | 'medium-term'
  market: 'FL' | 'PR' | 'DR'
  propertyAddress: string
  ownerName: string
  detectedAt: string
}

export function useRealtimeSignals() {
  const [signals, setSignals] = useState<RealtimeSignal[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Try Supabase Realtime first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      // When Supabase is configured, set up Realtime subscription
      // channel: 'signals' table, INSERT events
      // On new signal: prepend to signals array
      setConnected(true)
      return
    }

    // Fallback: simulate real-time with mock signals
    setConnected(true)

    const scheduleNext = () => {
      const delay = Math.random() * 7000 + 8000 // 8-15 seconds
      return window.setTimeout(() => {
        const mockSignal = generateMockRealtimeSignal()
        setSignals(prev => [mockSignal, ...prev].slice(0, 100))
        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()

    return () => {
      window.clearTimeout(timerRef)
    }
  }, [])

  return { signals, connected }
}

const MARKETS = ['FL', 'PR', 'DR'] as const
const URGENCIES = ['imminent', 'near-term', 'medium-term'] as const
const TYPES = ['distress', 'life-event', 'financial', 'behavioral', 'market'] as const

const LABELS: Record<string, string[]> = {
  FL: [
    'Lis Pendens Filed', 'Tax Delinquent 3yr', 'Probate Case Opened',
    'Divorce Filing', 'Code Violation', 'Expired Listing', 'WARN Act Layoff',
    'Out-of-State Owner', 'Pre-Foreclosure Notice', 'Ownership 20+ Years',
  ],
  PR: [
    'CRIM Tax Delinquent', 'Hurricane Maria Damage', 'Act 60 Expiry',
    'OGPE Permit Filed', 'Registro Transfer', 'Condo Assessment',
    'Vacant Property', 'Estate Filing', 'Commercial Lease Expiry',
  ],
  DR: [
    'CONFOTUR Expiring', 'Catastro Update', 'DGII Tax Issue',
    'Title Transfer', 'Building Permit Complete', 'Tourist Zone Signal',
    'Foreign Owner', 'Construction Stalled', 'Zona Franca Exit',
  ],
}

const ADDRESSES: Record<string, string[]> = {
  FL: [
    '123 Brickell Ave, Miami',
    '456 Las Olas Blvd, Fort Lauderdale',
    '789 Bayshore Blvd, Tampa',
    '321 Worth Ave, Palm Beach',
  ],
  PR: [
    'Calle Fortaleza 101, San Juan',
    'Ave Roosevelt 456, Hato Rey',
    'Calle Marina 789, Ponce',
  ],
  DR: [
    'Ave Winston Churchill 123, Santo Domingo',
    'Calle El Conde 456, Zona Colonial',
    'Blvd Turistico del Este, Bavaro',
  ],
}

const FIRST_NAMES = ['James', 'Maria', 'Robert', 'Elena', 'Carlos', 'Sarah', 'Miguel', 'Jennifer']
const LAST_NAMES = ['Rodriguez', 'Smith', 'Gonzalez', 'Johnson', 'Martinez', 'Williams', 'Lopez', 'Brown']

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMockRealtimeSignal(): RealtimeSignal {
  const market = pick(MARKETS)
  const marketLabels = LABELS[market]
  const marketAddresses = ADDRESSES[market]

  return {
    id: `rt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: pick(TYPES),
    label: pick(marketLabels),
    urgency: pick(URGENCIES),
    market,
    propertyAddress: pick(marketAddresses),
    ownerName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    detectedAt: new Date().toISOString(),
  }
}
