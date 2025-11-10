"use client"

// 1. IMPORT THE NEW CONTEXT
import { useSession } from '@/app/context/SessionContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import {Menu } from 'lucide-react'
import { FiFilter } from 'react-icons/fi'
import { BiSortAlt2 } from 'react-icons/bi'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import {useSidebar} from '@/app/context/SidebarContext' 

function DashboardContent() {
  const { 
    user, 
    loading: isAuthLoading, 
    projects, 
    projectsLoading 
  } = useSession()

  const { setIsOpen } = useSidebar()
  
  const router = useRouter()
  const [search, setSearch] = useState('')

  // This redirect logic is now SAFE.
  // It will only run AFTER the provider has finished loading
  // and confirmed there is no user.
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login')
    }
  }, [isAuthLoading, user, router])

  // 4. CREATE THE FILTERED LIST FROM CONTEXT STATE
  // This is fine.
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
        (p.course && p.course.toLowerCase().includes(search.toLowerCase()))
    )
  }, [projects, search])

 
  if (isAuthLoading) {
    return (
      <div className="p-8 bg-background min-h-screen font-sans flex items-center justify-center">
        <p className="text-muted">Loading session...</p>
      </div>
    )
  }

  // Helper to format the date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No due date'
    try {
      const date = new Date(dateString + 'T00:00:00')
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    } catch (_error) {
      return 'Invalid date'
    }
  }

  // If we get here, we either have a user, or we are
  // revalidating in the background. Either way, we render the page.
  return (
      <div className="p-8 bg-background min-h-screen font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          {/* Button to toggle sidebar in sm devices */}
          

          <h1 className="text-3xl font-heading text-foreground font-extrabold">
            Project Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium"
            >
              <FiFilter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium">
              <BiSortAlt2 size={16} />
              Sort
            </button>
          </div>
        </div>
        <p className="text-muted mb-6">An overview of all your active group projects.</p>

        {/* Search bar */}
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search projects by name or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-sm"
          />
        </div>

        {/* 6. PROJECTS GRID (Database-Driven) */}
        
        {/* Show loading spinner just for the projects */}
        {projectsLoading && filteredProjects.length === 0 && (
           <div className="text-center p-12">
             <p className="text-muted">Loading projects...</p>
           </div>
        )}
        
        {/* Show No Projects state */}
        {!projectsLoading && filteredProjects.length === 0 && (
           <div className="text-center p-12 bg-surface-alt rounded-lg">
             <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
             <p className="text-muted">
               {search ? 'Try adjusting your search terms.' : 'Get started by creating a new project in the sidebar!'}
             </p>
           </div>
        )}

        {/* Render the grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = project.progress || 0
            const progressColor =
              progress >= 80
                ? 'bg-success'
                : progress >= 50
                ? 'bg-warning'
                : 'bg-accent'
            
            return (
              <div
                key={project.id} // Use the database ID
                className="bg-surface-alt p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-muted text-sm">{project.course || 'No Course'}</p>
                  <h2 className="text-foreground font-semibold text-lg">{project.name}</h2>

                  <div className="mt-3 w-full bg-surface-alt rounded-full h-3">
                    <div className={`h-3 rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-sm text-muted">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-muted">
                  <span>Due: {formatDate(project.due_date)}</span>
                  <button 
                    className="text-primary hover:underline font-medium" 
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    View Board
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
