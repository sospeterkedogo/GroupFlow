'use client'

export default function ProductShowcase() {
  return (
    <section className="relative py-24 px-6 bg-surface text-foreground transition-colors overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight font-heading">
            Elevate Your Workflow
          </h2>
          <p className="text-lg text-secondary max-w-lg font-sans">
            Our platform unifies your most important tools into a single intuitive experience. Plan smarter, execute faster, and collaborate effortlessly.
          </p>
          <ul className="space-y-3 text-foreground/80 font-sans">
            <li className="flex items-start space-x-2"><span className="text-accent text-xl">✔</span> Organize tasks efficiently with automation</li>
            <li className="flex items-start space-x-2"><span className="text-accent text-xl">✔</span> Track real-time performance analytics</li>
            <li className="flex items-start space-x-2"><span className="text-accent text-xl">✔</span> Collaborate seamlessly with your team</li>
          </ul>
          <div className="pt-4 flex flex-wrap gap-4">
            <a href="http://localhost:3001" className="px-6 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all">Get Started</a>
            <a href="/docs" className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary/10 transition-all">Learn More</a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-md h-72 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-foreground/70 font-semibold text-lg font-sans">
              Product Preview Placeholder
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
