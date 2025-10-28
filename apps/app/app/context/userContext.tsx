'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// --- Interfaces ---
interface Profile {
  id?: string
  email?: string
  avatar_url?: string
  username?: string
  firstname?: string
  lastname?: string
}

interface UserContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  fetchProfile: (user: User | null) => Promise<void>
  refreshProfile: () => Promise<void>
}

// --- Context ---
const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)


  const fetchProfile = async (u: User | null) => {
    if (!u?.id) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      setProfile(null)
      return
    }

    const mergedProfile: Profile = {
      ...data,
      id: u.id,
      email: u.email,
      avatar_url: data?.avatar_url ?? '',
      username: data?.username ?? '',
      firstname: data?.firstname ?? '',
      lastname: data?.lastname ?? '',
    }

    setProfile(mergedProfile)
  }

  const refreshProfile = async () => {
    await fetchProfile(user)
  }

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        await fetchProfile(currentUser)
      } catch (err) {
        console.error('Failed to initialize session:', err)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      fetchProfile(newUser)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value: UserContextType = {
    user,
    profile,
    loading,
    setUser,
    setProfile,
    fetchProfile,
    refreshProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
