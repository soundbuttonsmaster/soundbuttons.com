import { ImageResponse } from "next/og"
import { LocaleOgImage, LOCALE_OG_SIZE } from "@/components/og/LocaleOgImage"

export const alt = "Sound Buttons - SoundButtons.com"
export const size = LOCALE_OG_SIZE
export const contentType = "image/png"

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ query: string }>
}) {
  const { query } = await params
  const name = toTitleCase(query.replace(/-/g, " "))
  return new ImageResponse(<LocaleOgImage title={`${name} Soundboard`} entityId={1} />, { ...size })
}
