import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { SITE, getLocaleBase } from "@/lib/constants/site"

export const revalidate = 86400

const BASE = getLocaleBase("es")

export const metadata: Metadata = {
  title: { absolute: "Categorías de Botones de Sonido | SoundButtons.com" },
  description:
    "Navega todas las categorías de botones de sonido en SoundButtons.com. Desde memes hasta música y juegos, explora miles de efectos sonoros organizados.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/categories`,
    languages: {
      en: `${SITE.baseUrl}/categories`,
      es: `${BASE}/categories`,
      pt: `${getLocaleBase("pt")}/categories`,
      fr: `${getLocaleBase("fr")}/categories`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Categorías de Botones de Sonido | SoundButtons.com",
    description:
      "Navega todas las categorías de botones de sonido en SoundButtons.com. Desde memes hasta música y juegos, explora miles de efectos sonoros organizados.",
    url: `${BASE}/categories`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/categories/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Categorías de Botones de Sonido", secureUrl: `${BASE}/categories/opengraph-image` }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Categorías de Botones de Sonido | SoundButtons.com",
    description:
      "Navega todas las categorías de botones de sonido en SoundButtons.com. Desde memes hasta música y juegos, explora miles de efectos sonoros organizados.",
    images: [`${BASE}/categories/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default function EsCategoriesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
      { "@type": "ListItem", position: 2, name: "categories", item: `${BASE}/categories` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title="Categorías de Botones de Sonido"
        description="Explora miles de botones de sonido por categoría. Desde memes virales hasta efectos clásicos, encuentra el audio perfecto para contenido, juegos o entretenimiento."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Buscar sound buttons..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getTopLevelCategories().map((cat) => {
              const displayName = cat.name.replace(/ Soundboard$/, "")
              return (
                <Link
                  key={cat.id}
                  href={`/es/categories/${cat.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/50 hover:border-primary/30 transition-all"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {displayName}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
