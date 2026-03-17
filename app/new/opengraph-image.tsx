import { ImageResponse } from "next/og"
import { StaticOgImage, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/components/og/StaticOgImage"

export const alt = "New Sound Buttons - Fresh Meme Soundboard Audio Updated Daily"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="New Sound Buttons"
      subtitle="Fresh Meme Soundboard Audio Updated Daily"
    />,
    { ...size }
  )
}
