"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MessageSquareText,
  LogIn,
  CheckCircle,
  AlertCircle,
  Loader2,
  Music,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import type { ProcessedSound } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"
import { getTopLevelCategories } from "@/lib/constants/categories"

const LANGUAGE_OPTIONS: { value: "" | string; label: string }[] = [
  { value: "", label: "Default (English)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ru", label: "Russian" },
  { value: "zh-cn", label: "Chinese (Simplified)" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
]

function TextToSoundKidsHero({ title, description }: { title: string; description: string }) {
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

export default function TextToSoundClient() {
  const { token, isReady } = useAuth()
  const [text, setText] = useState("")
  const [soundName, setSoundName] = useState("")
  const [categoryId, setCategoryId] = useState<number>(13)
  const [language, setLanguage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const [createdSound, setCreatedSound] = useState<ProcessedSound | null>(null)

  const categories = getTopLevelCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText || !token) return
    const name = soundName.trim() || trimmedText.slice(0, 50) || "Text to Sound"
    setLoading(true)
    setResult(null)
    setMessage("")
    setCreatedSound(null)
    const res = await apiClient.textToSpeechApihut(token, {
      text: trimmedText,
      soundName: name,
      category: categoryId,
      ...(language ? { language } : {}),
    })
    setLoading(false)
    if (res.success && res.sound) {
      setResult("success")
      setMessage("Your sound is live!")
      setCreatedSound(res.sound)
      setText("")
      setSoundName("")
    } else {
      setResult("error")
      setMessage(res.success ? "Something went wrong." : res.message)
    }
  }

  if (!isReady) {
    return (
      <div className={pageWrap}>
        <TextToSoundKidsHero title="Text to Sound" description="Create sound buttons from text." />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 flex flex-col items-center justify-center gap-4`}>
            <Loader2 className="h-10 w-10 animate-spin text-pink-500 dark:text-pink-400" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className={pageWrap}>
        <TextToSoundKidsHero
          title="Text to Sound"
          description="Sign in to create custom sound buttons from text."
        />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 space-y-6 text-center`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <MessageSquareText className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to create</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to create custom sound buttons from text. Your sound will be saved to your account.
            </p>
            <Link href="/login?redirect=/text-to-sound" className={`${gradientBtn} w-full`}>
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              <Link href="/register" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Register
              </Link>{" "}
              to get started.
            </p>
            <p className="text-xs text-muted-foreground pt-4 border-t border-border">
              <Link href="/create-sound" className="text-pink-600 dark:text-pink-400 hover:underline">
                Create sound
              </Link>{" "}
              from recording ·{" "}
              <Link href="/trends" className="text-pink-600 dark:text-pink-400 hover:underline">
                Trending sounds
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageWrap}>
      <TextToSoundKidsHero
        title="Text to Sound"
        description="Convert text to speech and create a sound button. Choose language, then generate and save."
      />
      <div className="w-full max-w-xl mx-auto px-4 mt-6 space-y-6">
        {result === "success" && createdSound && (
          <div
            className={`${kidsCard} p-8 text-center space-y-5`}
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <CheckCircle className="h-9 w-9 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{message}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You can listen now or see it in your profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={getSoundDetailPath(createdSound.name ?? "", createdSound.id)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow"
              >
                <Music className="h-4 w-4" />
                Listen to your sound
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium border-2 border-pink-300 dark:border-pink-600 text-foreground hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
              >
                View in my profile
              </Link>
            </div>
          </div>
        )}

        <div className={`${kidsCard} p-8 space-y-6`}>
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            {result === "success" ? "Create another sound" : "Text to sound"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="text" className="block text-sm font-medium text-foreground">
                Text <span className="text-destructive">*</span>
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                required
                placeholder="Type the text you want to convert to speech..."
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium text-foreground">
                Language <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value || "default"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="soundName" className="block text-sm font-medium text-foreground">
                Sound name <span className="text-destructive">*</span>
              </label>
              <input
                id="soundName"
                type="text"
                value={soundName}
                onChange={(e) => setSoundName(e.target.value)}
                placeholder={text.trim().slice(0, 50) || "My sound"}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {result === "error" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {message}
              </div>
            )}

            <button
              type="submit"
              className={`${gradientBtn} w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate & save"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-2 border-t border-border">
            <Link href="/create-sound" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Create sound
            </Link>
            {" · "}
            <Link href="/trends" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Trending sounds
            </Link>
            {" · "}
            <Link href="/profile" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              My profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
