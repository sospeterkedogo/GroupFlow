'use client'

import { LayoutGrid, MoreHorizontal, UserPlus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-background border-b border-border px-3 sm:px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">

        {/* LEFT: Menu icon area already exists externally, so we give it space */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Push content right so it doesn’t collide with the menu icon */}
          <div className="pl-10 sm:pl-0 flex items-center gap-3 min-w-0">
            <LayoutGrid className="w-6 h-6 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {course || 'No Course'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onInvite}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/80 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-muted-foreground rounded-md hover:bg-muted transition"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-40 sm:w-48 bg-background border border-border rounded-md shadow-lg z-20"
                onMouseLeave={() => setIsMenuOpen(false)}
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
