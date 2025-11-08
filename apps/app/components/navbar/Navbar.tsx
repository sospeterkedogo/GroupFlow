'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/app/context/userContext'
import { useNotifications } from '@/app/context/notificationsContext'

// Import child components
import FeedbackDropdown from './FeedbackDropdown'
import NotificationsDropdown from './NotificationsDropdown'
import HelpDropdown from './HelpDropdown'

export default function AppNavbar() {
  const supabase = createClient()
  const { user } = useUser()
  const { notifications = [] } = useNotifications() // default to empty array

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch user profile
  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      await supabase
        .from('profiles')
        .select('avatar_url, email')
        .eq('id', user.id)
        .single()
      // if (data) setProfile(data) // Removed setProfile call
    }
    fetchProfile()
  }, [user, supabase])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toggle dropdown, mark notifications as read when opening
  const toggleDropdown = (name: string) => {
    const isOpening = openDropdown !== name
    setOpenDropdown(isOpening ? name : null)
  }

  return (
    <nav className="flex justify-end items-center px-6 py-3 bg-background backdrop-blur">
      <div className="flex items-center space-x-5 relative" ref={dropdownRef}>
        <FeedbackDropdown open={openDropdown} toggle={toggleDropdown} />
        <NotificationsDropdown
        
          open={openDropdown}
          toggle={toggleDropdown}
          notifications={notifications}
          
        />
        <HelpDropdown open={openDropdown} toggle={toggleDropdown} />
        
      </div>
    </nav>
  )
}
