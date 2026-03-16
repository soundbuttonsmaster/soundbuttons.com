/**
 * Schema.org structures matching old site (sbmain) for policy/about/contact pages.
 * Used so new site meta and JSON-LD match old 100%.
 */

import { SITE } from "./site"

const BASE = SITE.baseUrl

/** Old site policy nav: 11 SiteNavigationElement entries (each as separate script on old). */
export const OLD_POLICY_NAV_ELEMENTS = [
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Home", url: `${BASE}/` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Sound Buttons", url: `${BASE}/categories` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Soundboard", url: `${BASE}/categories/soundboard` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Games", url: `${BASE}/games` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Mic Test", url: `${BASE}/mic-test` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "New", url: `${BASE}/new` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Trending", url: `${BASE}/trends` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "About", url: `${BASE}/about-us` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Contact", url: `${BASE}/contact-us` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Sitemap", url: `${BASE}/sitemap` },
  { "@context": "https://schema.org" as const, "@type": "SiteNavigationElement" as const, name: "Leaderboard", url: `${BASE}/leaderboard` },
]

export const OLD_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  name: "Sound Buttons",
  alternateName: ["SoundButtons", "SoundButtons.com", "Meme Soundboard"],
  url: BASE,
  description: "Play thousands of free sound buttons, meme sounds, and sound effects. The best meme soundboard online.",
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/search/{search_term_string}` },
    "query-input": "required name=search_term_string",
  },
}

export const OLD_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "Sound Buttons",
  url: BASE,
  logo: { "@type": "ImageObject" as const, url: `${BASE}/icons/icon-192x192.png`, width: 192, height: 192 },
  sameAs: [BASE],
}

export const OLD_NAV_GRAPH_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Home", url: `${BASE}/` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "New Sound Buttons", url: `${BASE}/new` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Trending Sound Buttons", url: `${BASE}/trends` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Sound Button Categories", url: `${BASE}/categories` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Meme Soundboard", url: `${BASE}/meme-soundboard` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Sound Effects", url: `${BASE}/sound-effects` },
    { "@type": "SiteNavigationElement" as const, "@id": `${BASE}/#navigation`, name: "Play Random Sound", url: `${BASE}/play-random` },
  ],
}
