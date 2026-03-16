import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import CreateSoundClient from "./CreateSoundClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com" },
  description:
    "Create Sound Button on SoundButtons to make your own fun and unique audio effects. Play, customize, and share sound buttons easily with friends anytime.",
  keywords:
    "create sound button, make sound effects, custom audio, sound button creator, audio effects maker, create meme sounds, custom soundboard, audio button maker",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/create-sound`,
    languages: { en: `${BASE}/create-sound`, "x-default": `${BASE}/create-sound` },
  },
  openGraph: {
    type: "website",
    title: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com",
    description:
      "Create Sound Button on SoundButtons to make your own fun and unique audio effects. Play, customize, and share sound buttons easily with friends anytime.",
    url: `${BASE}/create-sound`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Create Sound Button" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com",
    description:
      "Create Sound Button on SoundButtons to make your own fun and unique audio effects.",
    images: [`${BASE}/og.png`],
  },
}

export default function CreateSoundPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Create Sound Button - Make Your Own Fun Audio Effects",
    description:
      "Create Sound Button on SoundButtons to make your own fun and unique audio effects. Play, customize, and share sound buttons easily.",
    url: `${BASE}/create-sound`,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Create Sound", item: `${BASE}/create-sound` },
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
      <CreateSoundClient />
    </>
  )
}
