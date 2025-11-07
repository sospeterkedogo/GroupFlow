'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, CheckSquare, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import { useUser } from '@/app/context/userContext'
import SidebarFooter from './SidebarFooter'

interface Project {
  id: string
  title: string
}

export default function Sidebar() {
  const { } = useUser()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Example projects state; replace with actual dynamic state from database
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'Project A' },
    { id: '2', title: 'Project B' },
  ])

  const handleAddProject = () => {
    const newProject = { id: Date.now().toString(), title: `New Project ${projects.length + 1}` }
    setProjects([...projects, newProject])
  }

  return (
    <>
      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-background p-2 rounded-md shadow-md"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:static z-50 top-0 left-0 h-full w-64 border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out bg-background',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            className="text-2xl font-bold font-heading text-primary hover:opacity-80 transition-opacity"
          >
            Group<span className="text-foreground">Flow</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {/* Top buttons */}
          <Link
            href="/"
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors',
              pathname === '/' ? 'bg-primary text-background' : 'text-secondary hover:bg-muted hover:text-foreground'
            )}
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>

          <Link
            href="/tasks"
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors',
              pathname === '/tasks' ? 'bg-primary text-background' : 'text-secondary hover:bg-muted hover:text-foreground'
            )}
          >
            <CheckSquare className="w-5 h-5" /> My Tasks
          </Link>

          <Link
            href="/activity"
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors',
              pathname === '/notifications' ? 'bg-primary text-background' : 'text-secondary hover:bg-muted hover:text-foreground'
            )}
          >
            <Bell className="w-5 h-5" /> Activity
          </Link>

          {/* Projects Section */}
          <div className="mt-4">
            <p className="px-3 py-1 text-xs text-muted uppercase font-semibold mt-8">Projects</p>
            <div className="flex flex-col space-y-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors',
                    pathname === `/projects/${project.id}`
                      ? 'bg-primary text-background'
                      : 'text-secondary hover:bg-muted hover:text-foreground'
                  )}
                >
                  {project.title}
                </Link>
              ))}

              {/* Add New Project button */}
              <button
                onClick={handleAddProject}
                className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-secondary hover:bg-muted hover:text-foreground transition-colors"
              >
                <Plus className="w-5 h-5" /> Add New Project
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <SidebarFooter />
      </aside>
    </>
  )
}
