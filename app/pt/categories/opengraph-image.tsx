import { ImageResponse } from "next/og"
import { LocaleOgImage, LOCALE_OG_SIZE } from "@/components/og/LocaleOgImage"

export const alt = "Categorias de Botões de Som - SoundButtons.com"
export const size = LOCALE_OG_SIZE
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(<LocaleOgImage title="Categorias de Botões de Som" />, { ...size })
}
