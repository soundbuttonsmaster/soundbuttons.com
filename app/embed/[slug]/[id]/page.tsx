import { notFound } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import EmbedSoundPlayer from "@/components/sound/embed-sound-player"

interface EmbedPageProps {
  params: Promise<{ slug: string; id: string }>
}

export const metadata = {
  robots: "noindex, nofollow",
}

export default async function EmbedSoundPage({ params }: EmbedPageProps) {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) {
    notFound()
  }

  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-transparent">
      <EmbedSoundPlayer sound={sound} />
    </div>
  )
}
