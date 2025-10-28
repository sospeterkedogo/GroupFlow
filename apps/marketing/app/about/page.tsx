"use client"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header Section */}
      <section className="py-20 px-6 text-center border-b border-secondary/20">
        <h1 className="text-5xl font-extrabold text-primary mb-4">About MyApp</h1>
        <p className="max-w-2xl mx-auto text-lg text-secondary">
          MyApp is a clean, focused tool built to simplify your daily workflow — nothing more, nothing less. 
          It’s designed for users who value speed, clarity, and control over clutter and noise.
        </p>
      </section>

      {/* Purpose Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Why It Exists</h2>
            <p className="text-secondary leading-relaxed">
              Most modern apps overcomplicate simple things. MyApp exists to do the opposite — to make your tasks, 
              goals, and communication flow effortlessly without unnecessary distractions or steps.
            </p>
            <p className="text-secondary leading-relaxed">
              Every feature in MyApp is designed to serve a clear purpose: to help you get things done faster, 
              stay organized, and actually enjoy using the tools that keep your life or work on track.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl p-12 flex items-center justify-center shadow-md">
            <span className="text-primary font-semibold text-lg">Purpose Illustration Placeholder</span>
          </div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section className="py-24 px-6 bg-foreground/5 dark:bg-background/40 transition-colors">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Built With Intention</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Every decision behind MyApp — from layout to performance — follows a single rule: 
            simplify the user’s experience without stripping away capability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-secondary/10">
            <h3 className="text-xl font-semibold text-primary mb-3">Speed</h3>
            <p className="text-secondary">
              MyApp runs fast, syncs instantly, and keeps your flow uninterrupted — because waiting kills momentum.
            </p>
          </div>
          <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-secondary/10">
            <h3 className="text-xl font-semibold text-primary mb-3">Clarity</h3>
            <p className="text-secondary">
              Clean design, smart structure, and minimal friction make navigation effortless and intuitive.
            </p>
          </div>
          <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-secondary/10">
            <h3 className="text-xl font-semibold text-primary mb-3">Control</h3>
            <p className="text-secondary">
              You decide how to use it. No forced workflows, no ads, and no unnecessary features you didn’t ask for.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Always Improving</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            MyApp is continuously evolving — with every update focused on performance, reliability, and smarter functionality. 
            The goal is simple: to build the kind of app you’ll rely on daily without even thinking about it.
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-secondary leading-relaxed">
            As a solo developer, each update comes directly from real user feedback and real-world use. 
            No corporate layers, no committees — just fast, thoughtful iteration that responds to how people actually use the app.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 text-center transition-colors">
        <h2 className="text-3xl font-bold text-primary mb-4">Try It for Yourself</h2>
        <p className="text-secondary mb-8 max-w-2xl mx-auto">
          MyApp isn’t built to impress — it’s built to help. Start using it today and experience a smoother, 
          faster, and more focused way to work and organize your world.
        </p>
        <a href="http://localhost:3001/auth/signup" className="px-8 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all">
          Get Started
        </a>
      </section>
    </main>
  )
}
