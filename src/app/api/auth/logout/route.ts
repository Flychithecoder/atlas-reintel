import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    // If Supabase is not configured, return mock success
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ message: 'Logged out successfully (mock mode)' })
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
