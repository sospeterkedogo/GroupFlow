"use client"

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <h1 className="text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Getting Started
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Learn how to make the most of{" "}
          <span className="font-semibold text-primary">GroupFlow</span>. Here’s
          everything you need to start using it effectively.
        </p>
      </section>

      {/* Content Sections */}
      <section className="py-24 px-6 max-w-5xl mx-auto space-y-24">
        {/* Setup */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-primary">1. Create Your Account</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sign up using your email address to access your personal dashboard.
            You can manage all your settings and preferences from one place.
          </p>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              💡 <span className="font-medium">Tip:</span> Use a secure password and enable
              two-factor authentication for added protection.
            </p>
          </div>
        </div>

        {/* Features Overview */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-primary">2. Explore Core Features</h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground leading-relaxed">
            <li>Access your notifications panel for real-time updates.</li>
            <li>Create and organize projects or boards easily.</li>
            <li>Collaborate by sharing links or inviting users directly.</li>
            <li>Customize your interface through light and dark themes.</li>
          </ul>
        </div>

        {/* Data & Security */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-primary">3. Sync & Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            All your data is securely stored and synced via Supabase. You can access
            it on any device, and your updates will appear instantly across sessions.
          </p>
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-border rounded-2xl p-6 shadow-inner">
            <p className="text-muted-foreground leading-relaxed">
              We take privacy seriously. Your information is encrypted both in transit
              and at rest, ensuring maximum protection.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-10 rounded-3xl text-center shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold text-primary mb-3">Next Steps</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Continue exploring the advanced guides in the documentation — like integrating
            notifications, managing workspaces, and connecting third-party services.
          </p>
          <button className="px-8 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all">
            View Advanced Guides
          </button>
        </div>
      </section>
    </main>
  )
}
