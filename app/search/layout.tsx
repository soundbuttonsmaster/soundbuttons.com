import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com" },
  description:
    "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
  keywords:
    "search sound buttons, search sound effects, search meme sounds, audio search, sound button finder, sound effect search, meme audio search, free sound search, soundboard search",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/search`,
    languages: {
      en: `${BASE}/search`,
      fr: `${BASE}/fr/search`,
      pt: `${BASE}/pt/search`,
      es: `${BASE}/es/search`,
      "x-default": `${BASE}/search`,
    },
  },
  openGraph: {
    type: "website",
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
    description:
      "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
    url: `${BASE}/search`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Search Sound Buttons - Find Sound Effects & Meme Soundboard" }],
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
    description:
      "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
    images: [`${BASE}/og.png`],
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
