import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import TrendsPageClient from "./TrendsPageClient"

export const revalidate = 300

const PAGE_SIZE = 44
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Trending Sound Buttons & Viral Meme Soundboard",
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
    siteName: "SoundButtons.com",
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

function slugify(str: string): string {
  if (!str) return ""
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sound"
}

export default async function TrendsPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile =
    mobileHint === "?1" ||
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

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Sound Buttons & Viral Meme Soundboard",
    description:
      "Discover the most popular trending sound buttons and viral meme soundboard sound effects on SoundButtons.com.",
    url: `${BASE}/trends`,
    image: `${BASE}/og.png`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    },
  }

  const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: link.name,
    url: link.url,
  }))

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Trending", item: `${BASE}/trends` },
    ],
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Trending Sound Buttons & Viral Meme Soundboard",
    description:
      "Discover the most popular trending sound buttons and viral meme soundboard sound effects on SoundButtons.com. Play, download, and share the audio everyone is using across social media, gaming chats, and creator communities.",
    url: `${BASE}/trends`,
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
      name: "Trending Sound Buttons",
      description: "Collection of trending sound buttons and viral audio effects",
      numberOfItems: meta.total_items,
    },
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialSounds.slice(0, 10).map((sound, idx) => {
      const slug = `${slugify(sound.name)}-${sound.id}`
      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "AudioObject",
          name: sound.name,
          description: "Trending sound button",
          url: `${BASE}/${slug}`,
        },
      }
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {siteNavSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <TrendsPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
