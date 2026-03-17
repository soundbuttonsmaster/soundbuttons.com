"use client"

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import SoundButton from "@/components/sound/sound-button"
import { CATEGORIES, getCategoryBySlug } from "@/lib/constants/categories"
import { apiClient } from "@/lib/api/client"
import { getStrings, getLocaleFromPathname } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 12
const SOUND_BUTTON_SIZE = 110

type QuickReply = { type: "sound-buttons"; path: string[]; name: string }

type SoundMeta = {
  total_items: number
  last_page: number
}

type ChatMessage = {
  sender: "user" | "bot"
  text: string
  sounds?: Sound[]
  meta?: SoundMeta
  page?: number
  intentKey?: string
  loadingMore?: boolean
}

type CacheEntry = {
  sounds: Sound[]
  meta: SoundMeta
  page: number
}

const cache = new Map<string, CacheEntry>()

function getCacheKey(category: string | null, query: string | null): string | null {
  if (category) return `category:${category}`
  if (query && query.trim()) return `search:${query.trim()}`
  return null
}

export default function AiSoundButtonsClient() {
  const pathname = usePathname()
  const locale = useMemo(() => getLocaleFromPathname(pathname), [pathname])
  const strings = useMemo(() => getStrings(locale).aiSoundButtons, [locale])
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlCategory = searchParams.get("category")
  const urlQuery = searchParams.get("q")

  const [chat, setChat] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [quickReplies] = useState<QuickReply[]>(() =>
    CATEGORIES.filter((c) => !c.parentSlug).map((cat) => ({
      type: "sound-buttons" as const,
      path: [cat.slug],
      name: cat.name.replace(/\s+Soundboard$/, ""),
    }))
  )
  const chatEndRef = useRef<HTMLDivElement>(null)
  const initialUrlProcessed = useRef(false)

  useEffect(() => {
    if (chat.length < 2) return
    const last = chat[chat.length - 1]
    const prev = chat[chat.length - 2]
    if (last.sender === "bot" && prev.sender === "user") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat, loading])

  const findBestCategory = useCallback(
    (question: string): QuickReply | null => {
      const lower = question.toLowerCase().trim()
      const tokens = lower.split(/\s+/)
      return (
        quickReplies.find((q) => lower.includes(q.name.toLowerCase())) ||
        quickReplies.find((q) => lower.includes(q.path[0].toLowerCase().replace(/-/g, " "))) ||
        (tokens.length > 0 &&
          quickReplies.find((q) =>
            q.path[0].toLowerCase().replace(/-/g, " ").includes(tokens[0])
          )) ||
        null
      )
    },
    [quickReplies]
  )

  const fetchSounds = useCallback(
    async (intentKey: string, page: number, isCategory: boolean, slugOrQuery: string) => {
      const cacheKey = intentKey
      const cached = cache.get(cacheKey)
      if (cached && cached.page >= page) {
        const soundsUpToPage = cached.sounds.slice(0, page * PAGE_SIZE)
        return {
          data: soundsUpToPage,
          meta: cached.meta,
          fromCache: true,
        }
      }
      if (isCategory) {
        const category = getCategoryBySlug(slugOrQuery)
        if (!category) return { data: [], meta: { current_page: page, last_page: 1, total_items: 0 }, fromCache: false }
        const result = await apiClient.getSoundsByCategory(category.apiName, page, PAGE_SIZE)
        return { data: result.data, meta: result.meta, fromCache: false }
      }
      const result = await apiClient.searchSounds(slugOrQuery, page, PAGE_SIZE)
      return { data: result.data, meta: result.meta, fromCache: false }
    },
    []
  )

  const setUrlParams = useCallback(
    (category: string | null, q: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("category")
      params.delete("q")
      if (category) params.set("category", category)
      else if (q && q.trim()) params.set("q", q.trim())
      const next = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(next, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    const key = getCacheKey(urlCategory, urlQuery)
    if (!key || chat.length > 0) return
    if (initialUrlProcessed.current) return
    initialUrlProcessed.current = true
    const isCategory = key.startsWith("category:")
    const slugOrQuery = key.replace(/^category:|^search:/, "")
    setLoading(true)
    fetchSounds(key, 1, isCategory, slugOrQuery)
      .then((res) => {
        if (res.data.length === 0 && res.meta) {
          setChat([
            {
              sender: "bot",
              text: strings.noSoundsInCategory,
            },
          ])
          return
        }
        const meta: SoundMeta = {
          total_items: res.meta.total_items ?? res.data.length,
          last_page: res.meta.last_page ?? 1,
        }
        if (!res.fromCache) {
          cache.set(key, { sounds: res.data, meta, page: 1 })
        }
        const displayName = isCategory
          ? (getCategoryBySlug(slugOrQuery)?.name.replace(/\s+Soundboard$/, "") ?? slugOrQuery)
          : `"${slugOrQuery}"`
        setChat([
          {
            sender: "user",
            text: isCategory ? `I want to play ${displayName} sound buttons` : slugOrQuery,
          },
          {
            sender: "bot",
            text: res.data.length
              ? (isCategory
                  ? strings.hereAreCategory.replace("{name}", displayName)
                  : strings.hereAreSearch.replace("{query}", slugOrQuery))
              : strings.noSoundsInCategory,
            sounds: res.data,
            meta,
            page: 1,
            intentKey: key,
          },
        ])
      })
      .catch(() => {
        setChat([
          { sender: "bot", text: strings.errorMessage },
        ])
      })
      .finally(() => setLoading(false))
  }, [urlCategory, urlQuery, chat.length, strings.noSoundsInCategory, strings.errorMessage, fetchSounds])

  const handleLoadMoreSounds = useCallback(
    async (msgIdx: number) => {
      const msg = chat[msgIdx]
      if (
        !msg ||
        msg.sender !== "bot" ||
        !msg.sounds ||
        !msg.meta ||
        msg.loadingMore ||
        !msg.intentKey
      )
        return
      const { intentKey, page = 1 } = msg
      if (page >= msg.meta.last_page) return
      const nextPage = page + 1
      const isCategory = intentKey.startsWith("category:")
      const slugOrQuery = intentKey.replace(/^category:|^search:/, "")

      setChat((prev) =>
        prev.map((m, i) => (i === msgIdx ? { ...m, loadingMore: true } : m))
      )
      try {
        const res = await fetchSounds(intentKey, nextPage, isCategory, slugOrQuery)
        const newSounds = res.data
        const cached = cache.get(intentKey)
        if (cached && cached.page < nextPage && !res.fromCache) {
          cache.set(intentKey, {
            sounds: [...cached.sounds, ...newSounds],
            meta: res.meta,
            page: nextPage,
          })
        } else if (!cached && !res.fromCache) {
          cache.set(intentKey, {
            sounds: newSounds,
            meta: res.meta,
            page: nextPage,
          })
        }

        setChat((prev) =>
          prev.map((m, i) => {
            if (i !== msgIdx || !m.sounds) return m
            const merged = [...m.sounds, ...newSounds]
            return {
              ...m,
              sounds: merged,
              page: nextPage,
              loadingMore: false,
            }
          })
        )
      } catch {
        setChat((prev) =>
          prev.map((m, i) => (i === msgIdx ? { ...m, loadingMore: false } : m))
        )
      }
    },
    [chat, fetchSounds]
  )

  const handleUserQuestion = useCallback(
    async (
      question: string,
      catType?: "sound-buttons",
      catPath?: string[]
    ) => {
      if (loading) return
      const trimmed = question.trim()
      setChat((prev) => [...prev, { sender: "user", text: trimmed || question }])
      setInput("")
      setLoading(true)

      const match =
        catType && catPath?.length
          ? { type: "sound-buttons" as const, path: catPath, name: catPath[0] }
          : findBestCategory(trimmed || question)

      try {
        if (match) {
          const slug = match.path[0]
          setUrlParams(slug, null)
          const key = `category:${slug}`
          let res = await fetchSounds(key, 1, true, slug)
          if (res.fromCache && res.data.length === 0) {
            const category = getCategoryBySlug(slug)
            if (category) {
              const fresh = await apiClient.getSoundsByCategory(category.apiName, 1, PAGE_SIZE)
              res = { data: fresh.data, meta: fresh.meta, fromCache: false }
            }
          }
          if (!res.fromCache && res.data.length > 0) {
            cache.set(key, {
              sounds: res.data,
              meta: res.meta,
              page: 1,
            })
          }
          const displayName =
            getCategoryBySlug(slug)?.name.replace(/\s+Soundboard$/, "") ?? slug
          if (!res.data || res.data.length === 0) {
            setChat((prev) => [
              ...prev,
              { sender: "bot", text: strings.noSoundsInCategory },
            ])
          } else {
            setChat((prev) => [
              ...prev,
              {
                sender: "bot",
                text: strings.hereAreCategory.replace("{name}", displayName),
                sounds: res.data,
                meta: { total_items: res.meta.total_items, last_page: res.meta.last_page },
                page: 1,
                intentKey: key,
              },
            ])
          }
          return
        }

        if (!trimmed) {
          setChat((prev) => [
            ...prev,
            { sender: "bot", text: strings.noMatch },
          ])
          return
        }

        setUrlParams(null, trimmed)
        const key = `search:${trimmed}`
        const res = await fetchSounds(key, 1, false, trimmed)
        if (!res.fromCache && res.data.length > 0) {
          cache.set(key, { sounds: res.data, meta: res.meta, page: 1 })
        }
        if (!res.data || res.data.length === 0) {
          setChat((prev) => [
            ...prev,
            { sender: "bot", text: strings.noMatch },
          ])
        } else {
          setChat((prev) => [
            ...prev,
            {
              sender: "bot",
              text: strings.hereAreSearch.replace("{query}", trimmed),
              sounds: res.data,
              meta: { total_items: res.meta.total_items, last_page: res.meta.last_page },
              page: 1,
              intentKey: key,
            },
          ])
        }
      } catch {
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: strings.errorMessage },
        ])
      } finally {
        setLoading(false)
      }
    },
    [
      loading,
      findBestCategory,
      setUrlParams,
      fetchSounds,
      strings.noMatch,
      strings.noSoundsInCategory,
      strings.errorMessage,
    ]
  )

  const pageWrap =
    "min-h-screen bg-gradient-to-br from-amber-50/80 via-pink-50/80 to-violet-50/80 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30"
  const kidsCard =
    "rounded-3xl shadow-lg border border-pink-200/60 dark:border-pink-800/40 bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-900/90 dark:to-pink-950/30"
  const gradientBtn =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"

  return (
    <main className={`${pageWrap} flex flex-col py-6 sm:py-8`}>
      <section
        className="w-full py-6 sm:py-8 bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-yellow-950/50"
        suppressHydrationWarning
      >
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-pink-500 dark:text-pink-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {strings.heroTitle}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {strings.heroDescription}
          </p>
        </div>
      </section>

      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col flex-1">
        <div
          className={`${kidsCard} flex flex-col min-h-[420px] overflow-hidden border border-pink-200/60 dark:border-pink-800/40`}
        >
          <div className="px-4 py-3 border-b border-pink-200/60 dark:border-pink-800/40 bg-white/50 dark:bg-gray-900/50">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {strings.quickQuestionsLabel}
            </p>
            <div
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
              style={{ scrollbarWidth: "thin" }}
            >
              {quickReplies.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap flex-shrink-0 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  onClick={() =>
                    handleUserQuestion(
                      `I want to play ${q.name} sound buttons`,
                      "sound-buttons",
                      q.path
                    )
                  }
                  disabled={loading}
                >
                  {q.name}
                </Button>
              ))}
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-[200px]"
            style={{ scrollbarWidth: "thin" }}
          >
            {chat.length === 0 && !loading && (
              <div className="text-center text-muted-foreground mt-8">
                <p className="text-lg font-medium mb-2">{strings.welcomeTitle}</p>
                <p className="text-sm">{strings.welcomeSubtitle}</p>
                <p className="text-xs mt-2">{strings.tryCategoryBelow}</p>
              </div>
            )}
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 animate-in fade-in duration-300`}
              >
                {msg.sender === "bot" && (
                  <div className="shrink-0">
                    <Bot className="w-7 h-7 text-pink-500 dark:text-pink-400" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[90%] shadow ${
                    msg.sender === "user"
                      ? "bg-pink-100/80 dark:bg-pink-900/30 text-right"
                      : "bg-white/80 dark:bg-gray-800/80 border border-pink-100 dark:border-pink-900/50"
                  }`}
                >
                  <div className="whitespace-pre-line text-sm font-medium">
                    {msg.text}
                  </div>
                  {msg.sounds != null && msg.sounds.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2 text-pink-600 dark:text-pink-400 text-sm">
                        {strings.soundButtonsLabel}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                        {msg.sounds.map((sound, index) => (
                          <div key={sound.id} className="flex justify-center">
                            <SoundButton
                              sound={sound}
                              isAboveTheFold={index < 8}
                              isMobileDevice={false}
                              customSize={SOUND_BUTTON_SIZE}
                            />
                          </div>
                        ))}
                      </div>
                      {msg.meta && msg.page != null && msg.page < msg.meta.last_page && (
                        <div className="flex flex-col items-center mt-3 gap-1">
                          <Button
                            size="sm"
                            className={gradientBtn}
                            onClick={() => handleLoadMoreSounds(i)}
                            disabled={msg.loadingMore}
                          >
                            {msg.loadingMore ? strings.thinking : strings.showMore}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            {strings.showingXOfY
                              .replace("{shown}", String(msg.sounds.length))
                              .replace("{total}", String(msg.meta.total_items))}
                          </p>
                        </div>
                      )}
                      {msg.meta && msg.page != null && msg.page >= (msg.meta.last_page ?? 1) && msg.meta.total_items > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {strings.showingXOfY
                            .replace("{shown}", String(msg.sounds.length))
                            .replace("{total}", String(msg.meta.total_items))}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="shrink-0">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <Bot className="w-5 h-5 animate-spin text-pink-500" />
                  <span className="text-sm">{strings.thinking}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-2">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-pink-100/50 dark:bg-pink-900/20 animate-pulse border border-pink-200/50 dark:border-pink-800/30"
                      style={{ width: SOUND_BUTTON_SIZE, height: SOUND_BUTTON_SIZE }}
                    />
                  ))}
                </div>
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            className="flex gap-2 sm:gap-3 px-4 py-4 border-t border-pink-200/60 dark:border-pink-800/40 bg-white/60 dark:bg-gray-900/60"
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim() && !loading) {
                handleUserQuestion(input.trim())
              }
            }}
          >
            <input
              className="flex-1 rounded-xl border border-pink-200 dark:border-pink-800 bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
              placeholder={strings.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
              aria-label={strings.inputPlaceholder}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className={`${gradientBtn} px-5`}
            >
              {loading ? strings.sending : strings.ask}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
