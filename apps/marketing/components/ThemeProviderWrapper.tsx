"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode, useEffect, useState } from "react"

interface CustomThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
  value?: { [key: string]: string };
}

export default function ThemeProviderWrapper({ children, ...props }: CustomThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <ThemeProvider
      attribute={"class" as any}
      defaultTheme="system"
      enableSystem
      value={{
        light: 'light',
        dark: 'dark',
        ocean: 'theme-ocean', // custom theme
      }}
      {...props}
    >
      {children}
    </ThemeProvider>
  )
}
