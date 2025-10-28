'use client'

import Navbar from '../navbar/Navbar'
import Sidebar from '../Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface text-foreground transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border shadow-sm">
        <Sidebar />
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="h-13 flex justify-end items-center bg-background/80 backdrop-blur">
          <Navbar />
        </header>
        <main className="flex-1 px-6 overflow-y-auto ">{children}</main>
      </div>
    </div>
  )
}
