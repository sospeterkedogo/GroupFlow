'use client'

import { LayoutGrid, MoreHorizontal, UserPlus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

// 1. THIS IS THE NEW "CONTRACT" FOR THIS COMPONENT.
// It is no longer "dumb"; it is *informed*.
// Your page.tsx MUST be updated to provide these props.
interface AppHeaderProps {
  title: string
  course?: string | null
  onEdit: () => void
  onDelete: () => void
  onInvite: () => void
}

export default function AppHeader({ 
  title, 
  course, 
  onEdit, 
  onDelete, 
  onInvite 
}: AppHeaderProps) {
  // This state is fine because it's purely for
  // self-contained UI logic (toggling the menu).
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-background border-b border-border px-4 py-3 md:px-6">
      <div className="flex justify-between items-center">
        
        {/* Left Side: Title and Course */}
        <div className="flex items-center gap-4">
          <LayoutGrid className="w-6 h-6 text-primary" />
          <span className="w-px h-6 bg-border hidden sm:block"></span>
          {/* 2. ADDED TITLE AND COURSE GROUPING */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              {title}
            </h1>
            {/* 3. THIS IS THE "COURSE PLACEHOLDER" YOU WANTED. */}
            {/* It will show the course, or "No Course" if null */}
            <p className="text-xs text-muted-foreground hidden sm:block">
              {course || 'No Course'}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* (Search & Avatars would go here) */}
          
          {/* 4. INVITE BUTTON YOU ASKED FOR */}
          <button 
            onClick={onInvite}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/80 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {/* 5. EDIT/DELETE DROPDOWN (Aesthetic & Safe) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-muted-foreground rounded-md hover:bg-muted"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10"
                onMouseLeave={() => setIsMenuOpen(false)} // Auto-close
              >
                <button
                  onClick={() => {
                    onEdit()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}

