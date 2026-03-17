"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Upload, LogIn, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/page-hero"

const ACCEPT_AUDIO = "audio/*,.mp3,.wav,.ogg,.m4a,.webm"

export default function UploadSoundClient() {
  const { token, isReady } = useAuth()
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (!file) {
      setResult("error")
      setMessage("Please select an audio file.")
      return
    }
    setLoading(true)
    setResult(null)
    setMessage("")
    const formData = new FormData()
    formData.append("file", file)
    if (name.trim()) formData.append("name", name.trim())
    const res = await apiClient.uploadSound(token, formData)
    setLoading(false)
    if (res.success) {
      setResult("success")
      setMessage("Sound uploaded successfully!")
      setFile(null)
      setName("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setResult("error")
      setMessage(res.message || "Upload failed.")
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!token) {
    return (
      <>
        <PageHero
          title="Upload Sound"
          description="Sign in to upload your own sound buttons to the community."
        />
        <div className="py-12 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to upload</h2>
              <p className="text-muted-foreground text-sm">
                Create an account or sign in to share your sound buttons with the community.
              </p>
              <Link
                href="/login?redirect=/upload-sound"
                className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              <p className="text-sm text-muted-foreground">
                <Link href="/register" className="text-primary hover:underline">Register</Link> to get started.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero
        title="Upload Sound"
        description="Share your sound buttons with the community. Upload audio files to add to the soundboard."
      />
      <div className="py-8 bg-background">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Sound name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="My sound"
                />
              </div>
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
                  Audio file <span className="text-destructive">*</span>
                </label>
                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_AUDIO}
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:font-medium"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  MP3, WAV, OGG, M4A, or WebM. Max size may apply.
                </p>
              </div>

              {result === "success" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {message}
                </div>
              )}
              {result === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Uploading..." : "Upload sound"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/my-soundboard" className="text-primary hover:underline">View my soundboard</Link>
              {" · "}
              <Link href="/create-sound" className="text-primary hover:underline">Create sound</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
