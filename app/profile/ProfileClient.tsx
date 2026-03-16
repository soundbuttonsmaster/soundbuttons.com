"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogIn, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/layout/page-hero"

export default function ProfileClient() {
  const router = useRouter()
  const { user, token, isReady, setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    apiClient.getProfile(token).then((res) => {
      setLoading(false)
      if (res.success && res.user) {
        setUser(res.user)
        setEmail(res.user.email)
        setFullName(res.user.full_name ?? "")
      }
    })
  }, [isReady, token, setUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setMessage(null)
    const res = await apiClient.updateProfile(token, { email: email.trim(), full_name: fullName.trim() || undefined })
    setSaving(false)
    if (res.success && res.user) {
      setUser(res.user)
      setMessage({ type: "success", text: "Profile updated successfully." })
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update profile." })
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!token) {
    return (
      <>
        <PageHero title="My Profile" description="Sign in to manage your account." />
        <div className="py-12 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to view your profile</h2>
              <Button asChild className="w-full h-11">
                <Link href="/login?redirect=/profile">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                <Link href="/register" className="text-primary hover:underline">Register</Link> if you don&apos;t have an account.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero title="My Profile" description="Manage your account settings." />
      <div className="py-8 bg-background">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
            {user && (
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.username}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                  Full name (optional)
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </div>
              {message && (
                <p className={message.type === "success" ? "text-sm text-green-600 dark:text-green-400" : "text-sm text-destructive"}>
                  {message.text}
                </p>
              )}
              <Button type="submit" className="w-full h-11" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>

            <div className="pt-4 border-t border-border space-y-2">
              <Link href="/favorites" className="block text-sm text-primary hover:underline">
                My Favorites
              </Link>
              <Link href="/my-soundboard" className="block text-sm text-primary hover:underline">
                My Soundboard
              </Link>
              <Link href="/upload-sound" className="block text-sm text-primary hover:underline">
                Upload Sound
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
