import { ImageResponse } from "next/og"
import { apiClient } from "@/lib/api/client"
import { getDisplaySoundName } from "@/lib/utils"
import { LocaleOgImage, LOCALE_OG_SIZE } from "@/components/og/LocaleOgImage"

export const alt = "Sound Buttons - SoundButtons.com"
export const size = LOCALE_OG_SIZE
export const contentType = "image/png"

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { id } = await params
  const idNum = parseInt(id, 10)
  let soundName = "Sound"
  let soundId = idNum
  if (!isNaN(idNum) && idNum > 0) {
    try {
      const { data } = await apiClient.getSoundById(idNum)
      if (data) {
        if (data.name) soundName = getDisplaySoundName(data.name)
        soundId = data.id ?? idNum
      }
    } catch {
      // fallback
    }
  }
  return new ImageResponse(<LocaleOgImage title={soundName} entityId={soundId} />, { ...size })
}
