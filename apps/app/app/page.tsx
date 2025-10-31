'use client'

import { useUser } from '@/app/context/userContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/app/context/notificationsContext'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { FiFilter } from 'react-icons/fi'
import { BiSortAlt2 } from 'react-icons/bi'

const projects = [
  {
    course: 'Introduction to Chemistry',
    title: 'CHEM-101 Lab Report',
    progress: 75,
    due: 'Nov 25, 2023',
    avatars: [
      '/default-avatar.png',
      '/default-avatar.png',
      '/default-avatar.png',
    ],
    dueSoon: 2,
    overdue: 0,
  },
  {
    course: 'Marketing Principles',
    title: 'MKTG-205 Case Study',
    progress: 40,
    due: 'Dec 02, 2023',
    avatars: ['/default-avatar.png', '/default-avatar.png'],
    dueSoon: 0,
    overdue: 1,
  },
  {
    course: 'Software Engineering',
    title: 'CS-310 Capstone Project',
    progress: 95,
    due: 'Dec 15, 2023',
    avatars: [
      '/default-avatar.png',
      '/default-avatar.png',
      '/default-avatar.png',
      '/default-avatar.png',
    ],
    dueSoon: 0,
    overdue: 0,
  },
]

export default function PrivatePage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [search, setSearch] = useState('')

   const filteredProjects = projects.filter(
    (p) =>
      p.course.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [loading, user, router])

  if (loading) return <p>Loading session...</p>
  if (!user) return null

  const handleNotify = async () => {
    const newNotif = {
      id: uuidv4(),
      user_id: user.id,
      title: 'Hello World',
      message: 'This is a test notification',
      type: 'info',
      read: false,
      created_at: new Date().toISOString(),
    }

    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotif),
    })

    if (res.ok) addNotification(newNotif) // add only once
  }

  const goToProject = () => {
    router.push('/projects')
  }

  return (
    <DashboardLayout>
      <div className="p-8 bg-background min-h-screen font-sans">
      {/* Header */}
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-heading text-foreground font-extrabold">
          Project Dashboard
        </h1>

        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium">
            <FiFilter className="w-4 h-4" />
            Filter
          </button>

          <button className="flex items-center gap-1 px-3 py-1 text-foreground rounded-md hover:bg-hover transition-colors text-sm font-medium">
            <BiSortAlt2 className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>
      <p className="text-muted mb-6">
        An overview of all your active group projects.
      </p>

      {/* Search bar */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-sm"
        />
      </div>

      {/* Projects grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const progressColor = project.progress >= 80 ? 'bg-success' : project.progress >= 50 ? 'bg-warning' : 'bg-accent'
          return (
            <div
              key={project.title}
              className="bg-[rgba(255,255,255,0.02)] p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <p className="text-muted text-sm">{project.course}</p>
                <h2 className="text-foreground font-semibold text-lg">
                  {project.title}
                </h2>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-surface-alt rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${progressColor}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Progress info */}
                <div className="flex justify-between items-center mt-2 text-sm text-muted">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                {/* Members + badges */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex -space-x-2">
                    {project.avatars.map((avatar, idx) => (
                      <Image
                        key={idx}
                        src={avatar}
                        alt="avatar"
                        width={48}
                        height={48}
                        className="w-8 h-8 rounded-full border-2 border-surface"
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2 text-xs">
                    {project.dueSoon > 0 && (
                      <span className="px-2 py-1 bg-accent rounded-md">
                        {project.dueSoon} Due Soon
                      </span>
                    )}
                    {project.overdue > 0 && (
                      <span className="px-2 py-1 bg-error text-surface rounded-md">
                        {project.overdue} Overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-muted">
                <span>Due: {project.due}</span>
                <button className="text-primary hover:underline font-medium" onClick={goToProject}>
                  View Board
                  
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    </DashboardLayout>
  )
}
