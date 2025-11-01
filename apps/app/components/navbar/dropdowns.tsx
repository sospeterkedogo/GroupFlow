'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function MobileDropdown({
  title,
  items,
}: {
  title: string
  items: { label: string; onClick?: () => void }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-3 py-2 rounded-md text-secondary hover:bg-muted hover:text-foreground transition-colors font-medium"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="flex flex-col pl-4 mt-1 space-y-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="text-secondary hover:text-foreground text-sm text-left transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
