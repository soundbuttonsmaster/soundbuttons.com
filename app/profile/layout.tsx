import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "My Profile - Account Settings | SoundButtons.com" },
  description:
    "Manage your SoundButtons.com account. View your soundboard, uploads, and access your saved favorites.",
  keywords:
    "profile, user profile, my profile, account settings, my sounds, uploaded sounds, account management, sound buttons profile",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL(BASE),
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/profile`,
    languages: { en: `${BASE}/profile`, "x-default": `${BASE}/profile` },
  },
  openGraph: {
    type: "website",
    title: "My Profile - Account Settings",
    description:
      "Manage your SoundButtons.com account. View your soundboard, uploads, and access your saved favorites.",
    url: `${BASE}/profile`,
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "My Profile | SoundButtons.com",
    description: "Manage your account and view your sounds.",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org" as const,
  "@type": "BreadcrumbList" as const,
  itemListElement: [
    { "@type": "ListItem" as const, position: 1, name: "profile", item: `${BASE}/profile` },
  ],
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
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
