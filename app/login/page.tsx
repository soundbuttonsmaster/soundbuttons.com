import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "login",
        item: "https://soundbuttons.com/login",
      },
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
