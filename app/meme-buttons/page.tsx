import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import MemeButtonsClient from "./MemeButtonsClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Meme Buttons - Play Viral Meme Sound Effects & Funny Sounds" },
  description:
    "Play the best meme buttons! Thousands of viral meme sounds, funny sound effects, and trending audio. Free meme sound buttons for Discord, TikTok, streaming, and more.",
  keywords:
    "meme buttons, meme sounds, viral meme sounds, funny sounds, meme sound effects, meme soundboard, trending memes, discord sounds, tiktok sounds, sound buttons",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/meme-buttons`,
    languages: { en: `${BASE}/meme-buttons`, "x-default": `${BASE}/meme-buttons` },
  },
  openGraph: {
    type: "website",
    title: "Meme Buttons - Play Viral Meme Sound Effects & Funny Sounds",
    description:
      "Play the best meme buttons! Thousands of viral meme sounds, funny sound effects, and trending audio. Free meme sound buttons for Discord, TikTok, streaming.",
    url: `${BASE}/meme-buttons`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Meme Buttons" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Buttons - Play Viral Meme Sound Effects & Funny Sounds",
    description:
      "Play the best meme buttons! Thousands of viral meme sounds, funny sound effects, and trending audio.",
    images: [`${BASE}/og.png`],
  },
}

export default async function MemeButtonsPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const PAGE_SIZE = 44
  let initialSounds: Awaited<ReturnType<typeof apiClient.getSoundsByCategory>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getSoundsByCategory("Memes", 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // fallback to trending if Memes category fails
    try {
      const res = await apiClient.getTrendingSounds(1, PAGE_SIZE)
      initialSounds = res.data
      meta = res.meta
    } catch {
      // ignore
    }
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Meme Buttons - Play Viral Meme Sound Effects",
    description:
      "Play the best meme buttons! Thousands of viral meme sounds, funny sound effects, and trending audio. Free meme sound buttons.",
    url: `${BASE}/meme-buttons`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Meme Buttons", item: `${BASE}/meme-buttons` },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {siteNavSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <MemeButtonsClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
