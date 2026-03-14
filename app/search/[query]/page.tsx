import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import { SITE } from "@/lib/constants/site"
import { apiClient } from "@/lib/api/client"
import { generateSlug } from "@/lib/utils/slug"
import SearchResultsClient from "./SearchResultsClient"

export const revalidate = 60

const BASE = SITE.baseUrl
const PAGE_SIZE = 35

function slugToQuery(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim()
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

  const title = `${totalItems > 0 ? totalItems + "+ " : ""}${searchQuery} Soundboard - Sound Effect Buttons | SoundButtons.com`
  const description = `Discover ${totalItems > 0 ? totalItems : ""} ${searchQuery} soundboards for your meme sound buttons! Perfect for unblocked sound buttons, sound effects, and creating viral content.`
  const keywords = `${searchQuery}, ${searchQuery} sound buttons, ${searchQuery} sound effects, ${searchQuery} meme, ${searchQuery} audio, ${searchQuery} download, sound buttons, sound effects, meme soundboard`
  const canonicalUrl = `${BASE}/search/${query}`

  return {
    title: { absolute: title },
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        fr: `${BASE}/fr/search/${query}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "SoundButtons.com",
      images: [
        {
          url: `${BASE}/og.png`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${searchQuery} Sound Buttons - SoundButtons.com`,
        },
      ],
      locale: "en_US",
      alternateLocale: ["fr_FR"],
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title,
      description,
      images: [`${BASE}/og.png`],
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

  const canonicalUrl = `${BASE}/search/${querySlug}`

  const searchDetailTitle = `${meta.total_items}+ ${sanitizedQuery} Soundboard - Sound Effect Buttons`
  const searchDetailDescription = `Discover ${sanitizedQuery} soundboards for your meme sound buttons! Perfect for unblocked sound buttons, sound effects, and creating viral content.`

  const searchDetailSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SearchResultsPage",
        name: searchDetailTitle,
        description: searchDetailDescription,
        url: canonicalUrl,
        mainEntity: {
          "@type": "ItemList",
          name: searchDetailTitle,
          numberOfItems: meta.total_items,
          itemListElement: initialSounds.slice(0, 10).map((sound, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "AudioObject",
              name: sound.name,
              description: `${sound.name} sound button - ${sanitizedQuery} search result`,
              url: `${BASE}/${generateSlug(sound.name)}/${sound.id}`,
              contentUrl: sound.sound_file,
              encodingFormat: "audio/mpeg",
            },
          })),
        },
        publisher: {
          "@type": "Organization",
          name: "SoundButtons.com",
          logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Search", item: `${BASE}/search` },
          { "@type": "ListItem", position: 3, name: `${sanitizedQuery} Sound Buttons`, item: canonicalUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchDetailSchema) }}
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
