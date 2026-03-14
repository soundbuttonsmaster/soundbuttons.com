/**
 * Site nav links for schema - exact copy from sbmain siteNavLinks
 */

import { SITE } from "./site"

const BASE = SITE.baseUrl

export const SITE_NAV_LINKS = [
  { name: "Home", url: `${BASE}/` },
  { name: "Sound Buttons", url: `${BASE}/categories` },
  { name: "Soundboard", url: `${BASE}/categories/soundboard` },
  { name: "Sound Effects", url: `${BASE}/sound-effects` },
  { name: "Games", url: `${BASE}/games` },
  { name: "New", url: `${BASE}/new` },
  { name: "Trending", url: `${BASE}/trends` },
  { name: "About", url: `${BASE}/about-us` },
  { name: "Contact", url: `${BASE}/contact-us` },
  { name: "Sitemap", url: `${BASE}/sitemap` },
  { name: "Leaderboard", url: `${BASE}/leaderboard` },
] as const
