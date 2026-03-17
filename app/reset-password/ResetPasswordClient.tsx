"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { KeyRound, ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api/client"

const pageWrap = "bg-slate-50 dark:bg-slate-950 py-4 sm:py-6"
const cardClass = "rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm"
const primaryBtn =
  "inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors disabled:opacity-60"
const inputClass =
  "w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get("token") ?? ""
  const userIdFromUrl = searchParams.get("user_id") ?? ""
  const [token, setToken] = useState(tokenFromUrl)
  const [userId, setUserId] = useState(userIdFromUrl)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    const t = token.trim()
    if (!t) {
      setError("Reset token is missing. Use the link from your email.")
      return
    }
    const uid = userId.trim()
    const parsedUserId = uid ? parseInt(uid, 10) : NaN
    if (!uid || Number.isNaN(parsedUserId)) {
      setError("User ID is missing. Use the full link from your email.")
      return
    }
    setLoading(true)
    const res = await apiClient.confirmPasswordReset(parsedUserId, t, password, confirmPassword)
    setLoading(false)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.message || "Failed to reset password")
    }
  }

  if (success) {
    return (
      <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Password Updated</h1>
          <p className="text-muted-foreground text-sm">
            Your password has been reset. You can now sign in with your new password.
          </p>
        </div>
        <Link href="/login" className="block">
          <button type="button" className={primaryBtn}>Sign In</button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-foreground text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <KeyRound className="h-8 w-8 text-slate-600 dark:text-slate-400" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Set New Password</h1>
        <p className="text-muted-foreground text-sm">
          Use the link from your email to pre-fill User ID and token, or enter them manually. Then choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-foreground mb-1">
            User ID
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            inputMode="numeric"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={inputClass}
            placeholder="From your email link (e.g. 123)"
          />
        </div>
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-foreground mb-1">
            Reset Token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={inputClass}
            placeholder="Paste token from email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" className={primaryBtn} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/forgot-password" className="text-slate-900 dark:text-slate-100 font-medium hover:underline">
          Request a new reset link
        </Link>
      </p>
    </div>
  )
}

export default function ResetPasswordClient() {
  return (
    <div className={pageWrap}>
      <div className="w-full max-w-md mx-auto px-4">
        <Suspense fallback={<div className={`${cardClass} p-6 animate-pulse h-56`} />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
