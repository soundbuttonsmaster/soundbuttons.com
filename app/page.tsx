import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import HomePageClient from "@/components/home/HomePageClient"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked",
  description:
    "Play thousands of sound buttons with the best meme soundboard, buttons, prank, funny sound effect, and high-quality audio in unblocked soundboards.",
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
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: SITE.baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.baseUrl,
    siteName: "SoundButtons.com",
    title: "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked",
    description:
      "Play thousands of sound buttons with the best meme soundboard, buttons, prank, funny sound effect, and high-quality audio in unblocked soundboards.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sound Buttons - Meme Soundboard Unblocked",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked",
    description:
      "Play thousands of sound buttons with the best meme soundboard, buttons, prank, funny sound effect, and high-quality audio in unblocked soundboards.",
    images: ["/og.png"],
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

  const categories = getActiveCategories()
  const BASE = SITE.baseUrl

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SoundButtons.com",
    url: `${BASE}/`,
    description:
      "Sound buttons is the Ultimate collection of unblocked soundboard, sound buttons, meme soundboard, with billion's of sound effects and meme buttons.",
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Trending",
        item: `${BASE}/trends`,
      },
      ...categories.map((cat, i) => ({
        "@type": "ListItem",
        position: 4 + i,
        name: `${cat.name} Soundboard`,
        item: `${BASE}/categories/${cat.slug}`,
      })),
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personOrgSchema) }}
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
