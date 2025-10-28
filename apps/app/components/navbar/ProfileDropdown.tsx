'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, User } from 'lucide-react'

interface Profile {
  avatar_url?: string
  email?: string
}

export default function ProfileDropdown({
  open,
  toggle,
  profile,
  user,
  onLogout,
}: {
  open: string | null
  toggle: (name: string) => void
  profile: Profile
  user: any
  onLogout: () => void
}) {
  return (
    <div className="relative">
      <button
        onClick={() => toggle('profile')}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:ring-2 hover:ring-primary overflow-hidden transition-all"
      >
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-secondary" />
        )}
      </button>

      {open === 'profile' && (
        <div className="absolute right-0 mt-3 w-56 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center p-3 border-b border-border">
            <div>
              <p className="text-sm text-secondary truncate">
                {profile.email || user?.email}
              </p>
            </div>
            <button
              onClick={() => toggle('profile')}
              className="p-1 hover:bg-muted rounded"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col">
            <Link
              href="/account"
              className="px-4 py-2 text-left text-secondary hover:text-primary hover:bg-muted transition-colors"
              onClick={() => toggle('profile')}
            >
              Profile Settings
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-left text-secondary hover:text-red-500 hover:bg-muted transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
