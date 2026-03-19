import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SITE } from "@/lib/constants/site"
import { apiClient } from "@/lib/api/client"
import SearchResultsClient from "./SearchResultsClient"

export const revalidate = 300

const BASE = SITE.baseUrl
const PAGE_SIZE = 35

function slugToQuery(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim()
}

function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ query: string }>
}): Promise<Metadata> {
  const { query } = await params
  const searchQuery = slugToQuery(query)
  if (!searchQuery || searchQuery.length < 2) {
    return { title: "Search - Sound Buttons" }
  }

  let totalItems = 0
  try {
    const { meta } = await apiClient.searchSounds(searchQuery, 1, 10)
    totalItems = meta.total_items ?? 0
  } catch {
    // ignore
  }

  const name = toTitleCase(searchQuery)
  const title = `${name} Soundboard: Play Instant Sound Effect Button`
  const description = `Play and download ${searchQuery} sound buttons for free! Instant play, high-quality MP3 downloads. Perfect for memes, TikTok, Discord, and content creation.`
  const keywords = `${searchQuery}, ${searchQuery} sound buttons, ${searchQuery} sound effects, ${searchQuery} meme, ${searchQuery} audio, ${searchQuery} download, sound buttons, sound effects, meme soundboard`
  const canonicalUrl = `${BASE}/search/${query}`

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${BASE}/search/${query}`,
        fr: `${BASE}/fr/search/${query}`,
        pt: `${BASE}/pt/search/${query}`,
        es: `${BASE}/es/search/${query}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [
        {
          url: `${BASE}/search/${query}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${name} Sound Buttons - SoundButtons.com`,
        },
      ],
      locale: "en_US",
      alternateLocale: ["fr_FR", "pt_BR", "es_ES"],
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title,
      description,
      images: [
        {
          url: `${BASE}/search/${query}/opengraph-image`,
          alt: `${name} Sound Buttons - SoundButtons.com`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ query: string }>
}) {
  const { query: querySlug } = await params
  const searchQuery = slugToQuery(querySlug)

  if (!searchQuery || searchQuery.length < 2) {
    redirect("/search")
  }

  const sanitizedQuery = searchQuery.replace(/[<>]/g, "").trim()
  if (!sanitizedQuery) {
    redirect("/search")
  }

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent
  )

  let initialSounds: Awaited<ReturnType<typeof apiClient.searchSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.searchSounds(sanitizedQuery, 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const name = toTitleCase(sanitizedQuery)

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
              { "@type": "ListItem", position: 2, name: "Search", item: `${BASE}/search` },
              {
                "@type": "ListItem",
                position: 3,
                name: name,
                item: `${BASE}/search/${querySlug}`,
              },
            ],
          }),
        }}
      />
      <SearchResultsClient
        searchQuery={sanitizedQuery}
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
