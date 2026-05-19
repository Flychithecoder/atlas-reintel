"use client"

import Link from "next/link"
import { CheckCircle2, ArrowRight, Home, PlusCircle } from "lucide-react"
import { useMarketplaceStore } from "@/store/marketplace"

export default function PublishSuccessPage() {
  const { locale } = useMarketplaceStore()

  const t = locale === 'es' ? {
    title: '¡Propiedad Publicada!',
    subtitle: 'Tu anuncio está activo y visible para miles de compradores e inquilinos potenciales.',
    viewListing: 'Ver mi anuncio',
    publishAnother: 'Publicar otra propiedad',
    goHome: 'Ir al inicio',
  } : {
    title: 'Property Published!',
    subtitle: 'Your listing is now live and visible to thousands of potential buyers and renters.',
    viewListing: 'View my listing',
    publishAnother: 'List another property',
    goHome: 'Go to home',
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-3 text-base text-gray-500">{t.subtitle}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <PlusCircle className="h-4 w-4" />
            {t.publishAnother}
          </Link>
          <Link
            href="/inicio"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            {t.goHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
