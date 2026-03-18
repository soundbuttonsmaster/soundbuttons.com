import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import NewPageClient from "@/app/new/NewPageClient"

export const revalidate = 300
const PAGE_SIZE = 35

const BASE = getLocaleBase("pt")

export const metadata: Metadata = {
  title: { absolute: "Novos Botões de Som: Áudio Fresco de Meme Soundboard Atualizado Diariamente" },
  description:
    "Descubra os mais recentes botões de som e soundboard com clipes de áudio novos e em alta, atualizados diariamente para tocar, baixar e compartilhar para memes, jogos e entretenimento!",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/new`,
    languages: {
      en: `${SITE.baseUrl}/new`,
      es: `${getLocaleBase("es")}/new`,
      pt: `${BASE}/new`,
      fr: `${getLocaleBase("fr")}/new`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Novos Botões de Som: Áudio Fresco de Meme Soundboard Atualizado Diariamente",
    description:
      "Descubra os mais recentes botões de som e soundboard com clipes de áudio novos e em alta, atualizados diariamente para tocar, baixar e compartilhar para memes, jogos e entretenimento!",
    url: `${BASE}/new`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/new/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Novos Botões de Som", secureUrl: `${BASE}/new/opengraph-image` }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Novos Botões de Som: Áudio Fresco de Meme Soundboard Atualizado Diariamente",
    description:
      "Descubra os mais recentes botões de som e soundboard com clipes de áudio novos e em alta, atualizados diariamente para tocar, baixar e compartilhar para memes, jogos e entretenimento!",
    images: [`${BASE}/new/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default async function PtNewPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile = mobileHint === "?1" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const initialCount = isMobile ? 20 : 35
  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE },
      { "@type": "ListItem", position: 2, name: "new", item: `${BASE}/new` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewPageClient initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} />
    </>
  )
}
