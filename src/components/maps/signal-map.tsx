"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  MAPBOX_STYLE,
  DEFAULT_CENTERS,
  URGENCY_COLORS,
  isMapboxConfigured,
} from '@/lib/mapbox/config'

interface SignalData {
  id: string
  lat: number
  lng: number
  label: string
  urgency: 'imminent' | 'near-term' | 'medium-term'
  market: 'FL' | 'PR' | 'DR'
  propertyAddress: string
  ownerName: string
  score: number
  propertyValue: number
}

interface SignalMapProps {
  signals: SignalData[]
  activeMarket?: 'all' | 'fl' | 'pr' | 'dr'
  onSignalClick?: (id: string) => void
  className?: string
}

// ---- Fallback (no Mapbox token) ----

function MapFallback({
  signals,
  onSignalClick,
  className,
}: Omit<SignalMapProps, 'activeMarket'>) {
  // Scale lat/lng to a percentage within approximate bounding box
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
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Signal dots */}
      {signals.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSignalClick?.(s.id)}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${scaleX(s.lng)}%`,
            top: `${scaleY(s.lat)}%`,
          }}
          title={`${s.label} - ${s.propertyAddress}`}
        >
          <span
            className="block h-3 w-3 rounded-full shadow-lg transition-transform group-hover:scale-150"
            style={{ backgroundColor: URGENCY_COLORS[s.urgency] }}
          />
          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
            {s.label}
          </span>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Urgency
        </p>
        {(Object.entries(URGENCY_COLORS) as [string, string][]).map(
          ([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-gray-300">
                {key.replace('-', ' ')}
              </span>
            </div>
          )
        )}
      </div>

      {/* Token notice */}
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="rounded-full bg-gray-900/70 px-4 py-1.5 text-xs text-gray-400 backdrop-blur">
          Add MAPBOX_TOKEN to enable interactive maps
        </span>
      </div>
    </div>
  )
}

// ---- Main map (Mapbox GL) ----

export function SignalMap({
  signals,
  activeMarket = 'all',
  onSignalClick,
  className,
}: SignalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mbRef = useRef<typeof import('mapbox-gl') | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Graceful fallback
  if (!isMapboxConfigured()) {
    return (
      <MapFallback
        signals={signals}
        onSignalClick={onSignalClick}
        className={className}
      />
    )
  }

  /* eslint-disable react-hooks/rules-of-hooks -- token check above is stable */

  // Build GeoJSON from signals
  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: signals.map((s) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] },
      properties: {
        id: s.id,
        label: s.label,
        urgency: s.urgency,
        market: s.market,
        propertyAddress: s.propertyAddress,
        ownerName: s.ownerName,
        score: s.score,
        propertyValue: s.propertyValue,
        urgencyColor: URGENCY_COLORS[s.urgency],
      },
    })),
  }

  // -- Initialize map --
  useEffect(() => {
    if (!containerRef.current) return

    // Dynamic import to avoid SSR issues
    let cancelled = false
    let map: mapboxgl.Map | null = null

    import('mapbox-gl').then((mb) => {
      if (cancelled || !containerRef.current) return
      import('mapbox-gl/dist/mapbox-gl.css')

      mbRef.current = mb
      mb.default.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      const center = DEFAULT_CENTERS[activeMarket]

      map = new mb.default.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        center: [center.lng, center.lat],
        zoom: center.zoom,
      })

      map.addControl(new mb.default.NavigationControl(), 'top-right')

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
    // Only initialize once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -- Update data sources when signals or heatmap toggle changes --
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Cluster source
    if (map.getSource('signals')) {
      ;(map.getSource('signals') as mapboxgl.GeoJSONSource).setData(geojson)
    } else {
      map.addSource('signals', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Cluster circles
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'signals',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#3b82f6',
            10,
            '#f97316',
            30,
            '#ef4444',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            10,
            24,
            30,
            32,
          ],
          'circle-opacity': 0.85,
        },
      })

      // Cluster count labels
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'signals',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 13,
        },
        paint: {
          'text-color': '#ffffff',
        },
      })

      // Unclustered points
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'signals',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'urgencyColor'],
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      // Click cluster -> zoom in
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        })
        if (!features.length) return
        const clusterId = features[0].properties?.cluster_id
        ;(map.getSource('signals') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return
            const geom = features[0].geometry
            if (geom.type === 'Point') {
              map.easeTo({
                center: geom.coordinates as [number, number],
                zoom: zoom ?? 12,
              })
            }
          }
        )
      })

      // Click unclustered point -> popup + callback
      map.on('click', 'unclustered-point', (e) => {
        const f = e.features?.[0]
        if (!f || f.geometry.type !== 'Point') return
        const props = f.properties ?? {}
        const coords = f.geometry.coordinates.slice() as [number, number]

        const value =
          typeof props.propertyValue === 'number'
            ? `$${props.propertyValue.toLocaleString()}`
            : ''

        const mb = mbRef.current
        if (!mb) return
        new mb.default.Popup({ offset: 12 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:system-ui;font-size:13px;max-width:220px">
              <strong>${props.label ?? ''}</strong>
              <p style="margin:4px 0 0;color:#94a3b8">${props.propertyAddress ?? ''}</p>
              <p style="margin:2px 0 0;color:#94a3b8">${props.ownerName ?? ''}</p>
              <div style="display:flex;gap:8px;margin-top:6px">
                <span style="background:${URGENCY_COLORS[(props.urgency as keyof typeof URGENCY_COLORS) ?? 'medium-term']};color:#fff;padding:1px 6px;border-radius:9999px;font-size:11px">${props.urgency ?? ''}</span>
                <span style="color:#64748b;font-size:12px">${value}</span>
              </div>
            </div>`
          )
          .addTo(map)

        onSignalClick?.(props.id as string)
      })

      // Cursors
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = ''
      })
    }

    // Heatmap layer
    if (showHeatmap) {
      if (!map.getLayer('signal-heat')) {
        map.addSource('signals-heat', {
          type: 'geojson',
          data: geojson,
        })
        map.addLayer(
          {
            id: 'signal-heat',
            type: 'heatmap',
            source: 'signals-heat',
            maxzoom: 15,
            paint: {
              'heatmap-weight': 1,
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                15,
                3,
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                4,
                15,
                30,
              ],
              'heatmap-opacity': 0.6,
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(0,0,0,0)',
                0.2,
                '#3b82f6',
                0.4,
                '#10b981',
                0.6,
                '#eab308',
                0.8,
                '#f97316',
                1,
                '#ef4444',
              ],
            },
          },
          'clusters'
        )
      }
    } else if (map.getLayer('signal-heat')) {
      map.removeLayer('signal-heat')
      map.removeSource('signals-heat')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals, mapLoaded, showHeatmap])

  // -- Fly to market when activeMarket changes --
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
      {/* Map container */}
      <div ref={containerRef} className="h-full w-full rounded-xl" style={{ minHeight: 400 }} />

      {/* Controls overlay */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {/* Market toggles */}
        <div className="flex gap-1 rounded-lg bg-gray-900/80 p-1 backdrop-blur">
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

        {/* Heatmap toggle */}
        <button
          type="button"
          onClick={() => setShowHeatmap((v) => !v)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors',
            showHeatmap
              ? 'bg-orange-600/90 text-white'
              : 'bg-gray-900/80 text-gray-300 hover:bg-gray-700/80'
          )}
        >
          {showHeatmap ? 'Hide' : 'Show'} Heatmap
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Urgency
        </p>
        {(Object.entries(URGENCY_COLORS) as [string, string][]).map(
          ([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-gray-300">
                {key.replace('-', ' ')}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
