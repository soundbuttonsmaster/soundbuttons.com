import Link from "next/link"
import { ChevronRight } from "lucide-react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"

export const revalidate = 86400

export const metadata = buildLocaleMetadata("es", "categories")

export default function EsCategoriesPage() {
  const BASE = getLocaleBase("es")

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Categorías", item: `${BASE}/categories` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        title="Categorías de Sound Buttons"
        description="Explora miles de sound buttons organizados por categoría."
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
