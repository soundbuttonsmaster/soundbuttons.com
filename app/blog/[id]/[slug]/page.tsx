import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { Calendar, User, Music } from "lucide-react"
import { blogApi } from "@/lib/api/blog"
import { apiClient } from "@/lib/api/client"
import { blogSlugify, generateBlogDescription, cleanHtmlForMeta, formatBlogContent } from "@/lib/utils/blog"
import SoundButton from "@/components/sound/sound-button"
import type { ProcessedSound } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const BASE = "https://soundbuttons.com"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ id: string; slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) return { title: "Blog | SoundButtons" }
  const blog = await blogApi.fetchBlogById(idNum)
  if (!blog) return { title: "Blog | SoundButtons" }

  const pageTitle = `${blog.title} | SoundButtons Blog`
  const pageDescription = generateBlogDescription(blog.title)
  const pageUrl = `${BASE}/blog/${blog.id}/${blogSlugify(blog.title)}`
  const authorName = blog.user?.name || "SoundButtons Team"
  const articleTags = `sound buttons, sound effects, ${blog.title}, audio clips, sound board, blog, meme sounds`

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    authors: [{ name: "SoundButtons.com" }],
    keywords: `sound buttons, sound effects, ${blog.title}, audio clips, sound board, blog`,
    metadataBase: new URL(BASE),
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: "Sound Buttons",
      locale: "en_US",
      images: [
        {
          url: `${BASE}/blog/${blog.id}/${blogSlugify(blog.title)}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: blog.title,
          secureUrl: `${BASE}/blog/${blog.id}/${blogSlugify(blog.title)}/opengraph-image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title: pageTitle,
      description: pageDescription,
      images: [`${BASE}/blog/${blog.id}/${blogSlugify(blog.title)}/opengraph-image`],
    },
    other: {
      "article:published_time": blog.created_at,
      "article:modified_time": blog.updated_at || blog.created_at,
      "article:author": authorName,
      "article:section": "Sound Buttons Blog",
      "article:tag": articleTags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id, slug: slugFromUrl } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) notFound()

  const blog = await blogApi.fetchBlogById(idNum)
  if (!blog) notFound()

  const correctSlug = blogSlugify(blog.title)
  if (slugFromUrl !== correctSlug) {
    permanentRedirect(`/blog/${blog.id}/${correctSlug}`)
  }

  const pageTitle = `${blog.title} | SoundButtons Blog`
  const pageDescription = generateBlogDescription(blog.title)
  const pageUrl = `${BASE}/blog/${blog.id}/${correctSlug}`

  let featuredSounds: ProcessedSound[] = []
  if (Array.isArray(blog.sound_ids) && blog.sound_ids.length > 0) {
    const results = await Promise.all(
      blog.sound_ids.map((sid) => apiClient.getSoundById(sid))
    )
    featuredSounds = results
      .map((r) => r.data)
      .filter((s): s is ProcessedSound => s != null)
  }

  let relevantSounds: ProcessedSound[] = []
  try {
    const { data } = await apiClient.getTrendingSounds(1, 28)
    relevantSounds = data.filter((s) => s != null) as ProcessedSound[]
  } catch {
    relevantSounds = []
  }

  const formattedContent = formatBlogContent(blog.content || "")
  const wordCount = cleanHtmlForMeta(blog.content).split(" ").length
  const minRead = Math.ceil(wordCount / 200)

  const ogImageUrl = `${BASE}/blog/${blog.id}/${correctSlug}/opengraph-image`
  const authorName = blog.user?.name || "SoundButtons Team"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: pageDescription,
    image: ogImageUrl,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/opengraph-image`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "blog", item: `${BASE}/blog` },
      { "@type": "ListItem", position: 2, name: blog.title, item: pageUrl },
    ],
  }

  return (
    <div className="py-8 bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4">
        <nav
          className="flex text-sm text-muted-foreground mb-6"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{blog.title}</li>
          </ol>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {blog.user?.name || "SoundButtons Team"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={blog.created_at}>
                  {formatDate(blog.created_at)}
                </time>
              </div>
              {blog.updated_at && blog.updated_at !== blog.created_at && (
                <span className="text-xs">
                  Updated:{" "}
                  <time dateTime={blog.updated_at}>
                    {formatDate(blog.updated_at)}
                  </time>
                </span>
              )}
              <span className="text-xs">{minRead} min read</span>
            </div>
            <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {pageDescription}
              </p>
            </div>
          </header>

          {featuredSounds.length > 0 && (
            <div id="featured-sounds" className="mb-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Music className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Featured Sounds
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  Sound buttons featured in this blog post
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {featuredSounds.map((sound) => (
                  <SoundButton key={sound.id} sound={sound as Sound} customSize={80} hideActions />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1da1f2] hover:bg-[#1a91da] text-white text-sm font-medium transition-colors"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#4267B2] hover:bg-[#365899] text-white text-sm font-medium transition-colors"
            >
              Share on Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium transition-colors"
            >
              Share on LinkedIn
            </a>
          </div>

          <div
            id="article-content"
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-4 prose-a:text-primary prose-a:underline prose-ul:list-disc prose-ol:list-decimal border border-border rounded-xl p-6 md:p-8 bg-card"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {relevantSounds.length > 0 && (
            <div id="related-sounds" className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">
                You May Also Like These Sound Buttons
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {relevantSounds.slice(0, 14).map((sound) => (
                  <SoundButton key={sound.id} sound={sound as Sound} customSize={80} hideActions />
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
