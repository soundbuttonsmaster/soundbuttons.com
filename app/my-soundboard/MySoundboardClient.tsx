"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { createPortal } from "react-dom"
import { LayoutGrid, LogIn, Plus, Folder, Music, AlertCircle, X, Check } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import {
  getMyDashboards,
  categoryDashboards,
  createDashboard,
  type Dashboard,
  type DashboardCategory,
  type ProcessedDashboardSound,
} from "@/lib/api/dashboards"
import SoundButton from "@/components/sound/sound-button"
import SoundPicker from "@/components/my-soundboard/SoundPicker"
import { cn } from "@/lib/utils"
import type { ProcessedSound } from "@/lib/api/client"

function MySoundboardKidsHero({ title, description }: { title: string; description: string }) {
  return (
    <section
      className="w-full py-8 sm:py-10 bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-yellow-950/50"
      suppressHydrationWarning
    >
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}

const gradientBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"

const kidsCard =
  "rounded-3xl shadow-lg border border-pink-200/60 dark:border-pink-800/40 bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-900/90 dark:to-pink-950/30"

const pageWrap =
  "min-h-screen bg-gradient-to-br from-amber-50/80 via-pink-50/80 to-violet-50/80 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30 py-8 sm:py-10"

const SOUNDS_PER_PAGE = 8

function toProcessedSound(s: ProcessedDashboardSound): ProcessedSound {
  return {
    id: s.id,
    name: s.name,
    sound_file: s.sound_file,
    views: s.views ?? 0,
    likes_count: s.likes_count ?? 0,
    favorites_count: s.favorites_count ?? 0,
    category_id: s.category_id,
    category_name: s.category_name,
  }
}

export default function MySoundboardClient() {
  const { token, isReady } = useAuth()
  const [myDashboards, setMyDashboards] = useState<Dashboard[]>([])
  const [categories, setCategories] = useState<DashboardCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visibleSoundsCount, setVisibleSoundsCount] = useState<Record<string, number>>({})
  const [loadingSounds, setLoadingSounds] = useState<Record<number, boolean>>({})
  const loadingSoundsRef = useRef<Set<number>>(new Set())
  const [newName, setNewName] = useState("")
  const [newCategoryId, setNewCategoryId] = useState(0)
  const [addSelectedSounds, setAddSelectedSounds] = useState<ProcessedSound[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  const loadDashboardSounds = useCallback(async (dashboard: Dashboard) => {
    if (!dashboard.sound_ids?.length || (dashboard.sounds && dashboard.sounds.length > 0)) return
    if (loadingSoundsRef.current.has(dashboard.id)) return
    loadingSoundsRef.current.add(dashboard.id)
    setLoadingSounds((prev) => ({ ...prev, [dashboard.id]: true }))
    try {
      const results = await Promise.all(
        dashboard.sound_ids.map((id) => apiClient.getSoundById(id))
      )
      const sounds: ProcessedDashboardSound[] = results
        .filter((r) => r.data)
        .map((r) => ({
          id: r.data!.id,
          name: r.data!.name,
          sound_file: r.data!.sound_file,
          views: r.data!.views,
          category_id: r.data!.category_id,
          category_name: r.data!.category_name,
        }))
      setMyDashboards((prev) =>
        prev.map((d) => (d.id === dashboard.id ? { ...d, sounds } : d))
      )
      setVisibleSoundsCount((prev) => ({
        ...prev,
        [dashboard.id]: Math.min(SOUNDS_PER_PAGE, sounds.length),
      }))
    } catch {
      // ignore
    } finally {
      loadingSoundsRef.current.delete(dashboard.id)
      setLoadingSounds((prev) => {
        const next = { ...prev }
        delete next[dashboard.id]
        return next
      })
    }
  }, [])

  const refreshDashboards = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const result = await getMyDashboards(token)
      if (result?.dashboards) {
        setMyDashboards(result.dashboards)
        const counts: Record<string, number> = {}
        result.dashboards.forEach((d: Dashboard) => {
          if (d.sounds?.length) {
            counts[d.id] = Math.min(SOUNDS_PER_PAGE, d.sounds.length)
          } else if (d.sound_ids?.length) {
            loadDashboardSounds(d)
          } else {
            counts[d.id] = 0
          }
        })
        setVisibleSoundsCount((prev) => ({ ...prev, ...counts }))
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [token, loadDashboardSounds])

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true)
    try {
      const catRes = await categoryDashboards(token ?? undefined)
      if (catRes?.categories?.length) {
        setCategories(catRes.categories)
      }
    } finally {
      setCategoriesLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([getMyDashboards(token), categoryDashboards(token)])
      .then(([dashRes, catRes]) => {
        if (dashRes?.dashboards) {
          setMyDashboards(dashRes.dashboards)
          const counts: Record<string, number> = {}
          dashRes.dashboards.forEach((d: Dashboard) => {
            if (d.sounds?.length) {
              counts[d.id] = Math.min(SOUNDS_PER_PAGE, d.sounds.length)
            } else if (d.sound_ids?.length) {
              loadDashboardSounds(d)
            } else {
              counts[d.id] = 0
            }
          })
          setVisibleSoundsCount(counts)
        }
        if (catRes?.categories?.length) {
          setCategories(catRes.categories)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isReady, token, loadDashboardSounds])

  useEffect(() => {
    if (addDialogOpen && token && categories.length === 0) {
      fetchCategories()
    }
  }, [addDialogOpen, token, categories.length, fetchCategories])


  const categoriesForDropdown = useMemo(() => {
    if (!categories.length) return []
    const hasHierarchy = categories.some((c) => c.parent_id != null)
    if (hasHierarchy) {
      const roots = categories.filter((c) => c.parent_id == null)
      return roots.map((cat) => ({
        id: cat.id,
        name: cat.categoryName,
        children: (cat.descendants || []).map((d) => ({
          id: d.id,
          name: d.categoryName,
        })),
      }))
    }
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.categoryName,
      children: [] as { id: number; name: string }[],
    }))
  }, [categories])

  const isFormValid = newName.trim() && newCategoryId > 0 && addSelectedSounds.length > 0

  const handleCreateDashboard = useCallback(async () => {
    if (!token || !isFormValid) return
    setProcessing(true)
    setError(null)
    try {
      await createDashboard(
        {
          name: newName.trim(),
          category_id: newCategoryId,
          sound_ids: addSelectedSounds.map((s) => s.id),
        },
        token
      )
      setNewName("")
      setNewCategoryId(0)
      setAddSelectedSounds([])
      setAddDialogOpen(false)
      await refreshDashboards()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create soundboard.")
    } finally {
      setProcessing(false)
    }
  }, [token, newName, newCategoryId, addSelectedSounds, refreshDashboards])

  const handleLoadMoreSounds = useCallback((dashboardId: string, total: number) => {
    setVisibleSoundsCount((prev) => ({
      ...prev,
      [dashboardId]: Math.min((prev[dashboardId] || SOUNDS_PER_PAGE) + SOUNDS_PER_PAGE, total),
    }))
  }, [])

  if (!isReady) {
    return (
      <div className={pageWrap}>
        <MySoundboardKidsHero title="My Soundboard" description="Your personal sounds board." />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={cn(kidsCard, "p-8 flex flex-col items-center justify-center gap-4")}>
            <div className="animate-pulse text-pink-500 dark:text-pink-400">Loading…</div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className={pageWrap}>
        <MySoundboardKidsHero
          title="My Soundboard"
          description="Sign in to view and manage your personal soundboard."
        />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={cn(kidsCard, "p-8 space-y-6 text-center")}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <LayoutGrid className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to see your soundboard</h2>
            <p className="text-muted-foreground text-sm">
              Create and manage your custom soundboards. Add sounds, organize by category, and share.
            </p>
            <Link href="/login?redirect=/my-soundboard" className={cn(gradientBtn, "w-full")}>
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              <Link href="/register" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Register
              </Link>{" "}
              to get started.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={pageWrap}>
        <MySoundboardKidsHero
          title="My Soundboard"
          description="Welcome to your personal sounds board!"
        />
        <main className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex justify-end mb-6">
            <button type="button" onClick={() => setAddDialogOpen(true)} className={gradientBtn}>
              <Plus className="h-4 w-4" />
              Add Sound Board
            </button>
          </div>

          {loading && (
            <div className={cn(kidsCard, "p-12 flex flex-col items-center justify-center gap-4")}>
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-400 border-t-transparent" />
              <p className="text-muted-foreground">Loading dashboards…</p>
            </div>
          )}

          {!loading && myDashboards.length === 0 && (
            <div className={cn(kidsCard, "p-12 text-center")}>
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800/50 dark:to-purple-800/50 flex items-center justify-center mb-4">
                <Folder className="h-10 w-10 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No soundboards yet</h3>
              <p className="text-muted-foreground mb-6">Create your first soundboard to get started!</p>
              <button type="button" onClick={() => setAddDialogOpen(true)} className={gradientBtn}>
                <Plus className="h-4 w-4" />
                Create your first soundboard
              </button>
            </div>
          )}

          {!loading && myDashboards.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {myDashboards.map((dashboard) => {
                const visibleCount = visibleSoundsCount[dashboard.id] ?? SOUNDS_PER_PAGE
                const visibleSounds = (dashboard.sounds || []).slice(0, visibleCount)
                const hasMore = (dashboard.sounds?.length || 0) > visibleCount
                const totalSounds = dashboard.sounds?.length || dashboard.sound_ids?.length || 0
                const isDashboardLoading = loadingSounds[dashboard.id]

                return (
                  <div
                    key={dashboard.id}
                    className={cn(kidsCard, "p-4 md:p-6")}
                  >
                  <h3 className="text-lg font-semibold mb-4">{dashboard.name}</h3>
                  {isDashboardLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">Loading sounds...</p>
                    </div>
                  )}
                  {!isDashboardLoading && visibleSounds.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {visibleSounds.map((sound, i) => (
                        <SoundButton
                          key={sound.id}
                          sound={toProcessedSound(sound) as import("@/lib/types/sound").Sound}
                          customSize={80}
                          hideActions
                          isAboveTheFold={i < 4}
                        />
                      ))}
                    </div>
                  )}
                  {!isDashboardLoading && visibleSounds.length === 0 && totalSounds === 0 && (
                    <div className="text-center py-6">
                      <Music className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No sounds in this board</p>
                    </div>
                  )}
                  {!isDashboardLoading && hasMore && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border-2 border-pink-200 dark:border-pink-700/50 text-foreground hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
                        onClick={() =>
                          handleLoadMoreSounds(String(dashboard.id), dashboard.sounds?.length || 0)
                        }
                      >
                        Load more sounds ({(dashboard.sounds?.length || 0) - visibleCount} left)
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </main>
      </div>

      {addDialogOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setAddDialogOpen(false)}
          >
            <div
              className={cn(
                "relative bg-background w-full flex flex-col overflow-hidden",
                "h-[92dvh] sm:h-auto sm:max-h-[88vh]",
                "rounded-t-3xl sm:rounded-2xl",
                "sm:max-w-2xl",
                "shadow-2xl border border-border/50"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile) */}
              <div className="shrink-0 flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0 shadow">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground leading-tight">New Sound Board</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Name it, pick a category, add sounds</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddDialogOpen(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">

                {error && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Board name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Board name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. My favorite memes"
                    className="w-full h-11 px-4 rounded-xl border border-input bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition placeholder:text-muted-foreground"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Category</label>
                    {categoriesLoading && (
                      <span className="text-xs text-muted-foreground animate-pulse">Loading…</span>
                    )}
                    {newCategoryId > 0 && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {categoriesForDropdown.find((c) => c.id === newCategoryId)?.name}
                      </span>
                    )}
                  </div>
                  {categoriesLoading ? (
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 w-24 rounded-full bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {categoriesForDropdown.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewCategoryId(cat.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all",
                            newCategoryId === cat.id
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-border/80"
                          )}
                        >
                          {newCategoryId === cat.id && <Check className="h-3 w-3 shrink-0" />}
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sounds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Add Sounds</label>
                    {addSelectedSounds.length > 0 && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {addSelectedSounds.length} selected
                      </span>
                    )}
                  </div>
                  <div className="h-[320px] sm:h-[360px]">
                    <SoundPicker
                      selectedSounds={addSelectedSounds}
                      onToggleSound={(sound) =>
                        setAddSelectedSounds((prev) =>
                          prev.some((s) => s.id === sound.id)
                            ? prev.filter((s) => s.id !== sound.id)
                            : [...prev, sound]
                        )
                      }
                      onRemoveSound={(id) =>
                        setAddSelectedSounds((prev) => prev.filter((s) => s.id !== id))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-border bg-muted/10">
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {addSelectedSounds.length > 0
                    ? `${addSelectedSounds.length} sound${addSelectedSounds.length !== 1 ? "s" : ""} ready`
                    : "Select at least one sound"}
                </p>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setAddDialogOpen(false)}
                    disabled={processing}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateDashboard}
                    disabled={processing || !isFormValid}
                    className={cn(
                      gradientBtn,
                      "text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Creating…
                      </span>
                    ) : (
                      "Create Board"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
