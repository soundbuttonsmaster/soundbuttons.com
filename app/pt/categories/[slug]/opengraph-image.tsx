import { ImageResponse } from "next/og"
import { getCategoryBySlug } from "@/lib/constants/categories"
import { LocaleOgImage, LOCALE_OG_SIZE } from "@/components/og/LocaleOgImage"

export const alt = "Sound Buttons - SoundButtons.com"
export const size = LOCALE_OG_SIZE
export const contentType = "image/png"

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  const categoryName = category?.name ?? "Soundboard"
  const categoryId = category?.id ?? 13
  return new ImageResponse(<LocaleOgImage title={categoryName} entityId={categoryId} />, { ...size })
}
