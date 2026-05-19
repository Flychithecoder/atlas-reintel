"use client"

import { useAuthContext, type AuthUser } from '@/components/auth/auth-provider'

export interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

export function useAuth(): UseAuthReturn {
  const { user, loading, signIn, signUp, signOut, signInWithGoogle } =
    useAuthContext()

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}
