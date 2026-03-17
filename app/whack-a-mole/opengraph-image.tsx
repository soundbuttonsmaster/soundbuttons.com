import { ImageResponse } from "next/og"
import {
  StaticOgImage,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "@/components/og/StaticOgImage"

export const alt =
  "Whack-a-Mole Game With Sound Buttons | SoundButtons.com"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    <StaticOgImage
      title="Whack-a-Mole Game"
      subtitle="Hit the Moles with Sound Effects!"
    />,
    { ...size }
  )
}
