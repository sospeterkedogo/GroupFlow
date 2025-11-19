'use client'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import ProductShowcase from '@/components/ProductShowcase'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  return (
    <main className="bg-background text-foreground transition-colors">
      <HeroSection />
      <FeaturesSection />
      <ProductShowcase />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />

    </main>
  )
}
