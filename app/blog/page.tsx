import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import PageHero from "@/components/layout/page-hero"
import { FileText } from "lucide-react"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Blog | SoundButtons - Sound Effect Button Collection" },
  description:
    "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog. Discover tips, tutorials, and featured sound collections.",
  keywords: [
    "sound buttons blog",
    "sound effects articles",
    "meme sounds",
    "trending sound effects",
    "sound button tutorials",
    "sound collections",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    type: "website",
    url: `${BASE}/blog`,
    title: "Blog | SoundButtons - Sound Effect Button Collection",
    description:
      "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog. Discover tips, tutorials, and featured sound collections.",
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/images/rect.png`, width: 1200, height: 630, alt: "Blog | SoundButtons" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | SoundButtons - Sound Effect Button Collection",
    description:
      "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog.",
    images: [`${BASE}/images/rect.png`],
  },
}

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "SoundButtons Blog",
  description:
    "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog.",
  url: `${BASE}/blog`,
  publisher: { "@type": "Organization", name: "SoundButtons" },
}
const navSchema = SITE_NAV_LINKS.map((link) => ({
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: link.name,
  url: link.url,
}))

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {navSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <PageHero
        title="Blog"
        description="News, tips, and updates from SoundButtons.com."
      />
      <div className="py-8 bg-background">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Coming soon</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Blog posts and articles will appear here. Check back later or explore our soundboard in the meantime.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
