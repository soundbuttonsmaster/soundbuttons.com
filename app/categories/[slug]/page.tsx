import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { CATEGORIES, getCategoryBySlug, getParentCategory, getSubcategories } from "@/lib/constants/categories"
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
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        es: `${BASE}/es/categories/${slug}`,
        pt: `${BASE}/pt/categories/${slug}`,
        fr: `${BASE}/fr/categories/${slug}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type: "website",
      title: `${category.name} - SoundButtons.Com`,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [
        {
          url: `${BASE}/categories/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: category.name,
          secureUrl: `${BASE}/categories/${slug}/opengraph-image`,
        },
      ],
      locale: "en_US",
      alternateLocale: ["en_GB", "en_CA", "en_AU", "fr_FR"],
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title: `${category.name} - SoundButtons.Com`,
      description,
      images: [`${BASE}/categories/${slug}/opengraph-image`],
    },
  }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = getSubcategories(slug)
  const parentCategory = getParentCategory(category)

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "categories", item: `${BASE}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${BASE}/categories/${slug}` },
    ],
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
      <CategoryDetailClient
        category={category}
        subcategories={subcategories}
        parentCategory={parentCategory ?? null}
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
        faqs={faqs}
      />
    </>
  )
}
