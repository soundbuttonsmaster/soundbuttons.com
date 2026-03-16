import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import ProfileClient from "./ProfileClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "My Profile - Account Settings | SoundButtons.com" },
  description:
    "Manage your SoundButtons.com account. Update your profile, view your soundboard, and access your saved favorites.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/profile` },
  openGraph: {
    type: "website",
    title: "My Profile - Account Settings | SoundButtons.com",
    url: `${BASE}/profile`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "My Profile | SoundButtons.com" },
}

export default function ProfilePage() {
  return <ProfileClient />
}
