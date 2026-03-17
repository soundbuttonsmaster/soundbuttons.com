import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Sound Effects - Download Free Sound Effect for Videos" },
  description:
    "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads with no registration.",
  keywords:
    "sound effects, sound buttons, meme soundboard, unblocked sound buttons, free sound effects, download sound effects, sound effect library, audio library, sound design, sound effects for videos, sound effects for games, sound effects for podcasts, sound effects for streaming, professional sound effects, royalty free sound effects, sound buttons unblocked, soundboard download, funny sounds, notification sounds, ringtone sounds",
  publisher: "SoundButtons.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/sound-effects`,
    languages: { en: `${BASE}/sound-effects`, "x-default": `${BASE}/sound-effects` },
  },
  openGraph: {
    type: "website",
    title: "Sound Effects - Download Free Sound Effect for Videos",
    description:
      "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads.",
    url: `${BASE}/sound-effects`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/sound-effects/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sound Effects Library",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Effects - Download Free Sound Effect for Videos",
    description:
      "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads.",
    images: [
      {
        url: `${BASE}/sound-effects/opengraph-image`,
        alt: "Sound Effects Library",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function SoundEffectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sound Effects",
                item: BASE + "/sound-effects",
              },
            ],
          }),
        }}
      />
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
