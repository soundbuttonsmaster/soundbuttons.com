import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl
const TITLE = "About Us - Our Mission & Story | SoundButtons.com"
const DESCRIPTION =
  "Learn more about SoundButtons.com, our mission to bring people together through sound, and how you can discover, play, and share the best sound buttons online. Join our community of creators and sound enthusiasts!"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords:
    "about soundbuttons, soundbuttons mission, sound button community, about us soundbuttons, sound button platform, audio community, sound effects platform, meme sound community, gaming sound community, comedy sound community, music sound community, viral sound community, content creator platform, sound button creators, audio enthusiasts, sound button story, soundbuttons team, sound button mission, audio platform about, sound effects community, meme sound platform, gaming sound platform, comedy sound platform, music sound platform, viral sound platform, content creator community, sound button enthusiasts, audio creators, sound button platform about, sound effects about, meme sound about",
  authors: [{ name: "SoundButtons.com", url: BASE }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL(BASE),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${BASE}/about-us`,
    languages: { en: `${BASE}/about-us`, "x-default": `${BASE}/about-us` },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_AU"],
    url: `${BASE}/about-us`,
    siteName: "Sound Buttons",
    title: TITLE,
    description: DESCRIPTION,
    determiner: "the",
    images: [
      {
        url: `${BASE}/about-us/opengraph-image`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: TITLE,
        secureUrl: `${BASE}/about-us/opengraph-image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: `${BASE}/about-us/opengraph-image`, alt: TITLE, width: 1200, height: 630 },
    ],
  },
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
  verification: {
    other: { "wot-verification": "4342162e8c0f7503ba1f" },
  },
  other: {
    "fb:pages": "123456789012345",
    "fb:admins": "123456789012345",
    "fb:app_id": "123456789012345",
    slurp: "index, follow",
    msnbot: "index, follow",
    bingbot: "index, follow",
    rating: "general",
    target: "all",
    coverage: "worldwide",
    language: "en",
    distribution: "global",
    "revisit-after": "1 days",
    MobileOptimized: "width",
    HandheldFriendly: "true",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "linkedin:owner": "soundbuttons",
    "linkedin:page_id": "123456789012345",
    "twitter:domain": "soundbuttons.com",
    "article:publisher": "https://www.facebook.com/soundbuttons",
    "pinterest-rich-pin": "true",
    "pinterest:description": DESCRIPTION,
    "twitter:app:url:ipad": `${BASE}/`,
    "twitter:app:name:ipad": "SoundButtons",
    "twitter:app:url:iphone": `${BASE}/`,
    "twitter:app:name:iphone": "SoundButtons",
    "twitter:app:url:googleplay": `${BASE}/`,
    "twitter:app:name:googleplay": "SoundButtons",
  },
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
}

export default function AboutUsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "about-us", item: `${BASE}/about-us` },
    ],
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="flex flex-col items-center py-8 bg-background">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">About Us</h1>
        <p className="mb-4 text-muted-foreground">
          <strong>SoundButton</strong> is the best place to find, play, and share fun sound buttons from all over the world. SoundButton makes it fun and easy to add some humor to your day, find the perfect meme sound, or just look through the latest audio clips.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">What We Do</h2>
        <p className="mb-4 text-muted-foreground">
          Our goal is to connect people through music. We think that one sound can make people laugh, feel nostalgic, or excited, and we want to make those moments available to everyone, no matter where they are.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">What We Offer</h2>
        <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
          <li>A lot of sound buttons in a lot of different categories</li>
          <li>Sounds that are popular and new are added all the time.</li>
          <li>Sharing and downloading your favorite sounds is easy.</li>
          <li>A modern, easy-to-use interface</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          Do you have any questions, suggestions, or want to get in touch? Send us an email at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary underline hover:opacity-80">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </div>
    </>
  )
}
