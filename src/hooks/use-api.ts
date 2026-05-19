"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import type {
  Lead,
  BuyerLead,
  TenantLead,
  AgentProfile,
  CoListingProposal,
  Territory,
  PreMarketSignal,
  OwnerDossier,
  DashboardStats,
  OutreachCampaign,
} from '@/types'

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `API error: ${res.status}`)
  }
  return res.json()
}

function buildUrl(base: string, params?: Record<string, string | undefined | null>) {
  const url = new URL(base, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    }
  }
  return url.toString()
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

interface PaginatedResponse<T> {
  data: T[]
  meta: { page: number; limit: number; total: number }
}

interface SingleResponse<T> {
  data: T
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export function useLeads(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<Lead>>({
    queryKey: ['leads', filters],
    queryFn: () => fetchAPI(buildUrl('/api/leads', filters)),
  })
}

export function useLead(id: string, options?: Partial<UseQueryOptions<SingleResponse<Lead>>>) {
  return useQuery<SingleResponse<Lead>>({
    queryKey: ['leads', id],
    queryFn: () => fetchAPI(`/api/leads/${id}`),
    enabled: !!id,
    ...options,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Lead>) =>
      fetchAPI<SingleResponse<Lead>>('/api/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Lead>) =>
      fetchAPI<SingleResponse<Lead>>(`/api/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetchAPI<SingleResponse<{ id: string; status: string }>>(`/api/leads/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Signals
// ---------------------------------------------------------------------------

export function useSignals(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<PreMarketSignal>>({
    queryKey: ['signals', filters],
    queryFn: () => fetchAPI(buildUrl('/api/signals', filters)),
  })
}

export function useSignal(id: string) {
  return useQuery<SingleResponse<PreMarketSignal & { owner?: unknown; property?: unknown }>>({
    queryKey: ['signals', id],
    queryFn: () => fetchAPI(`/api/signals/${id}`),
    enabled: !!id,
  })
}

export function useOwnerDossier(signalId: string) {
  return useQuery<SingleResponse<OwnerDossier>>({
    queryKey: ['dossier', signalId],
    queryFn: () => fetchAPI(`/api/signals/${signalId}/dossier`),
    enabled: !!signalId,
  })
}

// ---------------------------------------------------------------------------
// Buyers
// ---------------------------------------------------------------------------

export function useBuyerLeads(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<BuyerLead>>({
    queryKey: ['buyers', filters],
    queryFn: () => fetchAPI(buildUrl('/api/buyers', filters)),
  })
}

export function useBuyerLead(id: string) {
  return useQuery<SingleResponse<BuyerLead>>({
    queryKey: ['buyers', id],
    queryFn: () => fetchAPI(`/api/buyers/${id}`),
    enabled: !!id,
  })
}

export function useCreateBuyerLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<BuyerLead>) =>
      fetchAPI<SingleResponse<BuyerLead>>('/api/buyers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
  })
}

export function useUpdateBuyerLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<BuyerLead>) =>
      fetchAPI<SingleResponse<BuyerLead>>(`/api/buyers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buyers', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Tenants
// ---------------------------------------------------------------------------

export function useTenantLeads(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<TenantLead>>({
    queryKey: ['tenants', filters],
    queryFn: () => fetchAPI(buildUrl('/api/tenants', filters)),
  })
}

export function useTenantLead(id: string) {
  return useQuery<SingleResponse<TenantLead>>({
    queryKey: ['tenants', id],
    queryFn: () => fetchAPI(`/api/tenants/${id}`),
    enabled: !!id,
  })
}

export function useCreateTenantLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<TenantLead>) =>
      fetchAPI<SingleResponse<TenantLead>>('/api/tenants', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}

export function useUpdateTenantLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<TenantLead>) =>
      fetchAPI<SingleResponse<TenantLead>>(`/api/tenants/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export function useAgents(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<AgentProfile>>({
    queryKey: ['agents', filters],
    queryFn: () => fetchAPI(buildUrl('/api/agents', filters)),
  })
}

export function useCoListingProposals(filters?: Record<string, string>) {
  return useQuery<PaginatedResponse<CoListingProposal>>({
    queryKey: ['co-listing', filters],
    queryFn: () => fetchAPI(buildUrl('/api/agents/co-listing', filters)),
  })
}

export function useCreateCoListingProposal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CoListingProposal>) =>
      fetchAPI<SingleResponse<CoListingProposal>>('/api/agents/co-listing', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-listing'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Territory
// ---------------------------------------------------------------------------

export function useTerritories(market?: string) {
  return useQuery<{ data: Territory[] }>({
    queryKey: ['territories', market],
    queryFn: () => fetchAPI(buildUrl('/api/territory', market ? { market } : undefined)),
  })
}

export function useClaimTerritory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { territoryId: string; assignedTo: string }) =>
      fetchAPI<SingleResponse<Territory>>('/api/territory', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['territories'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function useGlobalSearch(query: string, type?: string) {
  return useQuery<{ data: Array<{ id: string; type: string; title: string; subtitle: string; score?: number; status?: string; market?: string }>; meta: { total: number } }>({
    queryKey: ['search', query, type],
    queryFn: () => fetchAPI(buildUrl('/api/search', { q: query, type })),
    enabled: !!query && query.length >= 2,
  })
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export function useDashboardStats() {
  return useQuery<SingleResponse<DashboardStats>>({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchAPI('/api/dashboard/stats'),
  })
}

// ---------------------------------------------------------------------------
// Enrichment (mutations)
// ---------------------------------------------------------------------------

export function useEnrichProperty() {
  return useMutation({
    mutationFn: (data: { address?: string; propertyId?: string }) =>
      fetchAPI<SingleResponse<Record<string, unknown>>>('/api/enrichment/property', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useSkipTrace() {
  return useMutation({
    mutationFn: (data: { name?: string; address?: string; ownerId?: string }) =>
      fetchAPI<SingleResponse<Record<string, unknown>>>('/api/enrichment/owner', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useLLCUnwrap() {
  return useMutation({
    mutationFn: (data: { entityName: string; state?: string }) =>
      fetchAPI<SingleResponse<Record<string, unknown>>>('/api/enrichment/llc', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export function useCampaigns(filters?: Record<string, string>) {
  return useQuery<{ data: OutreachCampaign[] }>({
    queryKey: ['campaigns', filters],
    queryFn: () => fetchAPI(buildUrl('/api/outreach/campaigns', filters)),
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; type: string; totalRecipients?: number }) =>
      fetchAPI<SingleResponse<OutreachCampaign>>('/api/outreach/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; status?: string; name?: string }) =>
      fetchAPI<SingleResponse<OutreachCampaign>>('/api/outreach/campaigns', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
