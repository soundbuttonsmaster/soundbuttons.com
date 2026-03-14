import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Contact Us - SoundButtons.com | Get Support & Feedback",
  description:
    "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
  keywords:
    "contact soundbuttons, soundbuttons support, sound button help, contact us soundbuttons, sound button support, audio platform support, sound effects support, meme sound support, gaming sound support, comedy sound support, music sound support, viral sound support, content creator support, sound button help, audio platform contact, sound effects contact, meme sound contact, gaming sound contact, comedy sound contact, music sound contact, viral sound contact, content creator contact, sound button feedback, audio platform feedback, sound effects feedback, meme sound feedback, gaming sound feedback, comedy sound feedback, music sound feedback, viral sound feedback, content creator feedback",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${BASE}/contact-us`,
    languages: { en: `${BASE}/contact-us`, "x-default": `${BASE}/contact-us` },
  },
  openGraph: {
    type: "website",
    title: "Contact Us - SoundButtons.com | Get Support & Feedback",
    description:
      "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
    url: `${BASE}/contact-us`,
    siteName: "SoundButtons.com",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Contact Us - SoundButtons.com" }],
    locale: "en_US",
    alternateLocale: ["en_GB"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - SoundButtons.com | Get Support & Feedback",
    description:
      "Contact the SoundButtons.com team with your questions, feedback, or support requests. We're here to help! Get in touch for technical support, feature requests, or general inquiries.",
    images: [`${BASE}/og.png`],
  },
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us - SoundButtons.Com",
  description:
    "Contact the SoundButtons.Com team with your questions, feedback, or support requests. We're here to help!",
  url: `${BASE}/contact-us`,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "SoundButtons.com",
    logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
  },
}

const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: link.name,
  url: link.url,
}))

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {siteNavSchema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
