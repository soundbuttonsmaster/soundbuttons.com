import MySoundboardClient from "./MySoundboardClient"

export default function MySoundboardPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "my-soundboard",
        item: "https://soundbuttons.com/my-soundboard",
      },
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
