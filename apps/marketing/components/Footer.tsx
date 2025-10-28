import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} MyApp. Built with ❤️ by Sospeter Labs.</p>
      <div className="mt-3 space-x-4">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </div>
    </footer>
  )
}
