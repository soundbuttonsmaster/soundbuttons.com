import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import PageHero from "@/components/layout/page-hero"
import SoundboardDashboardClient from "./SoundboardDashboardClient"
import type { ProcessedSound } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

export const revalidate = 300
export const dynamicParams = true

const PAGE_SIZE = 35
const BASE = SITE.baseUrl

function slugToCategoryName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

type Props = { params: Promise<{ dashboardName: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dashboardName } = await params
  const name = slugToCategoryName(dashboardName)
  const title = `${name} - Soundboard | SoundButtons.com`
  const canonicalUrl = `${BASE}/soundboard/${dashboardName}`

  return {
    title: { absolute: title },
    description: `Play and discover ${name} sound buttons on the SoundButtons.com soundboard.`,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: name }],
    },
    twitter: { card: "summary_large_image", title },
  }
}

function toSound(p: ProcessedSound): Sound {
  return {
    id: p.id,
    name: p.name,
    sound_file: p.sound_file,
    views: p.views,
    likes_count: p.likes_count,
    favorites_count: p.favorites_count,
    is_favorited: p.is_favorited,
    is_liked: p.is_liked,
    category_id: p.category_id,
    category_name: p.category_name,
  }
}

export default async function SoundboardDashboardPage({ params }: Props) {
  const { dashboardName } = await params
  const categoryName = slugToCategoryName(dashboardName)

  let initialSounds: ProcessedSound[] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getSoundsByCategory(categoryName, 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // allow empty dashboard
  }

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  return (
    <>
      <PageHero
        title={`${categoryName} Soundboard`}
        description={`Play and discover ${categoryName} sound buttons.`}
      />
      <SoundboardDashboardClient
        dashboardName={categoryName}
        initialSounds={initialSounds.map(toSound)}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
