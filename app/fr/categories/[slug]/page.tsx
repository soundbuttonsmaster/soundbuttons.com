import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { getCategoryBySlug, getParentCategory, getSubcategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { getLocaleBase } from "@/lib/i18n/metadata"
import { getBreadcrumbLabels } from "@/lib/i18n/strings"
import CategoryDetailClient from "@/app/categories/[slug]/CategoryDetailClient"

export const revalidate = 300
export const dynamicParams = true
const PAGE_SIZE = 35

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: "Category Not Found" }
  const base = getLocaleBase("fr")
  const displayName = category.name.replace(/ Soundboard$/, "")
  return {
    title: { absolute: `${displayName} - Soundboard | SoundButtons.com` },
    description: `Découvrez et jouez aux meilleurs sound buttons de ${displayName}.`,
    alternates: { canonical: `${base}/categories/${slug}` },
    openGraph: { type: "website", title: `${category.name} - SoundButtons.com`, url: `${base}/categories/${slug}`, siteName: "Sound Buttons", images: [{ url: `${SITE.baseUrl}/og.png`, width: 1200, height: 630 }], locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function FrCategoryDetailPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = getSubcategories(slug)
  const parentCategory = getParentCategory(category)

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getSoundsByCategory>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }
  try {
    const result = await apiClient.getSoundsByCategory(category.apiName, 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch { /* ignore */ }

  const base = getLocaleBase("fr")
  const labels = getBreadcrumbLabels("fr")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parentCategory
      ? [
          { "@type": "ListItem", position: 1, name: labels.home, item: `${base}/` },
          { "@type": "ListItem", position: 2, name: labels.categories, item: `${base}/categories` },
          { "@type": "ListItem", position: 3, name: parentCategory.name, item: `${base}/categories/${parentCategory.slug}` },
          { "@type": "ListItem", position: 4, name: category.name, item: `${base}/categories/${slug}` },
        ]
      : [
          { "@type": "ListItem", position: 1, name: labels.home, item: `${base}/` },
          { "@type": "ListItem", position: 2, name: labels.categories, item: `${base}/categories` },
          { "@type": "ListItem", position: 3, name: category.name, item: `${base}/categories/${slug}` },
        ],
  }
  const faqs = [
    { question: `Qu'est-ce que les sound buttons ${category.name} ?`, answer: `Les sound buttons ${category.name} sont des clips audio que vous pouvez jouer en un clic.` },
    { question: `Comment télécharger les sound effects ${category.name} ?`, answer: `Cliquez sur n'importe quel sound button puis sur le bouton de téléchargement. Le son sera enregistré en MP3.` },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CategoryDetailClient
        category={category}
        subcategories={subcategories}
        parentCategory={parentCategory ?? null}
        categoriesBasePath="/fr"
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
        faqs={faqs}
        locale="fr"
      />
    </>
  )
}
