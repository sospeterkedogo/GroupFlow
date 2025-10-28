"use client"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  ctaText: string
  ctaLink: string
  highlight?: boolean
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  ctaText,
  ctaLink,
  highlight = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-3xl border border-secondary/10 flex flex-col shadow-sm transition-all ${
        highlight
          ? "bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 scale-105 hover:shadow-lg"
          : "bg-background hover:shadow-md"
      }`}
    >
      <div className="p-8 text-center flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-secondary mb-6">{description}</p>
        <p className="text-4xl font-extrabold text-foreground mb-6">{price}</p>

        <ul className="text-secondary space-y-3 text-sm flex-1">
          {features.map((f) => (
            <li key={f}>✔ {f}</li>
          ))}
        </ul>
      </div>

      <div className="p-8 text-center">
        <a
          href={ctaLink}
          className="px-6 py-3 w-full inline-block bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all"
        >
          {ctaText}
        </a>
      </div>
    </div>
  )
}
