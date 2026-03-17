/**
 * Blog API client - same endpoints as sbmain (api-v6.soundbuttons.com)
 */

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"

export interface Blog {
  id: number
  title: string
  content: string
  media_path: string | null
  user_id: number
  created_at: string
  updated_at: string
  user?: { name: string; email?: string }
  sound_ids?: number[]
  sounds?: unknown[]
  scheduled_time?: string | null
}

export interface BlogListMeta {
  current_page: number
  last_page: number
  total_items: number
  per_page: number
  next?: string | null
  previous?: string | null
}

async function fetchBlogsRaw(
  page = 1,
  limit = 10,
  sortOrder: "asc" | "desc" = "asc"
): Promise<{ data: Blog[]; meta: BlogListMeta }> {
  const url = `${API_BASE_URL}/blogs?page=${page}&limit=${limit}&sort=${sortOrder}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) {
    return {
      data: [],
      meta: {
        current_page: page,
        last_page: 1,
        total_items: 0,
        per_page: limit,
      },
    }
  }
  const result = (await res.json()) as {
    status?: boolean
    blogs?: Blog[]
    data?: Blog[] | { status?: boolean; blogs?: Blog[] }
    count?: number
    next?: string | null
    previous?: string | null
  }
  let blogsData: Blog[] = []
  const count = result.count ?? 0
  if (result.status === true && result.blogs) {
    blogsData = result.blogs
  } else if (
    result.data &&
    typeof result.data === "object" &&
    !Array.isArray(result.data) &&
    (result.data as { status?: boolean; blogs?: Blog[] }).status === true &&
    (result.data as { blogs?: Blog[] }).blogs
  ) {
    blogsData = (result.data as { blogs: Blog[] }).blogs
  } else if (result.data && Array.isArray(result.data)) {
    blogsData = result.data
  } else if (Array.isArray(result)) {
    blogsData = result as unknown as Blog[]
  }
  return {
    data: blogsData,
    meta: {
      current_page: page,
      last_page: Math.ceil(count / limit) || 1,
      total_items: count,
      per_page: limit,
      next: result.next,
      previous: result.previous,
    },
  }
}

export const blogApi = {
  async fetchBlogs(
    page = 1,
    limit = 20,
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Blog[]; meta: BlogListMeta }> {
    return fetchBlogsRaw(page, limit, sortOrder)
  },

  async fetchBlogById(id: number): Promise<Blog | null> {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const result = (await res.json()) as {
      status?: boolean
      blog?: Blog
      data?: Blog | { status?: boolean; blog?: Blog }
    }
    if (result.status === true && result.blog) return result.blog
    if (
      result.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      const d = result.data as { status?: boolean; blog?: Blog }
      if (d.status === true && d.blog) return d.blog
      if ("id" in d && "title" in d) return d as unknown as Blog
    }
    if (result.blog) return result.blog
    if (result.data && "id" in result.data && "title" in result.data)
      return result.data as unknown as Blog
    return null
  },
}
