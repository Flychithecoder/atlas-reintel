/**
 * Server-side mock data generators for API routes.
 * Re-exports generators from the client-side hook and adds API-specific helpers.
 */

export {
  generateLeads,
  generateBuyerLeads,
  generateTenantLeads,
  generateAgentProfiles,
  generatePreMarketSignals,
  generateOwnerDossier,
  generateTerritories,
  generateCampaigns,
  generateDashboardStats,
} from '@/lib/mock-generators'

import type { CoListingProposal, AgentProfile } from '@/types'

// ---- Utility helpers (same seeded helpers the mock-data hook uses) ----

function pick<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ---- Co-listing proposals ----

const firstNames = ['James', 'Maria', 'Robert', 'Patricia', 'David', 'Jennifer', 'Michael', 'Linda', 'Carlos', 'Ana', 'Miguel', 'Isabella']
const lastNames = ['Smith', 'Johnson', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Reyes', 'Santos', 'Diaz']
const streets = ['Oak St', 'Main Ave', 'Broadway', 'Park Blvd', 'Market St', 'Washington Ave', 'Lincoln Dr', 'Maple Ln']
const brokerages = ['RE/MAX', 'Keller Williams', 'Coldwell Banker', 'Century 21', 'CBRE', 'JLL', 'Compass', 'eXp Realty']
const flCities = ['Miami', 'Fort Lauderdale', 'West Palm Beach', 'Orlando', 'Tampa']
const prCities = ['San Juan', 'Guaynabo', 'Dorado', 'Carolina']
const drCities = ['Santo Domingo', 'Punta Cana', 'Santiago']
const allCities = [...flCities, ...prCities, ...drCities]

function makeAgent(id: string): AgentProfile {
  const licenseState = pick(['FL', 'PR', 'DR'] as const)
  return {
    id,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    email: `agent${id}@brokerage.com`,
    phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
    brokerage: pick(brokerages),
    licenseNumber: `${licenseState}-${randInt(100000, 9999999)}`,
    licenseState,
    specialty: pick(['residential', 'commercial', 'both'] as const),
    territories: [pick(allCities)],
    dealsClosedLTM: randInt(5, 150),
    avgDaysOnMarket: randInt(20, 120),
    totalVolumeLTM: randInt(1000000, 200000000),
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    coListingAvailable: Math.random() > 0.3,
    referralFeePercent: Math.random() > 0.5 ? randInt(20, 35) : undefined,
  }
}

export function generateCoListingProposals(count = 10): CoListingProposal[] {
  const statuses: CoListingProposal['status'][] = ['pending', 'accepted', 'rejected', 'expired']
  return Array.from({ length: count }, (_, i) => ({
    id: `colisting-${i}`,
    propertyId: `prop-cl-${i}`,
    propertyAddress: `${randInt(100, 9999)} ${pick(streets)}, ${pick(allCities)}`,
    proposingAgent: makeAgent(`proposing-${i}`),
    receivingAgentId: `agent-${randInt(0, 23)}`,
    commissionSplit: pick(['50/50', '60/40', '70/30']),
    territory: pick(allCities),
    terms: pick([
      'Standard co-listing agreement with shared marketing costs',
      'Lead agent handles showings, co-agent handles paperwork',
      'Split marketing costs 50/50, lead agent primary contact',
      'Referral-style arrangement with territory exclusivity',
    ]),
    status: pick(statuses),
    createdAt: new Date(Date.now() - randInt(1, 60) * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + randInt(7, 90) * 86400000).toISOString(),
  }))
}
