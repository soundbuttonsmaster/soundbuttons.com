import { ImageResponse } from "next/og"
import {
  StaticOgImage,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "@/components/og/StaticOgImage"

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export const alt = "Sound Buttons - SoundButtons.com"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default async function OgImage({
  params,
}: {
  params: Promise<{ query: string }>
}) {
  const { query } = await params
  const name = toTitleCase(query.replace(/-/g, " "))

  return new ImageResponse(
    <StaticOgImage
      title={`${name} Soundboard`}
      subtitle="Play Instant Sound Effect Button"
    />,
    { ...size }
  )
}
