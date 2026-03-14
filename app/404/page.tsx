import type { Metadata } from "next"
import { NotFoundContent } from "@/components/404-content"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Page Not Found (404) | SoundButtons.com - Sound Buttons & Sound Effects",
  description:
    "The page you're looking for doesn't exist. Explore our collection of thousands of free sound buttons, sound effects, and meme soundboards instead!",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/404` },
  openGraph: {
    type: "website",
    title: "Page Not Found (404) | SoundButtons.com",
    description:
      "The page you're looking for doesn't exist. Explore our collection of thousands of free sound buttons, sound effects, and meme soundboards instead!",
    url: `${BASE}/404`,
    siteName: "SoundButtons.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Not Found (404) | SoundButtons.com",
    description:
      "The page you're looking for doesn't exist. Explore our collection of thousands of free sound buttons and sound effects!",
  },
  keywords:
    "404, page not found, sound buttons, sound effects, meme soundboard, soundboard unblocked",
  authors: [{ name: "SoundButtons.com" }],
}

export default function NotFoundPage() {
  return <NotFoundContent />
}
