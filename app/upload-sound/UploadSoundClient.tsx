"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Upload, LogIn, CheckCircle, AlertCircle, Music, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"
import type { ProcessedSound } from "@/lib/api/client"

const ACCEPT_AUDIO = "audio/*,.mp3,.wav,.ogg,.m4a,.webm"

function UploadKidsHero({ title, description }: { title: string; description: string }) {
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

export default function UploadSoundClient() {
  const { token, isReady } = useAuth()
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const [uploadedSound, setUploadedSound] = useState<ProcessedSound | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiClient.getSoundCategories().then((list) => {
      setCategories(list)
      if (list.length > 0) setCategoryId((prev) => (prev === 0 ? list[0].id : prev))
      setCategoriesLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (!file) {
      setResult("error")
      setMessage("Please select an audio file.")
      return
    }
    if (!categoryId) {
      setResult("error")
      setMessage("Please select a category.")
      return
    }
    setLoading(true)
    setResult(null)
    setMessage("")
    setUploadedSound(null)
    const formData = new FormData()
    formData.append("soundFile", file)
    formData.append("soundName", (name.trim() || file.name.replace(/\.[^/.]+$/, "")) || "My sound")
    formData.append("category", String(categoryId))
    const res = await apiClient.uploadSound(token, formData)
    setLoading(false)
    if (res.success) {
      setResult("success")
      setMessage("Your sound is live!")
      setUploadedSound(res.sound ?? null)
      setFile(null)
      setName("")
      if (categories.length > 0) setCategoryId(categories[0].id)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setResult("error")
      setMessage(res.message || "Upload failed.")
      setUploadedSound(null)
    }
  }

  if (!isReady) {
    return (
      <div className={pageWrap}>
        <UploadKidsHero title="Upload Sound" description="Share your sounds with the community." />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 flex flex-col items-center justify-center gap-4`}>
            <div className="animate-pulse text-pink-500 dark:text-pink-400">Loading…</div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className={pageWrap}>
        <UploadKidsHero
          title="Upload Sound"
          description="Sign in to upload your own sound buttons to the community."
        />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 space-y-6 text-center`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to upload</h2>
            <p className="text-muted-foreground text-sm">
              Create an account or sign in to share your sound buttons.
            </p>
            <Link href="/login?redirect=/upload-sound" className={`${gradientBtn} w-full`}>
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
    <div className={pageWrap}>
      <UploadKidsHero
        title="Upload Sound"
        description="Share your sound buttons with the community. Upload audio to add to the soundboard."
      />
      <div className="w-full max-w-xl mx-auto px-4 mt-6 space-y-6">
        {result === "success" && (
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
                Your sound is on the site. You can listen now or see it in your profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {uploadedSound && (
                <Link
                  href={getSoundDetailPath(uploadedSound.name ?? "", uploadedSound.id)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow"
                >
                  <Music className="h-4 w-4" />
                  Listen to your sound
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </Link>
              )}
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
            {result === "success" ? "Upload another sound" : "Upload a sound"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Sound name <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50"
                placeholder="e.g. My cool sound"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                required
                value={categoryId || ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                disabled={categoriesLoading}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/50"
              >
                {categoriesLoading && <option value="">Loading categories…</option>}
                {!categoriesLoading && categories.length === 0 && <option value="">No categories</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium text-foreground">
                Audio file <span className="text-destructive">*</span>
              </label>
              <div className="relative rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-800/50 bg-pink-50/30 dark:bg-pink-950/20 p-6 text-center transition-colors focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-400/20">
                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_AUDIO}
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-pink-600 dark:text-pink-400">{file.name}</span>
                    <span className="text-muted-foreground ml-1">({(file.size / 1024).toFixed(1)} KB)</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click or drag to choose a file
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  MP3, WAV, OGG, M4A or WebM
                </p>
              </div>
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
              disabled={loading || categoriesLoading || !categoryId}
            >
              {loading ? "Uploading…" : "Upload sound"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-2 border-t border-border">
            <Link href="/my-soundboard" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              My soundboard
            </Link>
            {" · "}
            <Link href="/profile" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              My profile
            </Link>
            {" · "}
            <Link href="/create-sound" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Create sound
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
