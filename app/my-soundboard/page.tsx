import { SITE } from "@/lib/constants/site"
import MySoundboardClient from "./MySoundboardClient"

const BASE = SITE.baseUrl

export default function MySoundboardPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "my-soundboard", item: `${BASE}/my-soundboard` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MySoundboardClient />
    </>
  )
}
