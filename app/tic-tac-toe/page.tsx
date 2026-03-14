import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import TicTacToeClient from "./TicTacToeClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Play Tic Tac Toe with Sound Buttons | Fun, Colorful, and Challenging Game" },
  description:
    "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound and color, play against a smart bot, and enjoy winner effects. Try now!",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/tic-tac-toe` },
  openGraph: {
    type: "website",
    title: "Play Tic Tac Toe with Sound Buttons | Fun, Colorful, and Challenging Game",
    description:
      "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound and color, play against a smart bot, and enjoy winner effects. Try now!",
    url: `${BASE}/tic-tac-toe`,
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 512, height: 512, alt: "Tic Tac Toe" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Tic Tac Toe with Sound Buttons",
    description:
      "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound, play against a smart bot.",
    images: [`${BASE}/og.png`],
  },
}

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: "Tic Tac Toe with Sound Buttons",
  description:
    "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound and color, play against a smart bot, and enjoy winner effects. Try now!",
  url: `${BASE}/tic-tac-toe`,
  image: `${BASE}/og.png`,
  inLanguage: "en",
  genre: "Puzzle, Sound, Fun",
}

export default function TicTacToePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <TicTacToeClient />
    </>
  )
}
