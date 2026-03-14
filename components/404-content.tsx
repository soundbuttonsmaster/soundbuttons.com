import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/404-back-button"

export function NotFoundContent() {
  return (
    <div className="flex flex-col bg-background flex-1">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full mx-auto bg-card/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-border p-8 text-center">
          {/* 404 Animation */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold mb-2 text-primary animate-pulse">404</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>

          <h2 className="text-3xl font-bold mb-4 text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Oops! The sound button you&apos;re looking for seems to have gone silent.
            But don&apos;t worry - we have thousands of amazing sounds waiting for you!
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Link
              href="/trends"
              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium">Trending</div>
              <div className="text-xs text-muted-foreground">Hot sounds</div>
            </Link>
            <Link
              href="/new"
              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium">New Sounds</div>
              <div className="text-xs text-muted-foreground">Fresh content</div>
            </Link>
            <Link
              href="/categories"
              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium">Categories</div>
              <div className="text-xs text-muted-foreground">Browse by type</div>
            </Link>
            <Link
              href="/soundboard"
              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium">Soundboard</div>
              <div className="text-xs text-muted-foreground">Play & create</div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 px-6 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/trends">
              <Button variant="outline" className="flex items-center gap-2 px-6 w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Explore Sounds
              </Button>
            </Link>

            <BackButton />
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Can&apos;t find what you&apos;re looking for?</strong>
              <br />
              Try searching for sounds by category or browse our popular collections!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
