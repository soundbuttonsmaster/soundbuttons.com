import { Suspense } from "react"
import AiSoundButtonsClient from "./AiSoundButtonsClient"

export const revalidate = 300

export default function AiSoundButtonsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <AiSoundButtonsClient />
    </Suspense>
  )
}
