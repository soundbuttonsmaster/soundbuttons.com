import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import MySoundboardClient from "./MySoundboardClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "My Soundboard - Your Sound Buttons | SoundButtons.com" },
  description:
    "View and manage your personal soundboard. Your uploaded and saved sound buttons in one place on SoundButtons.com.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/my-soundboard` },
  openGraph: {
    type: "website",
    title: "My Soundboard - Your Sound Buttons | SoundButtons.com",
    url: `${BASE}/my-soundboard`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "My Soundboard | SoundButtons.com" },
}

export default function MySoundboardPage() {
  return <MySoundboardClient />
}
