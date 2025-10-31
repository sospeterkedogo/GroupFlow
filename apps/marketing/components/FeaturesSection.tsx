export default function FeaturesSection() {
  const features = [
    {
      title: "Stay Organized",
      desc: "Create boards, tasks, and notes that sync instantly.",
    },
    {
      title: "Smart Notifications",
      desc: "Receive real-time updates so you never miss an important event.",
    },
    {
      title: "Collaborate Effortlessly",
      desc: "Share progress with teammates or keep your workflow private — you decide.",
    },
  ]

  return (
    <section className="py-24 px-6 bg-foreground/5">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">What You Can Do</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          GroupFlow brings structure and simplicity to your daily work.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-background p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-primary mb-2">
              {f.title}
            </h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
