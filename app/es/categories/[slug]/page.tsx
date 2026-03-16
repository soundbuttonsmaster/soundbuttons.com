import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { getCategoryBySlug, getParentCategory, getSubcategories } from "@/lib/constants/categories"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"
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
  const base = getLocaleBase("es")
  const displayName = category.name.replace(/ Soundboard$/, "")
  return {
    title: { absolute: `${displayName} - Soundboard | SoundButtons.com` },
    description: `Descubre y reproduce los mejores sound buttons de ${displayName}.`,
    alternates: { canonical: `${base}/categories/${slug}` },
    openGraph: { type: "website", title: `${category.name} - SoundButtons.com`, url: `${base}/categories/${slug}`, siteName: "Sound Buttons", images: [{ url: `${base}/og.png`, width: 1200, height: 630 }], locale: "es_ES" },
    robots: { index: true, follow: true },
  }
}

export default async function EsCategoryDetailPage({ params }: Props) {
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
  } catch {
    // ignore
  }

  const base = getLocaleBase("es")
  const labels = getBreadcrumbLabels("es")
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
    { question: `¿Qué son los sound buttons de ${category.name}?`, answer: `Los sound buttons de ${category.name} son clips de audio que puedes reproducir con un clic. Ideales para vídeos, streams y entretenimiento.` },
    { question: `¿Cómo descargo los sound effects de ${category.name}?`, answer: `Haz clic en cualquier sound button y luego en el botón de descarga. El sonido se guardará como MP3 en tu dispositivo.` },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CategoryDetailClient
        category={category}
        subcategories={subcategories}
        parentCategory={parentCategory ?? null}
        categoriesBasePath="/es"
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
        faqs={faqs}
        locale="es"
      />
    </>
  )
}
