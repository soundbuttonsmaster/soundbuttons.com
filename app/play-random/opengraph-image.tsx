import { ImageResponse } from "next/og"
import { StaticOgImage, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/components/og/StaticOgImage"

export const alt = "Play Random Sound – Fun Sound Button Generator"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="Play Random Sound"
      subtitle="Fun Sound Button Generator"
    />,
    { ...size }
  )
}
