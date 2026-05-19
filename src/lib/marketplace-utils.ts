import type { Currency, Locale, ListingType, PropertyType, Amenity } from '@/types/marketplace'

const DOP_USD_RATE = 57.5

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount
  if (from === 'USD' && to === 'DOP') return Math.round(amount * DOP_USD_RATE)
  return Math.round(amount / DOP_USD_RATE)
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleaned}?text=${encoded}`
}

export function getListingTypeLabel(type: ListingType, locale: Locale): string {
  const labels: Record<ListingType, Record<Locale, string>> = {
    venta: { es: 'En Venta', en: 'For Sale' },
    alquiler: { es: 'En Alquiler', en: 'For Rent' },
    vacacional: { es: 'Alquiler Vacacional', en: 'Vacation Rental' },
    habitacion: { es: 'Habitación', en: 'Room' },
    oficina: { es: 'Oficina', en: 'Office Space' },
    terreno: { es: 'Terreno', en: 'Land' },
    negocio: { es: 'Negocio', en: 'Business' },
    coliving: { es: 'Coliving', en: 'Coliving' },
  }
  return labels[type][locale]
}

export function getPropertyTypeLabel(type: PropertyType, locale: Locale): string {
  const labels: Record<PropertyType, Record<Locale, string>> = {
    casa: { es: 'Casa', en: 'House' },
    apartamento: { es: 'Apartamento', en: 'Apartment' },
    penthouse: { es: 'Penthouse', en: 'Penthouse' },
    villa: { es: 'Villa', en: 'Villa' },
    terreno: { es: 'Terreno', en: 'Land' },
    local_comercial: { es: 'Local Comercial', en: 'Commercial Space' },
    oficina: { es: 'Oficina', en: 'Office' },
    nave_industrial: { es: 'Nave Industrial', en: 'Industrial' },
    finca: { es: 'Finca', en: 'Estate' },
    solar: { es: 'Solar', en: 'Lot' },
    edificio: { es: 'Edificio', en: 'Building' },
    hotel: { es: 'Hotel', en: 'Hotel' },
  }
  return labels[type][locale]
}

export function getAmenityLabel(amenity: Amenity, locale: Locale): string {
  const labels: Record<Amenity, Record<Locale, string>> = {
    piscina: { es: 'Piscina', en: 'Pool' },
    estacionamiento: { es: 'Estacionamiento', en: 'Parking' },
    seguridad_24h: { es: 'Seguridad 24h', en: '24h Security' },
    gimnasio: { es: 'Gimnasio', en: 'Gym' },
    terraza: { es: 'Terraza', en: 'Terrace' },
    balcon: { es: 'Balcón', en: 'Balcony' },
    jardin: { es: 'Jardín', en: 'Garden' },
    planta_electrica: { es: 'Planta Eléctrica', en: 'Generator' },
    cisterna: { es: 'Cisterna', en: 'Water Tank' },
    ascensor: { es: 'Ascensor', en: 'Elevator' },
    aire_acondicionado: { es: 'A/C', en: 'A/C' },
    amueblado: { es: 'Amueblado', en: 'Furnished' },
    vista_al_mar: { es: 'Vista al Mar', en: 'Ocean View' },
    acceso_playa: { es: 'Acceso a Playa', en: 'Beach Access' },
    area_bbq: { es: 'Área BBQ', en: 'BBQ Area' },
    lobby: { es: 'Lobby', en: 'Lobby' },
    area_social: { es: 'Área Social', en: 'Social Area' },
    cancha_tenis: { es: 'Cancha de Tenis', en: 'Tennis Court' },
    jacuzzi: { es: 'Jacuzzi', en: 'Jacuzzi' },
    coworking: { es: 'Coworking', en: 'Coworking' },
    lavanderia: { es: 'Lavandería', en: 'Laundry' },
    almacen: { es: 'Almacén', en: 'Storage' },
    pet_friendly: { es: 'Pet Friendly', en: 'Pet Friendly' },
    internet_incluido: { es: 'Internet Incluido', en: 'Internet Included' },
  }
  return labels[amenity][locale]
}

export function formatSqmt(sqmt: number, locale: Locale): string {
  return `${sqmt.toLocaleString(locale === 'es' ? 'es-DO' : 'en-US')} m²`
}

export function getListingUrl(slug: string): string {
  return `/propiedad/${slug}`
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getListingTypeColor(type: ListingType): string {
  const colors: Record<ListingType, string> = {
    venta: 'bg-emerald-100 text-emerald-700',
    alquiler: 'bg-blue-100 text-blue-700',
    vacacional: 'bg-purple-100 text-purple-700',
    habitacion: 'bg-amber-100 text-amber-700',
    oficina: 'bg-slate-100 text-slate-700',
    terreno: 'bg-lime-100 text-lime-700',
    negocio: 'bg-rose-100 text-rose-700',
    coliving: 'bg-cyan-100 text-cyan-700',
  }
  return colors[type]
}
