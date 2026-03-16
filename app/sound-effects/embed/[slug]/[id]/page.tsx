import { notFound } from "next/navigation"
import { soundEffectsApi, type SoundEffect } from "@/lib/api/sound-effects"
import EmbedSoundPlayer from "@/components/sound/embed-sound-player"
import type { Sound } from "@/lib/types/sound"

interface EmbedPageProps {
  params: Promise<{ slug: string; id: string }>
}

export const metadata = {
  robots: "noindex, nofollow",
}

function toSound(effect: SoundEffect): Sound {
  const soundFile = soundEffectsApi.getSoundFileUrl(effect)
  return {
    id: effect.id,
    name: effect.soundName || "",
    sound_file: soundFile,
    views: effect.views ?? 0,
    likes_count: 0,
    favorites_count: 0,
  }
}

export default async function SoundEffectEmbedPage({ params }: EmbedPageProps) {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) {
    notFound()
  }

  const effect = await soundEffectsApi.getById(idNum)
  if (!effect) {
    notFound()
  }

  const sound: Sound = toSound(effect)

  return (
    <div className="min-h-screen bg-transparent">
      <EmbedSoundPlayer sound={sound} />
    </div>
  )
}
