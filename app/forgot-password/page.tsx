"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { apiClient } from "@/lib/api/client"

const pageWrap = "bg-slate-50 dark:bg-slate-950 py-4 sm:py-6"
const cardClass = "rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm"
const primaryBtn =
  "inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors disabled:opacity-60"
const inputClass =
  "w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await apiClient.requestPasswordReset(email)
    setLoading(false)
    if (res.success) {
      setSent(true)
    } else {
      setError(res.message || "Failed to send reset email")
    }
  }

  return (
    <div className={pageWrap}>
      <div className="w-full max-w-md mx-auto px-4">
        <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ll send you a link to reset your password.
            </p>
          </div>

          {!sent ? (
            <>
              <p className="text-muted-foreground text-sm text-center">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="Enter your email address"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    We&apos;ll send password reset instructions to this email
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button type="submit" className={primaryBtn} disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Check Your Email</h2>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve sent password reset instructions to <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try again with a different email.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setSent(false); setError(null) }}
                  className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background font-medium text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Try Different Email
                </button>
                <Link href="/login" className="block">
                  <button type="button" className={primaryBtn}>
                    Back to Login
                  </button>
                </Link>
              </div>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-slate-900 dark:text-slate-100 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Having trouble? <Link href="/contact-us" className="text-slate-600 dark:text-slate-400 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
