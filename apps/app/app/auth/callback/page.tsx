'use client'

// This page runs client-side because it needs access to the browser URL
// (Supabase’s email link sends access tokens in the URL hash or query string)

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // This effect runs once the user lands on the callback page
      // It handles verifying the URL, exchanging tokens, and signing in automatically
      const handleSession = async () => {
        // Step 1: Try to get the current session
        // (This works if Supabase already stored session cookies)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          // If something goes wrong with the session retrieval, we log and bounce to login
          console.error('Error getting session:', error)
          router.replace('/auth/login')
          return
        }

        if (!data.session) {
          // Step 2: No active session found, so we try to exchange the magic link code
          // The confirmation email includes a link that contains a code or access token in the URL
          // Supabase provides a helper to "exchange" that for a real session cookie
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(window.location.href)

          if (exchangeData) {
            // If the exchange is successful, log in the user
            console.log('Session exchanged successfully:', exchangeData)
          }

          if (exchangeError) {
            // If the exchange fails (invalid/expired link), log and redirect
            console.error('Session exchange failed:', exchangeError)
            router.replace('/auth/login')
            return
          }

          // Step 3: Success — Supabase now has a valid session stored in cookies
          // We can safely redirect the user to the dashboard or homepage
          router.replace('/')
        } else {
          // If the session already exists (for example, user clicked the link while already logged in)
          // just redirect them home immediately
          router.replace('/')
        }
      }

      // Run the function
      handleSession()
    }
  }, [isClient, router, supabase])

  // A simple loading screen while the magic happens
  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-foreground bg-background">
      Confirming your account...
    </div>
  )
}
