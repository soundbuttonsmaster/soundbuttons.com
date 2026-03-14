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
