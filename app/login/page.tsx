import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import LoginClient from "./LoginClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Login - Sign In | SoundButtons.com" },
  description:
    "Sign in to your SoundButtons.com account to save favorites, create soundboards, and access your profile. Free meme soundboard and sound effects.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/login` },
  openGraph: {
    type: "website",
    title: "Login - Sign In | SoundButtons.com",
    url: `${BASE}/login`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "Login - Sign In | SoundButtons.com" },
}

export default function LoginPage() {
  return <LoginClient />
}
