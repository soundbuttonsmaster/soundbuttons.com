import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SITE } from "@/lib/constants/site"
import { FileText } from "lucide-react"

const BASE = SITE.baseUrl

interface BlogPostPageProps {
  params: Promise<{ id: string; slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id, slug } = await params
  const title = slug ? decodeURIComponent(slug).replace(/-/g, " ") : "Blog post"
  const titleFormatted = title.charAt(0).toUpperCase() + title.slice(1)
  return {
    title: { absolute: `${titleFormatted} - Blog | SoundButtons.com` },
    description: `Read ${titleFormatted} on the SoundButtons.com blog.`,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/blog/${id}/${slug}` },
    openGraph: {
      type: "article",
      title: `${titleFormatted} - Blog | SoundButtons.com`,
      url: `${BASE}/blog/${id}/${slug}`,
      siteName: "Sound Buttons",
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id, slug } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) notFound()

  const title = slug ? decodeURIComponent(slug).replace(/-/g, " ") : "Blog post"
  const titleFormatted = title.charAt(0).toUpperCase() + title.slice(1)

  return (
    <div className="py-8 bg-background min-h-[50vh]">
      <div className="w-full max-w-2xl mx-auto px-4">
        <article className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span>/</span>
            <span>{titleFormatted}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">{titleFormatted}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Post #{id}</span>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
            <p>This blog post is not available yet. Content will be added when the blog is fully set up.</p>
            <p className="mt-4">
              <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
