import { soundEffectsApi } from "@/lib/api/sound-effects"
import SoundEffectsClient from "./SoundEffectsClient"

export const dynamic = "force-dynamic"

export default async function SoundEffectsPage() {
  let initialEffects: Awaited<ReturnType<typeof soundEffectsApi.getAll>> = []
  try {
    initialEffects = await soundEffectsApi.getAll()
  } catch {
    initialEffects = []
  }

  return (
    <>
      <SoundEffectsClient initialEffects={initialEffects} />
    </>
  )
}
