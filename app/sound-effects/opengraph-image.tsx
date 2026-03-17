import { ImageResponse } from "next/og"
import {
  StaticOgImage,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "@/components/og/StaticOgImage"

export const alt =
  "Sound Effects - Download Free Sound Effect for Videos | SoundButtons.com"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="Sound Effects"
      subtitle="Download Free Sound Effect for Videos"
    />,
    { ...size }
  )
}
