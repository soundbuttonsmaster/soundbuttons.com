"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { getStrings, getLocaleFromPathname } from "@/lib/i18n/strings"
import { getLocalizedHref } from "@/lib/i18n/paths"
import { Mail, Heart, Music, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"

const FOOTER_CATEGORIES = getTopLevelCategories().slice(0, 8)

export default function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname ?? "")
  const f = getStrings(locale).footer

  return (
    <footer className="bg-[rgb(15,23,42)] text-white pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {/* Why Choose & Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/20 pb-2">
              {f.whyChoose}
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              {f.whyChooseParagraph}
            </p>
            <div className="mb-2">
              <a
                href="https://play.google.com/store/apps/details?id=soundbuttons.com.meme.soundboard.sound.effects"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm"
                aria-label={f.downloadAppGoogle}
              >
                {f.downloadAppGoogle}
              </a>
            </div>
            <div className="mb-4">
              <a
                href="https://apps.apple.com/in/app/soundbutttons-com-soundboard/id6756041397"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm"
                aria-label={f.downloadAppApple}
              >
                {f.downloadAppApple}
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail size={16} />
              <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors text-sm">
                {SITE.email}
              </a>
            </div>
          </div>

          {/* Special Pages */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/20 pb-2">
              {f.specialPages}
            </h3>
            <ul className="space-y-2">
              <li><Link href={getLocalizedHref("/", locale)} className="text-gray-300 hover:text-white transition-colors">{f.home}</Link></li>
              <li><Link href={getLocalizedHref("/sound-buttons-unblocked", locale)} className="text-gray-300 hover:text-white transition-colors">{f.soundButtonsUnblocked}</Link></li>
              <li><Link href={getLocalizedHref("/sound-buttons-unblocked-for-school", locale)} className="text-gray-300 hover:text-white transition-colors">{f.soundButtonsForSchool}</Link></li>
              <li><Link href={getLocalizedHref("/soundboard", locale)} className="text-gray-300 hover:text-white transition-colors">{f.soundboard}</Link></li>
              <li><Link href={getLocalizedHref("/text-to-sound", locale)} className="text-gray-300 hover:text-white transition-colors">{f.textToSound}</Link></li>
              <li><Link href={getLocalizedHref("/create-sound", locale)} className="text-gray-300 hover:text-white transition-colors">{f.createSound}</Link></li>
              <li><Link href={getLocalizedHref("/play-random", locale)} className="text-gray-300 hover:text-white transition-colors">{f.playRandom}</Link></li>
              <li><Link href={getLocalizedHref("/new", locale)} className="text-gray-300 hover:text-white transition-colors">{f.newSoundButtons}</Link></li>
              <li><Link href={getLocalizedHref("/trends", locale)} className="text-gray-300 hover:text-white transition-colors">{f.trending}</Link></li>
              <li><Link href={getLocalizedHref("/reviews", locale)} className="text-gray-300 hover:text-white transition-colors">{f.userReviews}</Link></li>
              <li><Link href={getLocalizedHref("/kids-soundboard", locale)} className="text-gray-300 hover:text-white transition-colors">{f.kidsSoundboard}</Link></li>
              <li><Link href={getLocalizedHref("/sound-effects", locale)} className="text-gray-300 hover:text-white transition-colors">{f.soundEffects}</Link></li>
              <li><Link href={getLocalizedHref("/login", locale)} className="text-gray-300 hover:text-white transition-colors">{f.signIn}</Link></li>
              <li><Link href={getLocalizedHref("/register", locale)} className="text-gray-300 hover:text-white transition-colors">{f.createAccount}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/20 pb-2">
              {f.categories}
            </h3>
            <ul className="space-y-2">
              {FOOTER_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    href={getLocalizedHref(`/categories/${category.slug}`, locale)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={getLocalizedHref("/categories", locale)} className="text-white hover:text-gray-300 transition-colors font-medium">
                  {f.viewAllCategories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/20 pb-2">
              {f.support}
            </h3>
            <ul className="space-y-2">
              <li><Link href={getLocalizedHref("/about-us", locale)} className="text-gray-300 hover:text-white transition-colors">{f.aboutUs}</Link></li>
              <li><Link href={getLocalizedHref("/contact-us", locale)} className="text-gray-300 hover:text-white transition-colors">{f.contactUs}</Link></li>
              <li><Link href={getLocalizedHref("/privacy-policy", locale)} className="text-gray-300 hover:text-white transition-colors">{f.privacyPolicy}</Link></li>
              <li><Link href={getLocalizedHref("/terms-of-use", locale)} className="text-gray-300 hover:text-white transition-colors">{f.termsOfUse}</Link></li>
              <li><Link href={getLocalizedHref("/sitemap", locale)} className="text-gray-300 hover:text-white transition-colors">{f.siteMap}</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white border-b border-white/20 pb-2">
              {f.contactInfo}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="text-gray-300 hover:text-white transition-colors text-sm break-words">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+1-555-847-2638" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +1 (555) 847-2638
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a
            href="https://www.facebook.com/soundbuttons/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Visit our Facebook page"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://x.com/sound_buttons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Visit our X (Twitter) page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/soundbuttons_com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Visit our Instagram page"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://www.youtube.com/@SoundButtons-07"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Visit our YouTube channel"
          >
            <Youtube size={18} />
          </a>
          <a
            href="https://www.threads.com/@soundbuttons_com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Visit our Threads page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.186 8.672L18.74.19H16.668L11.105 7.933 6.617 0H0l6.846 9.327L0 19.308H2.072L8.04 11.068 12.619 19.308H19.24L12.186 8.672ZM14.741 14.78l-1.34-1.544L2.072 1.697H5.11L14.699 13.24l1.34 1.544 5.242 6.067h-3.04l-3.5-4.071Z"/>
            </svg>
          </a>
          <a
            href="https://open.spotify.com/show/3KHK8lf8sr6Y0TQ0kGnGwW"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[rgb(15,23,42)] transition-all duration-300"
            aria-label="Listen to our Spotify podcast"
          >
            <Music size={18} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-white/20 pt-6">
          <p className="text-gray-300 text-sm mb-2">
            Made with <Heart size={14} className="inline text-red-500 mx-1" /> for sound enthusiasts worldwide
          </p>
          <p className="text-white font-medium">
            &copy; {new Date().getFullYear()} SoundButtons.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
