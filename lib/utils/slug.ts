/**
 * Slug utilities for sound URLs - format: /sound-name/{id}
 */

export function generateSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
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
