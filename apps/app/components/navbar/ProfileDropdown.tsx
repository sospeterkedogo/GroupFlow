'use client'

import Link from 'next/link'
import { User, LogOut, MessageSquare } from 'lucide-react'
import { BiQuestionMark } from 'react-icons/bi'
import { User as SupabaseUser } from '@supabase/supabase-js'


interface Profile {
  avatar_url?: string
  email?: string
  username?: string
}

interface Props {
  profile: Profile
  user: SupabaseUser | null
  onLogout: () => void
  onClose: () => void // called to close dropdown when clicking X or links
}

export default function ProfileDropdown({ profile, user, onLogout, onClose }: Props) {
  return (
    <div className="absolute bottom-0 w-60 bg-background border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-border">
          
          <p className="text-sm text-secondary truncate">
            {profile?.email || user?.email}
          </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col">
        <Link
          href="/account"
          className="px-4 py-2 text-left text-secondary hover:text-primary hover:bg-muted transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-2">
            <User size={16} />
            Account Settings
          </div>
        </Link>
        <Link href="/account">
          <div className="flex items-center gap-2 px-4 py-2 text-left text-secondary hover:text-primary hover:bg-muted transition-colors">
            <BiQuestionMark size={16} />
            Help
          </div>
        </Link>
        <Link href="/messages">
          <div className="flex items-center gap-2 px-4 py-2 text-left text-secondary hover:text-primary hover:bg-muted transition-colors">
            <MessageSquare size={16} />
            Feedback
          </div>
        </Link>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-left text-secondary hover:text-red-500 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} />
            Log out
          </div>
        </button>
      </div>
    </div>
  )
}
