"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  initializeGoogleAnalyticsStub,
  loadGoogleScriptsOnInteraction,
  trackGoogleAnalyticsPageview,
} from "@/lib/analytics/delayedAdLoader"

export function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    initializeGoogleAnalyticsStub()
    loadGoogleScriptsOnInteraction()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const scheduleTracking = (fn: () => void) => {
      if ("requestIdleCallback" in window) {
        ;(window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(fn, { timeout: 2000 })
      } else {
        setTimeout(fn, 0)
      }
    }

    if (pathname) {
      scheduleTracking(() => {
        trackGoogleAnalyticsPageview(pathname)
      })
    }
  }, [pathname])

  return null
}
