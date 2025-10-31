import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 text-center">
      <h2 className="text-3xl font-bold text-primary mb-4">
        Ready to boost your productivity?
      </h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Start using GroupFlow today its fast, intuitive, and free to try.
      </p>
      <Link href="/app">
        <Button className="font-semibold">
          Get Started
        </Button>
      </Link>
    </section>
  )
}
