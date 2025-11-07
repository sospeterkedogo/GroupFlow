'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('bg-card p-4 rounded-xl shadow-md dark:shadow-background/20', className)}>
      {children}
    </div>
  )
}