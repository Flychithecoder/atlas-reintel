"use client"

import { useState, useEffect } from 'react'
import type { Lead } from '@/types'
import { generateLeads } from '@/lib/mock-generators'

export {
  generateLeads,
  generateDashboardStats,
  generateAdminStats,
  generateUsers,
  generateCampaigns,
  generatePipelines,
  generateVoiceCalls,
  generateBuyerLeads,
  generateTenantLeads,
  generateAgentProfiles,
  generatePreMarketSignals,
  generateOwnerDossier,
  generateBuyerSignals,
  generateTerritories,
} from '@/lib/mock-generators'

export type { DataPipelineExtended, PipelineMarket } from '@/lib/mock-generators'

export function useMockLeads(count = 50) {
  const [leads, setLeads] = useState<Lead[]>([])
  useEffect(() => { setLeads(generateLeads(count)) }, [count])
  return leads
}
