/**
 * Smart path resolution for locale-aware routing.
 * Use localized paths only when the page exists in that locale; otherwise use English path.
 */

import type { Locale } from "./strings"

/** Exact paths that have es/pt/fr versions in app/es, app/pt, app/fr */
const LOCALIZED_EXACT = ["", "/", "/new", "/trends", "/categories", "/search"] as const

/** Path prefixes that have locale versions */
const LOCALIZED_PREFIXES = ["/categories/", "/search/"] as const

/**
 * Returns true if the given path has a localized version (es, pt, fr).
 * Path should be normalized (no leading locale prefix).
 */
export function pathHasLocaleVersion(path: string): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const trimmed = normalized.replace(/\/$/, "") || "/"

  // Exact match
  if (LOCALIZED_EXACT.includes(trimmed as (typeof LOCALIZED_EXACT)[number])) return true

  // Prefix match
  for (const prefix of LOCALIZED_PREFIXES) {
    if (trimmed.startsWith(prefix)) return true
  }

  // Sound detail: /slug/numericId (two segments, second is numeric)
  const parts = trimmed.split("/").filter(Boolean)
  if (parts.length === 2 && /^\d+$/.test(parts[1]!)) return true

  return false
}

/**
 * Returns the correct href for a path given the current locale.
 * - If locale is "en" or path has no locale version: returns base path (e.g. /register)
 * - Else: returns localized path (e.g. /es/new)
 */
export function getLocalizedHref(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const basePath = normalized === "/" ? "" : normalized

  if (locale === "en") return basePath || "/"
  if (!pathHasLocaleVersion(basePath || "/")) return basePath || "/"

  return `/${locale}${basePath}`
}
