import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MOCK_USER = {
  id: 'mock-user-1',
  name: 'Brandon Hayes',
  email: 'brandon@atlasrealty.com',
  role: 'admin' as const,
  plan: 'pro' as const,
  avatar_url: null,
}

export async function GET() {
  try {
    // If Supabase is not configured, return mock user
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ user: MOCK_USER })
    }

    const supabase = await createClient()
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Fetch profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    const p = profile as Record<string, unknown> | null

    return NextResponse.json({
      user: {
        id: authUser.id,
        name: (p?.name as string) ?? authUser.user_metadata?.name ?? '',
        email: authUser.email ?? '',
        role: (p?.role as string) ?? 'user',
        plan: (p?.plan as string) ?? 'free',
        avatar_url: (p?.avatar_url as string | null) ?? null,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
