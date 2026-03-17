/**
 * Dashboard (My Soundboard) API - same endpoints as sbmain
 * /dashboards/my, /dashcategories, POST /dashboards, etc.
 */

import { apiClient, type ProcessedSound } from "./client"

const API_BASE_URL = "https://api-v6.soundbuttons.com/api"
const MEDIA_BASE_URL = "https://api-v6.soundbuttons.com/media"

export interface PublicDashboard {
  id: number
  name: string
  category_id?: number
  category?: { id: number; categoryName: string } | null
  sound_ids?: number[]
  sounds?: ProcessedSound[]
  created_at?: string
}

export interface DashboardCategory {
  id: number
  categoryName: string
  slug?: string
  parent_id: number | null
  created_at?: string
  updated_at?: string
  descendants?: DashboardCategory[]
  parent?: { categoryName: string; id?: number }
}

export interface Dashboard {
  id: number
  name: string
  category_id?: number
  category?: number
  sound_ids?: number[]
  sounds?: ProcessedDashboardSound[]
}

export interface ProcessedDashboardSound {
  id: number
  name: string
  sound_file: string
  views?: number
  likes_count?: number
  favorites_count?: number
  category_id?: number
  category_name?: string
}

function processSound(raw: {
  id: number
  soundName?: string
  soundFile?: string
  sound_file?: string
  name?: string
  views?: number
  category_id?: number
  category_name?: number
}): ProcessedDashboardSound {
  let fileUrl = raw.soundFile || raw.sound_file || ""
  if (fileUrl.includes("/api/")) fileUrl = fileUrl.replace("/api/", "/")
  if (fileUrl && !fileUrl.startsWith("http")) {
    fileUrl = `${MEDIA_BASE_URL}/${fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl}`
  }
  return {
    id: raw.id,
    name: raw.soundName || raw.name || "",
    sound_file: fileUrl,
    views: raw.views ?? 0,
    likes_count: 0,
    favorites_count: 0,
    category_id: raw.category_id,
    category_name: typeof raw.category_name === "string" ? raw.category_name : undefined,
  }
}

export async function getMyDashboards(
  token: string
): Promise<{ status: boolean; dashboards: Dashboard[] }> {
  const res = await fetch(`${API_BASE_URL}/dashboards/my`, {
    headers: { Authorization: `Token ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const result = await res.json()
  let dashboards: any[] = []
  if (result.status === true && result.dashboards) dashboards = result.dashboards
  else if (result.data?.dashboards) dashboards = result.data.dashboards
  else if (Array.isArray(result)) dashboards = result
  else if (result.dashboards) dashboards = result.dashboards
  const processed = dashboards.map((d: any) => ({
    ...d,
    sound_ids: d.sound_ids || [],
    sounds: Array.isArray(d.sounds) ? d.sounds.map(processSound) : [],
  }))
  return { status: true, dashboards: processed }
}

function processCategory(cat: Record<string, unknown>): DashboardCategory {
  const parent = cat.parent as Record<string, unknown> | number | null | undefined
  const parentId =
    typeof cat.parent_id === "number"
      ? cat.parent_id
      : parent === null || parent === undefined
        ? null
        : typeof parent === "object" && parent && "id" in parent
          ? (parent.id as number)
          : typeof parent === "number"
            ? parent
            : null
  return {
    id: cat.id as number,
    categoryName: (cat.categoryName || cat.category_name || cat.name || "") as string,
    slug: (cat.slug as string) || String(cat.categoryName || "").toLowerCase().replace(/\s+/g, "-"),
    parent_id: parentId,
    created_at: cat.created_at as string | undefined,
    updated_at: cat.updated_at as string | undefined,
    descendants: (cat.descendants as DashboardCategory[]) || [],
  }
}

/** Fetch dashboard categories - works with or without token (API allows public read) */
export async function categoryDashboards(
  token?: string | null
): Promise<{ status: boolean; categories: DashboardCategory[] }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Token ${token}`

  let res = await fetch(`${API_BASE_URL}/dashcategories`, {
    headers,
    cache: "no-store",
  })
  if (!res.ok && token) {
    res = await fetch(`${API_BASE_URL}/dashcategories`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
  }
  if (!res.ok) return { status: false, categories: [] }
  const result = await res.json()

  let rawCategories: unknown[] = []
  if (result.status === true && Array.isArray(result.categories)) {
    rawCategories = result.categories
  } else if (result.status === true && Array.isArray(result.dashboard_categories)) {
    rawCategories = result.dashboard_categories
  } else if (result.data?.categories && Array.isArray(result.data.categories)) {
    rawCategories = result.data.categories
  } else if (result.data?.dashboard_categories && Array.isArray(result.data.dashboard_categories)) {
    rawCategories = result.data.dashboard_categories
  } else if (Array.isArray(result)) {
    rawCategories = result
  } else if (Array.isArray(result.categories)) {
    rawCategories = result.categories
  } else if (Array.isArray(result.dashboard_categories)) {
    rawCategories = result.dashboard_categories
  }

  const categories = rawCategories.map((c) => processCategory(c as Record<string, unknown>))
  return { status: true, categories }
}

export async function createDashboard(
  data: { name: string; category_id: number; sound_ids: number[] },
  token: string
): Promise<Dashboard | null> {
  const res = await fetch(`${API_BASE_URL}/dashboards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      category: data.category_id,
      sound_ids: data.sound_ids ?? [],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${text}`)
  }
  const result = await res.json()
  return result.data ?? result ?? null
}

export async function deleteDashboard(id: number, token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/dashboards/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  })
  if (!res.ok) return false
  const result = await res.json()
  return result.status === true
}

export async function updateDashboard(
  id: number,
  data: { name: string; category_id: number; sound_ids: number[] },
  token: string
): Promise<Dashboard | null> {
  const res = await fetch(`${API_BASE_URL}/dashboards/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      category: data.category_id,
      sound_ids: data.sound_ids ?? [],
    }),
  })
  if (!res.ok) return null
  const result = await res.json()
  return result.data ?? result ?? null
}

/** Process raw dashboard from API - handle category as object or ID */
function processDashboardFromApi(d: Record<string, unknown>): PublicDashboard {
  let category: { id: number; categoryName: string } | null = null
  const cat = d.category
  if (cat && typeof cat === "object" && cat !== null && "categoryName" in cat) {
    category = {
      id: (cat as { id?: number }).id ?? 0,
      categoryName: (cat as { categoryName?: string }).categoryName ?? "",
    }
  } else if (typeof cat === "number") {
    category = { id: cat, categoryName: `Category ${cat}` }
  }
  return {
    id: d.id as number,
    name: (d.name as string) ?? "",
    category_id: typeof d.category_id === "number" ? d.category_id : undefined,
    category,
    sound_ids: Array.isArray(d.sound_ids) ? (d.sound_ids as number[]) : [],
    sounds: [],
    created_at: d.created_at as string | undefined,
  }
}

/** Fetch all public dashboards - used for slug lookup and main page */
export async function getPublicDashboards(): Promise<PublicDashboard[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboards/public`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const result = await res.json()
    let raw: unknown[] = []
    if (result.status === true && Array.isArray(result.dashboards)) {
      raw = result.dashboards
    } else if (result.data?.dashboards && Array.isArray(result.data.dashboards)) {
      raw = result.data.dashboards
    } else if (result.data && Array.isArray(result.data)) {
      raw = result.data
    } else if (Array.isArray(result)) {
      raw = result
    }
    return raw.map((d) => processDashboardFromApi(d as Record<string, unknown>))
  } catch {
    return []
  }
}

/** Fetch public dashboards with pagination - Django may return all; we slice client-side */
export async function getPublicDashboardsPaginated(
  page = 1,
  limit = 6
): Promise<{ data: PublicDashboard[]; total: number; hasMore: boolean }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/dashboards/public?page=${page}&limit=${limit}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return { data: [], total: 0, hasMore: false }
    const result = await res.json()
    let raw: unknown[] = []
    let total = 0
    if (result.status === true && Array.isArray(result.dashboards)) {
      raw = result.dashboards
      total =
        typeof result.total_dashboards === "number"
          ? result.total_dashboards
          : typeof result.total === "number"
            ? result.total
            : raw.length
    } else if (result.data?.dashboards && Array.isArray(result.data.dashboards)) {
      raw = result.data.dashboards
      total =
        typeof result.data.total_dashboards === "number"
          ? result.data.total_dashboards
          : typeof result.total === "number"
            ? result.total
            : raw.length
    } else if (result.data && Array.isArray(result.data)) {
      raw = result.data
      total = result.meta?.total ?? result.total ?? raw.length
    } else if (Array.isArray(result)) {
      raw = result
      total = result.length
    }
    const all = raw.map((d) => processDashboardFromApi(d as Record<string, unknown>))
    const actualTotal = total || all.length
    // Django may ignore page/limit and return all - slice for client pagination
    const start = (page - 1) * limit
    const data = all.slice(start, start + limit)
    const hasMore = start + data.length < actualTotal
    return { data, total: actualTotal, hasMore }
  } catch {
    return { data: [], total: 0, hasMore: false }
  }
}

/** Batch fetch sounds by ID - returns ProcessedSound for SoundButton */
export async function getDashboardSounds(
  _dashboardId: number,
  soundIds: number[]
): Promise<ProcessedSound[]> {
  if (!soundIds?.length) return []
  const results = await Promise.allSettled(
    soundIds.map((id) => apiClient.getSoundById(id))
  )
  const sounds: ProcessedSound[] = []
  for (const r of results) {
    if (r.status === "fulfilled" && r.value?.data) {
      sounds.push(r.value.data)
    }
  }
  return sounds
}

/** Slugify dashboard name for URLs */
export function slugifyDashboardName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
