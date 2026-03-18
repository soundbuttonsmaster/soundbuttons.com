"use client"

import { usePathname } from "next/navigation"
import Header from "./header"
import Footer from "./footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEmbed = pathname?.startsWith("/embed") || pathname?.startsWith("/sound-effects/embed")

  if (isEmbed) {
    return <div className="min-h-0">{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 isolate">{children}</main>
      <Footer />
    </div>
  )
}
