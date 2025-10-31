"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: "Docs", href: "/docs" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-background backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold font-heading text-primary hover:opacity-80 transition-opacity"
        >
          Group<span className="text-foreground">Flow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side: Theme + Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="http://localhost:3001/auth/login">
            <Button variant="ghost" className="text-sm font-medium">
              Log in
            </Button>
          </Link>
          <Link href="http://localhost:3001/auth/signup">
            <Button className="text-sm font-medium">
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Overlay + Slide Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dimmed backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40"
            />

            {/* Slide-out menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-background shadow-2xl p-8 flex flex-col space-y-8 z-50 md:hidden"
            >
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold font-heading text-primary opacity-0"
                >
                  My<span className="text-foreground">SaaS</span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <X size={26} />
                </button>
              </div>

              <nav className="flex flex-col space-y-6 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <Link href="http://localhost:3001/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-sm font-medium">
                    Log in
                  </Button>
                </Link>
                <Link href="http://localhost:3001/auth/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full text-sm font-medium">
                    Sign up
                  </Button>
                </Link>
                <div className="flex justify-center mt-4">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
