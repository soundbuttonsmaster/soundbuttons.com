import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Play Tic Tac Toe with Sound Buttons | Fun, Colorful, and Challenging Game | SoundButtons.com" },
  description:
    "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound and color, play against a smart bot, and enjoy winner effects. Try now!",
  keywords:
    "tic tac toe, tiktok toe, sound game, kids game, puzzle game, sound effects, interactive game, fun game",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/tic-tac-toe` },
  openGraph: {
    type: "website",
    title: "Play Tic Tac Toe with Sound Buttons | Fun, Colorful, and Challenging Game",
    description:
      "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound and color, play against a smart bot, and enjoy winner effects. Try now!",
    url: `${BASE}/tic-tac-toe`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Tic Tac Toe Game" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Play Tic Tac Toe with Sound Buttons",
    description:
      "Play the most fun and challenging Tic Tac Toe game with sound buttons! Pick your sound, play against a smart bot.",
    images: [`${BASE}/og.png`],
  },
}

export default function TicTacToeLayout({
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
              { "@type": "ListItem", position: 3, name: "Tic Tac Toe", item: `${BASE}/tic-tac-toe` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
