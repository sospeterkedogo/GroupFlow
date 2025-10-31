'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?:
    | 'default'    // main brand button
    | 'secondary'  // subtle/secondary actions
    | 'accent'     // highlight / call-to-action
    | 'danger'     // destructive action
    | 'success'    // success/confirm
    | 'ghost'      // minimal background
    | 'outline'    // bordered button
}

export function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  const baseClasses =
    'rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 font-sans cursor-pointer'

  const variantClasses = {
    default: 'bg-primary text-background hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-background hover:bg-secondary/90 focus:ring-secondary',
    accent: 'bg-accent text-background hover:bg-accent/90 focus:ring-accent',
    danger: 'bg-error text-background hover:bg-error/90 focus:ring-error',
    success: 'bg-success text-background hover:bg-success/90 focus:ring-success',
    ghost: 'bg-transparent text-foreground hover:bg-muted focus:ring-primary',
    outline: 'bg-transparent text-foreground border border-border hover:bg-muted/10 focus:ring-primary',
  }

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
