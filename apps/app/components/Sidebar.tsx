'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, CheckSquare, Plus, X, Menu } from 'lucide-react'
import clsx from 'clsx'
import SidebarFooter from './SidebarFooter'
import { useUser } from '@/app/context/userContext' // Using the context
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from '@/app/context/SidebarContext'

interface Project {
  id: string
  name: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {isOpen, setIsOpen}= useSidebar()
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [loading, setLoading] = useState(false) // For modal "create" button
  const [error, setError] = useState<string | null>(null) 
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  
  // 1. GET THE USER AND AUTH STATE *FROM THE CONTEXT*
  const { user, loading: isAuthLoading } = useUser() 
  const supabase = createClient()

  // 2. THIS EFFECT *REACTS* TO THE USER STATE.
  // When 'user' changes from null -> user, this re-runs.
  useEffect(() => {
    const fetchProjects = async () => {
      // 3. If the context says there's no user, set projects to empty.
      if (!user) {
        setProjects([])
        setIsProjectsLoading(false)
        return
      }

      // 4. If we have a user, THEN fetch their projects.
      setIsProjectsLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('created_by_user_id', user.id) // Use the user.id from context

      if (error) {
        console.error('Failed to fetch projects:', error)
        setError('Failed to load projects')
        setProjects([])
      } else {
        setProjects(data || [])
      }
      setIsProjectsLoading(false)
    }
    
    // 5. Don't run this fetch until the main auth is even done.
    if (!isAuthLoading) {
      fetchProjects()
    }

  }, [user, isAuthLoading, supabase]) // Dependencies are key!
  
  const handleOpenModal = () => {
    setError(null) 
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewProjectTitle('')
    setError(null)
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return
    setLoading(true)
    setError(null) 
    try {
     const res = await fetch('/api/projects', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ title: newProjectTitle.trim() }),
     }) 
     if (!res.ok) {
       const errData = await res.json()
       throw new Error(errData.error || 'Failed to create project')
     }  
     // --- THIS IS THE FIX... AGAIN ---
     // Your API route returns the project *directly*,
     // not wrapped in a { project: ... } object.
     const newProject: Project = await res.json()
     
     setProjects([...projects, newProject])
     handleCloseModal()
    } 
    catch (err) {
       console.error(err)
       const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
       setError(errorMessage)
    } finally {
       setLoading(false)
    }
   }

  return (
    <>
      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-background text-foreground p-2 rounded-md shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>


      {(isOpen || isModalOpen) && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => {
            setIsOpen(false)
            handleCloseModal()
          }}
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
              pathname === '/activity' ? 'bg-primary text-background' : 'text-secondary hover:bg-muted hover:text-foreground'
            )}
          >
            <Bell className="w-5 h-5" /> Activity
          </Link>

          {/* Projects Section */}
          <div className="mt-4">
            <p className="px-3 py-1 text-xs text-muted uppercase font-semibold mt-8">Projects</p>
            <div className="flex flex-col space-y-1">
              {/* This now correctly waits for auth, THEN shows a loading state, 
                THEN shows the projects.
              */}
              {isAuthLoading || isProjectsLoading ? (
                  <p className="px-3 py-2 text-sm text-muted">Loading projects...</p>
              ) : error ? (
                  <p className="px-3 py-2 text-sm text-red-500">{error}</p>
              ) : projects.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted">No projects yet.</p>
              ) : (
                projects.map((project) => (
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
                    {project.name}
                  </Link>
                ))
              )}

              <button
                onClick={handleOpenModal}
                className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-secondary hover:bg-muted hover:text-foreground transition-colors"
              >
                <Plus className="w-5 h-5" /> Add New Project
              </button>
            </div>
          </div>
        </nav>

        {/* This will *still* show its own loading state until the 
          master 'isAuthLoading' (from your context) is false.
        */}
        <SidebarFooter />
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg p-6 w-96 relative z-50">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Project Name"
                className="border border-border rounded-md px-3 py-2"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
              />
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-background px-4 py-2 rounded-md font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}