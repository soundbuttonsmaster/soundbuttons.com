import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { headers } from "next/headers"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 300

interface SoundPageProps {
  params: Promise<{ slug: string; id: string }>
}

function buildDescription(soundName: string): string {
  const hasSuffix = /sound\s*button|sound\s*effect/i.test(soundName)
  const suffix = hasSuffix ? "" : " sound button"
  return `Play the iconic ${soundName}${suffix} for your meme soundboard! Perfect for unblocked sound buttons, sound effects, and creating viral content.`
}

function buildKeywords(soundName: string): string {
  return `${soundName}, ${soundName} sound button, ${soundName} meme sound, ${soundName} sound effect, ${soundName} download, ${soundName} mp3, sound buttons, meme sounds, sound effects, soundboard, unblocked sound buttons, free sound effects`
}

export async function generateMetadata({ params }: SoundPageProps): Promise<Metadata> {
  const { slug, id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) {
    return { title: "Sound Not Found" }
  }

  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) {
    return { title: "Sound Not Found" }
  }

  const canonicalSlug = generateSlug(sound.name)
  const canonicalUrl = `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`
  const title = `${sound.name} - Sound Effect Button`
  const description = buildDescription(sound.name)
  const keywords = buildKeywords(sound.name)

  const category = sound.category_id ? getCategoryById(sound.category_id) : null
  const categorySlug = category?.slug ?? "memes"

  return {
    title,
    description,
    keywords,
    authors: [{ name: "SoundButtons.com" }],
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
      languages: { "x-default": canonicalUrl },
    },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE.name,
      images: [{ url: `${SITE.baseUrl}/og.png`, width: 1200, height: 630, alt: `${sound.name} - Sound Button` }],
      audio: sound.sound_file,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.baseUrl}/og.png`],
    },
  }
}

export default async function SoundDetailPage({ params }: SoundPageProps) {
  const { slug, id } = await params
  const headersList = await headers()
  const userAgent = headersList.get("user-agent")
  const isMobile = isMobileDevice(userAgent)

  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) {
    notFound()
  }

  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) {
    notFound()
  }

  const canonicalSlug = generateSlug(sound.name)
  if (slug !== canonicalSlug) {
    permanentRedirect(`/${canonicalSlug}/${sound.id}`)
  }

  let relatedSounds: Sound[] = []
  const categoryId = sound.category_id ?? 13
  try {
    const { data } = await apiClient.getRelatedSounds(sound.id, categoryId)
    relatedSounds = (data ?? []).filter((s) => s.id !== sound.id)
  } catch {
    relatedSounds = []
  }

  try {
    await apiClient.updateViews(sound.id)
  } catch {
    // ignore
  }

  const category = getCategoryById(categoryId)
  const categorySlug = category?.slug ?? "memes"
  const canonicalUrl = `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`

  const description = buildDescription(sound.name)
  const faqs = [
    {
      q: `What is the ${sound.name} sound button?`,
      a: `The ${sound.name} sound button is a popular audio clip you can play, download, and use in your memes, videos, and streams.`,
    },
    {
      q: `How can I download the ${sound.name} sound button?`,
      a: `Simply click the download button on this page to save the ${sound.name} sound button as an MP3 file to your device.`,
    },
    {
      q: `Can I use the ${sound.name} sound button for free?`,
      a: `Yes! The ${sound.name} sound button is free to play, download, and share for personal use.`,
    },
    {
      q: `Where is the ${sound.name} sound button from?`,
      a: `The ${sound.name} sound button is part of our unblocked soundboard collection, perfect for memes, reactions, and content creation.`,
    },
    {
      q: `Can I use the ${sound.name} sound button on my phone?`,
      a: `Absolutely! The ${sound.name} sound button works on all devices, including smartphones, tablets, and desktops.`,
    },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.baseUrl}/` },
      { "@type": "ListItem", position: 2, name: category?.name ?? "Sounds", item: `${SITE.baseUrl}/categories/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: sound.name, item: canonicalUrl },
    ],
  }

  const audioSchema = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: sound.name,
    description,
    url: canonicalUrl,
    contentUrl: sound.sound_file,
    encodingFormat: "audio/mpeg",
    inLanguage: "en",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ListenAction",
      userInteractionCount: sound.views ?? 0,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.baseUrl}/og.png` },
    },
  }

  const itemListSchema =
    relatedSounds.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "You might also like",
          numberOfItems: relatedSounds.length,
          itemListElement: relatedSounds.slice(0, 10).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "AudioObject",
              name: s.name,
              url: `${SITE.baseUrl}/${generateSlug(s.name)}/${s.id}`,
            },
          })),
        }
      : null

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${sound.name} - Sound Effect Button`,
    description,
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: `${SITE.baseUrl}/` },
    potentialAction: { "@type": "ListenAction", target: canonicalUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(audioSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SoundDetailClient
        sound={sound}
        relatedSounds={relatedSounds}
        isMobileDevice={isMobile}
        categorySlug={categorySlug}
        categoryName={category?.name ?? sound.category_name ?? "Sounds"}
      />
    </>
  )
}
