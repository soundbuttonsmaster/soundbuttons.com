import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import { apiClient, fetchSoundCommentsServer, type SoundComment } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"
import { toTitleCase, getNameForTitle, getDisplaySoundName } from "@/lib/utils"
import { getTopSoundParams } from "@/lib/api/static-params"

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 300

export async function generateStaticParams() {
  return getTopSoundParams()
}

interface SoundPageProps {
  params: Promise<{ slug: string; id: string }>
}

function buildDescription(soundName: string): string {
  const name = getDisplaySoundName(soundName)
  return `Play and download ${name} sound effect instantly! Explore meme soundboard, sound buttons & sound effects for entertainment, pranks and content creation.`
}

function buildKeywords(soundName: string): string {
  return `${soundName}, ${soundName} sound button, ${soundName} meme sound, ${soundName} sound effect, ${soundName} download, ${soundName} mp3, sound buttons, meme sounds, sound effects, soundboard, unblocked sound buttons, free sound effects, viral sounds, meme soundboard, audio effects, sound buttons unblocked, soundboard download, funny sounds, notification sounds, ringtone sounds, sound buttons for school, sound buttons for discord, sound buttons for tiktok, sound buttons for youtube, sound buttons for streaming, sound buttons for gaming, sound buttons for pranks, sound buttons for memes, sound buttons for reactions, sound buttons for content creation, sound buttons for social media, sound buttons for videos, sound buttons for podcasts, sound buttons for live streams, sound buttons for comedy, sound buttons for entertainment`
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
        es: `${SITE.baseUrl}/es${canonicalUrl.replace(SITE.baseUrl, "")}`,
        pt: `${SITE.baseUrl}/pt${canonicalUrl.replace(SITE.baseUrl, "")}`,
        fr: `${SITE.baseUrl}/fr${canonicalUrl.replace(SITE.baseUrl, "")}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [
        {
          url: `${SITE.baseUrl}/${canonicalSlug}/${sound.id}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${sound.name} - SoundButtons.com`,
          secureUrl: `${SITE.baseUrl}/${canonicalSlug}/${sound.id}/opengraph-image`,
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
      images: [
        {
          url: `${SITE.baseUrl}/${canonicalSlug}/${sound.id}/opengraph-image`,
          alt: `${sound.name} - SoundButtons.com`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function SoundDetailPage({ params }: SoundPageProps) {
  const { slug, id } = await params

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

  let initialComments: SoundComment[] = []
  let initialCommentsTotal = 0
  try {
    const commentsData = await fetchSoundCommentsServer(sound.id, 1, 5)
    initialComments = commentsData.results
    initialCommentsTotal = commentsData.total_count
  } catch {
    // ignore
  }

  const categoryId = sound.category_id ?? 13
  const category = getCategoryById(categoryId)
  const categorySlug = category?.slug ?? "memes"
  const categoryName = category?.name ?? "Sounds"
  const breadcrumbCategoryUrl = category
    ? `${SITE.baseUrl}/categories/${categorySlug}`
    : `${SITE.baseUrl}/categories`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.baseUrl}/` },
              { "@type": "ListItem", position: 2, name: categoryName, item: breadcrumbCategoryUrl },
              {
                "@type": "ListItem",
                position: 3,
                name: getDisplaySoundName(sound.name),
                item: `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`,
              },
            ],
          }),
        }}
      />
      <SoundDetailClient
        sound={sound}
        relatedSounds={youMightLikeSounds}
        categorySlug={categorySlug}
        categoryName={category?.name ?? sound.category_name ?? "Sounds"}
        initialComments={initialComments}
        initialCommentsTotal={initialCommentsTotal}
      />
    </>
  )
}
