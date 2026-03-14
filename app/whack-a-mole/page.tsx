import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import WhackAMoleClient from "./WhackAMoleClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: {
    absolute: "Whack-a-Mole Game With Sound Buttons & Meme Soundboard",
  },
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
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 512, height: 512, alt: "Whack-a-Mole" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whack-a-Mole Game With Sound Buttons",
    description:
      "Play the fun Whack-a-Mole game with amazing sound effects! Hit the moles and score points.",
    images: [`${BASE}/og.png`],
  },
}

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: "Whack-a-Mole Game with Sound Buttons",
  description:
    "Play the fun Whack-a-Mole game with amazing sound effects! Hit the moles as they pop up and score points. Perfect for kids and families!",
  url: `${BASE}/whack-a-mole`,
  image: `${BASE}/og.png`,
  inLanguage: "en",
  genre: "Arcade, Sound, Kids, Family",
  gamePlatform: "Web Browser",
  numberOfPlayers: "1",
  playMode: "SinglePlayer",
}

export default function WhackAMolePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <WhackAMoleClient />
    </>
  )
}
