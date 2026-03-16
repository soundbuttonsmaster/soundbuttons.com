import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { getSoundDetailPath } from "@/lib/utils/slug"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const base = SITE.baseUrl
  const { data: sounds } = await apiClient.getNewSounds(1, 30)

  const items = sounds
    .map((s) => {
      const path = getSoundDetailPath(s.name, s.id)
      const link = `${base}${path}`
      const title = escapeXml(s.name)
      const description = escapeXml(`Play ${s.name} - new sound button on SoundButtons.com`)
      return `<item>
  <title>${title}</title>
  <link>${escapeXml(link)}</link>
  <description>${description}</description>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
</item>`
    })
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>New Sound Buttons - SoundButtons.com</title>
    <link>${escapeXml(base)}/new</link>
    <description>Latest sound buttons added to SoundButtons.com. Play, download, and share new meme sounds and sound effects.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(base)}/api/rss/new-sounds" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
