import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Upload Sound Button - Share Your Sounds | SoundButtons.com" },
  description:
    "Upload your own sound buttons to SoundButtons.com. Share meme sounds, sound effects, and audio clips with the community.",
  publisher: "SoundButtons.com",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/upload-sound` },
  openGraph: {
    type: "website",
    title: "Upload Sound Button - Share Your Sounds | SoundButtons.com",
    description:
      "Upload your own sound buttons to SoundButtons.com. Share meme sounds, sound effects, and audio clips with the community.",
    url: `${BASE}/upload-sound`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/upload-sound/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Upload Sound Button",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Upload Sound Button - Share Your Sounds | SoundButtons.com",
    description:
      "Upload your own sound buttons to SoundButtons.com. Share meme sounds, sound effects, and audio clips with the community.",
    images: [
      {
        url: `${BASE}/upload-sound/opengraph-image`,
        alt: "Upload Sound Button",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function UploadSoundLayout({
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
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Upload Sound", item: `${BASE}/upload-sound` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
