export interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  propertyType: 'SFR' | 'Multi-Family' | 'Commercial' | 'Industrial' | 'Land' | 'Mixed-Use' | 'Office' | 'Retail'
  bedrooms?: number
  bathrooms?: number
  sqft: number
  lotSize?: number
  yearBuilt: number
  estimatedValue: number
  lastSalePrice?: number
  lastSaleDate?: string
  taxAssessedValue?: number
  monthlyRent?: number
  occupancyStatus: 'Owner-Occupied' | 'Tenant-Occupied' | 'Vacant' | 'Unknown'
  country?: 'US' | 'DO' | 'PR'
  coordinates: { lat: number; lng: number }
  imageUrl?: string
  zoning?: string
}

export interface Owner {
  id: string
  name: string
  entityType: 'Individual' | 'LLC' | 'Corporation' | 'Trust' | 'Partnership'
  email?: string
  phone?: string
  mailingAddress?: string
  portfolioSize: number
  totalEquity: number
  ownershipTenure: number // years
  outOfState: boolean
  beneficialOwner?: string // unwrapped LLC
}

export interface Lead {
  id: string
  property: Property
  owner: Owner
  score: number
  scoreLabel: 'Hot' | 'Warm' | 'Cold'
  signals: Signal[]
  status: 'New' | 'Contacted' | 'Responded' | 'Meeting' | 'Negotiating' | 'Under Contract' | 'Closed' | 'Dead'
  assignedTo?: string
  lastContactDate?: string
  nextFollowUp?: string
  notes: string[]
  createdAt: string
  updatedAt: string
  source: string
}

export interface Signal {
  type: 'distress' | 'life-event' | 'financial' | 'behavioral' | 'market'
  label: string
  description: string
  severity: 'high' | 'medium' | 'low'
  detectedAt: string
  source: string
}

export interface OutreachCampaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'voice' | 'direct-mail' | 'linkedin'
  status: 'draft' | 'active' | 'paused' | 'completed'
  totalRecipients: number
  sent: number
  opened: number
  replied: number
  meetings: number
  createdAt: string
}

export interface DashboardStats {
  totalLeads: number
  hotLeads: number
  warmLeads: number
  coldLeads: number
  leadsContactedToday: number
  meetingsScheduled: number
  dealsInPipeline: number
  pipelineValue: number
  conversionRate: number
  avgResponseRate: number
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProperties: number
  totalLeads: number
  monthlyRevenue: number
  mrr: number
  arr: number
  churnRate: number
  apiCalls: number
  dataFreshness: string
  systemUptime: number
  avgResponseTime: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'team_lead' | 'enterprise'
  plan: 'free' | 'starter' | 'pro' | 'pro_cre' | 'team' | 'enterprise'
  company?: string
  territories: string[]
  leadsViewed: number
  enrichmentsUsed: number
  enrichmentsLimit: number
  outreachSent: number
  createdAt: string
  lastActive: string
  status: 'active' | 'inactive' | 'suspended' | 'trial'
  avatar?: string
}

export interface SearchFilters {
  propertyTypes: string[]
  priceMin?: number
  priceMax?: number
  sqftMin?: number
  sqftMax?: number
  yearBuiltMin?: number
  yearBuiltMax?: number
  scoreMin?: number
  ownerType?: string[]
  signals?: string[]
  occupancy?: string[]
  location?: string
  radius?: number
  market?: 'all' | 'us' | 'pr' | 'do'
  sortBy: 'score' | 'value' | 'equity' | 'date'
  sortOrder: 'asc' | 'desc'
}

export interface DataPipeline {
  id: string
  name: string
  source: string
  type: 'scraper' | 'api' | 'file-upload' | 'webhook'
  status: 'running' | 'completed' | 'failed' | 'scheduled' | 'paused'
  lastRun: string
  nextRun?: string
  recordsProcessed: number
  recordsFailed: number
  avgDuration: string
  schedule: string
}

export interface VoiceCall {
  id: string
  leadId: string
  leadName: string
  phone: string
  duration: number
  status: 'completed' | 'no-answer' | 'voicemail' | 'busy' | 'failed'
  sentiment: 'positive' | 'neutral' | 'negative'
  outcome: 'meeting-booked' | 'callback' | 'not-interested' | 'wrong-number' | 'dnc'
  transcript?: string
  recordingUrl?: string
  calledAt: string
}

// === BUYER LEADS ===

export interface BuyerProfile {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  buyerType: 'individual' | 'investor' | 'corporation' | 'reit' | '1031-exchange' | 'first-time'
  budget: { min: number; max: number }
  propertyTypes: Property['propertyType'][]
  preferredMarkets: string[]
  preApprovalStatus: 'none' | 'pre-qualified' | 'pre-approved' | 'cash-buyer' | 'hard-money'
  preApprovalAmount?: number
  lender?: string
  timeline: 'immediate' | '1-3months' | '3-6months' | '6-12months' | 'flexible'
  investmentCriteria?: {
    targetCapRate?: number
    targetCashOnCash?: number
    targetIRR?: number
    holdPeriod?: string
  }
}

export interface BuyerLead {
  id: string
  buyer: BuyerProfile
  qualificationStage: 'new' | 'contacted' | 'qualified' | 'matched' | 'showing' | 'offer' | 'under-contract' | 'closed' | 'lost'
  matchedProperties: { propertyId: string; matchScore: number; address: string; value: number }[]
  source: string
  assignedTo?: string
  notes: string[]
  lastContactDate?: string
  nextFollowUp?: string
  createdAt: string
  updatedAt: string
}

// === TENANT LEADS ===

export interface TenantProfile {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tenantType: 'commercial' | 'residential' | 'industrial' | 'retail' | 'restaurant' | 'office'
  spaceRequirements: {
    minSqft: number
    maxSqft: number
    preferredLayout?: string
  }
  leaseBudget: { min: number; max: number }
  preferredTerm: '1yr' | '2yr' | '3yr' | '5yr' | '10yr' | 'flexible'
  moveInDate?: string
  industry?: string
  employeeCount?: number
  preferredMarkets: string[]
  specialRequirements?: string[]
}

export interface TenantLead {
  id: string
  tenant: TenantProfile
  leaseStage: 'new' | 'contacted' | 'qualified' | 'touring' | 'proposal' | 'negotiating' | 'lease-signed' | 'lost'
  matchedSpaces: { propertyId: string; matchScore: number; address: string; rent: number }[]
  source: string
  assignedTo?: string
  notes: string[]
  lastContactDate?: string
  nextFollowUp?: string
  createdAt: string
  updatedAt: string
}

// === AGENT NETWORK ===

export interface AgentProfile {
  id: string
  name: string
  email: string
  phone?: string
  brokerage: string
  licenseNumber: string
  licenseState: 'FL' | 'PR' | 'DR'
  specialty: 'residential' | 'commercial' | 'both'
  territories: string[]
  dealsClosedLTM: number
  avgDaysOnMarket: number
  totalVolumeLTM: number
  rating: number
  avatar?: string
  coListingAvailable: boolean
  referralFeePercent?: number
}

export interface CoListingProposal {
  id: string
  propertyId: string
  propertyAddress: string
  proposingAgent: AgentProfile
  receivingAgentId: string
  commissionSplit: string
  territory: string
  terms: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
}

// === TERRITORY ===

export interface Territory {
  id: string
  name: string
  market: 'FL' | 'PR' | 'DR'
  region: string
  signalCount: number
  activeLeads: number
  hotLeads: number
  agentsActive: number
  competitionLevel: 'low' | 'medium' | 'high'
  assignedTo?: string
  lastActivity: string
}

// === PRE-MARKET SIGNALS ===

export interface PreMarketSignal {
  id: string
  propertyId: string
  propertyAddress: string
  ownerName: string
  signalType: Signal['type']
  label: string
  description: string
  urgency: 'imminent' | 'near-term' | 'medium-term'
  market: 'FL' | 'PR' | 'DR'
  sourceRegistry: string
  firstDetected: string
  contactedByCount: number
  isFirstToSee: boolean
  propertyValue: number
  propertyType: Property['propertyType']
  score: number
}

// === OWNER DOSSIER ===

export interface LLCChainNode {
  entityName: string
  entityType: 'Individual' | 'LLC' | 'Corporation' | 'Trust'
  role: string
  registrySource: string
}

export interface OwnerDossier {
  owner: Owner
  properties: (Property & { signals: Signal[]; equity: number; lastContact?: string })[]
  llcChain: LLCChainNode[]
  motivationScore: number
  motivationFactors: string[]
  outreachHistory: {
    type: 'call' | 'email' | 'sms' | 'letter' | 'linkedin'
    date: string
    outcome: string
    sentiment?: 'positive' | 'neutral' | 'negative'
  }[]
  competitorContacts: number
  totalPortfolioValue: number
  totalEquity: number
  ownerSince: string
}

// === LISTING PITCH ===

export interface ListingPitch {
  id: string
  propertyId: string
  language: 'en' | 'es'
  style: 'market-expert' | 'data-driven' | 'relationship-first'
  content: {
    headline: string
    valueProposition: string
    marketAnalysis: string
    comparables: { address: string; soldPrice: number; soldDate: string; similarity: number }[]
    suggestedListPrice: number
    projectedDOM: number
  }
  generatedAt: string
}

// === BUYER SIGNALS ===

export interface BuyerSignal {
  id: string
  type: 'hmda' | 'linkedin-jobs' | 'sba-loan' | 'franchise' | 'military-pcs' | '1031-exchange' | 'corporate-relocation'
  title: string
  description: string
  market: string
  count: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  lastUpdated: string
}
