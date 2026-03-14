import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import { CATEGORIES, getCategoryBySlug } from "@/lib/constants/categories"
import CategoryDetailClient from "./CategoryDetailClient"

export const revalidate = 300
export const dynamicParams = true

const PAGE_SIZE = 35
const BASE = SITE.baseUrl

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: "Category Not Found" }

  const displayName = category.name.replace(/ Soundboard$/, "")
  const title = `${category.name}: Meme Soundboard Unblocked`
  const description = `Discover and play the best ${displayName} sound buttons to download, share, and enjoy high-quality sound effects for memes, videos, pranks, and endless fun!`
  const canonicalUrl = `${BASE}/categories/${slug}`

  return {
    title: { absolute: title },
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { en: canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      type: "website",
      title: `${category.name} - SoundButtons.Com`,
      description,
      url: canonicalUrl,
      siteName: "SoundButtons.com",
      images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: category.name }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title: `${category.name} - SoundButtons.Com`,
      description,
      images: [`${BASE}/og.png`],
    },
  }
}

function slugify(str: string): string {
  if (!str) return ""
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sound"
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile =
    mobileHint === "?1" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getSoundsByCategory>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getSoundsByCategory(category.apiName, 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const canonicalUrl = `${BASE}/categories/${slug}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${BASE}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: canonicalUrl },
    ],
  }

  const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: link.name,
    url: link.url,
  }))

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Sound Buttons`,
    description: `Discover and play the best ${category.name} sound buttons. Download, share, and enjoy high-quality sound effects!`,
    url: canonicalUrl,
    image: `${BASE}/og.png`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
    },
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialSounds.slice(0, 10).map((sound, idx) => {
      const soundSlug = `${slugify(sound.name)}-${sound.id}`
      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "AudioObject",
          name: sound.name,
          description: `${category.name} sound button`,
          url: `${BASE}/${soundSlug}`,
        },
      }
    }),
  }

  const faqs = [
    {
      question: `What actually are ${category.name} sound buttons?`,
      answer: `${category.name} sound buttons are short audio clips from the ${category.name} category that are played by one click of a button. Great for including sound effects in videos, streams, presentations, and just for fun! Our sound buttons include the most popular and trending ${category.name} sounds in the community.`,
    },
    {
      question: `How do I download ${category.name} sound effects?`,
      answer: `It is easy! Just click on any ${category.name} sound button, and click the download button. The sound will save directly on your device as an MP3 file that you can use anywhere. All ${category.name} sound effects are free to download and use.`,
    },
    {
      question: `Can I use these ${category.name} sounds in my content?`,
      answer: `Yes! The ${category.name} sound buttons are free to use for your personal projects. If you are wanting to use the ${category.name} sounds for commercial use, please review the licensing on the sound detail page. The majority of ${category.name} sounds can be used in videos, streams, podcasts, and other content.`,
    },
    {
      question: `What makes ${category.name} sound buttons popular?`,
      answer: `${category.name} sound buttons are popular because they inject emotion, fun, and context into digital content. They are simple to use, instantly recognizable, and can add engagement and entertainment value to your videos and streams. Our collection of ${category.name} sounds features both classic staples and trending new sounds.`,
    },
    {
      question: `How often do new sounds get added?`,
      answer: `We routinely add new and trending ${category.name} sound buttons to our collection. Our team monitors popular media, games, and trends so you know that we have the latest ${category.name} sound effects available. Check back often!`,
    },
  ]

  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <CategoryDetailClient
        category={category}
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
        faqs={faqs}
      />
    </>
  )
}
