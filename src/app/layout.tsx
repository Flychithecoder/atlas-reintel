import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { QueryProvider } from "@/components/providers/query-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "ATLAS | AI-Powered Real Estate Lead Intelligence",
  description:
    "The #1 AI-native platform for real estate lead generation. Multi-signal intelligence, Claude AI agents, voice AI, and off-market deal sourcing for residential and commercial real estate professionals.",
  keywords: [
    "real estate leads",
    "lead generation",
    "CRE intelligence",
    "property data",
    "off-market deals",
    "AI real estate",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
