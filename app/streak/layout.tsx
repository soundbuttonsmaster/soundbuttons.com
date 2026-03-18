import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Streak - Daily Play Streaks & Leaderboard | SoundButtons.com" },
  description:
    "Build your daily streak by logging in and playing 5+ sounds each day. Compete on the global streak leaderboard and earn a colorful profile outline and badge.",
  keywords:
    "sound buttons streak, daily streak, play streak, soundboard streak, streak leaderboard, profile badge",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL("https://soundbuttons.com"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://soundbuttons.com/streak",
    languages: {
      en: "https://soundbuttons.com/streak",
      "x-default": "https://soundbuttons.com/streak",
    },
  },
  openGraph: {
    type: "website",
    title: "Streak - Daily Play Streaks & Leaderboard",
    description:
      "Build your daily streak by logging in and playing 5+ sounds each day. Compete on the global streak leaderboard.",
    url: "https://soundbuttons.com/streak",
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Streak - Daily Play Streaks & Leaderboard",
    description:
      "Build your daily streak by logging in and playing 5+ sounds each day.",
  },
  themeColor: "#f97316",
  formatDetection: { telephone: false },
}

export default function StreakLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
