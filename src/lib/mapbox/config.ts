export const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v11'

export const DEFAULT_CENTERS = {
  all: { lng: -74.0, lat: 22.0, zoom: 5 },
  fl: { lng: -81.5, lat: 27.6, zoom: 6.5 },
  pr: { lng: -66.5, lat: 18.2, zoom: 9 },
  dr: { lng: -70.0, lat: 18.9, zoom: 8 },
} as const

export function isMapboxConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN
}

export const MARKET_COLORS = {
  FL: '#3b82f6', // blue
  PR: '#10b981', // green
  DR: '#f59e0b', // amber
} as const

export const URGENCY_COLORS = {
  imminent: '#ef4444',
  'near-term': '#f97316',
  'medium-term': '#eab308',
} as const
