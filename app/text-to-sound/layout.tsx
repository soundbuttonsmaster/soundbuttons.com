import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Text to Sound Button - Convert Text to Fun Audio Effects" },
  description:
    "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily and enjoy endless audio fun.",
  publisher: "SoundButtons.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/text-to-sound`,
    languages: { en: `${BASE}/text-to-sound`, "x-default": `${BASE}/text-to-sound` },
  },
  openGraph: {
    type: "website",
    title: "Text to Sound Button - Convert Text to Fun Audio Effects",
    description:
      "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily and enjoy endless audio fun.",
    url: `${BASE}/text-to-sound`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/text-to-sound/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Text to Sound Button",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Text to Sound Button - Convert Text to Fun Audio Effects",
    description:
      "Convert your text into fun audio using Text to Sound Button on SoundButtons. Create, play, and share custom sound effects easily.",
    images: [
      {
        url: `${BASE}/text-to-sound/opengraph-image`,
        alt: "Text to Sound Button",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function TextToSoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Text to Sound",
                item: BASE + "/text-to-sound",
              },
            ],
          }),
        }}
      />
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 blur-3xl dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-30" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 opacity-30 blur-3xl dark:from-pink-900 dark:via-indigo-900 dark:to-blue-900 dark:opacity-20" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </>
  )
}
