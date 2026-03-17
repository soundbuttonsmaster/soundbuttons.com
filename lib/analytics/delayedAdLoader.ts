/**
 * Lazy-load Google Analytics - Non-blocking
 *
 * Loads GA only after:
 * 1. Page is fully loaded and interactive
 * 2. User interaction (scroll, click, etc.) OR 8s timeout
 * 3. requestIdleCallback when appending script
 *
 * Improves FCP, LCP, TBT, Speed Index.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __analyticsLoaded?: boolean;
    __gaInitialized?: boolean;
  }
}

const GA_MEASUREMENT_ID = "G-7JTM90LHN4"
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

interface LoadOptions {
  delayAfterLoad?: number
  useIdleCallback?: boolean
  minDelay?: number
}

const DEFAULT_OPTIONS: LoadOptions = {
  delayAfterLoad: 3000,
  useIdleCallback: true,
  minDelay: 5000,
}

const ensureGtagStub = () => {
  if (typeof window === "undefined") return

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }
  }

  if (!window.__gaInitialized) {
    window.__gaInitialized = true
    window.gtag("js", new Date())
  }
}

const loadGoogleAnalyticsScript = async (options: LoadOptions = {}): Promise<void> => {
  if (typeof window === "undefined") return

  ensureGtagStub()

  if (window.__analyticsLoaded) {
    return Promise.resolve()
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GA_SCRIPT_SRC}"]`)
  if (existingScript) {
    window.__analyticsLoaded = true
    return Promise.resolve()
  }

  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve) => {
    const appendScript = () => {
      try {
        const script = document.createElement("script")
        script.src = GA_SCRIPT_SRC
        script.async = true
        script.id = "ga-gtag"

        script.onload = () => {
          window.__analyticsLoaded = true
          window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false })
          resolve()
        }

        script.onerror = () => {
          window.__analyticsLoaded = true
          resolve()
        }

        const inject = () => {
          if ("requestIdleCallback" in window && opts.useIdleCallback) {
            ;(window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
              () => {
                document.head.appendChild(script)
              },
              { timeout: 2000 }
            )
          } else {
            document.head.appendChild(script)
          }
        }

        inject()
      } catch {
        window.__analyticsLoaded = true
        resolve()
      }
    }

    const executeWithDelay = () => {
      const delay = Math.max(opts.delayAfterLoad ?? 0, opts.minDelay ?? 0)
      if (delay > 0) {
        setTimeout(appendScript, delay)
      } else {
        appendScript()
      }
    }

    if (document.readyState === "complete") {
      executeWithDelay()
    } else {
      window.addEventListener("load", executeWithDelay, { once: true })
    }
  })
}

export const trackGoogleAnalyticsPageview = (url: string) => {
  if (typeof window === "undefined") return

  ensureGtagStub()
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export const initializeGoogleAnalyticsStub = () => {
  if (typeof window === "undefined") return
  ensureGtagStub()
}

/**
 * Load GA on first user interaction or after 8s.
 */
export const loadGoogleScriptsOnInteraction = () => {
  if (typeof window === "undefined") return

  let loaded = false

  const loadScripts = () => {
    if (loaded) return
    loaded = true
    void loadGoogleAnalyticsScript()

    window.removeEventListener("scroll", loadScripts)
    window.removeEventListener("click", loadScripts)
    window.removeEventListener("touchstart", loadScripts)
    window.removeEventListener("mousemove", loadScripts)
    window.removeEventListener("keydown", loadScripts)
  }

  window.addEventListener("scroll", loadScripts, { once: true, passive: true })
  window.addEventListener("click", loadScripts, { once: true, passive: true })
  window.addEventListener("touchstart", loadScripts, { once: true, passive: true })
  window.addEventListener("mousemove", loadScripts, { once: true, passive: true })
  window.addEventListener("keydown", loadScripts, { once: true, passive: true })

  setTimeout(() => {
    if (!loaded) {
      loadScripts()
    }
  }, 8000)
}
