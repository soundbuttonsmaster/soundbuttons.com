import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import SoundboardClient from "./SoundboardClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Meme Soundboard: Play Instant Sound Effects Buttons" },
  description:
    "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
  keywords:
    "soundboard, meme soundboard, gaming soundboard, discord soundboard, unblocked soundboard, viral sounds, sound buttons, free soundboard, online soundboard, instant sound effects, downloadable memes, streaming audio",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/soundboard`,
    languages: { en: `${BASE}/soundboard`, "x-default": `${BASE}/soundboard` },
  },
  openGraph: {
    type: "website",
    title: "Meme Soundboard: Play Instant Sound Effects Buttons",
    description:
      "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
    url: `${BASE}/soundboard`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1200,
        height: 630,
        alt: "Soundboard - Play & Download the Best Soundboard Buttons Online",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Soundboard: Play Instant Sound Effects Buttons",
    description:
      "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
    images: [`${BASE}/og.png`],
  },
}

const PAGE_SIZE = 44

export default async function SoundboardPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getTrendingSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Soundboard with Sound Buttons & Meme Soundboard Unblocked",
    description:
      "Best free soundboard with 100,000+ sound buttons including meme soundboard unblocked, gaming sounds, Discord effects, viral audio - instant play & download.",
    url: `${BASE}/soundboard`,
    image: `${BASE}/og.png`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${BASE}/` },
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Soundboard Collections",
      description: "Collection of soundboard dashboards and audio effects",
      numberOfItems: initialSounds.length,
    },
  }

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SoundButtons Soundboard",
    description: "Online soundboard application for playing and downloading sound effects",
    url: `${BASE}/soundboard`,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "SoundButtons.com", url: `${BASE}/` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Soundboard", item: `${BASE}/soundboard` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
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
      <SoundboardClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
