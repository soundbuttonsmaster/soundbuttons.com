import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Forgot Password - Sound Buttons | Reset Your Account Password",
  description:
    "Reset your Sound Buttons account password. Enter your email address to receive password reset instructions and regain access to your soundboard account.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${BASE}/forgot-password` },
  openGraph: {
    type: "website",
    title: "Forgot Password - Sound Buttons | Reset Your Account Password",
    description:
      "Reset your Sound Buttons account password. Enter your email address to receive password reset instructions.",
    url: `${BASE}/forgot-password`,
    siteName: "SoundButtons.com",
  },
  twitter: {
    card: "summary",
    title: "Forgot Password - Sound Buttons",
    description: "Reset your Sound Buttons account password. Enter your email to receive reset instructions.",
  },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
