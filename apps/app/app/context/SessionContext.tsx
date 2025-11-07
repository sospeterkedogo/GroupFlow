'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef, // 1. BRINGING THIS BACK
} from 'react'
import { usePathname } from 'next/navigation' // 2. BRINGING THIS BACK
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// --- (Interfaces are fine) ---
export interface Project {
  id: string
  name: string
  course?: string | null
  progress?: number | null
  due_date?: string | null
}

interface Profile {
  id?: string
  email?: string
  avatar_url?: string
  username?: string
  firstname?: string
  lastname?: string
}

interface SessionContextType {
  user: User | null
  profile: Profile | null
  projects: Project[]
  loading: boolean // Master auth loading
  projectsLoading: boolean // Projects loading
  addProject: (newProject: {
    title: string
    course: string | null
    due_date: string | null
  }) => Promise<Project>
  refreshProfile: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

const PROFILE_CACHE_KEY = 'cachedProfile'
const PROJECTS_CACHE_KEY = 'cachedProjects'

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_CACHE_KEY) || 'null')
    } catch (_error) {
      return null
    }
  })
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PROJECTS_CACHE_KEY) || '[]')
    } catch (_error) {
      return []
    }
  })
  
  // 3. SET LOADING TO TRUE (This is the default)
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  
  // 4. GET PATHNAME AND ISINITIAL LOAD REF
  const pathname = usePathname()
  const isInitialLoad = useRef(true) // Tracks the *very first* load

  // 5. "OFFLINE-AWARE" FETCHPROFILE
  // This version will NOT clear your cache on a network error.
  const fetchProfile = useCallback(async (u: User) => {
    console.log("Fetching profile for user:", u.id)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single()

    if (error) {
      console.error(
        'Error fetching profile (stale data may be shown):',
        error.message
      )
      return // DO NOT clear cache on network error
    }
    
    const newProfile = { ...data, id: u.id, email: u.email }
    setProfile(newProfile)
    try {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(newProfile))
    } catch (error) {
      console.warn("Failed to save profile to localStorage:", error);
    }
  }, [])

  // 6. "OFFLINE-AWARE" FETCHPROJECTS
  const fetchProjects = useCallback(async () => {
    console.log("Fetching projects...")
    // Only show "projects loading" on the very first load
    if (isInitialLoad.current) {
      setProjectsLoading(true)
    }
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to fetch projects')
      }
      const data: Project[] = await res.json()
      setProjects(data || [])
      try {
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data || []))
      } catch (error) {
        console.warn("Failed to save projects to localStorage:", error);
      }
    } catch (err) {
      console.error('Error fetching projects (stale data may be shown):', err instanceof Error ? err.message : 'An unknown error occurred')
      // DO NOT clear cache on network error
    } finally {
      // We will set this in the main effect
    }
  }, [isInitialLoad, supabase]) // Empty dep array, will be called by main effect

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user)
    }
  }, [user, fetchProfile])

  // --- 7. THE ONE ROBUST USEEFFECT ---
  // This runs ONCE on mount, and AGAIN on *every navigation*.
  useEffect(() => {
    const checkUserOnNavigate = async () => {
      // Only set the *master* loading spinner on the initial page load.
      // This solves the "flicker" on subsequent navigations.
      if (isInitialLoad.current) {
        setLoading(true)
      }

      try {
        // Get the session. This is fast and will catch the
        // server-side login redirect *before* the dashboard page
        // can make a bad redirect decision.
        const { data: { session } } = await supabase.auth.getSession()
        const newUser = session?.user ?? null
        setUser(newUser)

        if (newUser) {
          // User is found. Fetch their data in parallel.
          await Promise.all([
            fetchProfile(newUser),
            fetchProjects()
          ])
        } else {
          // No user. Clear everything.
          setProfile(null)
          setProjects([])
          localStorage.removeItem(PROFILE_CACHE_KEY)
          localStorage.removeItem(PROJECTS_CACHE_KEY)
        }
      } catch (error) {
        console.error("Error in session check:", error)
        // If anything fails, log out completely.
        setProfile(null)
        setProjects([])
        setUser(null)
        localStorage.removeItem(PROFILE_CACHE_KEY)
        localStorage.removeItem(PROJECTS_CACHE_KEY)
      } finally {
        // This is GUARANTEED to run.
        // This fixes your "stuck loading" crash.
        setLoading(false)
        setProjectsLoading(false) // Always turn this off too
        
        // Mark the initial load as done.
        isInitialLoad.current = false
      }
    }

    checkUserOnNavigate()
    
  }, [pathname, fetchProfile, fetchProjects, supabase]) // Re-run on navigation

  
  // --- (addProject function is fine) ---
  const addProject = useCallback(async (newProject: {
    title: string
    course: string | null
    due_date: string | null
  }) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    })
    
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Failed to create project')
    }
    
    const projectFromApi: Project = await res.json()
    
    const updatedProjects = [...projects, projectFromApi]
    setProjects(updatedProjects)
    try {
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(updatedProjects))
    } catch (error) {
      console.warn("Failed to save updated projects to localStorage:", error);
    }
    
    return projectFromApi
  }, [projects, setProjects])

  const value: SessionContextType = {
    user,
    profile,
    projects,
    loading,
    projectsLoading,
    addProject,
    refreshProfile,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}

