// components/ui/dropdown-menu.tsx
'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface DropdownMenuProps {
  children: ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuTrigger({ children }: { children: ReactNode; asChild?: boolean }) {
  return <>{children}</>
}

export function DropdownMenuContent({ children, className, align = 'end' }: { children: ReactNode; className?: string; align?: 'start' | 'end' }) {
  return (
    <div
      className={clsx(
        'absolute z-50 mt-2 min-w-max rounded-md border bg-background shadow-lg py-1',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  className?: string;
}

export function DropdownMenuItem({ children, className, ...props }: DropdownMenuItemProps) {
  return (
    <button
      className={clsx('w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-4 py-2 text-xs font-semibold text-secondary uppercase', className)}>{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="my-1 border-t border-secondary" />
}
