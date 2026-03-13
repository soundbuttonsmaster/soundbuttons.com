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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
      style={{
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Sun
        className="h-5 w-5 absolute transition-opacity duration-200"
        style={{ opacity: mounted && isDark ? 1 : 0, pointerEvents: "none" }}
        aria-hidden
      />
      <Moon
        className="h-5 w-5 absolute transition-opacity duration-200"
        style={{
          opacity: mounted && !isDark ? 1 : mounted ? 0 : 1,
          pointerEvents: "none",
        }}
        aria-hidden
      />
    </button>
  )
}
