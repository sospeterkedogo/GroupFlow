"use client"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <section className="py-20 px-6 text-center border-b border-secondary/20">
        <h1 className="text-5xl font-extrabold text-primary mb-4">Powerful Features That Just Work</h1>
        <p className="max-w-2xl mx-auto text-lg text-secondary">
          Every feature in <span className="font-semibold text-primary">MyApp</span> is built to help you move faster, stay organized, and get things done without friction.
        </p>
      </section>

      {/* Core Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Real-Time Updates</h3>
            <p className="text-secondary">
              Stay in sync instantly. Every change, notification, or update appears the moment it happens — no refresh required.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Smart Notifications</h3>
            <p className="text-secondary">
              Never miss what matters. Notifications are delivered instantly and intelligently, keeping noise low and focus high.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Secure Cloud Sync</h3>
            <p className="text-secondary">
              Your data lives safely in the cloud with encrypted storage and automatic backups you can trust.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Offline Mode</h3>
            <p className="text-secondary">
              Keep working even when your internet doesn’t. Everything syncs automatically once you’re back online.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Custom Workflows</h3>
            <p className="text-secondary">
              Adapt the app to your workflow. Create spaces, boards, and tools that fit your process — not the other way around.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-secondary/10 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-primary mb-3">Cross-Platform Access</h3>
            <p className="text-secondary">
              Use it anywhere — desktop, mobile, or web. Your workspace stays connected, secure, and fast across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Built for Everyday Use</h2>
        <p className="text-secondary max-w-2xl mx-auto mb-8">
          Whether you’re managing personal projects or building something big, <span className="font-semibold text-primary">MyApp</span> grows with you — feature by feature.
        </p>
        <a href="/docs" className="px-8 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all">
          Explore Documentation
        </a>
      </section>
    </main>
  )
}
