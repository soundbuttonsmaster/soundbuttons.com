import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { getCategoryBySlug, getParentCategory, getSubcategories } from "@/lib/constants/categories"
import { SITE, getLocaleBase } from "@/lib/constants/site"
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
  const canonicalUrl = `${base}/categories/${slug}`
  const title = `Botones de Sonido de ${category.name}: Soundboard de Memes Desbloqueado`
  const description = `¡Descubre y reproduce los mejores botones de sonido de ${category.name} para descargar, compartir y disfrutar efectos sonoros de alta calidad para memes, videos, bromas y entretenimiento sin fin!`
  const ogImageUrl = `${base}/categories/${slug}/opengraph-image`

  return {
    title: { absolute: title },
    description,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE.baseUrl}/categories/${slug}`,
        es: canonicalUrl,
        pt: `${SITE.baseUrl}/pt/categories/${slug}`,
        fr: `${SITE.baseUrl}/fr/categories/${slug}`,
        "x-default": `${SITE.baseUrl}/categories/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/png" as const, alt: category.name, secureUrl: ogImageUrl }],
      locale: "es_ES",
    },
    twitter: { card: "summary_large_image", site: "@soundbuttons", creator: "@soundbuttons", title, description, images: [ogImageUrl] },
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

  const faqs = [
    { question: `¿Qué son los sound buttons de ${category.name}?`, answer: `Los sound buttons de ${category.name} son clips de audio que puedes reproducir con un clic. Ideales para vídeos, streams y entretenimiento.` },
    { question: `¿Cómo descargo los sound effects de ${category.name}?`, answer: `Haz clic en cualquier sound button y luego en el botón de descarga. El sonido se guardará como MP3 en tu dispositivo.` },
  ]

  const base = getLocaleBase("es")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      { "@type": "ListItem", position: 2, name: "categories", item: `${base}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${base}/categories/${slug}` },
    ],
  }

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
