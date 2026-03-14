import type { Metadata } from "next"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"

const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: "Terms of Service | SoundButtons",
  description:
    "Terms of Service for SoundButtons.com - Review the guidelines for using our sound button platform.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/terms-of-use` },
  openGraph: {
    type: "website",
    title: "Terms of Service | SoundButtons",
    description:
      "Terms of Service for SoundButtons.com - Review the guidelines for using our sound button platform.",
    url: `${BASE}/terms-of-use`,
    siteName: "SoundButtons.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | SoundButtons",
    description:
      "Terms of Service for SoundButtons.com - Review the guidelines for using our sound button platform.",
  },
}

const siteNavSchema = SITE_NAV_LINKS.map((link) => ({
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: link.name,
  url: link.url,
}))

export default function TermsOfUsePage() {
  return (
    <>
      {siteNavSchema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="py-8 px-4 flex flex-col items-center bg-background">
        <div className="prose prose-slate dark:prose-invert max-w-4xl">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Terms of Service</h1>

          <h2 className="text-xl font-semibold mb-2 text-foreground">1. Agreeing to the Terms</h2>
          <p className="mb-4 text-muted-foreground">
            Hello and welcome to SoundButtons.com. You agree to follow and be bound by the following terms and conditions when you access or use our website. Please do not use our website if you do not agree to these terms.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">2. Service Description</h2>
          <p className="mb-4 text-muted-foreground">
            SoundButtons.com is a website that lets people access and use sound buttons for different things. We offer our services &quot;as is,&quot; and we can change or stop any part of the service at any time without warning.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">3. How Users Should Act</h2>
          <p className="mb-4 text-muted-foreground">
            You agree to follow all laws and rules when you use the website. You are not allowed to use our website for illegal purposes or in any way that could harm, disable, overload, or damage it.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">4. Rights to Intellectual Property</h2>
          <p className="mb-4 text-muted-foreground">
            SoundButtons.com owns all of the content on this website, including but not limited to text, graphics, logos, and sound buttons. It is protected by copyright and other intellectual property laws. You can&apos;t copy, share, or make new works based on any of the content on this website without our written permission.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">5. No Warranties</h2>
          <p className="mb-4 text-muted-foreground">
            The website and its content are only available as they are and when they are. SoundButtons.com does not make any promises or guarantees about how the website will work or the information, content, or materials that are on it.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">6. Limiting Liability</h2>
          <p className="mb-4 text-muted-foreground">
            SoundButtons.com is not responsible for any damages that happen because you use our website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">7. Changes to the Terms</h2>
          <p className="mb-4 text-muted-foreground">
            We can change these terms at any time. Changes will take effect as soon as they are posted on the website. If you keep using the website after changes are made, that means you agree to those changes.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-foreground">8. Information on How to Get in Touch</h2>
          <p className="mb-4 text-muted-foreground">
            Please use our <a href="/contact-us" className="text-primary underline hover:opacity-80">contact page</a> to get in touch with us if you have any questions about these Terms of Service.
          </p>
        </div>
    </div>
    </>
  )
}
