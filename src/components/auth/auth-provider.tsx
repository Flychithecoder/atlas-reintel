"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'team_lead' | 'enterprise'
  plan: 'free' | 'starter' | 'pro' | 'pro_cre' | 'team' | 'enterprise'
  avatar_url: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const MOCK_USER: AuthUser = {
  id: 'mock-user-1',
  name: 'Brandon Hayes',
  email: 'brandon@atlasrealty.com',
  role: 'admin',
  plan: 'pro',
  avatar_url: null,
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the user profile from /api/auth/me
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Mock mode: set mock user immediately
      setUser(MOCK_USER)
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Get initial session
    const initAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        setSupabaseUser(authUser)

        if (authUser) {
          await fetchProfile()
        }
      } catch {
        // Auth check failed, user stays null
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchProfile()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (!isSupabaseConfigured()) {
        setUser(MOCK_USER)
        return {}
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          return { error: data.error ?? 'Login failed' }
        }

        await fetchProfile()
        return {}
      } catch {
        return { error: 'Network error. Please try again.' }
      }
    },
    [fetchProfile]
  )

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string
    ): Promise<{ error?: string }> => {
      if (!isSupabaseConfigured()) {
        setUser(MOCK_USER)
        return {}
      }

      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await res.json()

        if (!res.ok) {
          return { error: data.error ?? 'Signup failed' }
        }

        return {}
      } catch {
        return { error: 'Network error. Please try again.' }
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      return
    }

    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setSupabaseUser(null)
    window.location.href = '/login'
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(MOCK_USER)
      return
    }

    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      supabaseUser,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }),
    [user, supabaseUser, loading, signIn, signUp, signOut, signInWithGoogle]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
