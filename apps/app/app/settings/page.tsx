'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const [email, setEmail] = useState('user@example.com')
  const [username, setUsername] = useState('user123')
  const [notifications, setNotifications] = useState({
    marketing: true,
    updates: false,
    reminders: true,
  })

  return (
    <DashboardLayout>
      <main className="bg-background text-foreground min-h-screen p-6 space-y-12 transition-colors">
        <h1 className="text-3xl font-heading font-bold mb-6 text-foreground">
          Account Settings
        </h1>

        {/* Account Info */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Profile Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-muted mb-1">Username</label>
              <input
                type="text"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <Button className="mt-4" variant="default">
            Save Changes
          </Button>
        </section>

        {/* Password Section */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted mb-1">Current Password</label>
              <input
                type="password"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-muted mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-muted mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
          </div>
          <Button className="mt-4" variant="default">
            Update Password
          </Button>
        </section>

        {/* Notifications Section */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Notifications</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                className="accent-primary"
              />
              <span className="text-foreground">Marketing Emails</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.updates}
                onChange={() => setNotifications({ ...notifications, updates: !notifications.updates })}
                className="accent-primary"
              />
              <span className="text-foreground">Product Updates</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.reminders}
                onChange={() => setNotifications({ ...notifications, reminders: !notifications.reminders })}
                className="accent-primary"
              />
              <span className="text-foreground">Reminders</span>
            </label>
          </div>
          <Button className="mt-4" variant="default">
            Save Notification Settings
          </Button>
        </section>

        {/* Privacy Section */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Privacy</h2>
          <p className="text-muted">
            Manage your privacy settings. Control who can see your profile and activity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-primary" />
              <span className="text-foreground">Show profile publicly</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-primary" />
              <span className="text-foreground">Share activity with friends</span>
            </label>
          </div>
          <Button className="mt-4" variant="default">
            Save Privacy Settings
          </Button>
        </section>

        {/* Appearance Section */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Appearance</h2>
          <p className="text-muted">Choose your preferred theme and interface options.</p>
          <div className="space-y-2">
            <Button variant="default">Light Theme</Button>
            <Button variant="default">Dark Theme</Button>
            <Button variant="default">Tech Theme</Button>
            <Button variant="default">Ocean Theme</Button>
          </div>
        </section>

        {/* Extra Sections to force scrolling */}
        {Array.from({ length: 5 }).map((_, i) => (
          <section key={i} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-semibold text-primary">Extra Section {i + 1}</h2>
            <p className="text-muted">This is some extra content to make the page scrollable.</p>
          </section>
        ))}
      </main>
    </DashboardLayout>
  )
}
