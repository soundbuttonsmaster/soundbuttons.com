import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { SITE, getLocaleBase } from "@/lib/constants/site"

export const revalidate = 86400

const BASE = getLocaleBase("pt")

export const metadata: Metadata = {
  title: { absolute: "Categorias de Botões de Som | SoundButtons.com" },
  description:
    "Navegue todas as categorias de botões de som no SoundButtons.com. De memes a música e jogos, explore milhares de efeitos sonoros organizados.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/categories`,
    languages: {
      en: `${SITE.baseUrl}/categories`,
      es: `${getLocaleBase("es")}/categories`,
      pt: `${BASE}/categories`,
      fr: `${getLocaleBase("fr")}/categories`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Categorias de Botões de Som | SoundButtons.com",
    description:
      "Navegue todas as categorias de botões de som no SoundButtons.com. De memes a música e jogos, explore milhares de efeitos sonoros organizados.",
    url: `${BASE}/categories`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/categories/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Categorias de Botões de Som", secureUrl: `${BASE}/categories/opengraph-image` }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Categorias de Botões de Som | SoundButtons.com",
    description:
      "Navegue todas as categorias de botões de som no SoundButtons.com. De memes a música e jogos, explore milhares de efeitos sonoros organizados.",
    images: [`${BASE}/categories/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default function PtCategoriesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE },
      { "@type": "ListItem", position: 2, name: "categories", item: `${BASE}/categories` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero title="Categorias de Botões de Som" description="Explore milhares de botões de som por categoria. De memes virais a efeitos clássicos, encontre o áudio perfeito para conteúdo, jogos ou entretenimento.">
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Pesquisar sound buttons..." />
          </div>
        </div>
      </PageHero>
      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getTopLevelCategories().map((cat) => {
              const displayName = cat.name.replace(/ Soundboard$/, "")
              return (
                <Link key={cat.id} href={`/pt/categories/${cat.slug}`} className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/50 hover:border-primary/30 transition-all">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{displayName}</span>
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
