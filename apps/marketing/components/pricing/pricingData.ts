export const pricingPlans = [
  {
    title: "Free",
    price: "£0.00/mo",
    description: "Perfect for trying out MyApp or managing small personal projects.",
    features: [
      "Access to basic tools",
      "Sync across devices",
      "Limited storage",
      "Email support"
    ],
    ctaText: "Get Started",
    ctaLink: "/signup?plan=free",
    highlight: false,
  },
  {
    title: "Pro",
    price: "£2.99/mo",
    description: "For users who want the full experience and advanced customization options.",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Priority sync",
      "Cloud backups",
      "Priority support"
    ],
    ctaText: "Upgrade to Pro",
    ctaLink: "/signup?plan=pro",
    highlight: true,
  },
  {
    title: "Enterprise",
    price: "£24.99",
    description: "For organizations needing advanced scalability and custom tools.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated storage",
      "Advanced analytics",
      "Direct developer support"
    ],
    ctaText: "Upgrade to Enterprise",
    ctaLink: "/signup?plan=enterprise",
    highlight: false,
  },
]
