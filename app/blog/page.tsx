import { blogApi } from "@/lib/api/blog"
import BlogListClient from "@/components/blog/BlogListClient"
import { SITE } from "@/lib/constants/site"

export const revalidate = 300

export default async function BlogPage() {
  const result = await blogApi.fetchBlogs(1, 20, "asc")
  const initialBlogs = result.data ?? []
  const meta = result.meta

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "blog", item: `${SITE.baseUrl}/blog` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-8 bg-background min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4">
        <BlogListClient
          initialBlogs={initialBlogs}
          initialPage={meta.current_page ?? 1}
          totalPages={meta.last_page ?? 1}
          itemsPerPage={20}
        />
      </div>
    </div>
    </>
  )
}
