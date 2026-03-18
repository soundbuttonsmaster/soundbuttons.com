import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/constants/site";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { PwaProvider } from "@/components/pwa/PwaProvider";
import ConditionalLayout from "@/components/layout/conditional-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sound Buttons - 9,99,999+ Meme Soundboard Unblocked",
    template: "%s | SoundButtons.com",
  },
  description:
    "Free sound effects and soundboard. Play, share, and download sound buttons.",
  metadataBase: new URL(SITE.baseUrl),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
  },
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#e53935",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mediavine ads - load first on every page */}
        <script
          type="text/javascript"
          async
          data-noptimize="1"
          data-cfasync="false"
          src="//scripts.mediavine.com/tags/sound-buttons.js"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google tag (gtag.js) - loaded client-side to avoid hydration mismatches */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7JTM90LHN4"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7JTM90LHN4');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PwaProvider />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
