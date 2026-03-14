import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { headers } from "next/headers"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"
import { toTitleCase, getNameForTitle } from "@/lib/utils"

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 60

interface SoundPageProps {
  params: Promise<{ slug: string; id: string }>
}

function buildDescription(soundName: string): string {
  const hasSuffix = /sound\s*button|sound\s*effect/i.test(soundName)
  const suffix = hasSuffix ? "" : " sound button"
  return `Play the iconic ${soundName}${suffix} for your meme soundboard! Perfect for unblocked sound buttons, sound effects, and creating viral content.`
}

function buildKeywords(soundName: string): string {
  return `${soundName}, ${soundName} sound button, ${soundName} meme sound, ${soundName} sound effect, ${soundName} download, ${soundName} mp3, sound buttons, meme sounds, sound effects, soundboard, unblocked sound buttons, free sound effects, viral sounds, meme soundboard, audio effects, sound buttons unblocked, soundboard download, funny sounds, notification sounds, ringtone sounds, sound buttons for school, sound buttons for discord, sound buttons for tiktok, sound buttons for youtube, sound buttons for streaming, sound buttons for gaming, sound buttons for pranks, sound buttons for memes, sound buttons for reactions, sound buttons for content creation, sound buttons for social media, sound buttons for videos, sound buttons for podcasts, sound buttons for live streams, sound buttons for comedy, sound buttons for entertainment`
}

function getFaqSuffix(soundName: string): string {
  const hasSoundButton = /sound\s*button|sound\s*effect/i.test(soundName)
  return hasSoundButton ? "" : " sound button"
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
  const title = `${toTitleCase(getNameForTitle(sound.name))} Sound Effect Download: Instant Soundboard Button`
  const description = buildDescription(sound.name)
  const keywords = buildKeywords(sound.name)

  const category = sound.category_id ? getCategoryById(sound.category_id) : null
  const categorySlug = category?.slug ?? "memes"

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        fr: `${SITE.baseUrl}/fr${canonicalUrl.replace(SITE.baseUrl, "")}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: canonicalUrl,
      siteName: "SoundButtons.com",
      images: [
        {
          url: `${SITE.baseUrl}/og.png`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${sound.name} - SoundButtons.com`,
          secureUrl: `${SITE.baseUrl}/og.png`,
        },
      ],
      locale: "en_US",
      alternateLocale: ["en_GB", "en_CA", "en_AU", "fr_FR"],
      ...(sound.sound_file && { audio: sound.sound_file }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
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

  let youMightLikeSounds: Sound[] = []
  try {
    const { data } = await apiClient.getNewSounds(1, 50)
    youMightLikeSounds = (data ?? []).filter((s) => s.id !== sound.id).slice(0, 40)
  } catch {
    youMightLikeSounds = []
  }

  try {
    await apiClient.updateViews(sound.id)
  } catch {
    // ignore
  }
  const categoryId = sound.category_id ?? 13
  const category = getCategoryById(categoryId)
  const categorySlug = category?.slug ?? "memes"
  const canonicalUrl = `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`

  const description = buildDescription(sound.name)
  const faqSuffix = getFaqSuffix(sound.name)
  const faqs = [
    {
      q: `What is the ${sound.name}${faqSuffix}?`,
      a: `The ${sound.name}${faqSuffix} is a popular audio clip you can play, download, and use in your memes, videos, and streams.`,
    },
    {
      q: `How can I download the ${sound.name}${faqSuffix}?`,
      a: `Simply click the download button on this page to save the ${sound.name}${faqSuffix} as an MP3 file to your device.`,
    },
    {
      q: `Can I use the ${sound.name}${faqSuffix} for free?`,
      a: `Yes! The ${sound.name}${faqSuffix} is free to play, download, and share for personal use.`,
    },
    {
      q: `Where is the ${sound.name}${faqSuffix} from?`,
      a: `The ${sound.name}${faqSuffix} is part of our unblocked soundboard collection, perfect for memes, reactions, and content creation.`,
    },
    {
      q: `Can I use the ${sound.name}${faqSuffix} on my phone?`,
      a: `Absolutely! The ${sound.name}${faqSuffix} works on all devices, including smartphones, tablets, and desktops.`,
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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoundButtons.com",
    url: `${SITE.baseUrl}/`,
    logo: { "@type": "ImageObject", url: `${SITE.baseUrl}/og.png` },
  }

  const audioSchema = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: sound.name,
    description,
    url: canonicalUrl,
    contentUrl: sound.sound_file,
    image: `${SITE.baseUrl}/og.png`,
    encodingFormat: "audio/mpeg",
    inLanguage: "en",
    datePublished: sound.created_at ?? undefined,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ListenAction",
      userInteractionCount: sound.views ?? 0,
    },
    publisher: {
      "@type": "Organization",
      name: "SoundButtons.com",
      logo: { "@type": "ImageObject", url: `${SITE.baseUrl}/og.png` },
    },
  }

  const itemListSchema =
    youMightLikeSounds.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "You might also like",
          numberOfItems: youMightLikeSounds.length,
          itemListElement: youMightLikeSounds.slice(0, 10).map((s, i) => ({
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
    name: `${toTitleCase(getNameForTitle(sound.name))} Sound Effect Download: Instant Soundboard Button`,
    description,
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${SITE.baseUrl}/` },
    potentialAction: { "@type": "ListenAction", target: canonicalUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(audioSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <SoundDetailClient
        sound={sound}
        relatedSounds={youMightLikeSounds}
        isMobileDevice={isMobile}
        categorySlug={categorySlug}
        categoryName={category?.name ?? sound.category_name ?? "Sounds"}
      />
    </>
  )
}
