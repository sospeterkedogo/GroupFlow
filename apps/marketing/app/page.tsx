'use client'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import ProductShowcase from '@/components/ProductShowcase'
import PricingSection from '@/components/pricing/PricingSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  return (
    <main className="bg-background text-foreground transition-colors">
      <HeroSection />
      <FeaturesSection />
      <ProductShowcase />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />

    </main>
  )
}
