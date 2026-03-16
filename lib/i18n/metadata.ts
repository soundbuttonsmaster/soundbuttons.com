/**
 * Localized metadata (title, description) for SEO per route and locale.
 * Used by app/[locale]/... pages to keep titles/descriptions in sync with the old site.
 */

import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export type Locale = "en" | "es" | "pt" | "fr"

const localeBases: Record<Locale, string> = {
  en: BASE,
  es: `${BASE}/es`,
  pt: `${BASE}/pt`,
  fr: `${BASE}/fr`,
}

const meta: Record<
  Locale,
  Record<
    string,
    { title: string; description: string }
  >
> = {
  en: {
    home: {
      title: "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked",
      description:
        "Play thousands of sound buttons with the best meme soundboard, buttons, prank, funny sound effect, and high-quality audio in unblocked soundboards.",
    },
    new: {
      title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
      description:
        "Discover the latest sound buttons and soundboard with fresh, trending audio clips updated daily to play, download, and share for memes, gaming, and entertainment!",
    },
    trends: {
      title: "Trending Sound Buttons & Viral Meme Soundboard",
      description:
        "Discover the most popular trending sound buttons and viral meme soundboard and sound effects on SoundButtons.com.",
    },
    categories: {
      title: "Sound Button Categories – Browse All | SoundButtons.com",
      description:
        "Browse all sound button categories on SoundButtons.com! From memes to music, gaming to comedy, find and explore thousands of organized sound effects.",
    },
    search: {
      title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | SoundButtons.com",
      description:
        "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
    },
    soundDetail: {
      title: "Sound Button - Play & Download | SoundButtons.com",
      description: "Play and download this sound button. Free meme soundboard and sound effects.",
    },
  },
  es: {
    home: {
      title: "Sound Buttons - Meme Soundboard y Efectos de Sonido | SoundButtons.com",
      description:
        "Reproduce miles de botones de sonido con el mejor meme soundboard, efectos de sonido y audio de alta calidad. Soundboard desbloqueado.",
    },
    new: {
      title: "Nuevos Sound Buttons - Meme Soundboard Actualizado | SoundButtons.com",
      description:
        "Descubre los últimos sound buttons y soundboard con clips de audio nuevos y tendencias. Reproduce, descarga y comparte para memes, gaming y entretenimiento.",
    },
    trends: {
      title: "Sound Buttons en Tendencia - Meme Soundboard Viral | SoundButtons.com",
      description:
        "Descubre los sound buttons y meme soundboard más populares y virales en SoundButtons.com.",
    },
    categories: {
      title: "Categorías de Sound Buttons - Explorar Todas | SoundButtons.com",
      description:
        "Explora todas las categorías de sound buttons en SoundButtons.com. Desde memes hasta música, gaming y comedia.",
    },
    search: {
      title: "Buscar Sound Buttons - Efectos de Sonido y Meme Soundboard | SoundButtons.com",
      description:
        "Busca en nuestra colección de sound buttons, efectos de sonido y memes. Encuentra el sonido perfecto para tus videos, memes y streams.",
    },
    soundDetail: {
      title: "Sound Button - Reproducir y Descargar | SoundButtons.com",
      description: "Reproduce y descarga este sound button. Meme soundboard y efectos de sonido gratis.",
    },
  },
  pt: {
    home: {
      title: "Sound Buttons - Meme Soundboard e Efeitos Sonoros | SoundButtons.com",
      description:
        "Toque milhares de botões de som com o melhor meme soundboard, efeitos sonoros e áudio de alta qualidade. Soundboard desbloqueado.",
    },
    new: {
      title: "Novos Sound Buttons - Meme Soundboard Atualizado | SoundButtons.com",
      description:
        "Descubra os mais recentes sound buttons e soundboard com clipes de áudio novos e tendências. Reproduza, baixe e compartilhe para memes, gaming e entretenimento.",
    },
    trends: {
      title: "Sound Buttons em Alta - Meme Soundboard Viral | SoundButtons.com",
      description:
        "Descubra os sound buttons e meme soundboard mais populares e virais no SoundButtons.com.",
    },
    categories: {
      title: "Categorias de Sound Buttons - Explorar Todas | SoundButtons.com",
      description:
        "Explore todas as categorias de sound buttons no SoundButtons.com. De memes a música, gaming e comédia.",
    },
    search: {
      title: "Pesquisar Sound Buttons - Efeitos Sonoros e Meme Soundboard | SoundButtons.com",
      description:
        "Pesquise nossa coleção de sound buttons, efeitos sonoros e memes. Encontre o som perfeito para seus vídeos, memes e streams.",
    },
    soundDetail: {
      title: "Sound Button - Reproduzir e Baixar | SoundButtons.com",
      description: "Reproduza e baixe este sound button. Meme soundboard e efeitos sonoros grátis.",
    },
  },
  fr: {
    home: {
      title: "Sound Buttons - Meme Soundboard et Effets Sonores | SoundButtons.com",
      description:
        "Jouez à des milliers de boutons sonores avec le meilleur meme soundboard, effets sonores et audio de haute qualité. Soundboard débloqué.",
    },
    new: {
      title: "Nouveaux Sound Buttons - Meme Soundboard Mis à Jour | SoundButtons.com",
      description:
        "Découvrez les derniers sound buttons et soundboard avec des clips audio frais et tendances. Jouez, téléchargez et partagez pour les memes, gaming et divertissement.",
    },
    trends: {
      title: "Sound Buttons Tendances - Meme Soundboard Viral | SoundButtons.com",
      description:
        "Découvrez les sound buttons et meme soundboard les plus populaires et viraux sur SoundButtons.com.",
    },
    categories: {
      title: "Catégories de Sound Buttons - Parcourir Toutes | SoundButtons.com",
      description:
        "Parcourez toutes les catégories de sound buttons sur SoundButtons.com. Des memes à la musique, gaming et comédie.",
    },
    search: {
      title: "Rechercher Sound Buttons - Effets Sonores et Meme Soundboard | SoundButtons.com",
      description:
        "Recherchez dans notre collection de sound buttons, effets sonores et memes. Trouvez le son parfait pour vos vidéos, memes et streams.",
    },
    soundDetail: {
      title: "Sound Button - Lire et Télécharger | SoundButtons.com",
      description: "Jouez et téléchargez ce sound button. Meme soundboard et effets sonores gratuits.",
    },
  },
}

export function getLocaleBase(locale: Locale): string {
  return localeBases[locale]
}

export function getPageMetadata(
  locale: Locale,
  route: keyof (typeof meta.en),
  pathSuffix = ""
): { title: string; description: string } {
  const m = meta[locale][route] ?? meta.en[route]
  return m ?? { title: "SoundButtons.com", description: "Sound Buttons and Meme Soundboard." }
}

export function buildLocaleMetadata(
  locale: Locale,
  route: keyof (typeof meta.en),
  pathSuffix = ""
): Metadata {
  const base = getLocaleBase(locale)
  const path = pathSuffix ? `${base}/${pathSuffix}` : (route === "home" ? base : `${base}/${route}`)
  const { title, description } = getPageMetadata(locale, route, pathSuffix)
  const canonical = path
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: locale === "en" ? BASE : `${BASE}${route === "home" ? "" : `/${route}`}`,
        es: `${BASE}/es${route === "home" ? "" : `/${route}`}`,
        pt: `${BASE}/pt${route === "home" ? "" : `/${route}`}`,
        fr: `${BASE}/fr${route === "home" ? "" : `/${route}`}`,
        "x-default": BASE,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: "Sound Buttons",
      images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: title }],
      locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      site: "@soundbuttons",
      creator: "@soundbuttons",
      title,
      description,
      images: [`${BASE}/og.png`],
    },
    robots: { index: true, follow: true },
  }
}
