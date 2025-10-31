import Link from 'next/link'
import { Button } from '@/components/ui/button'
import  DemoLoginButton  from './DemoLoginButton'

export default function HeroSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 text-center bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
          Simplify your workflow.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 px-2">
          GroupFlow helps you organize, collaborate, and stay productive all in one clean interface.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <DemoLoginButton />

          <Link href="/docs">
            <Button variant="outline" className="w-full sm:w-auto">
              Read Docs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
