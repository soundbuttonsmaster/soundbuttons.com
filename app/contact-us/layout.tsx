import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { absolute: "Contact Us - SoundButtons.com | Get Support & Feedback" },
  description:
    "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
  keywords:
    "contact soundbuttons, soundbuttons support, sound button help, contact us soundbuttons, sound button support, audio platform support, sound effects support, meme sound support, gaming sound support, comedy sound support, music sound support, viral sound support, content creator support, sound button help, audio platform contact, sound effects contact, meme sound contact, gaming sound contact, comedy sound contact, music sound contact, viral sound contact, content creator contact, sound button feedback, audio platform feedback, sound effects feedback, meme sound feedback, gaming sound feedback, comedy sound feedback, music sound feedback, viral sound feedback, content creator feedback",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  metadataBase: new URL("https://soundbuttons.com"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://soundbuttons.com/contact-us",
  },
  openGraph: {
    type: "website",
    title: "Contact Us - SoundButtons.com | Get Support & Feedback",
    description:
      "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
    url: "https://soundbuttons.com/contact-us",
    siteName: "Sound Buttons",
    locale: "en_US",
    alternateLocale: ["en_GB"],
    // Uses opengraph-image.tsx for dynamic SVG-based OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Contact Us - SoundButtons.com | Get Support & Feedback",
    description:
      "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
  },
  themeColor: "#2563eb",
  applicationName: "Sound Buttons",
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  other: {
    "fb:app_id": "123456789012345",
    "wot-verification": "4342162e8c0f7503ba1f",
    language: "en",
    rating: "general",
    distribution: "global",
    bingbot: "index, follow",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    "mobile-web-app-capable": "yes",
    coverage: "worldwide",
    target: "all",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "twitter:domain": "soundbuttons.com",
    "twitter:app:name:iphone": "SoundButtons",
    "twitter:app:name:ipad": "SoundButtons",
    "twitter:app:name:googleplay": "SoundButtons",
  },
}

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "contact-us", item: `${BASE}/contact-us` },
    ],
  }
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
