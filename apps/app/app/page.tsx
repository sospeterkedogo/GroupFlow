'use client'

import { useUser } from '@/app/context/userContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/app/context/notificationsContext'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/client'

export default function PrivatePage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()
  const { addNotification } = useNotifications()

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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <p className="text-xl font-semibold text-primary">
          Hello, {profile?.firstname || user.email}!
        </p>
        <p>Avatar: {profile?.avatar_url || 'N/A'}</p>
        <Button onClick={handleNotify}>Send Notification</Button>
      </div>
    </DashboardLayout>
  )
}
