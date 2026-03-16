import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import SoundButtonsForSchoolClient from "./SoundButtonsForSchoolClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Sound Buttons Unblocked for School - Play Free Sounds Online" },
  description:
    "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
  keywords:
    "sound buttons unblocked for school, school sound effects, classroom sound buttons, educational sound effects, school-friendly sounds, teacher sound resources",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/sound-buttons-unblocked-for-school`,
    languages: {
      en: `${BASE}/sound-buttons-unblocked-for-school`,
      "x-default": `${BASE}/sound-buttons-unblocked-for-school`,
    },
  },
  openGraph: {
    type: "website",
    title: "Sound Buttons Unblocked for School - Play Free Sounds Online",
    description:
      "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
    url: `${BASE}/sound-buttons-unblocked-for-school`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Sound Buttons for School" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons Unblocked for School - Play Free Sounds Online",
    description:
      "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
    images: [`${BASE}/og.png`],
  },
}

const PAGE_SIZE = 35

export default async function SoundButtonsForSchoolPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sound Buttons Unblocked for School - Play Free Sounds Online",
    description:
      "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
    url: `${BASE}/sound-buttons-unblocked-for-school`,
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
        name: "What are Sound Buttons Unblocked for School?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sound Buttons Unblocked for School is a collection of fun, educational, and school-appropriate sound effects that are accessible from school networks that block other entertainment websites. All sounds are family-friendly and are curated specially for use in educational environments.",
        },
      },
      {
        "@type": "Question",
        name: "Are these sound buttons appropriate for school environments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All of the sounds included on our \"Unblocked for School\" page are meant to be appropriate in school environments. All of our content is family-friendly and is appropriate for students of all ages.",
        },
      },
      {
        "@type": "Question",
        name: "How can teachers use these sound buttons in their classrooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Teachers can use our collection of sound buttons for many different educational activities. Teachers may use sound buttons for indicating transitions between activities, using an educational sounds as a fun part of a presentation, audio cues to games, and, perhaps as a reward for their students for participating!",
        },
      },
      {
        "@type": "Question",
        name: "Why are some sound button websites blocked in schools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many schools block entertainment sites to ensure their students are focused on educational content or for using the internet safely. Our Sound Buttons Unblocked for School page is dedicated to offering appropriate content, suitable for use in school!",
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sound Buttons for School",
        item: `${BASE}/sound-buttons-unblocked-for-school`,
      },
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
      <SoundButtonsForSchoolClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
