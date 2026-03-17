import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Register - Create Account | SoundButtons.com" },
  description:
    "Create a free SoundButtons.com account to save favorites, upload sounds, and build your own soundboard. Join the sound effects community.",
  keywords:
    "register, sign up, create account, sound buttons, soundboard, free account, user registration, sound effects account, meme soundboard account",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL(BASE),
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/register`,
    languages: { en: `${BASE}/register`, "x-default": `${BASE}/register` },
  },
  openGraph: {
    type: "website",
    title: "Register - Create Account | SoundButtons.com",
    description:
      "Create a free SoundButtons.com account to save favorites, upload sounds, and build your own soundboard.",
    url: `${BASE}/register`,
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Register - Create Account | SoundButtons.com",
    description:
      "Create a free account to save favorites, upload sounds, and build your soundboard.",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org" as const,
  "@type": "BreadcrumbList" as const,
  itemListElement: [
    { "@type": "ListItem" as const, position: 1, name: "register", item: `${BASE}/register` },
  ],
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
