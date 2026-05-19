"use client"

import { useRef, useEffect, useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { MAPBOX_STYLE, isMapboxConfigured } from '@/lib/mapbox/config'

interface PropertyData {
  id: string
  address: string
  lat: number
  lng: number
  propertyType: string
  estimatedValue: number
  signals: number
}

interface PropertyMapProps {
  properties: PropertyData[]
  onPropertyClick?: (id: string) => void
  className?: string
}

const PROPERTY_TYPE_COLORS: Record<string, string> = {
  SFR: '#3b82f6',
  'Multi-Family': '#8b5cf6',
  Commercial: '#10b981',
  Industrial: '#f59e0b',
  Office: '#06b6d4',
  Retail: '#ec4899',
  'Mixed-Use': '#f97316',
  Land: '#84cc16',
}

function getPropertyColor(type: string): string {
  return PROPERTY_TYPE_COLORS[type] ?? '#6b7280'
}

// ---- Fallback ----

function PropertyFallback({
  properties,
  onPropertyClick,
  className,
}: PropertyMapProps) {
  if (!properties.length) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-gray-700',
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          minHeight: 300,
        }}
      >
        <p className="text-sm text-gray-500">No properties to display</p>
      </div>
    )
  }

  // Compute tight bounds
  const lats = properties.map((p) => p.lat)
  const lngs = properties.map((p) => p.lng)
  const minLat = Math.min(...lats) - 0.02
  const maxLat = Math.max(...lats) + 0.02
  const minLng = Math.min(...lngs) - 0.02
  const maxLng = Math.max(...lngs) + 0.02

  const scaleX = (lng: number) =>
    ((lng - minLng) / (maxLng - minLng || 1)) * 80 + 10 // 10-90% range
  const scaleY = (lat: number) =>
    ((maxLat - lat) / (maxLat - minLat || 1)) * 80 + 10

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-700',
        className
      )}
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c4a6e 100%)',
        minHeight: 300,
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

      {properties.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPropertyClick?.(p.id)}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${scaleX(p.lng)}%`, top: `${scaleY(p.lat)}%` }}
        >
          <span
            className="flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-bold text-white shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: getPropertyColor(p.propertyType) }}
          >
            {formatCurrency(p.estimatedValue)}
          </span>
          {/* Tooltip */}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow group-hover:block">
            {p.address}
            {p.signals > 0 && (
              <span className="ml-1 text-orange-400">
                ({p.signals} signal{p.signals !== 1 ? 's' : ''})
              </span>
            )}
          </span>
        </button>
      ))}

      {/* Token notice */}
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="rounded-full bg-gray-900/70 px-4 py-1.5 text-xs text-gray-400 backdrop-blur">
          Add MAPBOX_TOKEN to enable interactive maps
        </span>
      </div>

      {/* Property type legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Property Type
        </p>
        {Object.entries(PROPERTY_TYPE_COLORS)
          .slice(0, 5)
          .map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300">{type}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// ---- Main map ----

export function PropertyMap({
  properties,
  onPropertyClick,
  className,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  if (!isMapboxConfigured()) {
    return (
      <PropertyFallback
        properties={properties}
        onPropertyClick={onPropertyClick}
        className={className}
      />
    )
  }

  /* eslint-disable react-hooks/rules-of-hooks */

  // -- Initialize map --
  useEffect(() => {
    if (!containerRef.current || !properties.length) return
    let cancelled = false
    let map: mapboxgl.Map | null = null

    import('mapbox-gl').then((mapboxgl) => {
      if (cancelled || !containerRef.current) return
      import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.default.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      // Compute bounds
      const lngs = properties.map((p) => p.lng)
      const lats = properties.map((p) => p.lat)
      const sw: [number, number] = [Math.min(...lngs) - 0.01, Math.min(...lats) - 0.01]
      const ne: [number, number] = [Math.max(...lngs) + 0.01, Math.max(...lats) + 0.01]

      map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        bounds: [sw, ne],
        fitBoundsOptions: { padding: 60, maxZoom: 15 },
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

  // -- Add markers when map is ready --
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Use markers with price labels (not clusters for portfolio view)
    const markers: mapboxgl.Marker[] = []

    import('mapbox-gl').then((mapboxgl) => {
      properties.forEach((p) => {
        // Create custom marker element
        const el = document.createElement('div')
        el.className = 'atlas-property-marker'
        el.style.cssText = `
          display:flex;align-items:center;gap:3px;
          background:${getPropertyColor(p.propertyType)};
          color:#fff;font-size:10px;font-weight:700;
          padding:2px 8px;border-radius:9999px;
          cursor:pointer;white-space:nowrap;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          transition:transform 0.15s;
        `
        el.textContent = formatCurrency(p.estimatedValue)
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.15)'
        })
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)'
        })

        const marker = new mapboxgl.default.Marker({ element: el })
          .setLngLat([p.lng, p.lat])
          .setPopup(
            new mapboxgl.default.Popup({ offset: 16 }).setHTML(
              `<div style="font-family:system-ui;font-size:13px;max-width:220px">
                <strong>${p.address}</strong>
                <p style="margin:4px 0 0;color:#94a3b8">${p.propertyType}</p>
                <p style="margin:2px 0;font-weight:600;color:#3b82f6">${formatCurrency(p.estimatedValue)}</p>
                ${p.signals > 0 ? `<p style="margin:0;color:#f97316;font-size:12px">${p.signals} active signal${p.signals !== 1 ? 's' : ''}</p>` : ''}
              </div>`
            )
          )
          .addTo(map)

        el.addEventListener('click', () => onPropertyClick?.(p.id))
        markers.push(marker)
      })

      // Fit bounds
      if (properties.length > 1) {
        const lngs = properties.map((p) => p.lng)
        const lats = properties.map((p) => p.lat)
        map.fitBounds(
          [
            [Math.min(...lngs) - 0.01, Math.min(...lats) - 0.01],
            [Math.max(...lngs) + 0.01, Math.max(...lats) + 0.01],
          ],
          { padding: 60, maxZoom: 15, duration: 800 }
        )
      }
    })

    return () => {
      markers.forEach((m) => m.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, mapLoaded])

  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="h-full w-full rounded-xl" style={{ minHeight: 300 }} />

      {/* Property type legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-gray-900/80 px-3 py-2 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Property Type
        </p>
        {Object.entries(PROPERTY_TYPE_COLORS)
          .slice(0, 5)
          .map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300">{type}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
