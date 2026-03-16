"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Languages } from "lucide-react"
import type { Locale } from "@/lib/i18n/strings"

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  pt: "PT",
  fr: "FR",
}

function getPathForLocale(pathname: string, targetLocale: Locale): string {
  const withoutLocale = pathname?.replace(/^\/(es|pt|fr)(\/|$)/, "$2") || "/"
  const base = withoutLocale === "/" ? "" : withoutLocale
  if (targetLocale === "en") return base || "/"
  return base ? `/${targetLocale}${base}` : `/${targetLocale}`
}

export function LanguageChanger() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLocale: Locale = pathname?.startsWith("/es")
    ? "es"
    : pathname?.startsWith("/pt")
      ? "pt"
      : pathname?.startsWith("/fr")
        ? "fr"
        : "en"

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (locale: Locale) => {
    if (locale === currentLocale) {
      setOpen(false)
      return
    }
    const path = getPathForLocale(pathname ?? "", locale)
    setOpen(false)
    router.push(path)
  }

  const locales: Locale[] = ["en", "es", "pt", "fr"]

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 min-w-[2.25rem] items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Languages className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline text-sm font-medium">{LOCALE_LABELS[currentLocale]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[7rem] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(locale)}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                locale === currentLocale
                  ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
