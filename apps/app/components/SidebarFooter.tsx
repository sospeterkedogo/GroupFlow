'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/context/userContext'
import ProfileDropdown from './navbar/ProfileDropdown'
import { createClient } from '@/lib/supabase/client'

export default function SidebarFooter() {
  const supabase = createClient()
  const router = useRouter()
  const { user, profile } = useUser()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  if (!user) return null

  return (
    <div className="p-4 border-t border-border relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full text-left focus:outline-none"
      >
        <Image
          src={profile?.avatar_url || '/default-avatar.png'}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {profile?.username || 'User'}
          </span>
          <span className="text-xs text-muted">{profile?.email || 'Email'}</span>
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-1 w-60 z-50">
          <ProfileDropdown
            profile={profile || {}}
            user={user}
            onLogout={handleLogout}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
