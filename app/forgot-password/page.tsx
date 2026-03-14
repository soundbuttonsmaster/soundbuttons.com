"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants/site"

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
    <div className="flex flex-col items-center justify-center py-12 bg-background min-h-[60vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {!sent ? (
            <>
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email address and we&apos;ll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email address"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    We&apos;ll send password reset instructions to this email
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-medium"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve sent password reset instructions to <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try again with a different email.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => { setSent(false); setError(null) }}
                >
                  Try Different Email
                </Button>
                <Link href="/login" className="block">
                  <Button className="w-full h-11">Back to Login</Button>
                </Link>
              </div>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Having trouble? <Link href="/contact-us" className="text-primary hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
