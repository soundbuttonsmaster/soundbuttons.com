import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import PlayRandomClient from "./PlayRandomClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Play Random Sound – Fun Sound Button Generator" },
  description:
    "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone. Try your luck and enjoy endless sound surprises on SoundButtons.com.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/play-random`,
    languages: { en: `${BASE}/play-random`, "x-default": `${BASE}/play-random` },
  },
  openGraph: {
    type: "website",
    title: "Play Random Sound – Fun Sound Button Generator",
    description:
      "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone. Try your luck and enjoy endless sound surprises on SoundButtons.com.",
    url: `${BASE}/play-random`,
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Play Random Sound" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Random Sound – Fun Sound Button Generator",
    description:
      "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone.",
    images: [`${BASE}/og.png`],
  },
}

export default async function PlayRandomPage() {
  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []

  try {
    const [trending, latest] = await Promise.all([
      apiClient.getTrendingSounds(1, 50),
      apiClient.getNewSounds(1, 50),
    ])
    const combined = [
      ...trending.data,
      ...latest.data.filter((s) => !trending.data.some((t) => t.id === s.id)),
    ]
    initialSounds = combined
  } catch {
    // ignore
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Play Random Sound - Fun Sound Button Generator",
    description:
      "Play a random sound with a single click! Discover fun, trending, and new sound buttons for kids and everyone. Try your luck and enjoy endless sound surprises on SoundButtons.com.",
    url: `${BASE}/play-random`,
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      url: BASE,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
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
      { "@type": "ListItem", position: 2, name: "Play Random", item: `${BASE}/play-random` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
      <PlayRandomClient initialSounds={initialSounds} />
    </>
  )
}
