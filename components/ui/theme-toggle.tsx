"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? resolvedTheme || theme : "light"
  const isDark = currentTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className="h-4 w-4 absolute transition-opacity duration-200"
        style={{ opacity: mounted && isDark ? 1 : 0, pointerEvents: "none" }}
        aria-hidden
      />
      <Moon
        className="h-4 w-4 absolute transition-opacity duration-200"
        style={{
          opacity: mounted && !isDark ? 1 : mounted ? 0 : 1,
          pointerEvents: "none",
        }}
        aria-hidden
      />
    </button>
  )
}
