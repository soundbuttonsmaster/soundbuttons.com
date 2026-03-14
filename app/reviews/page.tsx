import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import ReviewsClient from "./ReviewsClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "User Reviews - SoundButtons.com" },
  description:
    "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/reviews`,
    languages: { en: `${BASE}/reviews`, "x-default": `${BASE}/reviews` },
  },
  openGraph: {
    type: "website",
    title: "User Reviews - SoundButtons.com",
    description:
      "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
    url: `${BASE}/reviews`,
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "User Reviews" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "User Reviews - SoundButtons.com",
    description:
      "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
    images: [`${BASE}/og.png`],
  },
}

export default function ReviewsPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "User Reviews - SoundButtons.com",
    description:
      "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
    url: `${BASE}/reviews`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "User Reviews", item: `${BASE}/reviews` },
      ],
    },
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
      {siteNavSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <ReviewsClient />
    </>
  )
}
