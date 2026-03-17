import { SITE } from "@/lib/constants/site"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-center py-8 bg-background">
        <div className="w-full max-w-2xl px-4">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
            <p className="mb-4 text-muted-foreground">
              We care about your privacy at SoundButton. This Privacy Policy tells you how we get, use, and protect your personal information when you visit our website.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>Data we get directly from you, like your email address when you contact us.</li>
              <li>Usage data, like the pages you visit, the sounds you play, and information about your device.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">How We Use Your Data</h2>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>To give and improve our services.</li>
              <li>To answer your questions and help you with your needs.</li>
              <li>To look at how people use things and how trends change to make the experience better.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Cookies</h2>
            <p className="mb-4 text-muted-foreground">
              To make your time on our website better, we may use cookies and other similar technologies. You can change your browser settings to control cookies.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Mediavine Programmatic Advertising (Ver 1.1)</h2>
            <p className="mb-4 text-muted-foreground">
              The Website works with Mediavine to manage third-party interest-based advertising appearing on the Website. Mediavine serves content and advertisements when you visit the Website, which may use first and third-party cookies. A cookie is a small text file which is sent to your computer or mobile device (referred to in this policy as a &quot;device&quot;) by the web server so that a website can remember some information about your browsing activity on the Website.
            </p>
            <p className="mb-4 text-muted-foreground">
              First party cookies are created by the website that you are visiting. A third-party cookie is frequently used in behavioral advertising and analytics and is created by a domain other than the website you are visiting. Third-party cookies, tags, pixels, beacons and other similar technologies (collectively, &quot;Tags&quot;) may be placed on the Website to monitor interaction with advertising content and to target and optimize advertising. Each internet browser has functionality so that you can block both first and third-party cookies and clear your browser&apos;s cache. The &quot;help&quot; feature of the menu bar on most browsers will tell you how to stop accepting new cookies, how to receive notification of new cookies, how to disable existing cookies and how to clear your browser&apos;s cache. For more information about cookies and how to disable them, you can consult the information at{" "}
              <a href="https://allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">All About Cookies</a>.
            </p>
            <p className="mb-4 text-muted-foreground">
              Without cookies you may not be able to take full advantage of the Website content and features. Please note that rejecting cookies does not mean that you will no longer see ads when you visit our Site. In the event you opt-out, you will still see non-personalized advertisements on the Website.
            </p>
            <p className="mb-2 text-muted-foreground">
              The Website collects the following data using a cookie when serving personalized ads:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>IP Address</li>
              <li>Operating System type</li>
              <li>Operating System version</li>
              <li>Device Type</li>
              <li>Language of the website</li>
              <li>Web browser type</li>
              <li>Email (in hashed form)</li>
            </ul>
            <p className="mb-4 text-muted-foreground">
              Mediavine Partners (companies listed below with whom Mediavine shares data) may also use this data to link to other end user information the partner has independently collected to deliver targeted advertisements. Mediavine Partners may also separately collect data about end users from other sources, such as advertising IDs or pixels, and link that data to data collected from Mediavine publishers in order to provide interest-based advertising across your online experience, including devices, browsers and apps. This data includes usage data, cookie information, device information, information about interactions between users and advertisements and websites, geolocation data, traffic data, and information about a visitor&apos;s referral source to a particular website. Mediavine Partners may also create unique IDs to create audience segments, which are used to provide targeted advertising.
            </p>
            <p className="mb-4 text-muted-foreground">
              If you would like more information about this practice and to know your choices to opt-in or opt-out of this data collection, please visit{" "}
              <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">National Advertising Initiative opt out page</a>. You may also visit{" "}
              <a href="https://youradchoices.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">Digital Advertising Alliance website</a> and{" "}
              <a href="https://networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">Network Advertising Initiative website</a> to learn more information about interest-based advertising. You may download the AppChoices app at{" "}
              <a href="https://youradchoices.com/appchoices" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">Digital Advertising Alliance&apos;s AppChoices app</a> to opt out in connection with mobile apps, or use the platform controls on your mobile device to opt out.
            </p>
            <p className="mb-4 text-muted-foreground">
              For specific information about Mediavine Partners, the data each collects and their data collection and privacy policies, please visit{" "}
              <a href="https://www.mediavine.com/mediavine-partners" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">Mediavine Partners</a>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Services from Other Companies</h2>
            <p className="mb-4 text-muted-foreground">
              We might use services from other companies to collect, track, and analyze usage data. Each of these services has its own rules about privacy.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Your Rights</h2>
            <p className="mb-4 text-muted-foreground">
              You have the right to see, change, or delete your personal information. To use these rights, please email us at{" "}
              <a href={`mailto:${SITE.email}`} className="text-primary underline hover:opacity-80">
                {SITE.email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">Get in Touch with Us</h2>
            <p className="text-muted-foreground">
              Please email us at{" "}
              <a href={`mailto:${SITE.email}`} className="text-primary underline hover:opacity-80">
                {SITE.email}
              </a>{" "}
              if you have any questions about this Privacy Policy.
            </p>
          </div>
      </div>
  )
}
