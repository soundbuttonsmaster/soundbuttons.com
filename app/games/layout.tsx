import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Kids Games - Fun Sound Buttons for Everyone | SoundButtons.com" },
  description:
    "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects perfect for children and enjoy endless audio entertainment.",
  keywords:
    "kids games, fun games, sound games, tic tac toe, whack a mole, sound effects, children games, colorful games, interactive games",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/games`,
    languages: { en: `${BASE}/games`, "x-default": `${BASE}/games` },
  },
  openGraph: {
    type: "website",
    title: "Kids Games - Fun Sound Buttons for Everyone",
    description:
      "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects perfect for children.",
    url: `${BASE}/games`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Kids Games" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Kids Games - Fun Sound Buttons for Everyone",
    description:
      "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects.",
    images: [`${BASE}/og.png`],
  },
}

export default function GamesLayout({
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
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Games", item: `${BASE}/games` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
