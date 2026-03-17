import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import SearchPageClient from "@/app/search/SearchPageClient"

export const revalidate = 3600

const BASE = getLocaleBase("es")

export const metadata: Metadata = {
  title: { absolute: "Buscar Botones de Sonido - Encontrar Efectos de Sonido y Sonidos de Memes" },
  description:
    "Busca en nuestra vasta colección de botones de sonido, efectos de sonido, sonidos de memes y clips de audio. Encuentra el sonido perfecto para tus videos, memes, streams y más. Gratis para descargar y usar.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/search`,
    languages: {
      en: `${SITE.baseUrl}/search`,
      es: `${BASE}/search`,
      pt: `${getLocaleBase("pt")}/search`,
      fr: `${getLocaleBase("fr")}/search`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Buscar Botones de Sonido - Encontrar Efectos de Sonido y Sonidos de Memes",
    description:
      "Busca en nuestra vasta colección de botones de sonido, efectos de sonido, sonidos de memes y clips de audio. Encuentra el sonido perfecto para tus videos, memes, streams y más. Gratis para descargar y usar.",
    url: `${BASE}/search`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/search/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Buscar Botones de Sonido", secureUrl: `${BASE}/search/opengraph-image` }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Buscar Botones de Sonido - Encontrar Efectos de Sonido y Sonidos de Memes",
    description:
      "Busca en nuestra vasta colección de botones de sonido, efectos de sonido, sonidos de memes y clips de audio. Encuentra el sonido perfecto para tus videos, memes, streams y más. Gratis para descargar y usar.",
    images: [`${BASE}/search/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

function slugify(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || ""
}

export default async function EsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  if (params.q && typeof params.q === "string" && params.q.trim()) {
    const slug = slugify(params.q.trim())
    if (slug) redirect(`/es/search/${slug}`)
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "search", item: `${BASE}/search` }],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SearchPageClient />
    </>
  )
}
