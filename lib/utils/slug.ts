/**
 * Slug utilities for sound URLs - format: /sound-name/{id}
 * Uses ASCII-only slugs for compatibility with HTTP headers, cache keys, and build systems.
 * Non-Latin names (Arabic, etc.) fall back to "sound" - pages are identified by ID.
 */

export function generateSlug(name: string): string {
  if (!name) return ""
  const ascii = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return ascii || "sound"
}

export function getSoundDetailPath(name: string, id: number): string {
  const baseSlug = generateSlug(name) || `sound`
  return `/${baseSlug}/${id}`
}

/** Path for sound effect detail: /sound-effects/slug/id */
export function getSoundEffectDetailPath(name: string, id: number): string {
  const baseSlug = generateSlug(name) || `sound-effect`
  return `/sound-effects/${baseSlug}/${id}`
}

/** Tag to search slug for /sound-effects/search/[query] */
export function tagToSearchSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

/** Search slug back to display tag name */
export function searchSlugToTag(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
