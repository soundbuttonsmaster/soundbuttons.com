/**
 * Main nav links - from sbmain
 * Order: HOME, SOUND EFFECTS, NEW, TRENDING, [CATEGORIES], MEME SOUNDBOARD, PLAY RANDOM
 * All links in header DOM for Google sitelinks
 */
export const NAV_BEFORE_CATEGORIES = [
  { name: "Home", href: "/" },
  { name: "Sound Effects", href: "/categories/sound-effects" },
  { name: "New", href: "/new" },
  { name: "Trending", href: "/trends" },
] as const

export const NAV_AFTER_CATEGORIES = [
  { name: "Meme Soundboard", href: "/categories/memes" },
  { name: "Play Random", href: "/play-random" },
] as const

export const MAIN_NAV_LINKS = [...NAV_BEFORE_CATEGORIES, ...NAV_AFTER_CATEGORIES] as const
