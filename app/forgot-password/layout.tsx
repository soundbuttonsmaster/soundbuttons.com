import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { absolute: "Forgot Password - Sound Buttons | Reset Your Account Password" },
  description:
    "Reset your Sound Buttons account password. Enter your email address to receive password reset instructions and regain access to your soundboard account.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL("https://soundbuttons.com"),
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://soundbuttons.com/forgot-password",
  },
  openGraph: {
    type: "website",
    title: "Forgot Password - Sound Buttons | Reset Your Account Password",
    description:
      "Reset your Sound Buttons account password. Enter your email address to receive password reset instructions and regain access to your soundboard account.",
    url: "https://soundbuttons.com/forgot-password",
    siteName: "Sound Buttons",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password - Sound Buttons | Reset Your Account Password",
    description:
      "Reset your Sound Buttons account password. Enter your email address to receive password reset instructions.",
  },
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  other: {
    "wot-verification": "4342162e8c0f7503ba1f",
    language: "en",
    rating: "general",
    distribution: "global",
    coverage: "worldwide",
    target: "all",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "forgot-password", item: `${BASE}/forgot-password` },
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
