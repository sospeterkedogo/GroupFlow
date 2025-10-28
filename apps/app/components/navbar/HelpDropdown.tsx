'use client'

import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

export default function HelpDropdown({
  open,
  toggle,
}: {
  open: string | null
  toggle: (name: string) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={() => toggle('help')}
        className="text-secondary hover:text-primary transition-colors"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {open === 'help' && (
        <div className="absolute right-0 mt-3 w-64 bg-background border border-border rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold mb-2 text-primary">Help & Support</h3>
          <p className="text-sm text-secondary mb-2">
            Need help? Check our FAQ or contact us directly.
          </p>
          <ul className="text-sm space-y-1">
            <li>
              Email:{' '}
              <span className="text-primary">support@mysaas.com</span>
            </li>
            <li>
              Docs:{' '}
              <Link
                href="/help"
                className="text-accent hover:underline"
                onClick={() => toggle('help')}
              >
                Open Help Center
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
