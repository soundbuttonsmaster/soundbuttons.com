"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { MessageSquareText, LogIn, CheckCircle, AlertCircle, Volume2, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import type { ProcessedSound } from "@/lib/api/client"
import PageHero from "@/components/layout/page-hero"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"
import { getTopLevelCategories } from "@/lib/constants/categories"

export default function TextToSoundClient() {
  const { token, isReady } = useAuth()
  const [text, setText] = useState("")
  const [soundName, setSoundName] = useState("")
  const [categoryId, setCategoryId] = useState<number>(13)
  const [voiceIndex, setVoiceIndex] = useState(0)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const categories = getTopLevelCategories()

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices()
      if (v.length > 0) setVoices(v)
    }
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl)
    }
  }, [previewBlobUrl])

  const handlePreview = useCallback(async () => {
    const t = text.trim()
    if (!t) {
      setResult("error")
      setMessage("Please enter some text.")
      return
    }

    setLoading(true)
    setResult(null)
    setMessage("")

    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl)
      setPreviewBlobUrl(null)
    }
    setPreviewBlob(null)

    try {
      const utterance = new SpeechSynthesisUtterance(t)
      const v = speechSynthesis.getVoices()
      if (v[voiceIndex]) utterance.voice = v[voiceIndex]
      utterance.rate = 1
      utterance.pitch = 1

      const blob = await recordTTSWithCapture(utterance)
      if (blob) {
        setPreviewBlob(blob)
        setPreviewBlobUrl(URL.createObjectURL(blob))
        setMessage("")
      } else {
        speechSynthesis.speak(utterance)
        setMessage("Preview playing. To enable upload, click Preview again and allow screen/tab capture when prompted.")
      }
    } catch {
      const utterance = new SpeechSynthesisUtterance(t)
      const v = speechSynthesis.getVoices()
      if (v[voiceIndex]) utterance.voice = v[voiceIndex]
      speechSynthesis.speak(utterance)
      setMessage("Preview playing. To upload, click Preview again and allow tab capture when prompted.")
    }
    setLoading(false)
  }, [text, voiceIndex, previewBlobUrl])

  const recordTTSWithCapture = (utterance: SpeechSynthesisUtterance): Promise<Blob | null> => {
    return new Promise(async (resolve) => {
      try {
        const getDisplayMedia =
          (navigator.mediaDevices as MediaDevices & { getDisplayMedia?: (opt: MediaStreamConstraints) => Promise<MediaStream> }).getDisplayMedia
        if (!getDisplayMedia) {
          resolve(null)
          return
        }
        const stream = await getDisplayMedia({ video: true, audio: true })
        const audioTrack = stream.getAudioTracks()[0]
        if (!audioTrack) {
          stream.getTracks().forEach((t) => t.stop())
          resolve(null)
          return
        }

        setRecording(true)
        const audioStream = new MediaStream([audioTrack])
        const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
        const recorder = new MediaRecorder(audioStream, { mimeType })
        chunksRef.current = []
        recorder.ondataavailable = (e) => {
          if (e.data.size) chunksRef.current.push(e.data)
        }
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop())
          const blob = new Blob(chunksRef.current, { type: mimeType })
          resolve(blob)
          setRecording(false)
        }
        recorder.start()
        mediaRecorderRef.current = recorder

        utterance.onend = () => {
          setTimeout(() => recorder.stop(), 400)
        }
        speechSynthesis.speak(utterance)
      } catch {
        resolve(null)
        setRecording(false)
      }
    })
  }

  const handleUpload = async () => {
    if (!token) return
    if (!previewBlob) {
      setResult("error")
      setMessage("Please generate a preview first by clicking Preview Sound, then allow tab capture when prompted.")
      return
    }

    const name = soundName.trim() || text.trim().slice(0, 50) || "Text to Sound"
    setLoading(true)
    setResult(null)
    setMessage("")

    const formData = new FormData()
    formData.append("file", previewBlob, "text-to-sound.webm")
    formData.append("name", name)
    if (categoryId) formData.append("category_id", String(categoryId))

    const res = await apiClient.uploadSound(token, formData)
    setLoading(false)

    if (res.success) {
      setResult("success")
      setMessage("Sound uploaded successfully! It will be reviewed before being published.")
      setText("")
      setSoundName("")
      setPreviewBlob(null)
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl)
        setPreviewBlobUrl(null)
      }
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
          title="Text to Sound Button"
          description="Convert text to speech and create a custom sound button. Sign in to get started."
        />
        <div className="py-12 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquareText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to create</h2>
              <p className="text-muted-foreground text-sm">
                Sign in to create custom sound buttons from text. Your sound will be reviewed by our
                team before being published.
              </p>
              <Link
                href="/login?redirect=/text-to-sound"
                className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              <p className="text-sm text-muted-foreground">
                <Link href="/register" className="text-primary underline">Register</Link> to get started.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Explore our{" "}
                <Link href="/trends" className="text-primary underline">trending sounds</Link> and{" "}
                <Link href="/create-sound" className="text-primary underline">create sound</Link> from recording.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const previewSound: ProcessedSound | null = previewBlobUrl
    ? {
        id: -1,
        name: soundName.trim() || text.trim().slice(0, 50) || "Preview",
        sound_file: previewBlobUrl,
        views: 0,
        likes_count: 0,
        favorites_count: 0,
      }
    : null

  return (
    <>
      <PageHero
        title="Text to Sound Button"
        description="Convert text to speech and create a custom sound button. Type your text, customize the voice, and generate a sound button!"
      />
      <div className="py-8 bg-background">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handlePreview()
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-foreground mb-1">
                  Text <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Type the text you want to convert to speech..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label htmlFor="soundName" className="block text-sm font-medium text-foreground mb-1">
                  Sound Name
                </label>
                <input
                  id="soundName"
                  type="text"
                  value={soundName}
                  onChange={(e) => setSoundName(e.target.value)}
                  placeholder={text.trim().slice(0, 50) || "My sound"}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="voice" className="block text-sm font-medium text-foreground mb-1">
                  Voice
                </label>
                <select
                  id="voice"
                  value={voiceIndex}
                  onChange={(e) => setVoiceIndex(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {voices.length === 0 ? (
                    <option value={0}>Loading voices...</option>
                  ) : (
                    voices.map((v, i) => (
                      <option key={i} value={i}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {message && !result && (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
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

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || recording || !text.trim()}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  {recording ? "Recording..." : loading ? "Generating..." : "Preview Sound"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleUpload}
                  disabled={loading || !previewBlob}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Sound
                </Button>
              </div>
            </form>

            {previewSound && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>
                <div className="flex justify-center">
                  <SoundButton
                    sound={previewSound}
                    hideActions
                    hideLabel
                    detailPath="/text-to-sound"
                  />
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Your sound will be reviewed by our team before being published on the site.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/create-sound" className="text-primary underline">Create sound</Link> from recording ·{" "}
              <Link href="/trends" className="text-primary underline">Trending sounds</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
