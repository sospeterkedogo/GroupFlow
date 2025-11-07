"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/layouts/DashboardLayout"

interface HelpTopic {
  id: string
  title: string
  description: string
  content: string
  href?: string
  category: string
}

const helpTopics: HelpTopic[] = [
  {
    id: "reset-password",
    title: "How do I reset my password?",
    description: "If you’ve forgotten your password or can’t log in.",
    content:
      "Go to the login page and click 'Forgot password'. Enter your registered email and check your inbox for a reset link. If you don’t see it within a few minutes, check your spam folder or contact support.",
    category: "Account",
  },
  {
    id: "demo-login",
    title: "Trying the demo version",
    description: "Access the demo workspace instantly without signing up.",
    content:
      "From the landing page, click 'Try Demo'. You’ll be automatically logged in as a demo user with sample data. Note that changes won’t be saved after logging out.",
    category: "Getting Started",
  },
  {
    id: "billing-upgrade",
    title: "Upgrading your account",
    description: "Unlock premium features using Stripe billing.",
    content:
      "Go to Settings → Billing. You can choose a plan and pay securely via Stripe. After successful payment, your account will refresh and premium features will be unlocked instantly.",
    category: "Billing",
  },
  {
    id: "notifications",
    title: "How notifications work",
    description: "Learn how and when you’ll get alerts.",
    content:
      "Notifications appear in the top-right bell icon. They’re pushed in real-time through Supabase subscriptions. Once you open them, they’ll be marked as read automatically and your count resets to zero.",
    category: "Core Features",
  },
  {
    id: "shared-workspaces",
    title: "Collaborating in shared workspaces",
    description: "Invite teammates and collaborate in real time.",
    content:
      "From your dashboard, click 'Invite Members'. Add their email, and they’ll get an invite link. All workspace updates sync live through Supabase Realtime.",
    category: "Collaboration",
  },
]

export default function HelpPage() {
  const [query, setQuery] = useState("")
  const filtered = helpTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.content.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-background px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Help & Support</h1>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search for help (e.g. billing, notifications, login)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border rounded-xl border-muted focus:ring-2 focus:ring-accent outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">No results found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((topic) => (
            <div key={topic.id} className="p-4 border rounded-xl hover:border-accent transition">
              <h2 className="text-xl font-semibold text-primary">{topic.title}</h2>
              <p className="text-sm text-muted mb-2">{topic.description}</p>
              <p className="text-foreground whitespace-pre-line">{topic.content}</p>
              {topic.href && (
                <Link
                  href={topic.href}
                  className="text-accent font-medium hover:underline mt-2 inline-block"
                >
                  Go to feature →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-2 text-primary">Still stuck?</h3>
        <p className="text-muted">
          Contact support or report an issue directly from{" "}
          <Link href="/feedback" className="text-accent hover:underline">
            the feedback page
          </Link>
          .
        </p>
      </div>
    </div>
    </DashboardLayout>
  )
}