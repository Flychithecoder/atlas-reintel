import type { Lead, Property, Owner, Signal, DashboardStats, AdminStats, User, OutreachCampaign, DataPipeline, VoiceCall, BuyerProfile, BuyerLead, TenantProfile, TenantLead, AgentProfile, PreMarketSignal, OwnerDossier, BuyerSignal, Territory, LLCChainNode } from '@/types'

const propertyTypes = ['SFR', 'Multi-Family', 'Commercial', 'Industrial', 'Office', 'Retail', 'Mixed-Use', 'Land'] as const
const cities: { city: string; state: string; country: string; lat: number; lng: number }[] = [
  // US cities
  { city: 'New York', state: 'NY', country: 'US', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', state: 'CA', country: 'US', lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', state: 'IL', country: 'US', lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', state: 'TX', country: 'US', lat: 29.7604, lng: -95.3698 },
  { city: 'Dallas', state: 'TX', country: 'US', lat: 32.7767, lng: -96.7970 },
  { city: 'Atlanta', state: 'GA', country: 'US', lat: 33.7490, lng: -84.3880 },
  { city: 'Miami', state: 'FL', country: 'US', lat: 25.7617, lng: -80.1918 },
  { city: 'Phoenix', state: 'AZ', country: 'US', lat: 33.4484, lng: -112.0740 },
  { city: 'Austin', state: 'TX', country: 'US', lat: 30.2672, lng: -97.7431 },
  { city: 'Seattle', state: 'WA', country: 'US', lat: 47.6062, lng: -122.3321 },
  // Dominican Republic cities
  { city: 'Santo Domingo', state: 'DN', country: 'DO', lat: 18.4861, lng: -69.9312 },
  { city: 'Punta Cana', state: 'LC', country: 'DO', lat: 18.5601, lng: -68.3725 },
  { city: 'Santiago', state: 'ST', country: 'DO', lat: 19.4517, lng: -70.6970 },
  { city: 'La Romana', state: 'LR', country: 'DO', lat: 18.4273, lng: -68.9728 },
  // Puerto Rico cities
  { city: 'San Juan', state: 'PR', country: 'US', lat: 18.4655, lng: -66.1057 },
  { city: 'Condado', state: 'PR', country: 'US', lat: 18.4569, lng: -66.0711 },
  { city: 'Dorado', state: 'PR', country: 'US', lat: 18.4588, lng: -66.2677 },
  { city: 'Guaynabo', state: 'PR', country: 'US', lat: 18.3575, lng: -66.1178 },
]
const streets = ['Oak St', 'Main Ave', 'Broadway', 'Park Blvd', 'Market St', 'Washington Ave', 'Lincoln Dr', 'Maple Ln', 'Cedar Rd', 'Pine St', 'Elm Ave', 'Willow Way', 'Sunset Blvd', 'Highland Ave', 'Commerce Dr']
const firstNames = ['James', 'Maria', 'Robert', 'Patricia', 'David', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Carlos', 'Ana', 'Miguel', 'Isabella', 'José', 'Carmen', 'Luis', 'Sofia', 'Rafael', 'Valentina']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Chen', 'Kim', 'Patel', 'Reyes', 'Santos', 'Díaz', 'Morales', 'Castillo', 'Vargas', 'Jiménez', 'Peña', 'Guzmán', 'Medina']
const entityNames = ['Holdings LLC', 'Properties Inc', 'Capital Group', 'Investments LLC', 'Realty Trust', 'Development Corp', 'Asset Management']
const signalLabels: Record<string, Signal['type']> = {
  'Pre-foreclosure NOD filed': 'distress',
  'Tax delinquent 2+ years': 'distress',
  '3 code violations in 2025': 'distress',
  'Vacancy detected 6+ months': 'distress',
  'Probate filing detected': 'life-event',
  'Divorce proceedings': 'life-event',
  'Owner death - obituary match': 'life-event',
  'Out-of-state owner': 'behavioral',
  'Equity >70% of value': 'financial',
  'Mortgage maturity within 12mo': 'financial',
  'Property listed then withdrawn': 'behavioral',
  'Owner portfolio liquidating': 'behavioral',
  'SEC 8-K office closure mention': 'market',
  'Lease expiration within 18mo': 'market',
  'CMBS special servicer transfer': 'market',
  'Declining foot traffic -40% YoY': 'market',
  'Building permit >$500K filed': 'market',
  'WARN Act layoff notice': 'market',
  'Registro de Títulos ownership change': 'life-event',
  'CRIM tax delinquent': 'distress',
  'Tourist zone permit filed': 'market',
  'Hurricane damage assessment': 'distress',
  'Zona Franca lease expiry': 'market',
}

function pick<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateSignals(): Signal[] {
  const count = randInt(1, 4)
  const labels = Object.keys(signalLabels)
  const selected = new Set<string>()
  while (selected.size < count) selected.add(pick(labels))
  return Array.from(selected).map(label => ({
    type: signalLabels[label],
    label,
    description: `Detected via automated data pipeline analysis`,
    severity: (['high', 'medium', 'low'] as const)[randInt(0, 2)],
    detectedAt: new Date(Date.now() - randInt(1, 90) * 86400000).toISOString(),
    source: pick(['County Records', 'SEC EDGAR', 'Court Filings', 'MLS', 'Satellite', 'Permit Data', 'ATTOM', 'CRIM Registry', 'Registro de Títulos', 'Catastro Nacional', 'DR MLS']),
  }))
}

function generateLead(index: number): Lead {
  const loc = pick(cities)
  const isEntity = Math.random() > 0.5
  const score = randInt(25, 99)
  const statuses = ['New', 'Contacted', 'Responded', 'Meeting', 'Negotiating', 'Under Contract', 'Closed', 'Dead'] as const
  const property: Property = {
    id: `prop-${index}`,
    address: `${randInt(100, 9999)} ${pick(streets)}`,
    city: loc.city,
    state: loc.state,
    country: loc.country as Property['country'],
    zip: `${randInt(10000, 99999)}`,
    propertyType: pick(propertyTypes),
    bedrooms: randInt(2, 6),
    bathrooms: randInt(1, 4),
    sqft: randInt(800, 250000),
    yearBuilt: randInt(1940, 2023),
    estimatedValue: randInt(150000, 25000000),
    lastSalePrice: randInt(100000, 20000000),
    lastSaleDate: new Date(Date.now() - randInt(365, 3650) * 86400000).toISOString(),
    taxAssessedValue: randInt(100000, 20000000),
    occupancyStatus: pick(['Owner-Occupied', 'Tenant-Occupied', 'Vacant', 'Unknown']),
    coordinates: { lat: loc.lat + (Math.random() - 0.5) * 0.1, lng: loc.lng + (Math.random() - 0.5) * 0.1 },
  }
  const owner: Owner = {
    id: `owner-${index}`,
    name: isEntity ? `${pick(lastNames)} ${pick(entityNames)}` : `${pick(firstNames)} ${pick(lastNames)}`,
    entityType: isEntity ? pick(['LLC', 'Corporation', 'Trust', 'Partnership']) : 'Individual',
    email: `contact${index}@${isEntity ? 'company' : 'email'}.com`,
    phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
    portfolioSize: isEntity ? randInt(5, 500) : randInt(1, 10),
    totalEquity: randInt(50000, 50000000),
    ownershipTenure: randInt(1, 30),
    outOfState: Math.random() > 0.6,
    beneficialOwner: isEntity ? `${pick(firstNames)} ${pick(lastNames)}` : undefined,
  }
  return {
    id: `lead-${index}`,
    property,
    owner,
    score,
    scoreLabel: score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold',
    signals: generateSignals(),
    status: pick(statuses),
    lastContactDate: Math.random() > 0.4 ? new Date(Date.now() - randInt(1, 30) * 86400000).toISOString() : undefined,
    nextFollowUp: Math.random() > 0.5 ? new Date(Date.now() + randInt(1, 14) * 86400000).toISOString() : undefined,
    notes: [],
    createdAt: new Date(Date.now() - randInt(1, 180) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
    source: pick(['ATTOM API', 'County Scraper', 'MLS Feed', 'Court Records', 'SEC Filing', 'User Upload', 'Browser Extension', 'CRIM Registry', 'Registro de Títulos', 'Catastro Nacional', 'DR MLS']),
    assignedTo: Math.random() > 0.3 ? `${pick(firstNames)} ${pick(lastNames)}` : undefined,
  }
}

export function generateLeads(count: number): Lead[] {
  return Array.from({ length: count }, (_, i) => generateLead(i))
}

export function generateDashboardStats(): DashboardStats {
  return {
    totalLeads: 12847,
    hotLeads: 342,
    warmLeads: 2891,
    coldLeads: 9614,
    leadsContactedToday: 47,
    meetingsScheduled: 12,
    dealsInPipeline: 23,
    pipelineValue: 18750000,
    conversionRate: 3.2,
    avgResponseRate: 12.8,
  }
}

export function generateAdminStats(): AdminStats {
  return {
    totalUsers: 2847,
    activeUsers: 1923,
    totalProperties: 26400000,
    totalLeads: 4250000,
    monthlyRevenue: 487000,
    mrr: 487000,
    arr: 5844000,
    churnRate: 2.1,
    apiCalls: 12500000,
    dataFreshness: '2 hours ago',
    systemUptime: 99.97,
    avgResponseTime: 145,
  }
}

export function generateUsers(count: number): User[] {
  const plans = ['free', 'starter', 'pro', 'pro_cre', 'team', 'enterprise'] as const
  const statuses = ['active', 'inactive', 'trial'] as const
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    email: `user${i}@${pick(['gmail.com', 'company.com', 'realty.com', 'investments.com'])}`,
    role: i === 0 ? 'admin' as const : pick(['user', 'team_lead'] as const),
    plan: pick(plans),
    company: Math.random() > 0.3 ? `${pick(lastNames)} ${pick(['Realty', 'Properties', 'Investments', 'Capital', 'Group'])}` : undefined,
    territories: [pick(cities).city],
    leadsViewed: randInt(10, 5000),
    enrichmentsUsed: randInt(0, 500),
    enrichmentsLimit: pick([25, 250, -1, -1, -1, -1]),
    outreachSent: randInt(0, 2000),
    createdAt: new Date(Date.now() - randInt(30, 365) * 86400000).toISOString(),
    lastActive: new Date(Date.now() - randInt(0, 14) * 86400000).toISOString(),
    status: pick(statuses),
  }))
}

export function generateCampaigns(): OutreachCampaign[] {
  const types = ['email', 'sms', 'voice', 'direct-mail', 'linkedin'] as const
  return Array.from({ length: 8 }, (_, i) => ({
    id: `campaign-${i}`,
    name: `${pick(['Q2 Distressed', 'Absentee Owner', 'Probate', 'High Equity', 'Tax Delinquent', 'Vacant', 'FSBO', 'Expired Listing'])} Campaign`,
    type: pick(types),
    status: pick(['draft', 'active', 'paused', 'completed'] as const),
    totalRecipients: randInt(100, 5000),
    sent: randInt(50, 4000),
    opened: randInt(20, 2000),
    replied: randInt(5, 300),
    meetings: randInt(0, 50),
    createdAt: new Date(Date.now() - randInt(7, 90) * 86400000).toISOString(),
  }))
}

export type PipelineMarket = 'general' | 'florida' | 'puerto-rico' | 'dominican-republic' | 'buyer-signals'

export interface DataPipelineExtended extends DataPipeline {
  market: PipelineMarket
  description: string
}

export function generatePipelines(): DataPipelineExtended[] {
  return [
    // === General / Legacy Pipelines ===
    { id: 'dp-1', name: 'ATTOM Property Sync', source: 'ATTOM API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 79200000).toISOString(), recordsProcessed: 1250000, recordsFailed: 342, avgDuration: '45m', schedule: 'Daily 2:00 AM', market: 'general', description: 'National property data sync' },
    { id: 'dp-2', name: 'County Assessor Scraper', source: 'Browserbase', type: 'scraper', status: 'running', lastRun: new Date().toISOString(), recordsProcessed: 48000, recordsFailed: 1200, avgDuration: '3h 20m', schedule: 'Weekly Monday', market: 'general', description: 'Multi-county assessor records' },
    { id: 'dp-3', name: 'Court Records ETL', source: 'Court APIs', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 3600000).toISOString(), nextRun: new Date(Date.now() + 82800000).toISOString(), recordsProcessed: 89000, recordsFailed: 150, avgDuration: '1h 10m', schedule: 'Daily 4:00 AM', market: 'general', description: 'National court records aggregation' },
    { id: 'dp-4', name: 'SEC Filing Parser', source: 'EDGAR', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 14400000).toISOString(), nextRun: new Date(Date.now() + 72000000).toISOString(), recordsProcessed: 2400, recordsFailed: 12, avgDuration: '25m', schedule: 'Daily 6:00 AM', market: 'general', description: '8-K/10-K filings with RE references' },
    { id: 'dp-5', name: 'MLS Feed Ingest', source: 'CoreLogic Trestle', type: 'api', status: 'failed', lastRun: new Date(Date.now() - 1800000).toISOString(), recordsProcessed: 0, recordsFailed: 0, avgDuration: '2h', schedule: 'Every 6 hours', market: 'general', description: 'National MLS feed via Trestle' },
    { id: 'dp-6', name: 'Permit Data Sync', source: 'BuildZoom + Shovels', type: 'api', status: 'scheduled', lastRun: new Date(Date.now() - 86400000).toISOString(), nextRun: new Date(Date.now() + 43200000).toISOString(), recordsProcessed: 350000, recordsFailed: 800, avgDuration: '1h 45m', schedule: 'Daily 3:00 AM', market: 'general', description: 'Building permit data nationwide' },
    { id: 'dp-7', name: 'Skip Trace Enrichment', source: 'BatchSkipTracing', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 5400000).toISOString(), nextRun: new Date(Date.now() + 81000000).toISOString(), recordsProcessed: 15000, recordsFailed: 2100, avgDuration: '35m', schedule: 'Daily 5:00 AM', market: 'general', description: 'Owner contact data enrichment' },
    { id: 'dp-8', name: 'Satellite Imagery Analysis', source: 'Orbital Insight', type: 'api', status: 'paused', lastRun: new Date(Date.now() - 172800000).toISOString(), recordsProcessed: 5000, recordsFailed: 50, avgDuration: '4h', schedule: 'Weekly Wednesday', market: 'general', description: 'Vacancy & construction detection' },

    // === Florida Pipelines ===
    { id: 'dp-fl-1', name: 'FL Clerk of Court', source: 'County Clerk Portals', type: 'scraper', status: 'running', lastRun: new Date(Date.now() - 3600000).toISOString(), recordsProcessed: 127000, recordsFailed: 890, avgDuration: '2h 15m', schedule: 'Daily 1:00 AM', market: 'florida', description: 'Lis pendens, foreclosure, probate filings' },
    { id: 'dp-fl-2', name: 'Sunbiz.org', source: 'FL Dept of State', type: 'scraper', status: 'completed', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 79200000).toISOString(), recordsProcessed: 34500, recordsFailed: 120, avgDuration: '55m', schedule: 'Daily 3:00 AM', market: 'florida', description: 'LLC changes, dissolutions, registered agents' },
    { id: 'dp-fl-3', name: 'FL DBPR', source: 'DBPR License API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 14400000).toISOString(), nextRun: new Date(Date.now() + 72000000).toISOString(), recordsProcessed: 18200, recordsFailed: 45, avgDuration: '20m', schedule: 'Weekly Monday', market: 'florida', description: 'Real estate agent license database' },
    { id: 'dp-fl-4', name: 'County Property Appraisers', source: 'Miami-Dade/Broward/PBC', type: 'scraper', status: 'running', lastRun: new Date(Date.now() - 1800000).toISOString(), recordsProcessed: 285000, recordsFailed: 3200, avgDuration: '4h 30m', schedule: 'Daily 12:00 AM', market: 'florida', description: 'Tri-county property appraiser data' },
    { id: 'dp-fl-5', name: 'FL Code Enforcement', source: 'Major County Portals', type: 'scraper', status: 'completed', lastRun: new Date(Date.now() - 10800000).toISOString(), nextRun: new Date(Date.now() + 75600000).toISOString(), recordsProcessed: 42000, recordsFailed: 680, avgDuration: '1h 40m', schedule: 'Daily 5:00 AM', market: 'florida', description: 'Code violations across major FL counties' },
    { id: 'dp-fl-6', name: 'Florida MLS (Stellar)', source: 'Stellar MLS API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 5400000).toISOString(), nextRun: new Date(Date.now() + 81000000).toISOString(), recordsProcessed: 67000, recordsFailed: 210, avgDuration: '1h 10m', schedule: 'Every 6 hours', market: 'florida', description: 'Expired/withdrawn listings via Stellar MLS' },

    // === Puerto Rico Pipelines ===
    { id: 'dp-pr-1', name: 'CRIM/KARIBE', source: 'CRIM Tax Portal', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 79200000).toISOString(), recordsProcessed: 95000, recordsFailed: 520, avgDuration: '1h 30m', schedule: 'Daily 2:00 AM', market: 'puerto-rico', description: 'Tax delinquency records, ownership data' },
    { id: 'dp-pr-2', name: 'Registro de la Propiedad', source: 'PR Land Registry', type: 'scraper', status: 'scheduled', lastRun: new Date(Date.now() - 172800000).toISOString(), nextRun: new Date(Date.now() + 14400000).toISOString(), recordsProcessed: 28000, recordsFailed: 1500, avgDuration: '3h', schedule: 'Weekly Tuesday', market: 'puerto-rico', description: 'Deed transfers, liens, encumbrances' },
    { id: 'dp-pr-3', name: 'OGPE Building Permits', source: 'OGPE Portal API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 10800000).toISOString(), nextRun: new Date(Date.now() + 75600000).toISOString(), recordsProcessed: 12400, recordsFailed: 85, avgDuration: '25m', schedule: 'Daily 4:00 AM', market: 'puerto-rico', description: 'Building permits and construction activity' },
    { id: 'dp-pr-4', name: 'PR MLS (Stellar PR)', source: 'Stellar MLS PR Chapter', type: 'api', status: 'running', lastRun: new Date(Date.now() - 900000).toISOString(), recordsProcessed: 8900, recordsFailed: 62, avgDuration: '40m', schedule: 'Every 6 hours', market: 'puerto-rico', description: 'PR listings, expireds, withdrawns' },
    { id: 'dp-pr-5', name: 'FEMA Disaster Data', source: 'OpenFEMA API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 86400000).toISOString(), nextRun: new Date(Date.now() + 518400000).toISOString(), recordsProcessed: 156000, recordsFailed: 340, avgDuration: '50m', schedule: 'Weekly Sunday', market: 'puerto-rico', description: 'Maria/Fiona damage assessments & claims' },
    { id: 'dp-pr-6', name: 'Act 60 Investor Tracking', source: 'DDEC Records', type: 'scraper', status: 'paused', lastRun: new Date(Date.now() - 604800000).toISOString(), recordsProcessed: 4200, recordsFailed: 180, avgDuration: '1h 15m', schedule: 'Weekly Thursday', market: 'puerto-rico', description: 'Act 60 decree holders & property cycles' },

    // === Dominican Republic Pipelines ===
    { id: 'dp-dr-1', name: 'Catastro Nacional', source: 'Catastro Geoportal API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 14400000).toISOString(), nextRun: new Date(Date.now() + 72000000).toISOString(), recordsProcessed: 78000, recordsFailed: 420, avgDuration: '1h 20m', schedule: 'Daily 3:00 AM', market: 'dominican-republic', description: 'National cadastral data, parcel geometry' },
    { id: 'dp-dr-2', name: 'Registro de Títulos', source: 'DR Land Registry', type: 'scraper', status: 'running', lastRun: new Date(Date.now() - 3600000).toISOString(), recordsProcessed: 22000, recordsFailed: 1800, avgDuration: '2h 45m', schedule: 'Daily 1:00 AM', market: 'dominican-republic', description: 'Ownership changes, title transfers' },
    { id: 'dp-dr-3', name: 'DGII Tax Records', source: 'DGII Portal', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 79200000).toISOString(), recordsProcessed: 45000, recordsFailed: 290, avgDuration: '55m', schedule: 'Daily 4:00 AM', market: 'dominican-republic', description: 'IPI tax records, delinquency data' },
    { id: 'dp-dr-4', name: 'Corotos.com.do Scraper', source: 'Corotos Listings', type: 'scraper', status: 'completed', lastRun: new Date(Date.now() - 10800000).toISOString(), nextRun: new Date(Date.now() + 75600000).toISOString(), recordsProcessed: 15600, recordsFailed: 230, avgDuration: '1h 30m', schedule: 'Every 12 hours', market: 'dominican-republic', description: 'Listing price monitor & market pulse' },
    { id: 'dp-dr-5', name: 'CONFOTUR Project Tracker', source: 'Tourism Ministry API', type: 'api', status: 'scheduled', lastRun: new Date(Date.now() - 259200000).toISOString(), nextRun: new Date(Date.now() + 86400000).toISOString(), recordsProcessed: 3200, recordsFailed: 15, avgDuration: '15m', schedule: 'Weekly Wednesday', market: 'dominican-republic', description: 'CONFOTUR tax-exempt project tracking' },
    { id: 'dp-dr-6', name: 'Zona Franca Registry', source: 'CNZFE Portal', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 86400000).toISOString(), nextRun: new Date(Date.now() + 518400000).toISOString(), recordsProcessed: 1800, recordsFailed: 8, avgDuration: '10m', schedule: 'Weekly Monday', market: 'dominican-republic', description: 'Free-zone company registry & movements' },

    // === Buyer/Tenant Signal Pipelines ===
    { id: 'dp-bs-1', name: 'HMDA/CFPB', source: 'CFPB HMDA API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 14400000).toISOString(), nextRun: new Date(Date.now() + 72000000).toISOString(), recordsProcessed: 340000, recordsFailed: 1200, avgDuration: '2h', schedule: 'Daily 2:00 AM', market: 'buyer-signals', description: 'Mortgage pre-approvals & lending activity' },
    { id: 'dp-bs-2', name: 'LinkedIn Jobs API', source: 'LinkedIn Data', type: 'api', status: 'running', lastRun: new Date(Date.now() - 1800000).toISOString(), recordsProcessed: 8500, recordsFailed: 120, avgDuration: '45m', schedule: 'Every 4 hours', market: 'buyer-signals', description: 'Company expansion signals (50+ hires)' },
    { id: 'dp-bs-3', name: 'SEC EDGAR', source: 'EDGAR XBRL API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 79200000).toISOString(), recordsProcessed: 5600, recordsFailed: 32, avgDuration: '30m', schedule: 'Daily 6:00 AM', market: 'buyer-signals', description: 'Facility announcements, relocations' },
    { id: 'dp-bs-4', name: 'SBA Loans', source: 'SBA Data API', type: 'api', status: 'completed', lastRun: new Date(Date.now() - 10800000).toISOString(), nextRun: new Date(Date.now() + 75600000).toISOString(), recordsProcessed: 12000, recordsFailed: 85, avgDuration: '35m', schedule: 'Daily 5:00 AM', market: 'buyer-signals', description: 'New business formation & 504/7(a) loans' },
    { id: 'dp-bs-5', name: 'Franchise FDD Tracker', source: 'FDD Filings', type: 'scraper', status: 'completed', lastRun: new Date(Date.now() - 86400000).toISOString(), nextRun: new Date(Date.now() + 518400000).toISOString(), recordsProcessed: 2800, recordsFailed: 45, avgDuration: '1h 10m', schedule: 'Weekly Monday', market: 'buyer-signals', description: 'Franchise expansion into target markets' },
  ]
}

export function generateVoiceCalls(): VoiceCall[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `call-${i}`,
    leadId: `lead-${randInt(0, 100)}`,
    leadName: `${pick(firstNames)} ${pick(lastNames)}`,
    phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
    duration: randInt(15, 480),
    status: pick(['completed', 'no-answer', 'voicemail', 'busy', 'failed'] as const),
    sentiment: pick(['positive', 'neutral', 'negative'] as const),
    outcome: pick(['meeting-booked', 'callback', 'not-interested', 'wrong-number', 'dnc'] as const),
    calledAt: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
  }))
}

// ==================== FL/PR/DR city pools for new generators ====================

const flCities: { city: string; state: string; country: string; lat: number; lng: number }[] = [
  { city: 'Miami', state: 'FL', country: 'US', lat: 25.7617, lng: -80.1918 },
  { city: 'Fort Lauderdale', state: 'FL', country: 'US', lat: 26.1224, lng: -80.1373 },
  { city: 'West Palm Beach', state: 'FL', country: 'US', lat: 26.7153, lng: -80.0534 },
  { city: 'Orlando', state: 'FL', country: 'US', lat: 28.5384, lng: -81.3789 },
  { city: 'Tampa', state: 'FL', country: 'US', lat: 27.9506, lng: -82.4572 },
  { city: 'Jacksonville', state: 'FL', country: 'US', lat: 30.3322, lng: -81.6557 },
  { city: 'Naples', state: 'FL', country: 'US', lat: 26.1420, lng: -81.7948 },
  { city: 'Sarasota', state: 'FL', country: 'US', lat: 27.3364, lng: -82.5307 },
  { city: 'St. Petersburg', state: 'FL', country: 'US', lat: 27.7676, lng: -82.6403 },
  { city: 'Boca Raton', state: 'FL', country: 'US', lat: 26.3587, lng: -80.0831 },
]

const prCities: { city: string; state: string; country: string; lat: number; lng: number }[] = [
  { city: 'San Juan', state: 'PR', country: 'US', lat: 18.4655, lng: -66.1057 },
  { city: 'Guaynabo', state: 'PR', country: 'US', lat: 18.3575, lng: -66.1178 },
  { city: 'Bayamón', state: 'PR', country: 'US', lat: 18.3988, lng: -66.1553 },
  { city: 'Carolina', state: 'PR', country: 'US', lat: 18.3808, lng: -65.9573 },
  { city: 'Dorado', state: 'PR', country: 'US', lat: 18.4588, lng: -66.2677 },
  { city: 'Condado', state: 'PR', country: 'US', lat: 18.4569, lng: -66.0711 },
]

const drCities: { city: string; state: string; country: string; lat: number; lng: number }[] = [
  { city: 'Santo Domingo', state: 'DN', country: 'DO', lat: 18.4861, lng: -69.9312 },
  { city: 'Punta Cana', state: 'LC', country: 'DO', lat: 18.5601, lng: -68.3725 },
  { city: 'Santiago', state: 'ST', country: 'DO', lat: 19.4517, lng: -70.6970 },
  { city: 'Puerto Plata', state: 'PP', country: 'DO', lat: 19.7934, lng: -70.6884 },
  { city: 'La Romana', state: 'LR', country: 'DO', lat: 18.4273, lng: -68.9728 },
  { city: 'Samaná', state: 'SM', country: 'DO', lat: 19.2059, lng: -69.3363 },
]

const allTargetCities = [...flCities, ...prCities, ...drCities]

const spanishFirstNames = ['Carlos', 'Ana', 'Miguel', 'Isabella', 'José', 'Carmen', 'Luis', 'Sofía', 'Rafael', 'Valentina', 'Alejandro', 'María', 'Diego', 'Gabriela', 'Fernando', 'Camila', 'Ricardo', 'Daniela', 'Andrés', 'Natalia']
const spanishLastNames = ['García', 'Rodríguez', 'Martínez', 'Hernández', 'López', 'Reyes', 'Santos', 'Díaz', 'Morales', 'Castillo', 'Vargas', 'Jiménez', 'Peña', 'Guzmán', 'Medina', 'Rivera', 'Colón', 'Santiago', 'Delgado', 'Acosta']

function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function pickMarketCity(market: 'FL' | 'PR' | 'DR') {
  if (market === 'FL') return pick(flCities)
  if (market === 'PR') return pick(prCities)
  return pick(drCities)
}

function pickMarket(): 'FL' | 'PR' | 'DR' {
  return pickWeighted(['FL', 'PR', 'DR'] as const, [50, 25, 25])
}

// ==================== 1. generateBuyerLeads ====================

export function generateBuyerLeads(count: number): BuyerLead[] {
  const buyerTypes: BuyerProfile['buyerType'][] = ['individual', 'investor', 'corporation', 'reit', '1031-exchange', 'first-time']
  const buyerTypeWeights = [25, 30, 15, 10, 10, 10]
  const preApprovalStatuses: BuyerProfile['preApprovalStatus'][] = ['none', 'pre-qualified', 'pre-approved', 'cash-buyer', 'hard-money']
  const preApprovalWeights = [5, 10, 35, 35, 15]
  const timelines: BuyerProfile['timeline'][] = ['immediate', '1-3months', '3-6months', '6-12months', 'flexible']
  const qualStages: BuyerLead['qualificationStage'][] = ['new', 'contacted', 'qualified', 'matched', 'showing', 'offer', 'under-contract', 'closed', 'lost']
  const qualStageWeights = [20, 18, 15, 15, 10, 8, 6, 4, 4]
  const sources = ['HMDA Data', 'Agent Referral', 'Website Inquiry', 'Open House', 'LinkedIn Signal', 'Military PCS', '1031 Exchange', 'SBA Application']
  const lenders = ['Wells Fargo', 'Chase', 'Bank of America', 'US Bank', 'PennyMac', 'Rocket Mortgage', 'FirstBank PR', 'Oriental Bank', 'Scotiabank DR', 'Popular Bank']

  return Array.from({ length: count }, (_, i) => {
    const bType = pickWeighted(buyerTypes, buyerTypeWeights)
    const isCompany = bType === 'corporation' || bType === 'reit'
    const market = pickMarket()
    const loc = pickMarketCity(market)
    const preApproval = pickWeighted(preApprovalStatuses, preApprovalWeights)

    const budgetMin = bType === 'reit' || bType === 'corporation'
      ? randInt(1000000, 10000000)
      : bType === '1031-exchange'
        ? randInt(500000, 5000000)
        : randInt(150000, 800000)
    const budgetMax = budgetMin + randInt(100000, Math.max(budgetMin, 5000000))

    const matchedCount = randInt(0, 5)
    const matchedProperties = Array.from({ length: matchedCount }, (_, j) => {
      const mLoc = pickMarketCity(market)
      return {
        propertyId: `prop-buyer-${i}-${j}`,
        matchScore: randInt(60, 98),
        address: `${randInt(100, 9999)} ${pick(streets)}, ${mLoc.city}`,
        value: randInt(budgetMin, budgetMax),
      }
    })

    const preferredPropertyTypes: Property['propertyType'][] = []
    const ptCount = randInt(1, 3)
    while (preferredPropertyTypes.length < ptCount) {
      const pt = pick(propertyTypes)
      if (!preferredPropertyTypes.includes(pt)) preferredPropertyTypes.push(pt)
    }

    const preferredMarkets = [loc.city]
    if (Math.random() > 0.5) {
      const extra = pickMarketCity(market)
      if (!preferredMarkets.includes(extra.city)) preferredMarkets.push(extra.city)
    }

    const buyer: BuyerProfile = {
      id: `buyer-profile-${i}`,
      name: isCompany
        ? `${pick(lastNames)} ${pick(['Capital', 'Properties', 'Investments', 'Holdings', 'Realty Group'])}`
        : `${pick(firstNames)} ${pick(lastNames)}`,
      email: `buyer${i}@${isCompany ? 'company' : pick(['gmail.com', 'outlook.com', 'yahoo.com'])}`,
      phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
      company: isCompany ? `${pick(lastNames)} ${pick(['Capital LLC', 'Properties Inc', 'REIT', 'Investment Group'])}` : undefined,
      buyerType: bType,
      budget: { min: budgetMin, max: budgetMax },
      propertyTypes: preferredPropertyTypes,
      preferredMarkets,
      preApprovalStatus: preApproval,
      preApprovalAmount: preApproval !== 'none' ? randInt(budgetMin, budgetMax) : undefined,
      lender: preApproval !== 'none' && preApproval !== 'cash-buyer' ? pick(lenders) : undefined,
      timeline: pick(timelines),
      investmentCriteria: (bType === 'investor' || bType === 'reit' || bType === '1031-exchange') ? {
        targetCapRate: parseFloat((Math.random() * 6 + 4).toFixed(1)),
        targetCashOnCash: parseFloat((Math.random() * 8 + 6).toFixed(1)),
        targetIRR: parseFloat((Math.random() * 10 + 10).toFixed(1)),
        holdPeriod: pick(['1-3 years', '3-5 years', '5-7 years', '7-10 years', '10+ years']),
      } : undefined,
    }

    return {
      id: `buyer-lead-${i}`,
      buyer,
      qualificationStage: pickWeighted(qualStages, qualStageWeights),
      matchedProperties,
      source: pick(sources),
      assignedTo: Math.random() > 0.3 ? `${pick(firstNames)} ${pick(lastNames)}` : undefined,
      notes: [],
      lastContactDate: Math.random() > 0.4 ? new Date(Date.now() - randInt(1, 30) * 86400000).toISOString() : undefined,
      nextFollowUp: Math.random() > 0.5 ? new Date(Date.now() + randInt(1, 14) * 86400000).toISOString() : undefined,
      createdAt: new Date(Date.now() - randInt(1, 120) * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
    }
  })
}

// ==================== 2. generateTenantLeads ====================

export function generateTenantLeads(count: number): TenantLead[] {
  const commercialTenantTypes: TenantProfile['tenantType'][] = ['commercial', 'industrial', 'retail', 'restaurant', 'office']
  const residentialTenantTypes: TenantProfile['tenantType'][] = ['residential']
  const commercialTerms: TenantProfile['preferredTerm'][] = ['1yr', '2yr', '3yr', '5yr', '10yr']
  const residentialTerms: TenantProfile['preferredTerm'][] = ['1yr', '2yr']
  const leaseStages: TenantLead['leaseStage'][] = ['new', 'contacted', 'qualified', 'touring', 'proposal', 'negotiating', 'lease-signed', 'lost']
  const leaseStageWeights = [20, 18, 15, 15, 10, 10, 7, 5]
  const industries = ['Technology', 'Healthcare', 'Finance', 'Restaurant', 'Retail', 'Legal', 'Manufacturing', 'Logistics']
  const sources = ['LinkedIn Jobs', 'Business License App', 'Franchise FDD', 'Health Permit', 'Corporate Relocation', 'University Housing', 'Walk-in']
  const companyPrefixes = ['Apex', 'Summit', 'Coastal', 'Vertex', 'Prime', 'Metro', 'Horizon', 'Nexus', 'Atlas', 'Zenith']
  const companySuffixes = ['Solutions', 'Group', 'Corp', 'Partners', 'Industries', 'Labs', 'Systems', 'Enterprises', 'Tech', 'Services']
  const specialReqs = ['Loading dock', 'Class A finishes', 'Kitchen exhaust', 'Fiber internet', 'ADA compliant', 'Ground floor', 'High ceilings (14ft+)', 'Parking 4:1000', 'Freight elevator', 'Drive-thru window']

  return Array.from({ length: count }, (_, i) => {
    const isCommercial = Math.random() < 0.6
    const tType = isCommercial ? pick(commercialTenantTypes) : pick(residentialTenantTypes)
    const market = pickMarket()
    const loc = pickMarketCity(market)

    const minSqft = isCommercial ? randInt(500, 20000) : randInt(500, 1500)
    const maxSqft = isCommercial ? randInt(minSqft, 100000) : randInt(minSqft, 3000)

    // Commercial lease budgets per sqft/yr: $15-$65; residential monthly: $800-$5000
    const leaseBudgetMin = isCommercial
      ? Math.round(minSqft * randInt(15, 35) / 12)
      : randInt(800, 2500)
    const leaseBudgetMax = isCommercial
      ? Math.round(maxSqft * randInt(35, 65) / 12)
      : randInt(leaseBudgetMin, 5000)

    const employeeCount = isCommercial ? randInt(5, 500) : undefined
    const industry = isCommercial ? pick(industries) : undefined
    const companyName = isCommercial
      ? `${pick(companyPrefixes)} ${pick(companySuffixes)}`
      : undefined

    const reqCount = isCommercial ? randInt(0, 3) : 0
    const selectedReqs: string[] = []
    while (selectedReqs.length < reqCount) {
      const r = pick(specialReqs)
      if (!selectedReqs.includes(r)) selectedReqs.push(r)
    }

    const matchedCount = randInt(0, 4)
    const matchedSpaces = Array.from({ length: matchedCount }, (_, j) => {
      const mLoc = pickMarketCity(market)
      return {
        propertyId: `prop-tenant-${i}-${j}`,
        matchScore: randInt(55, 95),
        address: `${randInt(100, 9999)} ${pick(streets)}, ${mLoc.city}`,
        rent: randInt(leaseBudgetMin, leaseBudgetMax),
      }
    })

    const tenant: TenantProfile = {
      id: `tenant-profile-${i}`,
      name: isCommercial
        ? companyName!
        : `${pick(firstNames)} ${pick(lastNames)}`,
      email: `tenant${i}@${isCommercial ? 'business.com' : pick(['gmail.com', 'outlook.com'])}`,
      phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
      company: companyName,
      tenantType: tType,
      spaceRequirements: {
        minSqft,
        maxSqft,
        preferredLayout: isCommercial ? pick(['open-plan', 'partitioned', 'flex', 'warehouse', 'storefront']) : undefined,
      },
      leaseBudget: { min: leaseBudgetMin, max: leaseBudgetMax },
      preferredTerm: isCommercial ? pick(commercialTerms) : pick(residentialTerms),
      moveInDate: new Date(Date.now() + randInt(14, 180) * 86400000).toISOString(),
      industry,
      employeeCount,
      preferredMarkets: [loc.city],
      specialRequirements: selectedReqs.length > 0 ? selectedReqs : undefined,
    }

    return {
      id: `tenant-lead-${i}`,
      tenant,
      leaseStage: pickWeighted(leaseStages, leaseStageWeights),
      matchedSpaces,
      source: pick(sources),
      assignedTo: Math.random() > 0.3 ? `${pick(firstNames)} ${pick(lastNames)}` : undefined,
      notes: [],
      lastContactDate: Math.random() > 0.4 ? new Date(Date.now() - randInt(1, 30) * 86400000).toISOString() : undefined,
      nextFollowUp: Math.random() > 0.5 ? new Date(Date.now() + randInt(1, 14) * 86400000).toISOString() : undefined,
      createdAt: new Date(Date.now() - randInt(1, 90) * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
    }
  })
}

// ==================== 3. generateAgentProfiles ====================

export function generateAgentProfiles(count: number): AgentProfile[] {
  const flBrokerages = ['RE/MAX', 'Keller Williams', 'Coldwell Banker', 'Century 21', 'Marcus & Millichap', 'CBRE', 'Cushman & Wakefield', 'JLL', 'Berkshire Hathaway', 'eXp Realty', 'Compass']
  const prBrokerages = ['Puerto Rico Sotheby\'s', 'Christie\'s PR', 'Engel & Völkers PR', 'RE/MAX', 'Keller Williams', 'Coldwell Banker', 'Century 21', 'Compass']
  const drBrokerages = ['Inmobiliaria Reyes', 'Caribbean Properties', 'Island Real Estate', 'RE/MAX', 'Century 21', 'Coldwell Banker', 'CBRE', 'Cushman & Wakefield']
  const specialties: AgentProfile['specialty'][] = ['residential', 'commercial', 'both']
  const specialtyWeights = [40, 30, 30]

  return Array.from({ length: count }, (_, i) => {
    const licenseState = pickWeighted<AgentProfile['licenseState']>(['FL', 'PR', 'DR'], [50, 25, 25])
    const isLatinMarket = licenseState === 'PR' || licenseState === 'DR'

    const agentFirstName = isLatinMarket ? pick(spanishFirstNames) : pick(firstNames)
    const agentLastName = isLatinMarket ? pick(spanishLastNames) : pick(lastNames)

    const brokerage = licenseState === 'FL'
      ? pick(flBrokerages)
      : licenseState === 'PR'
        ? pick(prBrokerages)
        : pick(drBrokerages)

    const licenseNumber = licenseState === 'FL'
      ? `FL-SL${randInt(1000000, 9999999)}`
      : licenseState === 'PR'
        ? `PR-${randInt(100000, 999999)}`
        : `DR-ADCI-${randInt(10000, 99999)}`

    const territories: string[] = []
    const terrCount = randInt(1, 3)
    const pool = licenseState === 'FL' ? flCities : licenseState === 'PR' ? prCities : drCities
    while (territories.length < terrCount) {
      const c = pick(pool).city
      if (!territories.includes(c)) territories.push(c)
    }

    const dealsClosedLTM = randInt(5, 200)
    const totalVolumeLTM = dealsClosedLTM * randInt(100000, 2500000)

    return {
      id: `agent-${i}`,
      name: `${agentFirstName} ${agentLastName}`,
      email: `${agentFirstName.toLowerCase()}.${agentLastName.toLowerCase()}@${brokerage.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 10)}.com`,
      phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
      brokerage,
      licenseNumber,
      licenseState,
      specialty: pickWeighted(specialties, specialtyWeights),
      territories,
      dealsClosedLTM,
      avgDaysOnMarket: randInt(15, 120),
      totalVolumeLTM: Math.min(totalVolumeLTM, 500000000),
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      coListingAvailable: Math.random() > 0.3,
      referralFeePercent: Math.random() > 0.5 ? randInt(20, 35) : undefined,
    }
  })
}

// ==================== 4. generatePreMarketSignals ====================

interface SignalTemplate {
  label: string
  source: string
  urgency: PreMarketSignal['urgency']
  signalType: Signal['type']
}

const flSignalTemplates: SignalTemplate[] = [
  { label: 'Lis pendens filed', source: 'FL Clerk of Court', urgency: 'imminent', signalType: 'distress' },
  { label: 'Foreclosure auction scheduled', source: 'FL Clerk of Court', urgency: 'imminent', signalType: 'distress' },
  { label: 'Probate filing detected', source: 'FL Circuit Court', urgency: 'near-term', signalType: 'life-event' },
  { label: 'Divorce filing with property', source: 'FL Circuit Court', urgency: 'near-term', signalType: 'life-event' },
  { label: 'Tax delinquent 2+ years', source: 'FL DOR Tax Roll', urgency: 'near-term', signalType: 'distress' },
  { label: 'Condo special assessment >$50K', source: 'HOA Records', urgency: 'near-term', signalType: 'financial' },
  { label: 'Homestead exemption removed', source: 'County Appraiser', urgency: 'imminent', signalType: 'behavioral' },
  { label: 'LLC dissolution filed', source: 'Sunbiz.org', urgency: 'near-term', signalType: 'behavioral' },
  { label: 'Code violations - unsafe structure', source: 'Miami-Dade Code Enforcement', urgency: 'near-term', signalType: 'distress' },
  { label: 'Expired MLS listing', source: 'Stellar MLS', urgency: 'near-term', signalType: 'behavioral' },
  { label: 'Hurricane damage - unrepaired', source: 'FEMA OpenFEMA', urgency: 'medium-term', signalType: 'distress' },
  { label: 'Ownership tenure >20 years', source: 'County Records', urgency: 'medium-term', signalType: 'behavioral' },
  { label: 'Absentee owner - out of state', source: 'FL DOR NAL File', urgency: 'medium-term', signalType: 'behavioral' },
  { label: 'Condo milestone inspection failed', source: 'Building Dept', urgency: 'imminent', signalType: 'distress' },
]

const prSignalTemplates: SignalTemplate[] = [
  { label: 'CRIM tax delinquent', source: 'CRIM/KARIBE', urgency: 'near-term', signalType: 'distress' },
  { label: 'Registro ownership transfer', source: 'Registro de la Propiedad', urgency: 'near-term', signalType: 'life-event' },
  { label: 'OGPE permit completion', source: 'OGPE Portal', urgency: 'medium-term', signalType: 'market' },
  { label: 'Act 60 investor property cycling', source: 'DDEC Records', urgency: 'medium-term', signalType: 'behavioral' },
  { label: 'Hurricane Fiona damage unresolved', source: 'FEMA DR-4671', urgency: 'near-term', signalType: 'distress' },
  { label: 'Vacant property registered', source: 'Municipal Registry', urgency: 'medium-term', signalType: 'behavioral' },
]

const drSignalTemplates: SignalTemplate[] = [
  { label: 'Catastro ownership change', source: 'Catastro Nacional', urgency: 'near-term', signalType: 'life-event' },
  { label: 'DGII tax delinquent', source: 'DGII Portal', urgency: 'near-term', signalType: 'distress' },
  { label: 'CONFOTUR property 10yr mark', source: 'Tourism Ministry', urgency: 'medium-term', signalType: 'financial' },
  { label: 'Zona Franca company exit', source: 'CNZFE Registry', urgency: 'near-term', signalType: 'market' },
  { label: 'Foreign investor liquidating', source: 'Registro de Títulos', urgency: 'near-term', signalType: 'behavioral' },
  { label: 'Tourist zone permit expired', source: 'MOPC', urgency: 'medium-term', signalType: 'market' },
]

export function generatePreMarketSignals(count: number): PreMarketSignal[] {
  return Array.from({ length: count }, (_, i) => {
    const market = pickMarket()
    const templates = market === 'FL' ? flSignalTemplates : market === 'PR' ? prSignalTemplates : drSignalTemplates
    const template = pick(templates)
    const loc = pickMarketCity(market)
    const isLatinMarket = market === 'PR' || market === 'DR'

    const ownerFirst = isLatinMarket ? pick(spanishFirstNames) : pick(firstNames)
    const ownerLast = isLatinMarket ? pick(spanishLastNames) : pick(lastNames)

    // Weight contactedByCount toward low values
    const contactedByCount = pickWeighted(
      [0, 0, 0, 1, 1, 2, 3, randInt(4, 12)],
      [30, 20, 10, 15, 10, 8, 5, 2]
    )

    return {
      id: `pms-${i}`,
      propertyId: `prop-pms-${i}`,
      propertyAddress: `${randInt(100, 9999)} ${pick(streets)}, ${loc.city}, ${loc.state}`,
      ownerName: `${ownerFirst} ${ownerLast}`,
      signalType: template.signalType,
      label: template.label,
      description: `Detected via ${template.source} automated data pipeline`,
      urgency: template.urgency,
      market,
      sourceRegistry: template.source,
      firstDetected: new Date(Date.now() - randInt(1, 60) * 86400000).toISOString(),
      contactedByCount,
      isFirstToSee: contactedByCount === 0,
      propertyValue: randInt(150000, 15000000),
      propertyType: pick(propertyTypes),
      score: randInt(40, 99),
    }
  })
}

// ==================== 5. generateOwnerDossier ====================

export function generateOwnerDossier(): OwnerDossier {
  const isEntity = Math.random() > 0.4
  const isLatinMarket = Math.random() > 0.5
  const ownerFirst = isLatinMarket ? pick(spanishFirstNames) : pick(firstNames)
  const ownerLast = isLatinMarket ? pick(spanishLastNames) : pick(lastNames)

  const propertyCount = randInt(2, 8)
  const properties = Array.from({ length: propertyCount }, (_, i) => {
    const loc = pick(allTargetCities)
    const estimatedValue = randInt(200000, 15000000)
    const equity = Math.round(estimatedValue * (Math.random() * 0.6 + 0.3))
    return {
      id: `dossier-prop-${i}`,
      address: `${randInt(100, 9999)} ${pick(streets)}`,
      city: loc.city,
      state: loc.state,
      country: loc.country as Property['country'],
      zip: `${randInt(10000, 99999)}`,
      propertyType: pick(propertyTypes) as Property['propertyType'],
      sqft: randInt(800, 250000),
      yearBuilt: randInt(1940, 2023),
      estimatedValue,
      occupancyStatus: pick(['Owner-Occupied', 'Tenant-Occupied', 'Vacant', 'Unknown'] as const),
      coordinates: { lat: loc.lat + (Math.random() - 0.5) * 0.1, lng: loc.lng + (Math.random() - 0.5) * 0.1 },
      signals: generateSignals(),
      equity,
      lastContact: Math.random() > 0.5 ? new Date(Date.now() - randInt(1, 90) * 86400000).toISOString() : undefined,
    }
  })

  const totalPortfolioValue = properties.reduce((sum, p) => sum + p.estimatedValue, 0)
  const totalEquity = properties.reduce((sum, p) => sum + p.equity, 0)

  // LLC chain
  const chainDepth = randInt(1, 4)
  const llcChain: LLCChainNode[] = []
  if (chainDepth >= 1) {
    llcChain.push({
      entityName: `${ownerFirst} ${ownerLast}`,
      entityType: 'Individual',
      role: 'Beneficial Owner',
      registrySource: isLatinMarket ? 'Registro de Títulos' : 'FL Sunbiz',
    })
  }
  for (let d = 1; d < chainDepth; d++) {
    const etype = d === chainDepth - 1 ? pick(['LLC', 'Corporation', 'Trust'] as const) : 'LLC'
    llcChain.push({
      entityName: `${pick(lastNames)} ${pick(['Holdings', 'Properties', 'Capital', 'Investments', 'Management'])} ${etype}`,
      entityType: etype,
      role: d === chainDepth - 1 ? 'Property Holder' : 'Intermediate Entity',
      registrySource: isLatinMarket ? pick(['Registro Mercantil', 'DGII', 'Catastro Nacional']) : pick(['FL Sunbiz', 'DE Division of Corps', 'NV SOS']),
    })
  }

  const motivationFactors = []
  const possibleFactors = ['Tax delinquent 3 years', 'Out-of-state owner', 'Portfolio liquidation pattern', 'Inherited via probate', 'Post-hurricane damage', 'Divorce proceedings', 'Code violations accumulating', 'High vacancy rate', 'Balloon payment approaching', 'HOA special assessment', 'Owner aged 75+', 'Failed 1031 exchange deadline']
  const factorCount = randInt(1, 4)
  const used = new Set<string>()
  while (used.size < factorCount) {
    const f = pick(possibleFactors)
    if (!used.has(f)) { used.add(f); motivationFactors.push(f) }
  }

  const outreachCount = randInt(0, 10)
  const outreachTypes = ['call', 'email', 'sms', 'letter', 'linkedin'] as const
  const outcomes = ['No answer', 'Left voicemail', 'Spoke briefly - not interested', 'Requested callback', 'Interested - meeting set', 'Opened email', 'Clicked link', 'Replied - positive', 'Replied - not now', 'Bounced', 'Unsubscribed', 'Connected on LinkedIn']
  const outreachHistory = Array.from({ length: outreachCount }, (_, i) => ({
    type: pick(outreachTypes),
    date: new Date(Date.now() - randInt(1, 365) * 86400000).toISOString(),
    outcome: pick(outcomes),
    sentiment: pick(['positive', 'neutral', 'negative'] as const),
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const owner: Owner = {
    id: `dossier-owner`,
    name: isEntity ? `${ownerLast} ${pick(entityNames)}` : `${ownerFirst} ${ownerLast}`,
    entityType: isEntity ? pick(['LLC', 'Corporation', 'Trust', 'Partnership'] as const) : 'Individual',
    email: `contact@${ownerLast.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
    portfolioSize: propertyCount,
    totalEquity,
    ownershipTenure: randInt(1, 30),
    outOfState: Math.random() > 0.5,
    beneficialOwner: isEntity ? `${ownerFirst} ${ownerLast}` : undefined,
  }

  return {
    owner,
    properties,
    llcChain,
    motivationScore: randInt(30, 95),
    motivationFactors,
    outreachHistory,
    competitorContacts: randInt(0, 8),
    totalPortfolioValue,
    totalEquity,
    ownerSince: new Date(Date.now() - randInt(365, 10950) * 86400000).toISOString(),
  }
}

// ==================== 6. generateBuyerSignals ====================

export function generateBuyerSignals(): BuyerSignal[] {
  const now = new Date()
  const recentDate = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString()

  return [
    {
      id: 'bs-1',
      type: 'hmda',
      title: 'HMDA Pre-Approvals',
      description: 'New mortgage pre-approvals in target markets',
      market: 'Miami-Dade, FL',
      count: 847,
      trend: 'up',
      trendPercent: 12,
      lastUpdated: recentDate(randInt(0, 2)),
    },
    {
      id: 'bs-2',
      type: 'linkedin-jobs',
      title: 'Corporate Expansion',
      description: 'Companies posting 50+ roles in Florida',
      market: 'South Florida',
      count: 23,
      trend: 'up',
      trendPercent: 34,
      lastUpdated: recentDate(randInt(0, 2)),
    },
    {
      id: 'bs-3',
      type: 'military-pcs',
      title: 'Military PCS Orders',
      description: 'Incoming PCS orders to FL/PR bases',
      market: 'MacDill AFB / Ft Buchanan',
      count: 156,
      trend: 'stable',
      trendPercent: 2,
      lastUpdated: recentDate(randInt(0, 3)),
    },
    {
      id: 'bs-4',
      type: 'sba-loan',
      title: 'SBA Loan Applications',
      description: 'New SBA 504/7(a) applications for RE',
      market: 'Florida',
      count: 34,
      trend: 'up',
      trendPercent: 8,
      lastUpdated: recentDate(randInt(0, 2)),
    },
    {
      id: 'bs-5',
      type: 'franchise',
      title: 'Franchise Expansion',
      description: 'New franchise FDDs targeting market',
      market: 'FL + PR',
      count: 12,
      trend: 'up',
      trendPercent: 45,
      lastUpdated: recentDate(randInt(0, 3)),
    },
    {
      id: 'bs-6',
      type: '1031-exchange',
      title: '1031 Exchange Buyers',
      description: 'Active 1031 buyers with 45-day deadline',
      market: 'All Markets',
      count: 28,
      trend: 'up',
      trendPercent: 15,
      lastUpdated: recentDate(randInt(0, 2)),
    },
    {
      id: 'bs-7',
      type: 'corporate-relocation',
      title: 'Corporate Relocations',
      description: 'Companies relocating employees to market',
      market: 'South FL + PR',
      count: 89,
      trend: 'up',
      trendPercent: 22,
      lastUpdated: recentDate(randInt(0, 2)),
    },
  ]
}

// ==================== 7. generateTerritories ====================

export function generateTerritories(): Territory[] {
  const flTerritories = [
    { name: 'Miami-Dade', region: 'South Florida' },
    { name: 'Broward', region: 'South Florida' },
    { name: 'Palm Beach', region: 'South Florida' },
    { name: 'Orange', region: 'Central Florida' },
    { name: 'Hillsborough', region: 'Tampa Bay' },
    { name: 'Duval', region: 'Northeast Florida' },
    { name: 'Pinellas', region: 'Tampa Bay' },
    { name: 'Lee', region: 'Southwest Florida' },
    { name: 'Collier', region: 'Southwest Florida' },
    { name: 'Sarasota', region: 'Southwest Florida' },
  ]

  const prTerritories = [
    { name: 'San Juan', region: 'Metro San Juan' },
    { name: 'Guaynabo', region: 'Metro San Juan' },
    { name: 'Bayamón', region: 'Metro San Juan' },
    { name: 'Carolina', region: 'Metro San Juan' },
    { name: 'Dorado', region: 'North Coast' },
    { name: 'Condado', region: 'Metro San Juan' },
  ]

  const drTerritories = [
    { name: 'Santo Domingo', region: 'Distrito Nacional' },
    { name: 'La Altagracia (Punta Cana)', region: 'East Coast' },
    { name: 'Santiago', region: 'Cibao' },
    { name: 'Puerto Plata', region: 'North Coast' },
    { name: 'La Romana', region: 'East Coast' },
    { name: 'Samaná', region: 'Northeast' },
  ]

  const competitionLevels: Territory['competitionLevel'][] = ['low', 'medium', 'high']

  let idx = 0

  const buildTerritory = (t: { name: string; region: string }, market: 'FL' | 'PR' | 'DR', sizeMultiplier: number): Territory => {
    const signalCount = randInt(Math.round(50 * sizeMultiplier), Math.round(500 * sizeMultiplier))
    const activeLeads = randInt(Math.round(20 * sizeMultiplier), Math.round(200 * sizeMultiplier))
    const hotLeads = randInt(Math.round(5 * sizeMultiplier), Math.min(50, activeLeads))
    const agentsActive = randInt(Math.round(3 * sizeMultiplier), Math.round(30 * sizeMultiplier))
    const competition = sizeMultiplier > 0.8
      ? pickWeighted(competitionLevels, [10, 30, 60])
      : sizeMultiplier > 0.5
        ? pickWeighted(competitionLevels, [20, 50, 30])
        : pickWeighted(competitionLevels, [50, 35, 15])

    return {
      id: `territory-${idx++}`,
      name: t.name,
      market,
      region: t.region,
      signalCount,
      activeLeads,
      hotLeads,
      agentsActive,
      competitionLevel: competition,
      assignedTo: Math.random() > 0.4 ? `${pick(firstNames)} ${pick(lastNames)}` : undefined,
      lastActivity: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
    }
  }

  // FL territories - size multipliers based on market size
  const flSizes = [1.0, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.55, 0.6, 0.5]
  const flResults = flTerritories.map((t, i) => buildTerritory(t, 'FL', flSizes[i]))

  // PR territories - generally smaller
  const prSizes = [0.7, 0.5, 0.55, 0.45, 0.4, 0.5]
  const prResults = prTerritories.map((t, i) => buildTerritory(t, 'PR', prSizes[i]))

  // DR territories - mixed sizes
  const drSizes = [0.65, 0.7, 0.45, 0.4, 0.45, 0.3]
  const drResults = drTerritories.map((t, i) => buildTerritory(t, 'DR', drSizes[i]))

  return [...flResults, ...prResults, ...drResults]
}

