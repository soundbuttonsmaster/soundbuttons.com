"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"

const pageWrap = "bg-slate-50 dark:bg-slate-950 py-4 sm:py-6"
const cardClass = "rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm"
const primaryBtn =
  "inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors disabled:opacity-60"
const inputClass =
  "w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (tokenResponse: { access_token: string }) => void
          }) => { requestAccessToken: () => void }
        }
      }
    }
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string
          scope: string
          redirectURI: string
          usePopup: boolean
          callback?: (res: { authorization: { id_token: string; user?: { name?: { firstName?: string; lastName?: string }; email?: string } } }) => void
        }) => void
        signIn: () => void
      }
    }
  }
}

function getDiscordAuthUrl(): string {
  if (typeof window === "undefined") return ""
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  if (!clientId) return ""
  const redirectUri = `${window.location.origin}/api/auth/discord/callback`
  const scope = "identify email"
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
}

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<"google" | "discord" | "apple" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const googleInited = useRef(false)

  const redirectTo = searchParams.get("redirect") ?? "/"

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : ""
    if (!hash) return
    const params = new URLSearchParams(hash)
    const token = params.get("token")
    const userB64 = params.get("user")
    if (token && userB64) {
      try {
        const userJson = atob(decodeURIComponent(userB64))
        const user = JSON.parse(userJson) as { id: number; username: string; email: string }
        login(token, { ...user, full_name: undefined })
        window.history.replaceState(null, "", window.location.pathname + window.location.search)
        router.push(redirectTo)
      } catch {
        setError("Invalid sign-in data. Please try again.")
      }
    }
  }, [login, redirectTo, router])

  useEffect(() => {
    const err = searchParams.get("error")
    if (err === "discord_denied") setError("Discord sign-in was cancelled.")
    else if (err === "discord_no_code" || err === "discord_exchange" || err === "discord_backend" || err === "discord_failed") setError("Discord sign-in failed. Please try again.")
    else if (err === "discord_config") setError("Discord sign-in is not configured.")
  }, [searchParams])

  useEffect(() => {
    const gid = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!gid || googleInited.current) return
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      googleInited.current = true
      return
    }
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.onload = () => { googleInited.current = true }
    document.head.appendChild(script)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await apiClient.login(username.trim(), password)
    setLoading(false)
    if (res.success) {
      login(res.token, res.user)
      router.push(redirectTo)
    } else {
      setError(res.message || "Login failed")
    }
  }

  const handleGoogleClick = () => {
    const gid = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!gid || !window.google?.accounts?.oauth2) {
      setError("Google sign-in is not available.")
      return
    }
    setOauthLoading("google")
    setError(null)
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: gid,
      scope: "openid email profile",
      callback: async (tokenResponse) => {
        const res = await apiClient.loginWithGoogle(tokenResponse.access_token)
        setOauthLoading(null)
        if (res.success) {
          login(res.token, res.user)
          router.push(redirectTo)
        } else {
          setError(res.message || "Google sign-in failed")
        }
      },
    })
    tokenClient.requestAccessToken()
  }

  const handleAppleClick = () => {
    const appleId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || process.env.NEXT_PUBLIC_APPLE_SERVICE_ID
    if (!appleId || !window.AppleID?.auth) {
      setError("Apple sign-in is not available.")
      return
    }
    setOauthLoading("apple")
    setError(null)
    window.AppleID.auth.signIn()
  }

  const discordUrl = getDiscordAuthUrl()

  return (
    <div className={pageWrap}>
      <div className="w-full max-w-md mx-auto px-4">
        <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to save favorites and access your soundboard.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {oauthLoading === "google" ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            {discordUrl ? (
              <a
                href={discordUrl}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-lg font-medium text-white bg-[#5865F2] hover:bg-[#4752c4] transition-colors"
                onClick={() => setOauthLoading("discord")}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C2.451 6.58 2.05 8.862 2.052 11.157c0 .008.003.016.004.024a.076.076 0 0 0 .032.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.076.076 0 0 0 .032-.054c.002-.008.004-.016.004-.024 0-2.303-.398-4.587-1.594-6.76a.07.07 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                Sign in with Discord
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleAppleClick}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-lg font-medium text-white bg-black hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-100 transition-colors border border-slate-800 dark:border-slate-200 disabled:opacity-60"
            >
              {oauthLoading === "apple" ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Sign in with Apple
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="Username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button type="submit" className={primaryBtn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="space-y-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline"
            >
              Forgot password?
            </Link>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-slate-900 dark:text-slate-100 font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-foreground text-sm"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>

      <AppleScriptAndInit onSuccess={(payload) => {
        setOauthLoading(null)
        apiClient.loginWithApple(payload).then((res) => {
          if (res.success) {
            login(res.token, res.user)
            router.push(redirectTo)
          } else {
            setError(res.message || "Apple sign-in failed")
          }
        })
      }} />
    </div>
  )
}

function AppleScriptAndInit({
  onSuccess,
}: {
  onSuccess: (payload: { id_token: string; user?: { name?: { firstName?: string; lastName?: string }; email?: string } }) => void
}) {
  const inited = useRef(false)
  useEffect(() => {
    const appleId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || process.env.NEXT_PUBLIC_APPLE_SERVICE_ID
    if (!appleId || inited.current) return
    if (document.querySelector('script[src*="appleid.auth"]')) {
      inited.current = true
      if (window.AppleID?.auth) {
        window.AppleID.auth.init({
          clientId: appleId,
          scope: "name email",
          redirectURI: typeof window !== "undefined" ? `${window.location.origin}/login` : "",
          usePopup: true,
          callback: (res) => {
            const auth = res?.authorization
            if (auth?.id_token) onSuccess({ id_token: auth.id_token, user: auth.user as undefined })
          },
        })
      }
      return
    }
    const script = document.createElement("script")
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    script.async = true
    script.onload = () => {
      if (window.AppleID?.auth && appleId) {
        inited.current = true
        window.AppleID.auth.init({
          clientId: appleId,
          scope: "name email",
          redirectURI: typeof window !== "undefined" ? `${window.location.origin}/login` : "",
          usePopup: true,
          callback: (res) => {
            const auth = res?.authorization
            if (auth?.id_token) onSuccess({ id_token: auth.id_token, user: auth.user as undefined })
          },
        })
      }
    }
    document.head.appendChild(script)
  }, [onSuccess])
  return null
}
