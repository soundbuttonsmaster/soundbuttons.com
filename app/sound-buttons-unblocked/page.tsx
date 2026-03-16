import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import SoundButtonsUnblockedClient from "./SoundButtonsUnblockedClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Sound Buttons Unblocked - Play & Download Free Sounds" },
  description:
    "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
  keywords:
    "sound buttons unblocked, unblocked sound buttons, kids sound buttons, fun sounds, safe sounds for kids, sound effects unblocked",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/sound-buttons-unblocked`,
    languages: { en: `${BASE}/sound-buttons-unblocked`, "x-default": `${BASE}/sound-buttons-unblocked` },
  },
  openGraph: {
    type: "website",
    title: "Sound Buttons Unblocked - Play & Download Free Sounds",
    description:
      "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
    url: `${BASE}/sound-buttons-unblocked`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Sound Buttons Unblocked" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons Unblocked - Play & Download Free Sounds",
    description:
      "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
    images: [`${BASE}/og.png`],
  },
}

export default async function SoundButtonsUnblockedPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getTrendingSounds(1, 44)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sound Buttons Unblocked - Play & Download Free Sounds",
    description:
      "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
    url: `${BASE}/sound-buttons-unblocked`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are Sound Buttons Unblocked?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sound Buttons Unblocked are entertaining, interactive sound effects that you can access and play freely, usually on websites that are designed to be accessible from school or workplace networks where other websites would be blocked.",
        },
      },
      {
        "@type": "Question",
        name: "Are these sound buttons child friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Of course! All the sounds available from SoundButtons.com, especially our \"Unblocked\" page, are carefully curated to ensure family-friendly sounds can be enjoyed by children.",
        },
      },
      {
        "@type": "Question",
        name: "How can I play these sounds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can simply click or tap on any sound button and it will instantly play for you! You can download or share your favorite sounds too!",
        },
      },
      {
        "@type": "Question",
        name: "Why are some sound button websites blocked?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some networks, such as school or work networks, will block different websites to keep people focused or to maintain security. Unblocked sound button websites are aimed to provide fun content on those networks.",
        },
      },
      {
        "@type": "Question",
        name: "Can I request an additional sound?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Of course! We love hearing from our users! Feel free to use our contact page to submit a request for a sound you'd like to see on SoundButtons.com.",
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Sound Buttons Unblocked", item: `${BASE}/sound-buttons-unblocked` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
      <SoundButtonsUnblockedClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
