export type ListingType =
  | 'venta'
  | 'alquiler'
  | 'vacacional'
  | 'habitacion'
  | 'oficina'
  | 'terreno'
  | 'negocio'
  | 'coliving'

export type ListingStatus = 'draft' | 'active' | 'paused' | 'sold' | 'rented' | 'expired'

export type PropertyType =
  | 'casa'
  | 'apartamento'
  | 'penthouse'
  | 'villa'
  | 'terreno'
  | 'local_comercial'
  | 'oficina'
  | 'nave_industrial'
  | 'finca'
  | 'solar'
  | 'edificio'
  | 'hotel'

export type Currency = 'DOP' | 'USD'

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'flagged'

export type MarketplaceUserType =
  | 'buyer'
  | 'seller'
  | 'agent'
  | 'investor'
  | 'landlord'
  | 'tenant'
  | 'service_provider'

export type Locale = 'es' | 'en'

export interface Coordinates {
  lat: number
  lng: number
}

export interface ListingMedia {
  id: string
  listingId: string
  type: 'photo' | 'video' | '360' | 'floorplan'
  url: string
  order: number
  caption?: string
}

export interface Listing {
  id: string
  slug: string
  listingType: ListingType
  status: ListingStatus
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  propertyType: PropertyType
  bedrooms?: number
  bathrooms?: number
  sqmt: number
  lotSize?: number
  yearBuilt?: number
  price: number
  currency: Currency
  priceUSD: number
  priceDOP: number
  address: string
  sector?: string
  municipality: string
  province: Province
  coordinates: Coordinates
  amenities: string[]
  media: ListingMedia[]
  confoturEligible: boolean
  titleVerified: boolean
  verificationStatus: VerificationStatus
  featured: boolean
  ownerId: string
  ownerName: string
  ownerPhone?: string
  ownerWhatsapp?: string
  agentId?: string
  views: number
  saves: number
  inquiries: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface MarketplaceUser {
  id: string
  name: string
  email: string
  phone?: string
  whatsappNumber?: string
  locale: Locale
  userType: MarketplaceUserType
  savedListings: string[]
  savedSearches: SavedSearch[]
  avatar?: string
  createdAt: string
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  alertEnabled: boolean
  createdAt: string
}

export interface SearchFilters {
  query?: string
  listingType?: ListingType[]
  propertyType?: PropertyType[]
  province?: Province[]
  municipality?: string[]
  priceMin?: number
  priceMax?: number
  currency: Currency
  bedroomsMin?: number
  bathroomsMin?: number
  sqmtMin?: number
  sqmtMax?: number
  amenities?: string[]
  confoturOnly?: boolean
  titleVerifiedOnly?: boolean
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  page: number
  limit: number
}

export interface Inquiry {
  id: string
  listingId: string
  senderId: string
  senderName: string
  senderPhone?: string
  message: string
  whatsappOptIn: boolean
  createdAt: string
}

export type Province =
  | 'Distrito Nacional'
  | 'Santo Domingo'
  | 'Santiago'
  | 'La Altagracia'
  | 'Puerto Plata'
  | 'San Pedro de Macorís'
  | 'La Romana'
  | 'La Vega'
  | 'San Cristóbal'
  | 'Duarte'
  | 'Espaillat'
  | 'Samaná'
  | 'María Trinidad Sánchez'
  | 'Monte Plata'
  | 'Monseñor Nouel'
  | 'Peravia'
  | 'Azua'
  | 'Barahona'
  | 'San Juan'
  | 'Valverde'
  | 'Monte Cristi'
  | 'Sánchez Ramírez'
  | 'Hato Mayor'
  | 'El Seibo'
  | 'Hermanas Mirabal'
  | 'Independencia'
  | 'Pedernales'
  | 'Baoruco'
  | 'Dajabón'
  | 'Elías Piña'
  | 'Santiago Rodríguez'
  | 'San José de Ocoa'

export interface AreaGuide {
  slug: string
  name: string
  province: Province
  description_es: string
  description_en: string
  heroImage: string
  avgPriceUSD: number
  listingCount: number
  highlights_es: string[]
  highlights_en: string[]
  popular: boolean
}

export const AMENITIES = [
  'piscina',
  'estacionamiento',
  'seguridad_24h',
  'gimnasio',
  'terraza',
  'balcon',
  'jardin',
  'planta_electrica',
  'cisterna',
  'ascensor',
  'aire_acondicionado',
  'amueblado',
  'vista_al_mar',
  'acceso_playa',
  'area_bbq',
  'lobby',
  'area_social',
  'cancha_tenis',
  'jacuzzi',
  'coworking',
  'lavanderia',
  'almacen',
  'pet_friendly',
  'internet_incluido',
] as const

export type Amenity = typeof AMENITIES[number]

export const PROVINCES_WITH_AREAS: Record<string, string[]> = {
  'Distrito Nacional': ['Piantini', 'Naco', 'Gazcue', 'Zona Colonial', 'Bella Vista', 'Evaristo Morales', 'Serralles', 'Paraíso', 'Mirador Sur'],
  'Santo Domingo': ['Los Prados', 'Arroyo Hondo', 'Villa Mella', 'Santo Domingo Este', 'Santo Domingo Norte', 'Boca Chica', 'Juan Dolio'],
  'La Altagracia': ['Punta Cana', 'Bávaro', 'Cap Cana', 'Uvero Alto', 'Veron', 'Higüey'],
  'Puerto Plata': ['Sosúa', 'Cabarete', 'Playa Dorada', 'Costámbar', 'Puerto Plata Centro'],
  'Samaná': ['Las Terrenas', 'Las Galeras', 'Santa Bárbara de Samaná', 'El Limón'],
  'La Romana': ['Casa de Campo', 'Bayahíbe', 'La Romana Centro'],
  'Santiago': ['Santiago Centro', 'Gurabo', 'Villa Bisonó', 'Los Jardines'],
  'San Pedro de Macorís': ['San Pedro Centro', 'Guayacanes', 'Ramón Santana'],
}
