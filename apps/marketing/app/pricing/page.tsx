"use client"

import PricingSection from "@/components/pricing/PricingSection"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <section className="py-20 px-6 text-center border-b border-secondary/20">
        <h1 className="text-5xl font-extrabold text-primary mb-4">Choose the Plan That Fits You</h1>
        <p className="max-w-2xl mx-auto text-lg text-secondary">
          No hidden fees, no contracts — just clear pricing built for real users.
        </p>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA / FAQ Preview */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Built for Flexibility</h2>
        <p className="text-secondary mb-8 max-w-2xl mx-auto">
          Start free and upgrade whenever you’re ready. Your data and preferences stay with you — no matter the plan.
        </p>
        <a
          href="/docs"
          className="px-8 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all"
        >
          View Documentation
        </a>
      </section>
    </main>
  )
}
