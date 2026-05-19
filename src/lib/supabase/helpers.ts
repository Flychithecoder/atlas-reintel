import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// ---------------------------------------------------------------------------
// Configuration check
// ---------------------------------------------------------------------------

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Compute the range start/end values to pass to Supabase `.range()`.
 */
export function getPaginationRange(params: PaginationParams = {}): {
  from: number
  to: number
  page: number
  pageSize: number
} {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 25))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { from, to, page, pageSize }
}

/**
 * Build a PaginatedResult from Supabase response data.
 */
export function buildPaginatedResult<T>(
  data: T[],
  count: number | null,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const total = count ?? 0
  return {
    data,
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  }
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Apply an order clause to a Supabase query builder.
 */
export function applySorting<T extends keyof Database['public']['Tables']>(
  query: ReturnType<SupabaseClient<Database>['from']>,
  _table: T,
  params: SortParams = {}
) {
  const column = params.sortBy ?? 'created_at'
  const ascending = (params.sortOrder ?? 'desc') === 'asc'
  return query.order(column, { ascending })
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'

export interface FilterParam {
  column: string
  operator: FilterOperator
  value: unknown
}

/**
 * Apply an array of filters to a Supabase query builder.
 */
export function applyFilters(
  query: ReturnType<SupabaseClient<Database>['from']>,
  filters: FilterParam[]
) {
  let q = query
  for (const f of filters) {
    switch (f.operator) {
      case 'eq':
        q = q.eq(f.column, f.value) as typeof q
        break
      case 'neq':
        q = q.neq(f.column, f.value) as typeof q
        break
      case 'gt':
        q = q.gt(f.column, f.value) as typeof q
        break
      case 'gte':
        q = q.gte(f.column, f.value) as typeof q
        break
      case 'lt':
        q = q.lt(f.column, f.value) as typeof q
        break
      case 'lte':
        q = q.lte(f.column, f.value) as typeof q
        break
      case 'like':
        q = q.like(f.column, f.value as string) as typeof q
        break
      case 'ilike':
        q = q.ilike(f.column, f.value as string) as typeof q
        break
      case 'in':
        q = q.in(f.column, f.value as unknown[]) as typeof q
        break
      case 'is':
        q = q.is(f.column, f.value as null | boolean) as typeof q
        break
    }
  }
  return q
}

// ---------------------------------------------------------------------------
// Text search helper
// ---------------------------------------------------------------------------

/**
 * Build an ilike pattern for basic text search.
 * Wraps the term with `%` wildcards.
 */
export function searchPattern(term: string): string {
  const sanitized = term.replace(/%/g, '').trim()
  return `%${sanitized}%`
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

export interface QueryResult<T> {
  data: T | null
  error: string | null
}

/**
 * Wrap a Supabase query to normalize the result into {data, error}.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>
): Promise<QueryResult<T>> {
  try {
    const { data, error } = await queryFn()
    if (error) {
      return { data: null, error: error.message }
    }
    return { data, error: null }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred'
    return { data: null, error: message }
  }
}
