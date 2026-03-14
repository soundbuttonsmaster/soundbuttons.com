import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import NewPageClient from "./NewPageClient"

export const revalidate = 300

const PAGE_SIZE = 35
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
  description:
    "Discover the latest sound buttons and soundboard with fresh, trending audio clips updated daily to play, download, and share for memes, gaming, and entertainment!",
  keywords:
    "new sound buttons, latest sound effects, fresh audio clips, new meme sounds, trending sound buttons, latest soundboard, new audio effects, fresh sound effects, new gaming sounds, latest meme buttons, new notification sounds, fresh soundboard, new viral sounds, latest audio clips, new comedy sounds, fresh meme sounds, new music sounds, latest sound effects, new unblocked sounds, fresh gaming sounds, new discord sounds, latest meme effects, new tiktok sounds, fresh notification sounds, new streaming sounds, latest comedy effects, new entertainment sounds, fresh viral effects, new content creation sounds, latest gaming effects, new social media sounds",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/new`,
    languages: { en: `${BASE}/new`, fr: `${BASE}/fr/new`, "x-default": `${BASE}/new` },
  },
  openGraph: {
    type: "website",
    title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
    description:
      "Discover the latest sound buttons and soundboard with fresh, trending audio clips updated daily to play, download, and share for memes, gaming, and entertainment!",
    url: `${BASE}/new`,
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "New Sound Buttons - Latest Sound Effects" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
    description:
      "Discover the latest sound buttons and soundboard with fresh, trending audio clips updated daily to play, download, and share for memes, gaming, and entertainment!",
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

export default async function NewPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile =
    mobileHint === "?1" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const initialCount = isMobile ? 20 : 35
  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "New Sound Buttons - Latest Sound Effects",
    description:
      "Discover the latest new sound buttons and sound effects on SoundButtons.com! Fresh, trending audio clips updated daily.",
    url: `${BASE}/new`,
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
      { "@type": "ListItem", position: 2, name: "New Sounds", item: `${BASE}/new` },
    ],
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "New Sound Buttons - Latest Sound Effects",
    description:
      "Discover the latest new sound buttons and sound effects on SoundButtons.com! Fresh, trending audio clips updated daily. Play, download, and share the newest sound buttons for memes, gaming, and entertainment.",
    url: `${BASE}/new`,
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
      name: "New Sound Buttons",
      description: "Collection of latest sound buttons and audio effects",
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
          description: "New sound button",
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
      <NewPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
