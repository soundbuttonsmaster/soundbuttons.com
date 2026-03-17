import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Whack-a-Mole Game With Sound Buttons & Meme Soundboard | SoundButtons.com" },
  description:
    "Play the fun Whack-a-Mole game with amazing sound effects! Hit the moles as they pop up and score points. Perfect for kids and families!",
  keywords:
    "whack a mole game, sound game, kids game, interactive game, sound effects, fun game, family game, arcade game",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/whack-a-mole` },
  openGraph: {
    type: "website",
    title: "Whack-a-Mole Game With Sound Buttons & Meme Soundboard",
    description:
      "Play the fun Whack-a-Mole game with amazing sound effects! Hit the moles as they pop up and score points. Perfect for kids and families!",
    url: `${BASE}/whack-a-mole`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Whack-a-Mole Game" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Whack-a-Mole Game With Sound Buttons",
    description:
      "Play the fun Whack-a-Mole game with amazing sound effects! Hit the moles and score points.",
    images: [`${BASE}/og.png`],
  },
}

export default function WhackAMoleLayout({
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
              { "@type": "ListItem", position: 3, name: "Whack-a-Mole", item: `${BASE}/whack-a-mole` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
