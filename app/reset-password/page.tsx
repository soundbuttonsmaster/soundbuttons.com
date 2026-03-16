import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import ResetPasswordClient from "./ResetPasswordClient"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Reset Password - Set New Password | SoundButtons.com" },
  description:
    "Set a new password for your SoundButtons.com account using the link from your email.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE}/reset-password` },
  openGraph: {
    type: "website",
    title: "Reset Password - Set New Password | SoundButtons.com",
    url: `${BASE}/reset-password`,
    siteName: "Sound Buttons",
  },
  twitter: { card: "summary", title: "Reset Password | SoundButtons.com" },
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
