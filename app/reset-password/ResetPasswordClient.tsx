"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRound, ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get("token") ?? ""
  const [token, setToken] = useState(tokenFromUrl)
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
    setLoading(true)
    const res = await apiClient.confirmPasswordReset(t, password)
    setLoading(false)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.message || "Failed to reset password")
    }
  }

  if (success) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Password Updated</h1>
          <p className="text-muted-foreground text-sm">
            Your password has been reset. You can now sign in with your new password.
          </p>
        </div>
        <Link href="/login" className="block">
          <Button className="w-full h-11">Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
        <p className="text-muted-foreground text-sm">
          Enter the reset token from your email and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Request a new reset link
        </Link>
      </p>
    </div>
  )
}

export default function ResetPasswordClient() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-background min-h-[60vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <Suspense fallback={<div className="bg-card border border-border rounded-2xl p-8 animate-pulse h-64" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
