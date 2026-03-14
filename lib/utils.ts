import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/** Strip trailing "sound", "sound effect", "sound button" to avoid duplication */
export function getNameForTitle(name: string): string {
  let n = name.trim()
  const suffixes = [/\s+sound\s+button$/i, /\s+sound\s+effect$/i, /\s+sound$/i]
  for (const re of suffixes) {
    n = n.replace(re, "").trim()
  }
  return n || name
}

/** Display name: title case + strip trailing sound words */
export function getDisplaySoundName(name: string): string {
  return toTitleCase(getNameForTitle(name))
}

/** Suffix for FAQs/descriptions: "" if name has "sound button/effect", else " sound button" */
export function getSoundFaqSuffix(name: string): string {
  return /sound\s*button|sound\s*effect/i.test(name) ? "" : " sound button"
}
