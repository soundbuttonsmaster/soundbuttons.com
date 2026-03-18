import Link from "next/link"
import { ChevronRight } from "lucide-react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

export const revalidate = 86400

export default function CategoriesPage() {
  const BASE = SITE.baseUrl
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
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
        title="Sound Button Categories"
        description="Explore thousands of sound buttons organized by category. From memes to music, games to comedy—find the perfect sound effects for your content, streams, and entertainment."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search Sound buttons..." />
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
                  href={`/categories/${cat.slug}`}
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

          <div className="mt-16 max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why browse by category?</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Organized discovery — find exactly what you&apos;re looking for</li>
              <li>Quality content — each category is curated with high-quality sounds</li>
              <li>Easy sharing — share your favorite categories with friends and followers</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
