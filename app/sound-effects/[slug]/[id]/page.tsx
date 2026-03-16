import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import SoundEffectDetailClient from "@/components/sound-effects/SoundEffectDetailClient"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"
import { getSoundEffectDetailPath } from "@/lib/utils/slug"

export const revalidate = 60

interface SoundEffectPageProps {
  params: Promise<{ slug: string; id: string }>
}

function buildDescription(soundName: string): string {
  const hasSuffix = /sound\s*effect/i.test(soundName)
  const suffix = hasSuffix ? "" : " sound effect"
  return `Play the iconic ${soundName}${suffix} for your meme soundboard! Perfect for unblocked sound buttons, sound effects, and creating viral content. Free download, no registration required.`
}

function buildTitle(soundName: string): string {
  const hasSuffix = /sound\s*effect/i.test(soundName)
  const suffix = hasSuffix ? "" : " Sound Effect"
  return `${soundName}${suffix}: Free Unblocked Meme Soundboard & Sound Buttons`
}

export async function generateMetadata({ params }: SoundEffectPageProps): Promise<Metadata> {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) return { title: "Sound Effect Not Found" }

  const soundEffect = await soundEffectsApi.getById(idNum)
  if (!soundEffect) return { title: "Sound Effect Not Found" }

  const canonicalSlug = generateSlug(soundEffect.soundName)
  const canonicalUrl = `${SITE.baseUrl}/sound-effects/${canonicalSlug}/${soundEffect.id}`
  const title = buildTitle(soundEffect.soundName)
  const description = buildDescription(soundEffect.soundName)

  return {
    title: { absolute: `${title} - SoundButtons.com` },
    description,
    keywords: `${soundEffect.soundName}, ${soundEffect.soundName} sound effect, download, mp3, sound effects, sound buttons`,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [{ url: `${SITE.baseUrl}/og.png`, width: 1200, height: 630 }],
      ...(soundEffect.soundFile && {
        audio: soundEffectsApi.getSoundFileUrl(soundEffect),
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function SoundEffectDetailPage({ params }: SoundEffectPageProps) {
  const { slug, id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) notFound()

  const soundEffect = await soundEffectsApi.getById(idNum)
  if (!soundEffect) notFound()

  const canonicalSlug = generateSlug(soundEffect.soundName)
  if (slug !== canonicalSlug) {
    permanentRedirect(`/sound-effects/${canonicalSlug}/${soundEffect.id}`)
  }

  const canonicalUrl = `${SITE.baseUrl}${getSoundEffectDetailPath(soundEffect.soundName, soundEffect.id)}`

  let relatedEffects: Awaited<ReturnType<typeof soundEffectsApi.getRelated>> = []
  try {
    relatedEffects = await soundEffectsApi.getRelated(
      soundEffect.id,
      soundEffect.tags || "",
      24
    )
  } catch {
    relatedEffects = []
  }

  try {
    await soundEffectsApi.incrementViews(soundEffect.id)
  } catch {
    // ignore
  }

  const description = buildDescription(soundEffect.soundName)
  const faqSuffix = /sound\s*effect/i.test(soundEffect.soundName) ? "" : " sound effect"
  const faqs = [
    {
      q: `What is the ${soundEffect.soundName}${faqSuffix}?`,
      a: `The ${soundEffect.soundName}${faqSuffix} is a high-quality audio clip you can download and use in your creative projects, videos, games, and multimedia content.`,
    },
    {
      q: `How can I download the ${soundEffect.soundName}${faqSuffix}?`,
      a: `Simply click the download button on this page to save the ${soundEffect.soundName}${faqSuffix} as an MP3 file.`,
    },
    {
      q: `Can I use the ${soundEffect.soundName}${faqSuffix} for free?`,
      a: `Yes! The ${soundEffect.soundName}${faqSuffix} is free to download and use for personal and commercial projects.`,
    },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Sound Effects", item: `${SITE.baseUrl}/sound-effects` },
      { "@type": "ListItem", position: 3, name: soundEffect.soundName, item: canonicalUrl },
    ],
  }

  const audioSchema = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: soundEffect.soundName,
    description,
    url: canonicalUrl,
    contentUrl: soundEffectsApi.getSoundFileUrl(soundEffect),
    encodingFormat: "audio/mpeg",
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(audioSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SoundEffectDetailClient soundEffect={soundEffect} relatedEffects={relatedEffects} />
    </>
  )
}
