import { ImageResponse } from "next/og"
import {
  StaticOgImage,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "@/components/og/StaticOgImage"

export const alt =
  "Trending Sound Buttons & Viral Meme Soundboard | SoundButtons.com"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="Trending Sound Buttons"
      subtitle="Viral Meme Soundboard & Popular Sounds"
    />,
    { ...size }
  )
}
