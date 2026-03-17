import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Meme Soundboard: Play Instant Sound Effects Buttons" },
  description:
    "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
  keywords:
    "soundboard, meme soundboard, gaming soundboard, discord soundboard, unblocked soundboard, viral sounds, sound buttons, free soundboard, online soundboard, instant sound effects, downloadable memes, streaming audio",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/soundboard`,
    languages: { en: `${BASE}/soundboard`, "x-default": `${BASE}/soundboard` },
  },
  openGraph: {
    type: "website",
    title: "Meme Soundboard: Play Instant Sound Effects Buttons",
    description:
      "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
    url: `${BASE}/soundboard`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/soundboard/opengraph-image`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Soundboard - Play & Download the Best Soundboard Buttons Online",
        secureUrl: `${BASE}/soundboard/opengraph-image`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Soundboard: Play Instant Sound Effects Buttons",
    description:
      "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
    images: [`${BASE}/soundboard/opengraph-image`],
  },
}

export default function SoundboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 blur-3xl dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-30" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 opacity-30 blur-3xl dark:from-pink-900 dark:via-indigo-900 dark:to-blue-900 dark:opacity-20" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </>
  )
}
