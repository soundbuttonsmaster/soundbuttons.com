import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import SoundEffectDetailClient from "@/components/sound-effects/SoundEffectDetailClient"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"

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

  const base = SITE.baseUrl
  const detailPath = `/sound-effects/${canonicalSlug}/${soundEffect.id}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
              { "@type": "ListItem", position: 2, name: "Sound Effects", item: `${base}/sound-effects` },
              {
                "@type": "ListItem",
                position: 3,
                name: soundEffect.soundName,
                item: `${base}${detailPath}`,
              },
            ],
          }),
        }}
      />
      <SoundEffectDetailClient soundEffect={soundEffect} relatedEffects={relatedEffects} />
    </>
  )
}
