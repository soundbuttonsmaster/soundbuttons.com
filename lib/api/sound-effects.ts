/**
 * Sound Effects API - separate from main sounds API
 * Endpoints: /api/soundeffects/*
 * Same as sbmain
 */

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"
const MEDIA_BASE_URL = "https://api-v6.soundbuttons.com/media"

export interface SoundEffect {
  id: number
  soundName: string
  soundFile: string
  selectedImage?: string
  category?: number
  tags?: string
  views?: number
  status?: string
  created_at?: string
  updated_at?: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const soundEffectsApi = {
  async getAll(): Promise<SoundEffect[]> {
    try {
      const result = await fetchJson<{ status?: boolean; data?: SoundEffect[] }>(
        `${API_BASE_URL}/soundeffects/all`
      )
      if (result?.status && Array.isArray(result.data)) return result.data
      if (Array.isArray(result.data)) return result.data
      if (Array.isArray(result)) return result as SoundEffect[]
      return []
    } catch {
      return []
    }
  },

  async getById(id: number): Promise<SoundEffect | null> {
    try {
      const result = await fetchJson<{ status?: boolean; data?: SoundEffect }>(
        `${API_BASE_URL}/soundeffects/${id}`
      )
      if (result?.status && result.data) return result.data
      if (result?.data) return result.data
      return null
    } catch {
      return null
    }
  },

  async getRelated(id: number, tags: string, limit = 30): Promise<SoundEffect[]> {
    try {
      const all = await this.getAll()
      const currentTags = tags ? tags.split(",").map((t) => t.trim().toLowerCase()) : []
      return all
        .filter((e) => {
          if (e.id === id) return false
          if (!e.tags) return false
          const effectTags = e.tags.split(",").map((t) => t.trim().toLowerCase())
          return currentTags.some((tag) => effectTags.includes(tag))
        })
        .slice(0, limit)
    } catch {
      return []
    }
  },

  async incrementViews(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/soundeffects/${id}/views`, { method: "POST" })
    } catch {
      // ignore
    }
  },

  getSoundFileUrl(effect: SoundEffect): string {
    let path = effect.soundFile || ""
    if (path.startsWith("http")) return path
    if (path) {
      path = path.replace(/^\/+/, "").replace(/^media\//, "")
      return `${MEDIA_BASE_URL}/${path}`
    }
    return ""
  },

  getImageUrl(effect: SoundEffect): string {
    const img = effect.selectedImage || ""
    if (img.startsWith("http")) return img
    if (img) return `${MEDIA_BASE_URL}/${img.replace(/^\/+/, "")}`
    return ""
  },
}
