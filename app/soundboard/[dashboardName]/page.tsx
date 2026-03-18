import { headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import PageHero from "@/components/layout/page-hero"
import SoundboardDashboardClient from "./SoundboardDashboardClient"
import {
  getPublicDashboards,
  getDashboardSounds,
  slugifyDashboardName,
  type PublicDashboard,
} from "@/lib/api/dashboards"
import type { ProcessedSound } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

export const revalidate = 300
export const dynamicParams = true

const BASE = SITE.baseUrl

type Props = { params: Promise<{ dashboardName: string }> }

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dashboardName } = await params
  const dashboards = await getPublicDashboards()
  const dashboard = dashboards.find(
    (d) => slugifyDashboardName(d.name) === dashboardName.toLowerCase()
  )
  if (!dashboard) {
    return { title: { absolute: "Dashboard Not Found | SoundButtons.com" } }
  }
  const title = `${dashboard.name} - ${dashboard.category?.categoryName ?? "Soundboard"} | SoundButtons.com`
  const slug = slugifyDashboardName(dashboard.name)
  const canonicalUrl = `${BASE}/soundboard/${slug}`
  const description = `Play ${dashboard.name} soundboard with ${dashboard.sound_ids?.length ?? 0} sound effects. ${dashboard.category?.categoryName ?? ""} soundboard buttons - free to play and download!`

  const ogImageUrl = `${BASE}/soundboard/${slug}/opengraph-image`

  return {
    title: { absolute: title },
    description,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: dashboard.name,
          secureUrl: ogImageUrl,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function SoundboardDashboardPage({ params }: Props) {
  const { dashboardName } = await params
  const dashboards = await getPublicDashboards()
  const targetDashboard = dashboards.find(
    (d) => slugifyDashboardName(d.name) === dashboardName.toLowerCase()
  )

  if (!targetDashboard) {
    notFound()
  }

  let sounds: ProcessedSound[] = []
  if (
    targetDashboard.sound_ids &&
    targetDashboard.sound_ids.length > 0
  ) {
    sounds = await getDashboardSounds(
      targetDashboard.id,
      targetDashboard.sound_ids
    )
  }

  const dashboard: PublicDashboard & { sounds: ProcessedSound[] } = {
    ...targetDashboard,
    sounds,
  }

  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "soundboard", item: `${BASE}/soundboard` },
              {
                "@type": "ListItem",
                position: 3,
                name: dashboard.name,
                item: `${BASE}/soundboard/${slugifyDashboardName(dashboard.name)}`,
              },
            ],
          }),
        }}
      />
      <PageHero
        title={dashboard.name}
        description={`${dashboard.category?.categoryName ?? "Soundboard"} • ${dashboard.sounds.length} sound effects. Play, download, and share ${dashboard.name} buttons - completely free!`}
      />
      <SoundboardDashboardClient
        dashboard={dashboard}
        initialSounds={dashboard.sounds.map(toSound)}
        isMobileDevice={isMobile}
      />
    </>
  )
}
