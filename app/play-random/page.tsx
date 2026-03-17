import { apiClient } from "@/lib/api/client"
import PlayRandomClient from "./PlayRandomClient"

export const revalidate = 300

export default async function PlayRandomPage() {
  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []

  try {
    const [trending, latest] = await Promise.all([
      apiClient.getTrendingSounds(1, 50),
      apiClient.getNewSounds(1, 50),
    ])
    const combined = [
      ...trending.data,
      ...latest.data.filter((s) => !trending.data.some((t) => t.id === s.id)),
    ]
    initialSounds = combined
  } catch {
    // ignore
  }

  return (
    <>
      <PlayRandomClient initialSounds={initialSounds} />
    </>
  )
}
