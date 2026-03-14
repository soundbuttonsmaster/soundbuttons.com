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
