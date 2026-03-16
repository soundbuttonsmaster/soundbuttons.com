import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import RegisterClient from "./RegisterClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Register - Create Account | SoundButtons.com" },
  description:
    "Create a free SoundButtons.com account to save favorites, upload sounds, and build your own soundboard. Join the sound effects community.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/register` },
  openGraph: {
    type: "website",
    title: "Register - Create Account | SoundButtons.com",
    url: `${BASE}/register`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "Register - Create Account | SoundButtons.com" },
}

export default function RegisterPage() {
  return <RegisterClient />
}
