/**
 * Categories - sbmain slugs: /categories/memes, /categories/games, etc.
 */

export interface Category {
  id: number
  name: string
  slug: string
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export const CATEGORIES: Category[] = [
  { id: 1, name: "Memes", slug: "memes" },
  { id: 2, name: "Games", slug: "games" },
  { id: 3, name: "Anime", slug: "anime" },
  { id: 4, name: "Reactions", slug: "reactions" },
  { id: 5, name: "Movies", slug: "movies" },
  { id: 6, name: "Sound Effects", slug: "sound-effects" },
  { id: 7, name: "Politics", slug: "politics" },
]

export function getActiveCategories(): Category[] {
  return CATEGORIES
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
