import { ImageResponse } from "next/og"
import { StaticOgImage, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/components/og/StaticOgImage"

export const alt = "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="Sound Buttons"
      subtitle="9,99,999+ Meme Soundboard Unblocked"
    />,
    { ...size }
  )
}
