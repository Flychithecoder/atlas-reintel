"use client"

import { MessageCircle } from "lucide-react"
import { getWhatsAppLink } from "@/lib/marketplace-utils"
import { useMarketplaceStore } from "@/store/marketplace"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  phone: string
  listingTitle: string
  className?: string
  size?: "default" | "large"
}

export function WhatsAppButton({ phone, listingTitle, className, size = "default" }: WhatsAppButtonProps) {
  const { locale } = useMarketplaceStore()

  const message = locale === 'es'
    ? `Hola! Me interesa la propiedad: ${listingTitle}. ¿Está disponible?`
    : `Hi! I'm interested in the property: ${listingTitle}. Is it available?`

  const link = getWhatsAppLink(phone, message)

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] font-semibold text-white transition-colors hover:bg-[#20BD5A]",
        size === "large" ? "px-6 py-3.5 text-base" : "px-4 py-2.5 text-sm",
        className
      )}
    >
      <MessageCircle className={size === "large" ? "h-5 w-5" : "h-4 w-4"} />
      WhatsApp
    </a>
  )
}
