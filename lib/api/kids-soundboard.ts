/**
 * Kids Soundboard API - same endpoints as sbmain
 * https://api-v6.soundbuttons.com/api
 */

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"
const MEDIA_BASE_URL = "https://api-v6.soundbuttons.com/media"

export interface KidsSoundboardCategory {
  id: number
  categoryName: string
  image: string
  parent: number | null
  created_at: string
  updated_at: string
  descendants: KidsSoundboardCategory[]
}

export interface KidsSoundboard {
  id: number
  soundName: string
  category: number
  soundFile: string
  selectedImage: string
  views: number
  isTrending: boolean
  user: number
  status: string
  created_at: string
  updated_at: string
  updated_by: number | null
  scheduled_time?: string
}

export interface KidsSoundboardsResponse {
  data: KidsSoundboard[]
  count: number
  next: string | null
  previous: string | null
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const kidsSoundboardApi = {
  async getCategories(): Promise<KidsSoundboardCategory[]> {
    try {
      const result = await fetchJson<{ data?: KidsSoundboardCategory[] }>(
        `${API_BASE_URL}/kidssoundboard-categories`
      )
      return result.data || []
    } catch {
      return []
    }
  },

  async getPaginated(
    page = 1,
    limit = 36
  ): Promise<KidsSoundboardsResponse> {
    try {
      const result = await fetchJson<KidsSoundboardsResponse>(
        `${API_BASE_URL}/kidssoundboards/all-paginated?page=${page}&limit=${limit}`
      )
      return result || { data: [], count: 0, next: null, previous: null }
    } catch {
      return { data: [], count: 0, next: null, previous: null }
    }
  },

  async getByCategory(
    categoryId: number,
    page = 1,
    limit = 36
  ): Promise<KidsSoundboardsResponse> {
    try {
      const result = await fetchJson<KidsSoundboardsResponse>(
        `${API_BASE_URL}/kidssoundboards/category/${categoryId}?page=${page}&limit=${limit}`
      )
      return result || { data: [], count: 0, next: null, previous: null }
    } catch {
      return { data: [], count: 0, next: null, previous: null }
    }
  },

  getSoundFileUrl(sound: KidsSoundboard): string {
    let path = sound.soundFile || ""
    if (path.includes("/api/")) path = path.replace("/api/", "/")
    if (path && !path.startsWith("http")) {
      path = path.replace(/^\/+/, "").replace(/^media\//, "")
      return `${MEDIA_BASE_URL}/${path}`
    }
    return path || ""
  },

  getImageUrl(sound: KidsSoundboard): string {
    const img = sound.selectedImage || ""
    if (img.startsWith("http")) return img
    if (img) return `${MEDIA_BASE_URL}/${img.replace(/^\/+/, "")}`
    return ""
  },

  getCategoryImageUrl(cat: KidsSoundboardCategory): string {
    const img = cat.image || ""
    if (img.startsWith("http")) return img
    if (img) return `${MEDIA_BASE_URL}/${img.replace(/^\/+/, "")}`
    return ""
  },
}
