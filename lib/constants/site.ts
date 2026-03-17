/**
 * Site-wide constants for Sound Buttons (from sbmain - live site)
 * Same meta, schema, slugs as old soundbuttons.com
 */

export const SITE = {
  name: "Sound Buttons",
  nameShort: "SoundButtons",
  domain: "soundbuttons.com",
  baseUrl: "https://soundbuttons.com",
  email: "play@soundbuttons.com",
  contactEmail: "play@soundbuttons.com",
} as const

export type Locale = "en" | "es" | "pt" | "fr"

const localeBases: Record<Locale, string> = {
  en: SITE.baseUrl,
  es: `${SITE.baseUrl}/es`,
  pt: `${SITE.baseUrl}/pt`,
  fr: `${SITE.baseUrl}/fr`,
}

export function getLocaleBase(locale: Locale): string {
  return localeBases[locale]
}
