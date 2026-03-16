"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LogIn, ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get("redirect") ?? "/"

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

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-background min-h-[60vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to save favorites and access your soundboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="block text-muted-foreground hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
