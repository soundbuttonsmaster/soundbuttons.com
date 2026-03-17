import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import SearchPageClient from "@/app/search/SearchPageClient"

export const revalidate = 3600

const BASE = getLocaleBase("fr")

export const metadata: Metadata = {
  title: { absolute: "Rechercher des Boutons Sonores - Trouver des Effets Sonores et des Sons de Mèmes | SoundButtons.com" },
  description:
    "Recherchez dans notre vaste collection de boutons sonores, effets sonores, sons de mèmes et clips audio. Trouvez le son parfait pour vos vidéos, mèmes, streams et plus encore. Gratuit à télécharger et utiliser.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/search`,
    languages: {
      en: `${SITE.baseUrl}/search`,
      es: `${getLocaleBase("es")}/search`,
      pt: `${getLocaleBase("pt")}/search`,
      fr: `${BASE}/search`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Rechercher des Boutons Sonores - Trouver des Effets Sonores et des Sons de Mèmes | SoundButtons.com",
    description:
      "Recherchez dans notre vaste collection de boutons sonores, effets sonores, sons de mèmes et clips audio. Trouvez le son parfait pour vos vidéos, mèmes, streams et plus encore. Gratuit à télécharger et utiliser.",
    url: `${BASE}/search`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/search/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Rechercher des Boutons Sonores", secureUrl: `${BASE}/search/opengraph-image` }],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Rechercher des Boutons Sonores - Trouver des Effets Sonores et des Sons de Mèmes | SoundButtons.com",
    description:
      "Recherchez dans notre vaste collection de boutons sonores, effets sonores, sons de mèmes et clips audio. Trouvez le son parfait pour vos vidéos, mèmes, streams et plus encore. Gratuit à télécharger et utiliser.",
    images: [`${BASE}/search/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

function slugify(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || ""
}

export default async function FrSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  if (params.q && typeof params.q === "string" && params.q.trim()) {
    const slug = slugify(params.q.trim())
    if (slug) redirect(`/fr/search/${slug}`)
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
