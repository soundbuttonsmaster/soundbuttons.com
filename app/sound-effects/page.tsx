import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import SoundEffectsClient from "./SoundEffectsClient"

export const dynamic = "force-dynamic"
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Sound Effects - Download Free Sound Effect for Videos" },
  description:
    "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads with no registration.",
  keywords:
    "sound effects, sound buttons, meme soundboard, unblocked sound buttons, free sound effects, download sound effects, sound effect library, audio library, sound design, sound effects for videos, sound effects for games, sound effects for podcasts, sound effects for streaming, professional sound effects, royalty free sound effects, sound buttons unblocked, soundboard download, funny sounds, notification sounds, ringtone sounds",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/sound-effects`,
    languages: { en: `${BASE}/sound-effects`, "x-default": `${BASE}/sound-effects` },
  },
  openGraph: {
    type: "website",
    title: "Sound Effects - Download Free Sound Effect for Videos",
    description:
      "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads.",
    url: `${BASE}/sound-effects`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Sound Effects Library" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Effects - Download Free Sound Effect for Videos",
    description:
      "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads.",
    images: [`${BASE}/og.png`],
  },
}

export default async function SoundEffectsPage() {
  let initialEffects: Awaited<ReturnType<typeof soundEffectsApi.getAll>> = []
  try {
    initialEffects = await soundEffectsApi.getAll()
  } catch {
    initialEffects = []
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sound Effects - Download Free Sound Effect for Videos",
    url: `${BASE}/sound-effects`,
    description:
      "Download high-quality sound effects for your meme soundboard! Perfect for unblocked sound buttons, viral content, and free downloads.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoundButtons.com",
    url: `${BASE}/`,
    logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    description:
      "The ultimate collection of Sound Effects and Meme Soundboards. Play, download, and share thousands of free Sound Effects.",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Sound Effects", item: `${BASE}/sound-effects` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
      <SoundEffectsClient initialEffects={initialEffects} />
    </>
  )
}
