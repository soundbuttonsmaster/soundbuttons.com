import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"
import HomePageClient from "@/components/home/HomePageClient"

export const revalidate = 60

const HOME_TITLE = "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked"
const HOME_DESCRIPTION =
  "Play thousands of sound buttons with the best sound, buttons, meme, prank, sound effect, and high-quality audio in one powerful soundboard unblocked"

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  keywords: [
    "sound buttons",
    "meme sounds",
    "sound effects",
    "soundboard",
    "unblocked sound buttons",
    "free sound effects",
    "viral sounds",
    "meme soundboard",
    "audio effects",
  ],
  authors: [{ name: "SoundButtons.com", url: SITE.baseUrl }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  generator: "Next.js",
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: SITE.baseUrl,
    languages: {
      en: SITE.baseUrl,
      es: `${SITE.baseUrl}/es`,
      pt: `${SITE.baseUrl}/pt`,
      fr: `${SITE.baseUrl}/fr`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.baseUrl,
    siteName: "SoundButtons.com",
    alternateLocale: ["fr_FR"],
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/og.png", alt: HOME_TITLE }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#2563eb",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
  other: {
    rating: "general",
    target: "all",
    coverage: "worldwide",
    copyright: "© 2025 SoundButtons.com",
    distribution: "global",
    language: "en",
    "MobileOptimized": "width",
    "HandheldFriendly": "true",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default async function HomePage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile =
    mobileHint === "?1" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      userAgent
    )

  const trendingCount = isMobile ? 16 : 44
  const newCount = 22

  let trendingSounds: Awaited<
    ReturnType<typeof apiClient.getTrendingSounds>
  >["data"] = []
  let newSounds: Awaited<
    ReturnType<typeof apiClient.getNewSounds>
  >["data"] = []
  let trendingMeta = {
    current_page: 1,
    last_page: 1,
    total_items: 0,
  }

  try {
    const [trendingResult, newResult] = await Promise.allSettled([
      apiClient.getTrendingSounds(1, trendingCount),
      apiClient.getNewSounds(1, newCount),
    ])

    if (trendingResult.status === "fulfilled") {
      trendingSounds = trendingResult.value.data
      trendingMeta = trendingResult.value.meta
    }
    if (newResult.status === "fulfilled") {
      newSounds = newResult.value.data
    }
  } catch {
    // ignore
  }

  const BASE = SITE.baseUrl

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SoundButtons.com",
    url: `${BASE}/`,
    description: HOME_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "New", item: `${BASE}/new` },
      { "@type": "ListItem", position: 3, name: "Trending", item: `${BASE}/trends` },
      { "@type": "ListItem", position: 4, name: "Memes Soundboard", item: `${BASE}/categories/memes` },
      { "@type": "ListItem", position: 5, name: "Games Soundboard", item: `${BASE}/categories/games` },
      { "@type": "ListItem", position: 6, name: "Anime Soundboard", item: `${BASE}/categories/anime` },
      { "@type": "ListItem", position: 7, name: "Reactions Soundboard", item: `${BASE}/categories/reactions` },
      { "@type": "ListItem", position: 8, name: "Movies Soundboard", item: `${BASE}/categories/movies` },
      { "@type": "ListItem", position: 9, name: "Meme Soundboard", item: `${BASE}/soundboard` },
      { "@type": "ListItem", position: 10, name: "Meme Soundboard", item: `${BASE}/meme-soundboard` },
    ],
  }

  const allSoundsForList = [...trendingSounds, ...newSounds]
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    numberOfItems: allSoundsForList.length,
    itemListElement: allSoundsForList.map((sound, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sound.name,
      url: `${BASE}/${generateSlug(sound.name)}/${sound.id}`,
    })),
  }

  const personOrgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Siya P",
        jobTitle: "Founder & Creator",
        worksFor: { "@type": "Organization", name: "SoundButtons.com" },
        email: SITE.email,
        telephone: "+1-555-847-2638",
        address: {
          "@type": "PostalAddress",
          streetAddress: "2847 Digital Avenue, Suite 102",
          addressLocality: "San Francisco",
          addressRegion: "CA",
          postalCode: "94105",
          addressCountry: "US",
        },
        sameAs: [BASE],
      },
      {
        "@type": "Organization",
        name: "SoundButtons.com",
        url: `${BASE}/`,
        logo: `${BASE}/og.png`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-555-847-2638",
          contactType: "Customer Service",
          email: SITE.email,
          areaServed: "Worldwide",
          availableLanguage: ["en", "es", "fr", "pt"],
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "2847 Digital Avenue, Suite 102",
          addressLocality: "San Francisco",
          addressRegion: "CA",
          postalCode: "94105",
          addressCountry: "US",
        },
        founder: { "@type": "Person", name: "Siya P" },
      },
    ],
  }

  const webSiteIdSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: HOME_TITLE,
    alternateName: ["SoundButtons", "SoundButtons.com", "Meme Soundboard"],
    url: BASE,
    description: HOME_DESCRIPTION,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/search/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const organizationIdSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Sound Buttons",
    url: BASE,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/icons/icon-192x192.png`,
      width: 192,
      height: 192,
    },
    sameAs: [BASE],
  }

  const siteNavSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Home", url: `${BASE}/` },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "New Sound Buttons",
        url: `${BASE}/new`,
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "Trending Sound Buttons",
        url: `${BASE}/trends`,
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "Sound Button Categories",
        url: `${BASE}/categories`,
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "Meme Soundboard",
        url: `${BASE}/meme-soundboard`,
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "Sound Effects",
        url: `${BASE}/sound-effects`,
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE}/#navigation`,
        name: "Play Random Sound",
        url: `${BASE}/play-random`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personOrgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteIdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationIdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }}
      />
      <HomePageClient
        initialTrendingSounds={trendingSounds}
        initialNewSounds={newSounds}
        initialTrendingMeta={trendingMeta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
