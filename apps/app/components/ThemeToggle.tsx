import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const themes = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "ocean", label: "Ocean" },
  { key: "sunset", label: "Sunset" },
  { key: "midnight", label: "Midnight" },
  { key: "forest", label: "Forest" },
  { key: "rose", label: "Rose" },
  { key: "tech", label: "Tech" },
]

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map(t => (
        <Button
          key={t.key}
          onClick={() => setTheme(t.key)}
          variant={currentTheme === t.key ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {t.label}
        </Button>
      ))}
    </div>
  )
}
