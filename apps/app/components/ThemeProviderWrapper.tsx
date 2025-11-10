"use client"

import { ThemeProvider, type ThemeProviderProps } from "next-themes"
import { ReactNode, useEffect, useState, type ComponentType } from "react"

type ThemeProviderWrapperProps = ThemeProviderProps & {
  children: ReactNode
}

// Cast ThemeProvider to a ComponentType that includes children (no JSX namespace used)
const TypedThemeProvider = ThemeProvider as ComponentType<ThemeProviderProps & { children?: ReactNode }>

export default function ThemeProviderWrapper({ children, ...props }: ThemeProviderWrapperProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <TypedThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: 'light',
        dark: 'dark',
        ocean: 'theme-ocean',
        sunset: 'theme-sunset',
        midnight: 'theme-midnight',
        forest: 'theme-forest',
        rose: 'theme-rose',
        tech: 'theme-tech',
      }}
      {...props}
    >
      {children}
    </TypedThemeProvider>
  )
}