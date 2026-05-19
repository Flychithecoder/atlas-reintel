"use client"

import Link from "next/link"
import { Heart, Home, MessageCircle, Settings, ChevronRight, PlusCircle, LogOut } from "lucide-react"
import { useMarketplaceStore } from "@/store/marketplace"

export default function AccountPage() {
  const { locale, savedListings } = useMarketplaceStore()

  const t = locale === 'es' ? {
    title: 'Mi Cuenta',
    myListings: 'Mis Propiedades',
    myListingsDesc: 'Administra tus anuncios publicados',
    favorites: 'Favoritos',
    favoritesDesc: `${savedListings.length} propiedades guardadas`,
    messages: 'Mensajes',
    messagesDesc: 'Consultas y conversaciones',
    settings: 'Configuración',
    settingsDesc: 'Idioma, notificaciones, perfil',
    publish: 'Publicar Propiedad',
    signOut: 'Cerrar Sesión',
    loginPrompt: 'Inicia sesión para acceder a todas las funciones',
    login: 'Iniciar Sesión',
    register: 'Crear Cuenta',
  } : {
    title: 'My Account',
    myListings: 'My Listings',
    myListingsDesc: 'Manage your published listings',
    favorites: 'Favorites',
    favoritesDesc: `${savedListings.length} saved properties`,
    messages: 'Messages',
    messagesDesc: 'Inquiries and conversations',
    settings: 'Settings',
    settingsDesc: 'Language, notifications, profile',
    publish: 'List Property',
    signOut: 'Sign Out',
    loginPrompt: 'Sign in to access all features',
    login: 'Sign In',
    register: 'Create Account',
  }

  const menuItems = [
    { href: '/cuenta/propiedades', icon: Home, label: t.myListings, description: t.myListingsDesc },
    { href: '/cuenta/favoritos', icon: Heart, label: t.favorites, description: t.favoritesDesc },
    { href: '/cuenta/mensajes', icon: MessageCircle, label: t.messages, description: t.messagesDesc },
    { href: '/cuenta/configuracion', icon: Settings, label: t.settings, description: t.settingsDesc },
  ]

  return (
    <div className="pb-16 sm:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>

        {/* User card */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{t.loginPrompt}</p>
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                {t.login}
              </Link>
              <Link href="/register" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                {t.register}
              </Link>
            </div>
          </div>
        </div>

        {/* Publish CTA */}
        <Link
          href="/publicar"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-base font-semibold text-white shadow-sm transition-all hover:shadow-md"
        >
          <PlusCircle className="h-5 w-5" />
          {t.publish}
        </Link>

        {/* Menu */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
                i < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <item.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
