import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import FavoritesClient from "./FavoritesClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "My Favorites - Saved Sound Buttons | SoundButtons.com" },
  description:
    "View and play your favorite sound buttons. Sign in to save and manage your favorite meme sounds and sound effects on SoundButtons.com.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/favorites` },
  openGraph: {
    type: "website",
    title: "My Favorites - Saved Sound Buttons | SoundButtons.com",
    url: `${BASE}/favorites`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "My Favorites | SoundButtons.com" },
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
