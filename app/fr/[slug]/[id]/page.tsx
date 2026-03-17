import { notFound, permanentRedirect } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { generateSlug } from "@/lib/utils/slug"
import { toTitleCase, getNameForTitle } from "@/lib/utils"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import { getDisplaySoundName } from "@/lib/utils"

export const revalidate = 60

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

interface Props { params: Promise<{ slug: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) return { title: "Sound Not Found" }
  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) return { title: "Sound Not Found" }
  const base = getLocaleBase("fr")
  const canonicalSlug = generateSlug(sound.name)
  const canonicalUrl = `${base}/${canonicalSlug}/${sound.id}`
  const soundName = toTitleCase(getNameForTitle(sound.name))
  const title = `${soundName} Téléchargement d'Effet Sonore : Bouton Soundboard Instantané`
  const description = `Jouez et téléchargez l'effet sonore ${getDisplaySoundName(sound.name)} instantanément ! Explorez le soundboard de mèmes, les boutons sonores et les effets sonores pour le divertissement, les blagues et la création de contenu.`
  const ogImageUrl = `${base}/${canonicalSlug}/${sound.id}/opengraph-image`
  return {
    title: { absolute: title },
    description,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`,
        es: `${SITE.baseUrl}/es/${canonicalSlug}/${sound.id}`,
        pt: `${SITE.baseUrl}/pt/${canonicalSlug}/${sound.id}`,
        fr: canonicalUrl,
        "x-default": `${SITE.baseUrl}/${canonicalSlug}/${sound.id}`,
      },
    },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/png" as const, alt: sound.name, secureUrl: ogImageUrl }],
      locale: "fr_FR",
    },
    twitter: { card: "summary_large_image", site: "@soundbuttons", creator: "@soundbuttons", title, description, images: [ogImageUrl] },
    robots: { index: true, follow: true },
  }
}

export default async function FrSoundDetailPage({ params }: Props) {
  const { slug, id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) notFound()
  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) notFound()
  const canonicalSlug = generateSlug(sound.name)
  if (slug !== canonicalSlug) permanentRedirect(`/fr/${canonicalSlug}/${sound.id}`)

  const headersList = await headers()
  const isMobile = isMobileDevice(headersList.get("user-agent"))

  let youMightLikeSounds: Sound[] = []
  try {
    const { data } = await apiClient.getNewSounds(1, 50)
    youMightLikeSounds = (data ?? []).filter((s) => s.id !== sound.id).slice(0, 40)
  } catch { youMightLikeSounds = [] }

  try { await apiClient.updateViews(sound.id) } catch { /* ignore */ }

  const categoryId = sound.category_id ?? 13
  const category = getCategoryById(categoryId)
  const categorySlug = category?.slug ?? "memes"
  const base = getLocaleBase("fr")

  const soundForClient: Sound = {
    id: sound.id, name: sound.name, sound_file: sound.sound_file, views: sound.views,
    likes_count: sound.likes_count, favorites_count: sound.favorites_count,
    is_liked: sound.is_liked, is_favorited: sound.is_favorited,
    category_id: sound.category_id, category_name: sound.category_name,
  }

  const categoryName = category?.name ?? "Sounds"
  const shareUrl = `${base}/${canonicalSlug}/${sound.id}`
  const breadcrumbCategoryUrl = category ? `${base}/categories/${categorySlug}` : `${base}/categories`
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "categories", item: `${base}/categories` },
      { "@type": "ListItem", position: 2, name: categoryName, item: breadcrumbCategoryUrl },
      { "@type": "ListItem", position: 3, name: getDisplaySoundName(sound.name), item: shareUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SoundDetailClient
        sound={soundForClient}
        relatedSounds={youMightLikeSounds}
        categorySlug={categorySlug}
        categoryName={categoryName}
        categoryHref={`/fr/categories/${categorySlug}`}
        shareUrl={shareUrl}
        localePrefix="/fr"
        locale="fr"
        isMobileDevice={isMobile}
      />
    </>
  )
}
