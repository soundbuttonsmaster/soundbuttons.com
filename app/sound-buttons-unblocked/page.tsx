import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import SoundButtonsUnblockedClient from "./SoundButtonsUnblockedClient"

export const revalidate = 300

export default async function SoundButtonsUnblockedPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getTrendingSounds(1, 44)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  return (
    <>
      <SoundButtonsUnblockedClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
