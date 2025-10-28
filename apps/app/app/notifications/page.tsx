'use client'

import { useUser } from '@/app/context/userContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useNotifications, Notification } from '@/app/context/notificationsContext'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function NotificationsPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { notifications } = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [loading, user, router])

  if (loading || !user) return null

  return (
    <DashboardLayout>
      <div className="space-y-3 p-4">
        <h2 className="text-xl font-semibold text-primary">Notifications</h2>
        {notifications.length === 0 && <p>No notifications yet.</p>}
        <ul >
          {notifications.map(n => (
            <li key={n.id}>
              <button onClick={() => setSelectedNotification(n)} className={clsx("block w-full p-3 border-b hover:bg-muted text-left", n.read ? "bg-accent/20 text-primary hover:bg-accent/40" : "bg-secondary")}>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-secondary truncate">{n.message}</p>
              </button>
            </li>
          ))}
        </ul>

        {selectedNotification && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
            <div className="bg-background border border-border rounded-xl shadow-xl w-96 p-5 relative">
              <button onClick={() => setSelectedNotification(null)} className="absolute top-3 right-3 text-secondary hover:text-primary transition-colors">
                <X size={18} />
              </button>
              <h2 className="text-lg font-semibold text-primary mb-3">{selectedNotification.title}</h2>
              <p className="text-sm text-secondary whitespace-pre-line">{selectedNotification.message || 'No message content available.'}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
