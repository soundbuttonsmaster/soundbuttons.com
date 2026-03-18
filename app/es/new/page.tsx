import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import NewPageClient from "@/app/new/NewPageClient"

export const revalidate = 300
const PAGE_SIZE = 35

const BASE = getLocaleBase("es")

export const metadata: Metadata = {
  title: { absolute: "Nuevos Botones de Sonido: Soundboard Actualizado" },
  description:
    "Descubre los botones de sonido y soundboard más recientes con audio en tendencia, actualizados diariamente para memes, juegos y entretenimiento.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/new`,
    languages: {
      en: `${SITE.baseUrl}/new`,
      es: `${BASE}/new`,
      pt: `${getLocaleBase("pt")}/new`,
      fr: `${getLocaleBase("fr")}/new`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Nuevos Botones de Sonido: Soundboard Actualizado",
    description:
      "Descubre los botones de sonido y soundboard más recientes con audio en tendencia, actualizados diariamente para memes, juegos y entretenimiento.",
    url: `${BASE}/new`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/new/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Nuevos Botones de Sonido", secureUrl: `${BASE}/new/opengraph-image` }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Nuevos Botones de Sonido: Soundboard Actualizado",
    description:
      "Descubre los botones de sonido y soundboard más recientes con audio en tendencia, actualizados diariamente para memes, juegos y entretenimiento.",
    images: [`${BASE}/new/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

function slugify(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || "sound"
}

export default async function EsNewPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile = mobileHint === "?1" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const initialCount = isMobile ? 20 : 35
  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
      { "@type": "ListItem", position: 2, name: "new", item: `${BASE}/new` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
        locale="es"
      />
    </>
  )
}
