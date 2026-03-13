/**
 * API client for soundbuttonsapi (https://api-v6.soundbuttons.com/api)
 * Same API as sbmain
 */

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"
const MEDIA_BASE_URL = "https://api-v6.soundbuttons.com/media"

export interface ApiSound {
  id: number
  soundName: string
  soundFile: string
  views?: number
  category_id?: number
  category_name?: string
}

export interface SoundResponse {
  status?: boolean
  sounds?: ApiSound[]
  data?: ApiSound[] | { sounds: ApiSound[] }
  results?: { sounds: ApiSound[] }
  count?: number
  next?: string | null
  previous?: string | null
  current_page?: number
  total_pages?: number
  total_items?: number
}

export interface ProcessedSound {
  id: number
  name: string
  sound_file: string
  views: number
  likes_count: number
  favorites_count: number
  category_id?: number
  category_name?: string
  is_liked?: boolean
  is_favorited?: boolean
}

function processSound(raw: ApiSound): ProcessedSound {
  let fileUrl = raw.soundFile || ""
  if (fileUrl.includes("/api/")) fileUrl = fileUrl.replace("/api/", "/")
  if (fileUrl && !fileUrl.startsWith("http")) {
    fileUrl = `${MEDIA_BASE_URL}/${fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl}`
  }
  return {
    id: raw.id,
    name: raw.soundName || "",
    sound_file: fileUrl,
    views: raw.views ?? 0,
    likes_count: 0,
    favorites_count: 0,
    category_id: raw.category_id,
    category_name: raw.category_name,
  }
}

function extractSounds(res: SoundResponse): ProcessedSound[] {
  let raw: ApiSound[] = []
  if (res.sounds && Array.isArray(res.sounds)) raw = res.sounds
  else if (res.results?.sounds) raw = res.results.sounds
  else if (res.data && Array.isArray(res.data)) raw = res.data
  else if (res.data && typeof res.data === "object" && "sounds" in res.data)
    raw = (res.data as { sounds: ApiSound[] }).sounds || []
  return raw.map(processSound)
}

function extractMeta(res: SoundResponse, page: number) {
  return {
    current_page: res.current_page ?? page,
    last_page: (res.total_pages ?? Math.ceil((res.count ?? 0) / 21)) || 1,
    total_items: res.total_items ?? res.count ?? 0,
  }
}

export const apiClient = {
  async getTrendingSounds(
    page = 1,
    pageSize = 44
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    const url = `${API_BASE_URL}/sounds/trending?page=${page}&page_size=${pageSize}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    const json = (await res.json()) as SoundResponse
    return { data: extractSounds(json), meta: extractMeta(json, page) }
  },

  async getNewSounds(
    page = 1,
    pageSize = 22
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    const url = `${API_BASE_URL}/sounds/new?page=${page}&page_size=${pageSize}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    const json = (await res.json()) as SoundResponse
    return { data: extractSounds(json), meta: extractMeta(json, page) }
  },

  getSoundAudioUrl(sound: { sound_file?: string }): string {
    if (sound.sound_file?.startsWith("http")) return sound.sound_file
    return `${MEDIA_BASE_URL}/${sound.sound_file?.replace(/^\//, "") || ""}`
  },

  getSoundDownloadUrl(sound: { sound_file?: string }): string {
    const base = this.getSoundAudioUrl(sound)
    return `${base}${base.includes("?") ? "&" : "?"}download=true`
  },
}
