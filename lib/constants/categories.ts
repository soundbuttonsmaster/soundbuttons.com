/**
 * Categories - synced with API /categories
 * API uses categoryName without "Soundboard" (e.g. "Reactions", "Memes")
 * name = display name, apiName = name for API calls
 */

export interface Category {
  id: number
  name: string
  slug: string
  /** API expects this - e.g. "Reactions", "Memes" (no "Soundboard") */
  apiName: string
  /** Parent category slug (sbmain: e.g. animal-sounds subcategories) */
  parentSlug?: string
}

// Synced with API /categories - apiName matches API categoryName
export const CATEGORIES: Category[] = [
  { id: 7, name: "Reactions Soundboard", slug: "reactions", apiName: "Reactions" },
  { id: 8, name: "Sound Effects Soundboard", slug: "sound-effects", apiName: "Sound Effects" },
  { id: 9, name: "Voice Record Soundboard", slug: "voice-record", apiName: "Voice Record" },
  { id: 10, name: "Creativity Soundboard", slug: "creativity", apiName: "Creativity" },
  { id: 11, name: "Anime Soundboard", slug: "anime", apiName: "Anime" },
  { id: 12, name: "Games Soundboard", slug: "games", apiName: "Games" },
  { id: 13, name: "Memes Soundboard", slug: "memes", apiName: "Memes" },
  { id: 15, name: "Movies Soundboard", slug: "movies", apiName: "Movies" },
  { id: 16, name: "Animal Sounds Soundboard", slug: "animal-sounds", apiName: "Animal Sounds" },
  { id: 18, name: "Fart Soundboard", slug: "fart", apiName: "Fart" },
  { id: 21, name: "Laugh Soundboard", slug: "laugh", apiName: "Laugh" },
  { id: 33, name: "Tiktok Trends Soundboard", slug: "tiktok-trends", apiName: "Tiktok Trends" },
  { id: 34, name: "Squid Game Soundboard", slug: "squid-game", apiName: "Squid Game" },
  { id: 35, name: "Discord Soundboard", slug: "discord", apiName: "Discord" },
  { id: 51, name: "Whatsapp Audios Soundboard", slug: "whatsapp-audios", apiName: "Whatsapp Audios" },
  { id: 52, name: "Politics Soundboard", slug: "politics", apiName: "Politics" },
  { id: 56, name: "Pranks Soundboard", slug: "pranks", apiName: "Pranks" },
  { id: 57, name: "Phonics Soundboard", slug: "phonics", apiName: "Phonics" },
  // Subcategories of Animal Sounds (sbmain) – parentSlug for dropdown/index top-level only
  { id: 58, name: "Leopard Sound Soundboard", slug: "leopard-sound", apiName: "Leopard Sound", parentSlug: "animal-sounds" },
  { id: 59, name: "Bird Sounds Soundboard", slug: "bird-sounds", apiName: "Bird Sounds", parentSlug: "animal-sounds" },
  { id: 60, name: "Wolf Sounds Soundboard", slug: "wolf-sounds", apiName: "Wolf Sounds", parentSlug: "animal-sounds" },
  { id: 61, name: "Tiger Sounds Soundboard", slug: "tiger-sounds", apiName: "Tiger Sounds", parentSlug: "animal-sounds" },
  { id: 62, name: "Lion Sounds Soundboard", slug: "lion-sounds", apiName: "Lion Sounds", parentSlug: "animal-sounds" },
  { id: 63, name: "Monkey Sounds Soundboard", slug: "monkey-sounds", apiName: "Monkey Sounds", parentSlug: "animal-sounds" },
  { id: 64, name: "Bobcat Sounds Soundboard", slug: "bobcat-sounds", apiName: "Bobcat Sounds", parentSlug: "animal-sounds" },
  { id: 65, name: "Horse Sounds Soundboard", slug: "horse-sounds", apiName: "Horse Sounds", parentSlug: "animal-sounds" },
  { id: 66, name: "Elephant Sounds Soundboard", slug: "elephant-sounds", apiName: "Elephant Sounds", parentSlug: "animal-sounds" },
  { id: 67, name: "Chewbacca Sounds Soundboard", slug: "chewbacca-sounds", apiName: "Chewbacca Sounds", parentSlug: "animal-sounds" },
  { id: 68, name: "Dog Barking Sound Soundboard", slug: "dog-barking-sound", apiName: "Dog Barking Sound", parentSlug: "animal-sounds" },
  { id: 69, name: "Cat Sounds Soundboard", slug: "cat-sounds", apiName: "Cat Sounds", parentSlug: "animal-sounds" },
  { id: 70, name: "Dog Sounds Soundboard", slug: "dog-sounds", apiName: "Dog Sounds", parentSlug: "animal-sounds" },
  { id: 71, name: "Animal Sounds Coyote Soundboard", slug: "animal-sounds-coyote", apiName: "Animal Sounds Coyote", parentSlug: "animal-sounds" },
]

export function getActiveCategories(): Category[] {
  return CATEGORIES
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryById(id: number): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

/** Categories with no parent (for index and nav dropdown) */
export function getTopLevelCategories(): Category[] {
  return CATEGORIES.filter((c) => !c.parentSlug)
}

/** Subcategories of a parent slug (e.g. animal-sounds) */
export function getSubcategories(parentSlug: string): Category[] {
  return CATEGORIES.filter((c) => c.parentSlug === parentSlug)
}

/** Parent category when this one is a subcategory */
export function getParentCategory(category: Category): Category | undefined {
  if (!category.parentSlug) return undefined
  return CATEGORIES.find((c) => c.slug === category.parentSlug)
}
