/**
 * Shared logic for generateStaticParams - pre-render top sounds at build time
 * to reduce serverless invocations and improve CDN cache hit rate.
 */
import { apiClient } from "./client"
import { generateSlug } from "@/lib/utils/slug"

const TOP_SOUNDS_LIMIT = 400

export async function getTopSoundParams(): Promise<{ slug: string; id: string }[]> {
  try {
    const [trending, newSounds] = await Promise.all([
      apiClient.getTrendingSounds(1, 200),
      apiClient.getNewSounds(1, 200),
    ])
    const all = [...(trending.data ?? []), ...(newSounds.data ?? [])]
    const seen = new Set<number>()
    return all
      .filter((s) => !seen.has(s.id) && !!seen.add(s.id))
      .slice(0, TOP_SOUNDS_LIMIT)
      .map((s) => ({ slug: generateSlug(s.name) || "sound", id: String(s.id) }))
  } catch {
    return []
  }
}
