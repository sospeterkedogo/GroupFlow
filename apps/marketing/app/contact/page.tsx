"use client"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header Section */}
      <section className="py-20 px-6 text-center border-b border-secondary/20">
        <h1 className="text-5xl font-extrabold text-primary mb-4">Get in Touch</h1>
        <p className="max-w-2xl mx-auto text-lg text-secondary">
          Have questions, ideas, or feedback about the app? Drop a message — I’ll make sure it reaches me directly.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-foreground/5 dark:bg-background/40 p-8 rounded-3xl shadow-sm border border-secondary/10 transition-colors">
            <h2 className="text-2xl font-bold text-primary mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-secondary/20 bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-secondary/20 bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Message</label>
                <textarea
                  placeholder="Tell me about your question or idea..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-secondary/20 bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-3">Reach Out</h3>
              <p className="text-secondary">
                Whether it’s a quick question, a feature suggestion, or just feedback — I’ll read it and respond personally.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary uppercase mb-1">Email</p>
                <p className="font-medium text-foreground">hello@myapp.com</p>
              </div>

              <div>
                <p className="text-sm text-secondary uppercase mb-1">Twitter</p>
                <p className="font-medium text-foreground">@myapp_handle</p>
              </div>

              <div>
                <p className="text-sm text-secondary uppercase mb-1">GitHub</p>
                <p className="font-medium text-foreground">github.com/myapp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Friendly CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 transition-colors">
        <h2 className="text-3xl font-bold text-primary mb-4">Your Message Matters</h2>
        <p className="text-secondary mb-8 max-w-2xl mx-auto">
          I read every message and appreciate hearing from users. Your feedback helps make the app better for everyone.
        </p>
        <a
          href="#"
          className="px-8 py-3 bg-primary text-background font-semibold rounded-xl shadow-md hover:brightness-110 transition-all"
        >
          Send a Message
        </a>
      </section>
    </main>
  )
}
