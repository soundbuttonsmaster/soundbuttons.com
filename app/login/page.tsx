import { SITE } from "@/lib/constants/site"
import { Suspense } from "react"
import LoginClient from "./LoginClient"

const BASE = SITE.baseUrl

export default function LoginPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "login", item: `${BASE}/login` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center">Loading...</div>}>
        <LoginClient />
      </Suspense>
    </>
  )
}
