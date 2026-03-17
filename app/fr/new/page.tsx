import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import NewPageClient from "@/app/new/NewPageClient"

export const revalidate = 300
const PAGE_SIZE = 35

const BASE = getLocaleBase("fr")

export const metadata: Metadata = {
  title: { absolute: "Myinstants Nouveaux boutons sonores : Table d'harmonie de mèmes originaux, mise à jour quotidiennement" },
  description:
    "Découvrez les tout derniers boutons sonores et la table d'harmonie avec des clips audio tendance mis à jour quotidiennement, à écouter, télécharger et partager pour les mèmes, les jeux et le divertissement !",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/new`,
    languages: {
      en: `${SITE.baseUrl}/new`,
      es: `${getLocaleBase("es")}/new`,
      pt: `${getLocaleBase("pt")}/new`,
      fr: `${BASE}/new`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Myinstants Nouveaux boutons sonores : Table d'harmonie de mèmes originaux, mise à jour quotidiennement",
    description:
      "Découvrez les tout derniers boutons sonores et la table d'harmonie avec des clips audio tendance mis à jour quotidiennement, à écouter, télécharger et partager pour les mèmes, les jeux et le divertissement !",
    url: `${BASE}/new`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/new/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Nouveaux boutons sonores", secureUrl: `${BASE}/new/opengraph-image` }],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Myinstants Nouveaux boutons sonores : Table d'harmonie de mèmes originaux, mise à jour quotidiennement",
    description:
      "Découvrez les tout derniers boutons sonores et la table d'harmonie avec des clips audio tendance mis à jour quotidiennement, à écouter, télécharger et partager pour les mèmes, les jeux et le divertissement !",
    images: [`${BASE}/new/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default async function FrNewPage() {
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
    itemListElement: [{ "@type": "ListItem", position: 1, name: "new", item: `${BASE}/new` }],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewPageClient initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} />
    </>
  )
}
