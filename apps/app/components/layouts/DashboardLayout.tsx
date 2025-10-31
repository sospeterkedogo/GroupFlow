'use client'

import Navbar from '../navbar/Navbar'
import Sidebar from '../Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface text-foreground transition-colors">
      {/* Sidebar */}
        <Sidebar />
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 overflow-y-auto ">{children}</main>
      </div>
    </div>
  )
}
