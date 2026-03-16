import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import TextToSoundClient from "./TextToSoundClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Text to Sound Button - Convert Text to Fun Audio Effects" },
  description:
    "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily and enjoy endless audio fun.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/text-to-sound`,
    languages: { en: `${BASE}/text-to-sound`, "x-default": `${BASE}/text-to-sound` },
  },
  openGraph: {
    type: "website",
    title: "Text to Sound Button - Convert Text to Fun Audio Effects",
    description:
      "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily and enjoy endless audio fun.",
    url: `${BASE}/text-to-sound`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Text to Sound Button" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Text to Sound Button - Convert Text to Fun Audio Effects",
    description:
      "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily.",
    images: [`${BASE}/og.png`],
  },
}

export default function TextToSoundPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Text to Sound Button - Convert Text to Fun Audio Effects",
    description:
      "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily.",
    url: `${BASE}/text-to-sound`,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Text to Sound", item: `${BASE}/text-to-sound` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {siteNavSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <TextToSoundClient />
    </>
  )
}
