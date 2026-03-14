"use client"

import type { Sound } from "@/lib/types/sound"
import SoundButton from "./sound-button"

interface EmbedSoundPlayerProps {
  sound: Sound
}

export default function EmbedSoundPlayer({ sound }: EmbedSoundPlayerProps) {
  return (
    <div
      className="flex items-center justify-center bg-transparent"
      style={{ width: 300, height: 90, minWidth: 300, minHeight: 90 }}
    >
      <SoundButton sound={sound} hideLabel={true} hideActions={true} customSize={56} />
    </div>
  )
}
