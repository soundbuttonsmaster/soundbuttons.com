import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import { searchSlugToTag } from "@/lib/utils/slug"
import SoundEffectsSearchClient from "./SoundEffectsSearchClient"

export const revalidate = 300
const BASE = SITE.baseUrl

type Props = { params: Promise<{ query: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params
  const tagDisplayName = searchSlugToTag(query)
  const title = `Sound Effects: ${tagDisplayName} | SoundButtons.com`
  const description = `Discover and download ${tagDisplayName} sound effects. Free, high-quality audio for videos, games, podcasts, and more.`
  const canonicalUrl = `${BASE}/sound-effects/search/${query}`

  return {
    title: { absolute: title },
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `Sound Effects: ${tagDisplayName}`,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [
        {
          url: `${BASE}/sound-effects/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `Sound Effects - ${tagDisplayName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Sound Effects: ${tagDisplayName}`,
      description,
      images: [
        {
          url: `${BASE}/sound-effects/opengraph-image`,
          alt: `Sound Effects - ${tagDisplayName}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function SoundEffectsSearchPage({ params }: Props) {
  const { query } = await params
  const tagDisplayName = searchSlugToTag(query)
  // API uses tags__icontains - pass tag for matching (e.g. "Music", "Gaming Sounds")
  const tagForApi = tagDisplayName || query

  let effects: Awaited<ReturnType<typeof soundEffectsApi.getByTag>> = []
  try {
    effects = await soundEffectsApi.getByTag(tagForApi)
  } catch {
    effects = []
  }

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
              { "@type": "ListItem", position: 2, name: "Sound Effects", item: `${BASE}/sound-effects` },
              {
                "@type": "ListItem",
                position: 3,
                name: tagDisplayName,
                item: `${BASE}/sound-effects/search/${query}`,
              },
            ],
          }),
        }}
      />
      <SoundEffectsSearchClient
        query={query}
        tagDisplayName={tagDisplayName}
        initialEffects={effects}
      />
    </>
  )
}
