"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import KidsCardSound from "@/components/kids/KidsCardSound"
import SoundList from "@/components/home/SoundList"
import { kidsSoundboardApi } from "@/lib/api/kids-soundboard"
import type { KidsSoundboard, KidsSoundboardCategory } from "@/lib/api/kids-soundboard"

const categoryIcons = ["🎵", "🎧", "🎬", "🎤", "📻", "🎮", "📺", "🔊", "💿", "📢", "⚡", "❤️", "⭐"]

const CATEGORY_GRADIENTS = [
  "from-pink-400 to-purple-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-blue-400 to-cyan-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-blue-500",
  "from-pink-400 to-red-500",
  "from-yellow-400 to-green-500",
  "from-purple-400 to-indigo-500",
  "from-red-400 to-pink-500",
  "from-green-400 to-emerald-500",
  "from-blue-400 to-purple-500",
  "from-orange-400 to-yellow-500",
]

interface KidsSoundboardClientProps {
  initialCategories: KidsSoundboardCategory[]
  initialSounds: KidsSoundboard[]
  initialHasNext: boolean
  initialTotalCount: number
  isMobileDevice: boolean
}

export default function KidsSoundboardClient({
  initialCategories,
  initialSounds,
  initialHasNext,
  initialTotalCount,
  isMobileDevice,
}: KidsSoundboardClientProps) {
  const [sounds, setSounds] = useState<KidsSoundboard[]>(initialSounds)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [hasMore, setHasMore] = useState(initialHasNext)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [showRainEffect, setShowRainEffect] = useState(false)
  const [rainImage, setRainImage] = useState("")

  const handleCategorySelect = useCallback(async (categoryId: number) => {
    setSelectedCategory(categoryId)
    setLoading(true)
    setCurrentPage(1)
    try {
      const result = await kidsSoundboardApi.getByCategory(categoryId, 1, isMobileDevice ? 18 : 36)
      setSounds(result?.data ?? [])
      setTotalCount(result?.count ?? 0)
      setHasMore(!!result?.next)
    } catch {
      setSounds([])
      setTotalCount(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [isMobileDevice])

  const handleShowAll = useCallback(() => {
    setSelectedCategory(null)
    setSounds(initialSounds)
    setTotalCount(initialTotalCount)
    setHasMore(initialHasNext)
    setCurrentPage(1)
  }, [initialSounds, initialTotalCount, initialHasNext])

  const loadMore = useCallback(async (): Promise<boolean> => {
    if (loading || !hasMore) return false
    setLoading(true)
    try {
      if (selectedCategory) {
        const nextPage = currentPage + 1
        const result = await kidsSoundboardApi.getByCategory(
          selectedCategory,
          nextPage,
          isMobileDevice ? 20 : 20
        )
        const newData = result?.data ?? []
        setSounds((prev) => [...prev, ...newData])
        setCurrentPage(nextPage)
        const more = !!result?.next
        setHasMore(more)
        return more
      }
      const nextPage = currentPage + 1
      const result = await kidsSoundboardApi.getPaginated(
        nextPage,
        isMobileDevice ? 20 : 36
      )
      const newData = result?.data ?? []
      setSounds((prev) => [...prev, ...newData])
      setCurrentPage(nextPage)
      const more = !!result?.next
      setHasMore(more)
      return more
    } catch {
      setHasMore(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, selectedCategory, currentPage, isMobileDevice])

  const nextCategories = () => {
    const perView = isMobileDevice ? 4 : 8
    const maxIndex = Math.max(0, initialCategories.length - perView)
    setCurrentCategoryIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevCategories = () => {
    setCurrentCategoryIndex((prev) => Math.max(prev - 1, 0))
  }

  const perView = isMobileDevice ? 4 : 8
  const visibleCategories = initialCategories.slice(
    currentCategoryIndex,
    currentCategoryIndex + perView
  )

  const handleRainEffect = (imageUrl: string) => {
    setRainImage(imageUrl)
    setShowRainEffect(true)
    setTimeout(() => setShowRainEffect(false), 8000)
  }

  const selectedCatName =
    selectedCategory != null
      ? initialCategories.find((c) => c.id === selectedCategory)?.categoryName ?? "Selected"
      : null
  const listTitle = selectedCatName
    ? `${selectedCatName} Sounds (${totalCount})`
    : "New Kids Sounds"

  const dottedStyle: React.CSSProperties = {
    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
    backgroundSize: "20px 20px",
    opacity: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-950 dark:via-purple-950 dark:to-blue-900 relative">
      <div style={dottedStyle} aria-hidden="true" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-foreground">
          Kids Soundboard{" "}
          <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-pink-600 text-white rounded inline-block">
            KIDS
          </span>
        </h1>
        <p className="text-lg text-center mb-8 text-muted-foreground">
          Welcome to our kid-friendly collection of sound buttons! Perfect for children&apos;s
          activities, educational games, and family fun. All sounds are designed to be safe,
          educational, and entertaining for kids of all ages.
        </p>

        <section className="w-full max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground">🎨 Sound Categories</h2>
          <div className="relative">
            {initialCategories.length > 4 && (
              <>
                <button
                  type="button"
                  onClick={prevCategories}
                  disabled={currentCategoryIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous categories"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={nextCategories}
                  disabled={
                    currentCategoryIndex >=
                    Math.max(0, initialCategories.length - (isMobileDevice ? 4 : 8))
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Next categories"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <div
              className={`grid gap-3 px-8 ${
                initialCategories.length <= 4
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
              }`}
            >
              <button
                type="button"
                onClick={handleShowAll}
                className={`overflow-hidden rounded-xl shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  selectedCategory === null ? "ring-2 ring-pink-500" : ""
                }`}
              >
                <div className="h-32 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl">🌟</span>
                </div>
                <div className="p-2 bg-card text-center">
                  <span className="text-sm font-semibold">Show All</span>
                </div>
              </button>
              {visibleCategories.map((cat) => {
                const grad = CATEGORY_GRADIENTS[cat.id % CATEGORY_GRADIENTS.length]
                const icon = categoryIcons[cat.id % categoryIcons.length]
                const imgUrl = kidsSoundboardApi.getCategoryImageUrl(cat)
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`overflow-hidden rounded-xl shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isSelected ? "ring-2 ring-pink-500" : ""
                    }`}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={cat.categoryName}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div
                        className={`h-32 bg-gradient-to-r ${grad} flex items-center justify-center`}
                      >
                        <span className="text-3xl">{icon}</span>
                      </div>
                    )}
                    <div className="p-2 bg-card text-center">
                      <span className="text-sm font-semibold">{cat.categoryName}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            {initialCategories.length > 4 && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                {currentCategoryIndex + 1}-
                {Math.min(currentCategoryIndex + perView, initialCategories.length)} of{" "}
                {initialCategories.length} categories
              </p>
            )}
          </div>

          <section>
            {loading && sounds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Loading sounds...</h3>
              </div>
            ) : sounds.length > 0 ? (
              <SoundList
                title={listTitle}
                sounds={sounds}
                initialCount={isMobileDevice ? 18 : 36}
                loadMoreCount={isMobileDevice ? 9 : 18}
                onLoadMore={loadMore}
                hasMoreSounds={hasMore}
                maxLines={100}
                useCardView
                customCardComponent={KidsCardSound}
                onRainEffect={handleRainEffect}
                showLoadMore={hasMore && !!selectedCategory}
                showRedirectButton={false}
                showLoadingIndicator={loading}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {selectedCategory ? "No sounds found in this category" : "No sounds found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory
                    ? "Try selecting a different category or Show All."
                    : "Check back later for more sounds!"}
                </p>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={handleShowAll}
                    className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Show All Sounds
                  </button>
                )}
              </div>
            )}
          </section>
        </section>

        <section className="mt-12 py-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">
            Questions that are often asked (FAQ)
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the Kids Soundboard?",
                a: "Kids Soundboard is a set of fun, safe, and educational sound effects made just for kids. All of the sounds are carefully chosen to be safe for kids of all ages and great for family activities.",
              },
              {
                q: "Are these buttons that make noise safe for kids?",
                a: "Yes! We carefully chose all the sounds on our Kids Soundboard to be safe for kids, educational, and good for people of all ages. We make sure that all of our content is safe and good for families.",
              },
              {
                q: "How can parents let their kids use these sound buttons?",
                a: "Parents can use these sound buttons to teach kids about animal sounds, musical instruments, make up fun games, or make stories and lessons more exciting.",
              },
              {
                q: "What kinds of sounds can kids hear?",
                a: "Our Kids Soundboard has animal sounds, musical instruments, sounds that teach, sounds that make games more fun, and other sounds that are safe for kids to listen to and learn from.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="p-4 bg-card rounded-lg shadow group border border-border"
              >
                <summary className="font-semibold cursor-pointer group-open:text-pink-600">
                  {faq.q}
                </summary>
                <p className="mt-2 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-muted-foreground">
          Explore{" "}
          <Link href="/sound-buttons-unblocked-for-school" className="text-primary underline">
            Sound Buttons for School
          </Link>{" "}
          and{" "}
          <Link href="/trends" className="text-primary underline">
            trending sounds
          </Link>
          .
        </p>
      </main>

      {showRainEffect && rainImage && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-rain-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-100px",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            >
              <img
                src={rainImage}
                alt=""
                className="w-12 h-12 opacity-70"
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              />
            </div>
          ))}
          <style jsx>{`
            @keyframes rain-fall {
              0% {
                transform: translateY(-100px);
                opacity: 0;
              }
              10% {
                opacity: 0.7;
              }
              90% {
                opacity: 0.7;
              }
              100% {
                transform: translateY(calc(100vh + 100px));
                opacity: 0;
              }
            }
            .animate-rain-fall {
              animation: rain-fall linear infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
