import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import AiSoundButtonsClient from "./AiSoundButtonsClient"

export const revalidate = 300

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category | SoundButtons.com" },
  description:
    "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
  keywords:
    "AI sound buttons, sound bot, soundboard chat, play sound by category, sound effects assistant, meme sounds bot",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/ai-sound-buttons`,
    languages: { en: `${BASE}/ai-sound-buttons`, "x-default": `${BASE}/ai-sound-buttons` },
  },
  openGraph: {
    type: "website",
    title: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category",
    description:
      "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
    url: `${BASE}/ai-sound-buttons`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "AI Sound Buttons | SoundButtons.com" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category",
    description:
      "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
    images: [`${BASE}/og.png`],
  },
}

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category",
  description:
    "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
  url: `${BASE}/ai-sound-buttons`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${BASE}/` },
  publisher: {
    "@type": "Organization",
    name: "SoundButtons.com",
    logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "AI Sound Buttons", item: `${BASE}/ai-sound-buttons` },
  ],
}

const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: link.name,
  url: link.url,
}))

export default function AiSoundButtonsPage() {
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
      {siteNavSchema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <AiSoundButtonsClient />
    </>
  )
}
