import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/constants/site"
import { CATEGORIES } from "@/lib/constants/categories"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import { ChevronRight } from "lucide-react"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Sitemap - SoundButtons.com",
  description:
    "Navigate SoundButtons.com through our sitemap. Find all our pages including sound categories, blog posts, and more.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/sitemap` },
  openGraph: {
    type: "website",
    title: "Sitemap - SoundButtons.com",
    description:
      "Navigate SoundButtons.com through our sitemap. Find all our pages including sound categories and more.",
    url: `${BASE}/sitemap`,
    siteName: "SoundButtons.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sitemap - SoundButtons.com",
    description:
      "Navigate SoundButtons.com through our sitemap. Find all our pages including sound categories and more.",
  },
}

const staticPages = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Contact Us", path: "/contact-us" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Use", path: "/terms-of-use" },
  { name: "Sitemap", path: "/sitemap" },
]

const soundPages = [
  { name: "New Sounds", path: "/new" },
  { name: "Trending Sounds", path: "/trends" },
  { name: "Meme Buttons", path: "/meme-buttons" },
  { name: "Meme Soundboard", path: "/meme-soundboard" },
  { name: "Create Sound", path: "/create-sound" },
  { name: "Text to Sound", path: "/text-to-sound" },
  { name: "Soundboard", path: "/soundboard" },
  { name: "Kids Soundboard", path: "/kids-soundboard" },
  { name: "Sound Effects", path: "/sound-effects" },
  { name: "Sound Buttons", path: "/sound-buttons" },
  { name: "Sound Buttons Unblocked", path: "/sound-buttons-unblocked" },
  { name: "Sound Buttons Unblocked for School", path: "/sound-buttons-unblocked-for-school" },
  { name: "Sound Buttons Categories", path: "/categories" },
  { name: "Soundboard Categories", path: "/categories/soundboard" },
  { name: "Play Random Sound", path: "/play-random" },
  { name: "All Categories", path: "/categories" },
  { name: "Upload Sound", path: "/upload-sound" },
  { name: "Reviews", path: "/reviews" },
  { name: "Favorites", path: "/favorites" },
  { name: "Games", path: "/games" },
  { name: "Tic Tac Toe", path: "/tic-tac-toe" },
  { name: "Whack-a-Mole", path: "/whack-a-mole" },
]

const accountPages = [
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
  { name: "My Profile", path: "/profile" },
]

const otherPages = [
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Main Blog Page", path: "/blog" },
]

const siteNavSchema = {
  "@context": "https://schema.org",
  "@graph": SITE_NAV_LINKS.map((link) => ({
    "@type": "SiteNavigationElement",
    name: link.name,
    url: link.url,
  })),
}

function LinkList({
  links,
  className,
}: {
  links: { name: string; path: string }[]
  className?: string
}) {
  return (
    <ul className={`space-y-2 ${className ?? ""}`}>
      {links.map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            className="text-primary hover:underline flex items-center"
          >
            <ChevronRight size={16} className="mr-1 shrink-0" /> {link.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }}
      />
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 border-b pb-4">
              Site Map
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Main Pages
                </h2>
                <LinkList links={staticPages} />
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Sound Collections
                </h2>
                <LinkList links={soundPages} />
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  User Account
                </h2>
                <LinkList links={accountPages} />
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Other Features
                </h2>
                <LinkList links={otherPages} />
              </section>

              <section className="md:col-span-2">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Sound Categories
                </h2>
                <ul className="space-y-2 columns-1 sm:columns-2 md:columns-3">
                  {CATEGORIES.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <ChevronRight size={16} className="mr-1 shrink-0" />{" "}
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
      </div>
    </>
  )
}
