import { notFound, permanentRedirect } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"
import { toTitleCase, getNameForTitle } from "@/lib/utils"
import { getPageMetadata, getLocaleBase } from "@/lib/i18n/metadata"
import { getBreadcrumbLabels } from "@/lib/i18n/strings"

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
  const base = getLocaleBase("pt")
  const canonicalSlug = generateSlug(sound.name)
  const canonicalUrl = `${base}/${canonicalSlug}/${sound.id}`
  const { title, description } = getPageMetadata("pt", "soundDetail")
  const displayTitle = `${toTitleCase(getNameForTitle(sound.name))} - ${title}`
  return {
    title: { absolute: displayTitle },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { type: "music.song", title: displayTitle, description, url: canonicalUrl, siteName: "Sound Buttons", images: [{ url: `${SITE.baseUrl}/og.png`, width: 1200, height: 630 }], locale: "pt_BR" },
    twitter: { card: "summary_large_image", title: displayTitle, description },
    robots: { index: true, follow: true },
  }
}

export default async function PtSoundDetailPage({ params }: Props) {
  const { slug, id } = await params
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum <= 0) notFound()
  const { data: sound } = await apiClient.getSoundById(idNum)
  if (!sound) notFound()
  const canonicalSlug = generateSlug(sound.name)
  if (slug !== canonicalSlug) permanentRedirect(`/pt/${canonicalSlug}/${sound.id}`)

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
  const base = getLocaleBase("pt")

  const soundForClient: Sound = {
    id: sound.id, name: sound.name, sound_file: sound.sound_file, views: sound.views,
    likes_count: sound.likes_count, favorites_count: sound.favorites_count,
    is_liked: sound.is_liked, is_favorited: sound.is_favorited,
    category_id: sound.category_id, category_name: sound.category_name,
  }

  const labels = getBreadcrumbLabels("pt")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${base}/` },
      { "@type": "ListItem", position: 2, name: category?.name ?? "Sounds", item: `${base}/categories/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: sound.name, item: `${base}/${canonicalSlug}/${sound.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SoundDetailClient
        sound={soundForClient}
        relatedSounds={youMightLikeSounds}
        categorySlug={categorySlug}
        categoryName={category?.name ?? "Sounds"}
        categoryHref={`/pt/categories/${categorySlug}`}
        shareUrl={`${base}/${canonicalSlug}/${sound.id}`}
        localePrefix="/pt"
        locale="pt"
        isMobileDevice={isMobile}
      />
    </>
  )
}
