"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  MAPBOX_STYLE,
  DEFAULT_CENTERS,
  MARKET_COLORS,
  isMapboxConfigured,
} from '@/lib/mapbox/config'

interface TerritoryData {
  id: string
  name: string
  market: 'FL' | 'PR' | 'DR'
  signalCount: number
  activeLeads: number
  competitionLevel: 'low' | 'medium' | 'high'
  assigned: boolean
  bounds: [number, number, number, number] // [west, south, east, north]
}

interface TerritoryMapProps {
  territories: TerritoryData[]
  activeMarket?: 'all' | 'fl' | 'pr' | 'dr'
  onTerritoryClick?: (id: string) => void
  className?: string
}

const COMPETITION_OPACITY: Record<string, number> = {
  low: 0.25,
  medium: 0.45,
  high: 0.65,
}

// ---- Approximate bounding boxes for key territories ----

export const TERRITORY_PRESETS: Record<
  string,
  { name: string; market: 'FL' | 'PR' | 'DR'; bounds: [number, number, number, number] }
> = {
  // Florida
  'fl-miami-dade': { name: 'Miami-Dade', market: 'FL', bounds: [-80.87, 25.14, -80.1, 25.97] },
  'fl-broward': { name: 'Broward', market: 'FL', bounds: [-80.88, 25.96, -80.07, 26.39] },
  'fl-palm-beach': { name: 'Palm Beach', market: 'FL', bounds: [-80.88, 26.32, -80.03, 26.97] },
  'fl-orange': { name: 'Orange', market: 'FL', bounds: [-81.66, 28.34, -80.95, 28.79] },
  'fl-hillsborough': { name: 'Hillsborough', market: 'FL', bounds: [-82.82, 27.57, -82.05, 28.17] },
  // Puerto Rico
  'pr-san-juan': { name: 'San Juan', market: 'PR', bounds: [-66.15, 18.33, -65.99, 18.48] },
  'pr-bayamon': { name: 'Bayamon', market: 'PR', bounds: [-66.19, 18.32, -66.1, 18.41] },
  'pr-carolina': { name: 'Carolina', market: 'PR', bounds: [-65.98, 18.33, -65.87, 18.43] },
  'pr-ponce': { name: 'Ponce', market: 'PR', bounds: [-66.68, 17.97, -66.56, 18.08] },
  // DR
  'dr-distrito-nacional': { name: 'Distrito Nacional', market: 'DR', bounds: [-69.99, 18.44, -69.85, 18.52] },
  'dr-santo-domingo': { name: 'Santo Domingo', market: 'DR', bounds: [-70.1, 18.38, -69.73, 18.56] },
  'dr-la-altagracia': { name: 'La Altagracia', market: 'DR', bounds: [-68.9, 18.25, -68.25, 18.78] },
  'dr-puerto-plata': { name: 'Puerto Plata', market: 'DR', bounds: [-71.1, 19.55, -70.4, 19.92] },
}

// ---- Fallback (no Mapbox token) ----

function TerritoryFallback({
  territories,
  onTerritoryClick,
  className,
}: Omit<TerritoryMapProps, 'activeMarket'>) {
  const bounds = { minLat: 17, maxLat: 30, minLng: -83, maxLng: -65 }

  const scaleX = (lng: number) =>
    ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
  const scaleY = (lat: number) =>
    ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-700',
        className
      )}
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c4a6e 70%, #134e4a 100%)',
        minHeight: 400,
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Territory rectangles */}
      {territories.map((t) => {
        const [west, south, east, north] = t.bounds
        const left = scaleX(west)
        const top = scaleY(north)
        const width = scaleX(east) - left
        const height = scaleY(south) - top
        const color = MARKET_COLORS[t.market]
        const opacity = t.assigned ? COMPETITION_OPACITY[t.competitionLevel] : 0.12

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTerritoryClick?.(t.id)}
            className="group absolute z-10 flex items-center justify-center transition-opacity hover:opacity-100"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
              backgroundColor: color,
              opacity,
              border: `1px solid ${color}`,
              borderRadius: 4,
            }}
            title={t.name}
          >
            <span className="hidden text-[10px] font-semibold text-white drop-shadow group-hover:block">
              {t.name}
            </span>
          </button>
        )
      })}

      {/* Token notice */}
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="rounded-full bg-gray-900/70 px-4 py-1.5 text-xs text-gray-400 backdrop-blur">
          Add MAPBOX_TOKEN to enable interactive maps
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Competition
        </p>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{
                backgroundColor: '#3b82f6',
                opacity: COMPETITION_OPACITY[level],
              }}
            />
            <span className="text-xs capitalize text-gray-300">{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Main map (Mapbox GL) ----

export function TerritoryMap({
  territories,
  activeMarket = 'all',
  onTerritoryClick,
  className,
}: TerritoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryData | null>(null)

  if (!isMapboxConfigured()) {
    return (
      <TerritoryFallback
        territories={territories}
        onTerritoryClick={onTerritoryClick}
        className={className}
      />
    )
  }

  /* eslint-disable react-hooks/rules-of-hooks */

  // Convert territories to GeoJSON polygons
  function territoriesToGeoJSON(
    data: TerritoryData[]
  ): GeoJSON.FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: data.map((t) => {
        const [w, s, e, n] = t.bounds
        return {
          type: 'Feature' as const,
          properties: {
            id: t.id,
            name: t.name,
            market: t.market,
            signalCount: t.signalCount,
            activeLeads: t.activeLeads,
            competitionLevel: t.competitionLevel,
            assigned: t.assigned,
            fillColor: MARKET_COLORS[t.market],
            fillOpacity: t.assigned
              ? COMPETITION_OPACITY[t.competitionLevel]
              : 0.1,
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [w, s],
                [e, s],
                [e, n],
                [w, n],
                [w, s],
              ],
            ],
          },
        }
      }),
    }
  }

  // -- Initialize map --
  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false
    let map: mapboxgl.Map | null = null

    import('mapbox-gl').then((mapboxgl) => {
      if (cancelled || !containerRef.current) return
      import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.default.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      const center = DEFAULT_CENTERS[activeMarket]

      map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        center: [center.lng, center.lat],
        zoom: center.zoom,
      })

      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right')

      map.on('load', () => {
        if (cancelled || !map) return
        mapRef.current = map
        setMapLoaded(true)
      })
    })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
      setMapLoaded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -- Update territory data --
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    const geojson = territoriesToGeoJSON(territories)

    if (map.getSource('territories')) {
      ;(map.getSource('territories') as mapboxgl.GeoJSONSource).setData(geojson)
    } else {
      map.addSource('territories', { type: 'geojson', data: geojson })

      // Fill layer
      map.addLayer({
        id: 'territory-fill',
        type: 'fill',
        source: 'territories',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': ['get', 'fillOpacity'],
        },
      })

      // Border layer
      map.addLayer({
        id: 'territory-border',
        type: 'line',
        source: 'territories',
        paint: {
          'line-color': ['get', 'fillColor'],
          'line-width': 2,
          'line-opacity': 0.7,
        },
      })

      // Name labels
      map.addLayer({
        id: 'territory-label',
        type: 'symbol',
        source: 'territories',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      })

      // Click handler
      map.on('click', 'territory-fill', (e) => {
        const f = e.features?.[0]
        if (!f) return
        const props = f.properties ?? {}
        const tid = props.id as string

        const territory = territories.find((t) => t.id === tid)
        if (territory) setSelectedTerritory(territory)
        onTerritoryClick?.(tid)
      })

      map.on('mouseenter', 'territory-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'territory-fill', () => {
        map.getCanvas().style.cursor = ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [territories, mapLoaded])

  // -- Fly to market --
  const flyToMarket = useCallback(
    (market: 'all' | 'fl' | 'pr' | 'dr') => {
      const map = mapRef.current
      if (!map) return
      const c = DEFAULT_CENTERS[market]
      map.flyTo({ center: [c.lng, c.lat], zoom: c.zoom, duration: 1200 })
    },
    []
  )

  useEffect(() => {
    flyToMarket(activeMarket)
  }, [activeMarket, flyToMarket])

  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="h-full w-full rounded-xl" style={{ minHeight: 400 }} />

      {/* Market tabs */}
      <div className="absolute left-3 top-3 z-10 flex gap-1 rounded-lg bg-gray-900/80 p-1 backdrop-blur">
        {(['all', 'fl', 'pr', 'dr'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => flyToMarket(m)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              activeMarket === m
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            )}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Selected territory detail panel */}
      {selectedTerritory && (
        <div className="absolute bottom-3 right-3 z-10 w-64 rounded-lg bg-gray-900/90 p-3 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">
              {selectedTerritory.name}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedTerritory(null)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              x
            </button>
          </div>
          <div className="space-y-1 text-xs text-gray-300">
            <p>
              <span className="text-gray-500">Market:</span>{' '}
              {selectedTerritory.market}
            </p>
            <p>
              <span className="text-gray-500">Signals:</span>{' '}
              {selectedTerritory.signalCount}
            </p>
            <p>
              <span className="text-gray-500">Active Leads:</span>{' '}
              {selectedTerritory.activeLeads}
            </p>
            <p>
              <span className="text-gray-500">Competition:</span>{' '}
              <span
                className={cn(
                  'capitalize',
                  selectedTerritory.competitionLevel === 'low' && 'text-green-400',
                  selectedTerritory.competitionLevel === 'medium' && 'text-yellow-400',
                  selectedTerritory.competitionLevel === 'high' && 'text-red-400'
                )}
              >
                {selectedTerritory.competitionLevel}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Status:</span>{' '}
              {selectedTerritory.assigned ? 'Assigned' : 'Unclaimed'}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Competition
        </p>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{
                backgroundColor: '#3b82f6',
                opacity: COMPETITION_OPACITY[level],
              }}
            />
            <span className="text-xs capitalize text-gray-300">{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
