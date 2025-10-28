'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { BiQuestionMark } from 'react-icons/bi'

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Help', href: '/help', icon: BiQuestionMark },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger button (visible only on mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-background p-2 rounded-md shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Dark overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={clsx(
          'fixed md:static z-50 top-0 left-0 h-full w-64 bg-surface-alt border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out' ,
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="text-2xl font-bold font-heading text-primary hover:opacity-80 transition-opacity"
          >
            My<span className="text-foreground">SaaS</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium',
                pathname === href
                  ? 'bg-primary text-background'
                  : 'text-secondary hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-muted">
          © 2025 MySaaS
        </div>
      </aside>
    </>
  )
}
