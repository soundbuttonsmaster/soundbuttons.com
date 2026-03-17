"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, User, ChevronRight, Loader2 } from "lucide-react"
import { blogApi, type Blog } from "@/lib/api/blog"
import { blogSlugify, cleanHtmlForMeta } from "@/lib/utils/blog"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function truncateContent(htmlContent: string, maxLength = 120) {
  const plain = cleanHtmlForMeta(htmlContent)
  return plain.length > maxLength ? plain.substring(0, maxLength) + "..." : plain
}

interface BlogListClientProps {
  initialBlogs: Blog[]
  initialPage: number
  totalPages: number
  itemsPerPage: number
}

export default function BlogListClient({
  initialBlogs,
  initialPage,
  totalPages,
  itemsPerPage,
}: BlogListClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPage < totalPages)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const result = await blogApi.fetchBlogs(nextPage, itemsPerPage, "asc")
      if (result.data.length > 0) {
        setBlogs((prev) => [...prev, ...result.data])
        setCurrentPage(nextPage)
        setHasMore(nextPage < result.meta.last_page)
      } else {
        setHasMore(false)
      }
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          SoundButtons Articles
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Read the latest news, updates, and articles about sound buttons, memes,
          and trending sounds. Discover tips, tutorials, and featured sound
          collections.
        </p>
      </div>

      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}/${blogSlugify(blog.title)}`}
                className="block group"
              >
                <div className="h-full rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="relative w-full pt-[100%] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="text-white text-center">
                        <div className="text-4xl font-bold mb-2">📝</div>
                        <h3 className="text-lg font-bold line-clamp-3 drop-shadow-lg">
                          {blog.title}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{formatDate(blog.created_at)}</span>
                      {blog.user?.name && (
                        <>
                          <span>•</span>
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{blog.user.name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {truncateContent(blog.content, 120)}
                    </p>
                    <div className="inline-flex items-center text-primary group-hover:text-primary/80 transition-colors text-sm font-medium">
                      Read more{" "}
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-all duration-300 border-2 border-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin inline-block" />
                    Loading...
                  </>
                ) : (
                  "Load More Articles →"
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No blog posts found at the moment. Check back later!
          </p>
        </div>
      )}

      <div className="mt-16 prose prose-neutral dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Stay Updated with SoundButtons
        </h2>
        <p className="text-muted-foreground mb-4">
          Our blog is your go-to resource for everything related to sound
          buttons, trending audio, and the latest developments in the world of
          sound effects and memes.
        </p>
        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
          What You&apos;ll Find Here
        </h3>
        <ul className="list-disc pl-6 text-muted-foreground mb-4">
          <li>Latest news and updates about sound buttons</li>
          <li>Tutorials and guides for content creators</li>
          <li>Featured sound collections and playlists</li>
          <li>Trending sound effects and viral audio</li>
          <li>Tips for using sound buttons effectively</li>
        </ul>
      </div>
    </>
  )
}
