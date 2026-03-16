import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import UploadSoundClient from "./UploadSoundClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Upload Sound Button - Share Your Sounds | SoundButtons.com" },
  description:
    "Upload your own sound buttons to SoundButtons.com. Share meme sounds, sound effects, and audio clips with the community.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/upload-sound` },
  openGraph: {
    type: "website",
    title: "Upload Sound Button - Share Your Sounds | SoundButtons.com",
    url: `${BASE}/upload-sound`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "Upload Sound Button | SoundButtons.com" },
}

export default function UploadSoundPage() {
  return <UploadSoundClient />
}
