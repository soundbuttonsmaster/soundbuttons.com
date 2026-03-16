import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import {
  OLD_POLICY_NAV_ELEMENTS,
  OLD_WEBSITE_SCHEMA,
  OLD_ORGANIZATION_SCHEMA,
  OLD_NAV_GRAPH_SCHEMA,
} from "@/lib/constants/policy-page-schema"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "About Us - Our Mission & Story | SoundButtons.com" },
  description:
    "Learn more about SoundButtons.com, our mission to bring people together through sound, and how you can discover, play, and share the best sound buttons online. Join our community of creators and sound enthusiasts!",
  keywords:
    "about soundbuttons, soundbuttons mission, sound button community, about us soundbuttons, sound button platform, audio community, sound effects platform, meme sound community, gaming sound community, comedy sound community, music sound community, viral sound community, content creator platform, sound button creators, audio enthusiasts, sound button story, soundbuttons team, sound button mission, audio platform about, sound effects community, meme sound platform, gaming sound platform, comedy sound platform, music sound platform, viral sound platform, content creator community, sound button enthusiasts, audio creators, sound button platform about, sound effects about, meme sound about",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${BASE}/about-us`,
    languages: { en: `${BASE}/about-us`, "x-default": `${BASE}/about-us` },
  },
  openGraph: {
    type: "website",
    title: "About Us - Our Mission & Story | SoundButtons.com",
    description:
      "Learn more about SoundButtons.com, our mission to bring people together through sound, and how you can discover, play, and share the best sound buttons online. Join our community of creators and sound enthusiasts!",
    url: `${BASE}/about-us`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "About Us - Our Mission & Story | SoundButtons.com",
        secureUrl: `${BASE}/og.png`,
      },
    ],
    locale: "en_US",
    alternateLocale: ["en_AU"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "About Us - Our Mission & Story | SoundButtons.com",
    description:
      "Learn more about SoundButtons.com, our mission to bring people together through sound, and how you can discover, play, and share the best sound buttons online. Join our community of creators and sound enthusiasts!",
    images: [`${BASE}/og.png`],
  },
}

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Us - SoundButtons.Com",
  description:
    "Learn more about SoundButtons.Com, our mission to bring people together through sound, and how you can discover, play, and share the best sound buttons online.",
  url: `${BASE}/about-us`,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "SoundButtons.com",
    logo: { "@type": "ImageObject", url: `${BASE}/og.png` },
  },
}

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      {OLD_POLICY_NAV_ELEMENTS.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OLD_WEBSITE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OLD_ORGANIZATION_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OLD_NAV_GRAPH_SCHEMA) }}
      />
      <div className="flex flex-col items-center py-8 bg-background">
        <div className="w-full max-w-2xl px-4">
            <h1 className="text-3xl font-bold mb-6 text-foreground">About Us</h1>
            <p className="mb-4 text-muted-foreground">
              <strong>SoundButton</strong> is the best place to find, play, and share fun sound buttons from all over the world. SoundButton makes it fun and easy to add some humor to your day, find the perfect meme sound, or just look through the latest audio clips.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">What We Do</h2>
            <p className="mb-4 text-muted-foreground">
              Our goal is to connect people through music. We think that one sound can make people laugh, feel nostalgic, or excited, and we want to make those moments available to everyone, no matter where they are.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">What We Offer</h2>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>A lot of sound buttons in a lot of different categories</li>
              <li>Sounds that are popular and new are added all the time.</li>
              <li>Sharing and downloading your favorite sounds is easy.</li>
              <li>A modern, easy-to-use interface</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Contact</h2>
            <p className="text-muted-foreground">
              Do you have any questions, suggestions, or want to get in touch? Send us an email at{" "}
              <a href={`mailto:${SITE.email}`} className="text-primary underline hover:opacity-80">
                {SITE.email}
              </a>
              .
            </p>
          </div>
      </div>
    </>
  )
}
