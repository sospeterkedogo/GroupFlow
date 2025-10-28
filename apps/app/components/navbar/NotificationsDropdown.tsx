'use client'

import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { Notification, useNotifications } from '@/app/context/notificationsContext'

export default function NotificationsDropdown({
  open,
  toggle,
  notifications,
}: {
  open: string | null
  toggle: (name: string) => void
  notifications: Notification[]
}) {
  const router = useRouter()
  const { markNotificationAsRead } = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleToggle = () => {
    toggle('notifications') // just open/close, don’t mark as read
  }

  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) await markNotificationAsRead(n.id)
    setSelectedNotification(n)
  }

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative text-secondary hover:text-primary transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className={clsx(
              'absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent text-xs font-bold text-background transform transition-transform'
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open === 'notifications' && (
        <div className="absolute right-0 mt-3 w-64 bg-background border border-border rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold mb-2 text-primary border-b border-border p-3">Notifications</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 p-3">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={clsx(
                    'w-full text-left text-sm p-2 rounded-md transition-all',
                    n.read ? 'bg-accent/20 text-primary hover:bg-accent/40' : 'bg-secondary'
                  )}
                >
                  {n.title}
                </button>
              ))
            ) : (
              <p className="text-sm text-secondary">No new notifications</p>
            )}
          </div>
          <div className="p-2 flex float-right">
            <button
              onClick={() => {
                router.push('/notifications')
                toggle('notifications')
              }}
              className="w-full text-sm text-accent hover:underline"
            >
              View All →
            </button>
          </div>
        </div>
      )}

      {selectedNotification && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
          <div className="bg-background border border-border rounded-xl shadow-xl w-96 p-5 relative animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-3 right-3 text-secondary hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-primary mb-3">
              {selectedNotification.title}
            </h2>
            <p className="text-sm text-secondary whitespace-pre-line">
              {selectedNotification.message || 'No message content available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


