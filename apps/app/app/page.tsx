"use client"

import { useSession } from '@/app/context/SessionContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { FiFilter } from 'react-icons/fi'
import { BiSortAlt2 } from 'react-icons/bi'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useSidebar } from '@/app/context/SidebarContext'

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

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login')
    }
  }, [isAuthLoading, user, router])

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No due date'
    try {
      const date = new Date(dateString + 'T00:00:00')
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="p-4 sm:p-8 bg-background min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 ml-12">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl sm:text-3xl font-heading text-foreground font-extrabold">
            Project Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium">
            <FiFilter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium">
            <BiSortAlt2 size={16} />
            Sort
          </button>
        </div>
      </div>

      <p className="text-muted mb-6 text-sm sm:text-base">
        An overview of all your active group projects.
      </p>

      {/* Search bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search projects by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:max-w-md"
        />
      </div>

      {/* Loading State */}
      {projectsLoading && filteredProjects.length === 0 && (
        <div className="text-center p-12">
          <p className="text-muted">Loading projects...</p>
        </div>
      )}

      {/* Empty State */}
      {!projectsLoading && filteredProjects.length === 0 && (
        <div className="text-center p-8 sm:p-12 bg-surface-alt rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            No projects found
          </h3>
          <p className="text-muted text-sm sm:text-base">
            {search
              ? 'Try adjusting your search terms.'
              : 'Get started by creating a new project in the sidebar!'}
          </p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              key={project.id}
              className="bg-surface-alt p-4 sm:p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <p className="text-muted text-xs sm:text-sm">
                  {project.course || 'No Course'}
                </p>
                <h2 className="text-foreground font-semibold text-base sm:text-lg mt-1">
                  {project.name}
                </h2>

                <div className="mt-3 w-full bg-surface-alt rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-muted">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-xs sm:text-sm text-muted">
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
