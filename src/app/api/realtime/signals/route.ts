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

function generateMockSignal() {
  const market = pick(MARKETS)
  return {
    id: `sse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: pick(TYPES),
    label: pick(LABELS[market]),
    urgency: pick(URGENCIES),
    market,
    propertyAddress: pick(ADDRESSES[market]),
    ownerName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    detectedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'ok' })}\n\n`))

      // Send a signal every 8-15 seconds (mock mode)
      const sendSignal = () => {
        try {
          const signal = generateMockSignal()
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(signal)}\n\n`))
        } catch {
          // Controller closed, clean up
          cleanup()
        }
      }

      const interval = setInterval(sendSignal, 10000)

      // Add jitter by also scheduling random-interval signals
      let jitterTimeout: ReturnType<typeof setTimeout>
      const scheduleJitter = () => {
        jitterTimeout = setTimeout(() => {
          sendSignal()
          scheduleJitter()
        }, Math.random() * 7000 + 8000)
      }
      scheduleJitter()

      const cleanup = () => {
        clearInterval(interval)
        clearTimeout(jitterTimeout)
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      // Auto-close after 5 minutes to prevent hanging connections
      setTimeout(cleanup, 300000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
