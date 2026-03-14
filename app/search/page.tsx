import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { SITE } from "@/lib/constants/site"
import SearchPageClient from "./SearchPageClient"

export const revalidate = 3600

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com" },
  description:
    "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
  keywords:
    "search sound buttons, search sound effects, search meme sounds, audio search, sound button finder, sound effect search, meme audio search, free sound search, soundboard search",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/search`,
    languages: {
      en: `${BASE}/search`,
      fr: `${BASE}/fr/search`,
      pt: `${BASE}/pt/search`,
      es: `${BASE}/es/search`,
      "x-default": `${BASE}/search`,
    },
  },
  openGraph: {
    type: "website",
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
    description:
      "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more.",
    url: `${BASE}/search`,
    siteName: "SoundButtons.com",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
      },
    ],
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
    description:
      "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips.",
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  if (params.q && typeof params.q === "string" && params.q.trim()) {
    const slug = slugify(params.q.trim())
    if (slug) redirect(`/search/${slug}`)
  }

  const searchTitle = "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com"
  const searchDescription =
    "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use."

  const searchSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: searchTitle,
        description: searchDescription,
        url: `${BASE}/search`,
        isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${BASE}/` },
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
        ],
      },
      {
        "@type": "WebSite",
        name: "SoundButtons.com",
        url: `${BASE}/`,
        description: "The ultimate collection of Sound Buttons and Meme Soundboards",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE}/search/{search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
      />
      <SearchPageClient />
    </>
  )
}
