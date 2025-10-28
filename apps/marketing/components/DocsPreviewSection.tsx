import Link from "next/link"

export default function DocsPreviewSection() {
  const docs = [
    { title: "Getting Started", link: "/docs/getting-started" },
    { title: "Feature Guides", link: "/docs/features" },
    { title: "Troubleshooting", link: "/docs/troubleshooting" },
  ]

  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-3xl font-bold text-primary mb-4">Learn the App</h2>
      <p className="text-muted-foreground mb-12">
        Explore step-by-step guides to master every feature.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {docs.map((doc) => (
          <Link
            key={doc.title}
            href={doc.link}
            className="bg-background border border-border/20 rounded-xl px-8 py-5 text-primary font-medium hover:shadow-md transition-all"
          >
            {doc.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
