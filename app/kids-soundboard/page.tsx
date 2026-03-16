import { headers } from "next/headers"
import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import { kidsSoundboardApi } from "@/lib/api/kids-soundboard"
import KidsSoundboardClient from "./KidsSoundboardClient"

export const dynamic = "force-dynamic"
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Kids Soundboard: Funny Sound Buttons for Children" },
  description:
    "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects that children will love.",
  keywords:
    "kids soundboard, children sounds, animal sounds, educational sounds, kid-friendly audio, safe sound buttons, fun sounds for kids",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/kids-soundboard`,
    languages: { en: `${BASE}/kids-soundboard`, "x-default": `${BASE}/kids-soundboard` },
  },
  openGraph: {
    type: "website",
    title: "Kids Soundboard: Funny Sound Buttons for Children",
    description:
      "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects.",
    url: `${BASE}/kids-soundboard`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Kids Soundboard" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Kids Soundboard: Funny Sound Buttons for Children",
    description:
      "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects.",
    images: [`${BASE}/og.png`],
  },
}

export default async function KidsSoundboardPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const PAGE_SIZE = isMobile ? 18 : 36
  let initialCategories: Awaited<ReturnType<typeof kidsSoundboardApi.getCategories>> = []
  let initialSounds: Awaited<ReturnType<typeof kidsSoundboardApi.getPaginated>>["data"] = []
  let hasNext = false
  let totalCount = 0

  try {
    const [catsRes, soundsRes] = await Promise.all([
      kidsSoundboardApi.getCategories(),
      kidsSoundboardApi.getPaginated(1, PAGE_SIZE),
    ])
    initialCategories = catsRes || []
    initialSounds = soundsRes?.data || []
    hasNext = !!soundsRes?.next
    totalCount = soundsRes?.count ?? initialSounds.length
  } catch {
    // fallback empty
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kids Soundboard: Funny Sound Buttons for Children",
    url: `${BASE}/kids-soundboard`,
    description:
      "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects.",
    mainEntity: {
      "@type": "CollectionPage",
      name: "Kids Soundboard Collection",
      description: "A curated collection of kid-friendly sound buttons and audio effects",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Kids Soundboard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kids Soundboard is a set of fun, safe, and educational sound effects made just for kids. All of the sounds are carefully chosen to be safe for kids of all ages and great for family activities.",
        },
      },
      {
        "@type": "Question",
        name: "Are these buttons that make noise safe for kids?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We carefully chose all the sounds on our Kids Soundboard to be safe for kids, educational, and good for people of all ages. We make sure that all of our content is safe and good for families.",
        },
      },
      {
        "@type": "Question",
        name: "How can parents let their kids use these sound buttons?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parents can use these sound buttons to teach kids about animal sounds, musical instruments, make up fun games, or make stories and lessons more exciting.",
        },
      },
      {
        "@type": "Question",
        name: "What kinds of sounds can kids hear?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our Kids Soundboard has animal sounds, musical instruments, sounds that teach, sounds that make games more fun, and other sounds that are safe for kids to listen to and learn from.",
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Kids Soundboard", item: `${BASE}/kids-soundboard` },
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
      <KidsSoundboardClient
        initialCategories={initialCategories}
        initialSounds={initialSounds}
        initialHasNext={hasNext}
        initialTotalCount={totalCount}
        isMobileDevice={isMobile}
      />
    </>
  )
}
