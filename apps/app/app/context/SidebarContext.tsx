'use client'

import { createContext, useContext } from 'react'

// 1. Define the context shape
interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// 2. Create the context
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
)

// 3. Create the custom hook for easy access
export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}