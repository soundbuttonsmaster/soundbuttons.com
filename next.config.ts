import type { NextConfig } from "next";

/** Paths that exist only in English (no es/pt/fr versions). Redirect locale-prefixed URLs to English. */
const NON_LOCALIZED_PATHS = [
  "register",
  "login",
  "profile",
  "play-random",
  "upload-sound",
  "create-sound",
  "favorites",
  "my-soundboard",
  "soundboard",
  "text-to-sound",
  "games",
  "blog",
  "about-us",
  "contact-us",
  "privacy-policy",
  "terms-of-use",
  "kids-soundboard",
  "meme-soundboard",
  "sound-effects",
  "reviews",
  "sitemap",
  "sound-buttons-unblocked",
  "sound-buttons-unblocked-for-school",
  "reset-password",
  "forgot-password",
] as const;

const LOCALES = ["es", "pt", "fr"] as const;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    const redirects: { source: string; destination: string; permanent: boolean }[] = [
      { source: "/ads.txt", destination: "https://adstxt.mediavine.com/sites/sound-buttons/ads.txt", permanent: false },
    ];
    for (const locale of LOCALES) {
      for (const path of NON_LOCALIZED_PATHS) {
        redirects.push({
          source: `/${locale}/${path}`,
          destination: `/${path}`,
          permanent: false,
        });
        redirects.push({
          source: `/${locale}/${path}/:path*`,
          destination: `/${path}/:path*`,
          permanent: false,
        });
      }
    }
    return redirects;
  },
};

export default nextConfig;
