import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Trending Sound Buttons & Viral Meme Soundboard" },
  description:
    "Discover the most popular trending sound buttons and viral meme soundboard and sound effects on SoundButtons.com.",
  keywords:
    "trending sounds, viral sound buttons, popular sound effects, trending audio clips, viral meme sounds, trending soundboard, popular audio effects, viral sound effects, trending gaming sounds, popular meme buttons, viral notification sounds, popular audio clips, trending comedy sounds, viral meme sounds, trending music sounds, viral unblocked sounds, trending gaming sounds, viral discord sounds, popular meme effects, viral tiktok sounds, trending notification sounds, viral streaming sounds, popular comedy effects, viral entertainment sounds, trending viral effects, viral content creation sounds, popular gaming effects, viral social media sounds",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/trends`,
    languages: { en: `${BASE}/trends`, fr: `${BASE}/fr/trends`, "x-default": `${BASE}/trends` },
  },
  openGraph: {
    type: "website",
    title: "Trending Sound Buttons & Viral Meme Soundboard",
    description:
      "Discover the most popular trending sound buttons and viral meme soundboard and sound effects on SoundButtons.com.",
    url: `${BASE}/trends`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Trending Sound Buttons & Viral Meme Soundboard" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Trending Sound Buttons & Viral Meme Soundboard",
    description:
      "Discover the most popular trending sound buttons and viral meme soundboard and sound effects on SoundButtons.com.",
    images: [`${BASE}/og.png`],
  },
}

export default function TrendsLayout({
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
              { "@type": "ListItem", position: 2, name: "Trends", item: `${BASE}/trends` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
