import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/constants/site"
import PageHero from "@/components/layout/page-hero"
import { Rss } from "lucide-react"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "RSS Feeds - Subscribe to Sound Buttons Updates | SoundButtons.com" },
  description:
    "Subscribe to SoundButtons.com RSS feeds for new sound buttons, trending sounds, and site updates.",
  publisher: "SoundButtons.com",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/rss-feeds` },
  openGraph: {
    type: "website",
    title: "RSS Feeds - Subscribe to Sound Buttons Updates | SoundButtons.com",
    description:
      "Subscribe to SoundButtons.com RSS feeds for new sound buttons, trending sounds, and site updates.",
    url: `${BASE}/rss-feeds`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/rss-feeds/opengraph-image`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "RSS Feeds - Subscribe to Sound Buttons Updates | SoundButtons.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "RSS Feeds | SoundButtons.com",
    description:
      "Subscribe to SoundButtons.com RSS feeds for new sound buttons, trending sounds, and site updates.",
    images: [
      { url: `${BASE}/rss-feeds/opengraph-image`, alt: "RSS Feeds | SoundButtons.com", width: 1200, height: 630 },
    ],
  },
}

const RSS_FEEDS = [
  { name: "New sounds", description: "Latest sound buttons added to the site.", path: "/api/rss/new-sounds", url: `${BASE}/api/rss/new-sounds` },
]

export default function RssFeedsPage() {
  return (
    <>
      <PageHero
        title="RSS Feeds"
        description="Subscribe to our feeds for new sound buttons and updates."
      />
      <div className="py-8 bg-background">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <p className="text-muted-foreground text-sm">
              Add these feeds to your RSS reader to get notified when new sounds are added.
            </p>
            <ul className="space-y-4">
              {RSS_FEEDS.map((feed) => (
                <li
                  key={feed.path}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <Rss className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{feed.name}</p>
                      <p className="text-sm text-muted-foreground">{feed.description}</p>
                    </div>
                  </div>
                  <a
                    href={feed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all shrink-0"
                  >
                    {feed.url}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              <Link href="/sitemap" className="text-primary hover:underline">View sitemap</Link>
              {" · "}
              <Link href="/new" className="text-primary hover:underline">New sounds</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
