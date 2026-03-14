import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import {
  Gamepad2,
  Volume2,
  Users,
  Trophy,
  Star,
  Sparkles,
  Heart,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const revalidate = 300
const BASE = SITE.baseUrl

const games = [
  {
    id: "tic-tac-toe",
    title: "TikTok Toe",
    description:
      "Play Tic-Tac-Toe with fun sound effects! Choose your favorite sound and play against our friendly robot friend!",
    url: "/tic-tac-toe",
    features: ["Fun Sounds", "Robot Friend", "Easy to Play", "Super Fun"],
    category: "Puzzle",
    players: "1-2",
    difficulty: "Easy",
    playTime: "2-5 min",
    icon: Gamepad2,
    color: "bg-gradient-to-br from-pink-400 to-purple-500",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-pink-300 dark:border-pink-600",
    accentColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description:
      "Hit the moles as they pop up and score points! Each mole makes a fun sound when you whack it!",
    url: "/whack-a-mole",
    features: ["Sound Effects", "Score Points", "Fast Action", "Super Fun"],
    category: "Arcade",
    players: "1",
    difficulty: "Easy",
    playTime: "2 min",
    icon: Target,
    color: "bg-gradient-to-br from-green-400 to-yellow-500",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-600",
    accentColor: "bg-green-100 dark:bg-green-900/30",
  },
]

export const metadata: Metadata = {
  title: { absolute: "Kids Games - Fun Sound Buttons for Everyone" },
  description:
    "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects perfect for children and enjoy endless audio entertainment.",
  keywords:
    "kids games, fun games, sound games, tic tac toe, sound effects, children games, colorful games, interactive games",
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
    siteName: "SoundButtons.com",
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

export default function GamesPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Play Games With Sound Buttons And Soundboard Unblocked",
    description:
      "Super fun games for kids with amazing sound effects! Play TikTok Toe and more colorful games. Each game is like a magical adventure with sounds!",
    url: `${BASE}/games`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: games.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: game.title,
          description: game.description,
          url: `${BASE}${game.url}`,
        },
      })),
    },
  }

  const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: link.name,
    url: link.url,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {siteNavSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-950 dark:via-pink-950 dark:to-purple-950 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-10 w-14 h-14 bg-green-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }} />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 rounded-full shadow-lg mr-4">
                <Gamepad2 className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-2">
                  Fun Games!
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <Star className="h-6 w-6 text-pink-400" />
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-purple-700 dark:text-purple-300 max-w-4xl mx-auto font-semibold">
              Play super fun games with amazing sound effects! Each game is like a magical adventure
              with sounds!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {games.map((game) => {
              const IconComponent = game.icon
              return (
                <Card
                  key={game.id}
                  className={`shadow-2xl border-4 ${game.borderColor} rounded-3xl overflow-hidden bg-background/90 backdrop-blur`}
                >
                  <CardHeader className="text-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 pb-3">
                    <div className={`w-16 h-16 ${game.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className={`text-2xl font-bold ${game.textColor}`}>
                      {game.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <div className="flex flex-wrap gap-2">
                      {game.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`${game.accentColor} border-2 ${game.borderColor} rounded-full`}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`${game.accentColor} rounded-xl p-2 text-center border-2 ${game.borderColor}`}>
                        <Users className="h-4 w-4 mx-auto mb-1" />
                        <span className={`text-xs font-bold ${game.textColor}`}>{game.players} players</span>
                      </div>
                      <div className={`${game.accentColor} rounded-xl p-2 text-center border-2 ${game.borderColor}`}>
                        <Trophy className="h-4 w-4 mx-auto mb-1" />
                        <span className={`text-xs font-bold ${game.textColor}`}>{game.difficulty}</span>
                      </div>
                      <div className={`${game.accentColor} rounded-xl p-2 text-center border-2 ${game.borderColor}`}>
                        <Volume2 className="h-4 w-4 mx-auto mb-1" />
                        <span className={`text-xs font-bold ${game.textColor}`}>{game.playTime}</span>
                      </div>
                      <div className={`${game.accentColor} rounded-xl p-2 text-center border-2 ${game.borderColor}`}>
                        <Heart className="h-4 w-4 mx-auto mb-1" />
                        <span className={`text-xs font-bold ${game.textColor}`}>{game.category}</span>
                      </div>
                    </div>
                    <Link href={game.url}>
                      <Button
                        className={`w-full ${game.color} hover:opacity-90 text-white font-bold py-3 text-lg rounded-2xl`}
                        size="lg"
                      >
                        <Gamepad2 className="h-5 w-5 mr-2" />
                        PLAY NOW!
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center bg-muted/50 rounded-3xl p-8 mb-12 border-4 border-dashed">
            <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">More Fun Games Coming Soon!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We&apos;re making super awesome new games with amazing sounds! Get ready for more fun!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-6 py-2 text-sm">
                Memory Games
              </Badge>
              <Badge variant="outline" className="px-6 py-2 text-sm">
                Rhythm Games
              </Badge>
              <Badge variant="outline" className="px-6 py-2 text-sm">
                Puzzle Games
              </Badge>
              <Badge variant="outline" className="px-6 py-2 text-sm">
                Multiplayer Games
              </Badge>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Love Sound Effects?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our collection of sound buttons and create your own magical soundboards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <Button size="lg" className="w-full sm:w-auto">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Browse Sound Buttons
                </Button>
              </Link>
              <Link href="/create-sound">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Sound
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
