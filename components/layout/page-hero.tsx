"use client"

/**
 * Reusable page hero / banner - same style as home page hero section.
 * Use for /new, /trends, category pages, etc.
 */

interface PageHeroProps {
  title: string
  description: string
  children?: React.ReactNode
}

export default function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="hero-section-lcp" suppressHydrationWarning>
      <div className="hero-container-lcp">
        <div className="hero-inner-lcp">
          <h1 className="hero-title-lcp">{title}</h1>
          <p className="hero-text-lcp">{description}</p>
          {children}
        </div>
      </div>
    </section>
  )
}
