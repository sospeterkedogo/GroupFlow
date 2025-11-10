'use client'

import { useState } from 'react' // Remove createContext, useContext
import Sidebar from '../Sidebar'
// Import the context from its NEW file
import { SidebarContext } from '@/app/context/SidebarContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false) // This is correct

  return (
    // This provider now correctly uses the imported context
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex h-screen bg-surface text-foreground transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1 overflow-y-auto ">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}