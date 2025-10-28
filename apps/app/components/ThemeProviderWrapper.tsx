"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode, useEffect, useState } from "react"

interface Props {
  children: ReactNode
}

export default function ThemeProviderWrapper({ children }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: 'light',
        dark: 'dark',
        ocean: 'theme-ocean', // custom theme
        sunset: 'theme-sunset',
        midnight: 'theme-midnight',
        forest: 'theme-forest',
        rose: 'theme-rose',
        tech: 'theme-tech',

      }}
    >
      {children}
    </ThemeProvider>
  )
}
