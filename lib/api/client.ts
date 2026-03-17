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

function extractMeta(res: SoundResponse, page: number, pageSize?: number) {
  const total = res.total_items ?? res.count ?? 0
  const perPage = pageSize ?? 21
  return {
    current_page: res.current_page ?? page,
    last_page: (res.total_pages ?? Math.ceil(total / perPage)) || 1,
    total_items: total,
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

  /** Fetch single sound by ID */
  async getSoundById(id: number): Promise<{ data: ProcessedSound | null }> {
    const res = await fetch(`${API_BASE_URL}/sounds/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return { data: null }
    const json = (await res.json()) as {
      status?: boolean
      sound?: ApiSound & { category?: number; category_name?: string; category_id?: number }
      data?: { sound?: ApiSound & { category?: number; category_name?: string; category_id?: number } }
    }
    let raw = json.sound ?? json.data?.sound
    if (!raw) return { data: null }
    const processed = processSound(raw)
    const ext = raw as { category?: number; category_name?: string; category_id?: number }
    if (!processed.category_id && typeof ext.category === "number") {
      ;(processed as ProcessedSound & { category_id?: number }).category_id = ext.category
    }
    if (ext.category_name) {
      ;(processed as ProcessedSound & { category_name?: string }).category_name = ext.category_name
    }
    return { data: processed }
  },

  /** Fetch related sounds by sound ID and category ID */
  async getRelatedSounds(soundId: number, categoryId: number): Promise<{ data: ProcessedSound[] }> {
    const res = await fetch(
      `${API_BASE_URL}/sounds/related/${soundId}/${categoryId}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return { data: [] }
    const json = (await res.json()) as SoundResponse
    return { data: extractSounds(json) }
  },

  /** Increment sound views (fire-and-forget) */
  async updateViews(soundId: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/sounds/views/${soundId}`, { method: "POST" })
    } catch {
      // ignore
    }
  },

  /** Search sounds */
  async searchSounds(
    query: string,
    page = 1,
    pageSize = 50
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    const url = `${API_BASE_URL}/sounds/search/${encodeURIComponent(query)}?page=${page}&limit=${pageSize}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    const json = (await res.json()) as SoundResponse
    return { data: extractSounds(json), meta: extractMeta(json, page, pageSize) }
  },

  /** Fetch sounds by category name (e.g. "Reactions", "Memes") - API uses categoryName without "Soundboard" */
  async getSoundsByCategory(
    categoryName: string,
    page = 1,
    pageSize = 35
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    const url = `${API_BASE_URL}/sounds/category/${encodeURIComponent(categoryName)}/sounds?page=${page}&limit=${pageSize}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    const json = (await res.json()) as SoundResponse & {
      data?: { sounds?: ApiSound[]; current_page?: number; total_pages?: number; total_items?: number }
      count?: number
    }
    const nested = json.data && typeof json.data === "object" && "sounds" in json.data
    const soundsRes = nested ? (json.data as { sounds?: ApiSound[] }) : json
    const metaRes = nested && json.data ? json.data : json
    return {
      data: extractSounds(soundsRes as SoundResponse),
      meta: extractMeta(metaRes as SoundResponse, page),
    }
  },

  /** URL for streaming/playback - soundbuttonsapi uses download endpoint */
  getSoundAudioUrl(soundOrId: { sound_file?: string } | number): string {
    if (typeof soundOrId === "number") {
      return `${API_BASE_URL}/sounds/download/${soundOrId}`
    }
    if (soundOrId.sound_file?.startsWith("http")) return soundOrId.sound_file
    return `${MEDIA_BASE_URL}/${soundOrId.sound_file?.replace(/^\//, "") || ""}`
  },

  /** Fetch direct playback URL - soundbuttonsapi: return same as getSoundAudioUrl (no S3) */
  async getSoundAudioPlaybackUrl(id: number): Promise<string> {
    return `${API_BASE_URL}/sounds/download/${id}`
  },

  /** URL for download */
  async favoriteSound(token: string, soundId: number): Promise<{ status: number }> {
    const res = await fetch(`${API_BASE_URL}/favorites/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ soundId }),
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, ...data }
  },

  async unfavoriteSound(token: string, soundId: number): Promise<{ status: number }> {
    const res = await fetch(`${API_BASE_URL}/favorites/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ soundId }),
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, ...data }
  },

  async likeSound(token: string, soundId: number): Promise<{ status: number }> {
    return Promise.resolve({ status: 200 })
  },

  async unlikeSound(token: string, soundId: number): Promise<{ status: number }> {
    return Promise.resolve({ status: 200 })
  },

  getSoundDownloadUrl(soundOrId: { sound_file?: string } | number): string {
    const base =
      typeof soundOrId === "number"
        ? `${API_BASE_URL}/sounds/download/${soundOrId}`
        : this.getSoundAudioUrl(soundOrId as { sound_file?: string })
    return `${base}${base.includes("?") ? "&" : "?"}download=true`
  },

  /** Request password reset - sends email with reset link */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) {
        return { success: true, message: data.message || "Password reset email sent successfully" }
      }
      return { success: false, message: data.message || "Failed to send password reset email" }
    } catch {
      return { success: false, message: "Network error" }
    }
  },

  /** Login - POST /login/user (same as sbmain). email field accepts username or email. */
  async login(
    usernameOrEmail: string,
    password: string
  ): Promise<{ success: true; token: string; user: { id: number; username: string; email: string; full_name?: string } } | { success: false; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/login/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usernameOrEmail, password }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        id?: number
        token?: string
        user?: { username: string; is_admin?: boolean }
        error?: string
        message?: string
      }
      if (res.ok && data.token && data.user) {
        const user = {
          id: data.id ?? 0,
          username: data.user.username,
          email: usernameOrEmail,
          full_name: undefined as string | undefined,
        }
        return { success: true, token: data.token, user }
      }
      return { success: false, message: data.error || data.message || "Login failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  },

  /** Register - POST /register (same as sbmain). Returns no token; call login() after success. */
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<{ success: true; user: { id: number; username: string; email: string } } | { success: false; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        id?: number
        user?: { username: string; email: string; is_admin?: boolean }
        message?: string
        email?: string[]
        username?: string[]
      }
      if (res.ok && data.user) {
        return {
          success: true,
          user: {
            id: data.id ?? 0,
            username: data.user.username,
            email: data.user.email,
          },
        }
      }
      const msg =
        data.message ||
        (Array.isArray(data.email) ? data.email[0] : null) ||
        (Array.isArray(data.username) ? data.username[0] : null) ||
        "Registration failed"
      return { success: false, message: msg }
    } catch {
      return { success: false, message: "Network error" }
    }
  },

  /** Confirm password reset with token from email. API expects user_id, token, new_password, new_password_confirm. */
  async confirmPasswordReset(
    userId: number,
    token: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          token,
          new_password: newPassword,
          new_password_confirm: newPasswordConfirm,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) return { success: true, message: data.message || "Password updated successfully" }
      return { success: false, message: data.message || "Failed to reset password" }
    } catch {
      return { success: false, message: "Network error" }
    }
  },

  /** Get user favorites (requires token) */
  async getFavorites(
    token: string,
    page = 1,
    pageSize = 50
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/favorites?page=${page}&limit=${pageSize}`,
        { headers: { Authorization: `Token ${token}` }, next: { revalidate: 0 } }
      )
      if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
      const json = (await res.json()) as SoundResponse & { data?: { sounds?: ApiSound[]; current_page?: number; total_pages?: number; total_items?: number } }
      const nested = json.data && typeof json.data === "object" && "sounds" in json.data
      const soundsRes = nested ? (json.data as { sounds?: ApiSound[] }) : json
      const metaRes = nested && json.data ? json.data : json
      return {
        data: extractSounds(soundsRes as SoundResponse),
        meta: extractMeta(metaRes as SoundResponse, page, pageSize),
      }
    } catch {
      return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    }
  },

  /** Get leaderboard entries */
  async getLeaderboard(
    page = 1,
    pageSize = 50
  ): Promise<{ data: { username: string; score: number; rank: number }[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/leaderboard?page=${page}&limit=${pageSize}`,
        { next: { revalidate: 60 } }
      )
      if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
      const json = (await res.json()) as {
        results?: { username: string; score: number; rank: number }[]
        data?: { username: string; score: number; rank: number }[]
        current_page?: number
        total_pages?: number
        total_items?: number
      }
      const list = json.results ?? json.data ?? []
      const total = json.total_items ?? (Array.isArray(list) ? list.length : 0)
      return {
        data: Array.isArray(list) ? list : [],
        meta: {
          current_page: json.current_page ?? page,
          last_page: json.total_pages ?? 1,
          total_items: total,
        },
      }
    } catch {
      return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    }
  },

  /** Get current user's sounds - GET /sounds?my_sounds=true (same as sbmain) */
  async getMySounds(
    token: string,
    page = 1,
    pageSize = 1000
  ): Promise<{ data: ProcessedSound[]; meta: { current_page: number; last_page: number; total_items: number } }> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/sounds?my_sounds=true&limit=${pageSize}${page > 1 ? `&page=${page}` : ""}`,
        { headers: { Authorization: `Token ${token}` }, cache: "no-store" }
      )
      if (!res.ok) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
      const json = (await res.json()) as SoundResponse & {
        data?: ApiSound[] | { sounds?: ApiSound[]; current_page?: number; total_pages?: number; total_items?: number }
        results?: { sounds?: ApiSound[] }
      }
      let raw: ApiSound[] = []
      if (json.sounds && Array.isArray(json.sounds)) raw = json.sounds
      else if (json.data && Array.isArray(json.data)) raw = json.data
      else if (json.results?.sounds) raw = json.results.sounds
      else if (json.data && typeof json.data === "object" && "sounds" in json.data)
        raw = (json.data as { sounds?: ApiSound[] }).sounds || []
      const metaRes = (typeof json.data === "object" && json.data && "sounds" in json.data ? json.data : json) as SoundResponse
      return {
        data: raw.map((s) => processSound(s)),
        meta: extractMeta(metaRes, page, pageSize),
      }
    } catch {
      return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 } }
    }
  },

  /** Sound categories for upload (GET /api/categories). Used for soundFile upload category selection. */
  async getSoundCategories(): Promise<{ id: number; categoryName: string }[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" })
      if (!res.ok) return []
      const data = (await res.json()) as { status?: boolean; categories?: { id: number; categoryName: string }[] }
      const list = data.categories ?? []
      return Array.isArray(list) ? list : []
    } catch {
      return []
    }
  },

  /**
   * Upload sound (requires token). POST /api/sounds/add.
   * FormData must include: soundFile (file), soundName (string), category (number, required).
   */
  async uploadSound(
    token: string,
    formData: FormData
  ): Promise<{ success: true; sound?: ProcessedSound } | { success: false; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/sounds/add`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` } as HeadersInit,
        body: formData,
      })
      const data = (await res.json().catch(() => ({}))) as {
        sound?: ApiSound
        data?: { sound?: ApiSound }
        message?: string
      }
      const raw = data.sound ?? data.data?.sound
      if (res.ok && raw) {
        return { success: true, sound: processSound(raw) }
      }
      return { success: false, message: (data as { message?: string }).message || "Upload failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  },
}
