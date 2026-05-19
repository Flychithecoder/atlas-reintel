"use client"
import Link from "next/link"
import { Radar } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Radar className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ATLAS</span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="max-w-md text-white space-y-8">
          <h2 className="text-3xl font-bold">Find deals your competition can&apos;t see</h2>
          <p className="text-blue-100 text-lg">Join 2,800+ real estate professionals using AI-powered intelligence to close more deals.</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200 text-sm">Data Signals</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">26M+</div>
              <div className="text-blue-200 text-sm">Properties</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">12.8%</div>
              <div className="text-blue-200 text-sm">Avg Response Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">3.2x</div>
              <div className="text-blue-200 text-sm">More Meetings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
