"use client"

import Link from "next/link"
import { getStrings } from "@/lib/i18n/strings"
import type { Locale } from "@/lib/i18n/strings"

const linkClass = "text-primary underline underline-offset-2 hover:opacity-80"

interface AboutContentProps {
  locale?: Locale
}

const localePaths: Record<Locale, string> = {
  en: "",
  es: "/es",
  pt: "/pt",
  fr: "/fr",
}

export default function AboutContent({ locale = "en" }: AboutContentProps) {
  const about = getStrings(locale).about
  const ac = getStrings(locale).aboutContent
  const localePrefix = localePaths[locale]

  return (
    <article className="w-full max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14 bg-background">
      <hr className="mb-10 sm:mb-8 border-border" />

      {/* Language switcher */}
      <div className="mb-6 sm:mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{ac.readIn}</span>
        <Link href="/#introduction" className={linkClass}>
          {ac.langEn}
        </Link>
        <span aria-hidden>|</span>
        <Link href="/es#introduction" className={linkClass}>
          {ac.langEs}
        </Link>
        <span aria-hidden>|</span>
        <Link href="/pt#introduction" className={linkClass}>
          {ac.langPt}
        </Link>
        <span aria-hidden>|</span>
        <Link href="/fr#introduction" className={linkClass}>
          {ac.langFr}
        </Link>
      </div>

      <h2
        id="introduction"
        className="text-xl sm:text-3xl font-bold mb-6 sm:mb-4 text-foreground scroll-mt-20 leading-tight"
      >
        {ac.mainTitle}
      </h2>

      <nav
        className="mb-10 sm:mb-8 pb-8 sm:pb-6 border-b border-border"
        aria-label={ac.tableOfContents}
      >
        <h3 className="text-lg sm:text-2xl font-bold mb-5 sm:mb-4 text-foreground">
          {ac.tableOfContents}
        </h3>
        <ol className="space-y-3 sm:space-y-2 text-[15px] sm:text-base text-muted-foreground list-decimal list-outside ml-0 sm:ml-2 pl-5 sm:pl-6">
          <li className="pl-1">
            <Link href="#introduction" className={linkClass}>
              {ac.tocIntroduction}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#what-are-sound-buttons" className={linkClass}>
              {ac.tocWhatAreSoundButtons}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#what-you-get" className={linkClass}>
              {ac.tocWhatYouGet}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#quality-sounds" className={linkClass}>
              {ac.tocQualitySounds}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#works-everywhere" className={linkClass}>
              {ac.tocWorksEverywhere}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#easy-to-use" className={linkClass}>
              {ac.tocEasyToUse}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#organization" className={linkClass}>
              {ac.tocOrganization}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#meme-soundboard" className={linkClass}>
              {ac.tocMemeSoundboard}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#streamers" className={linkClass}>
              {ac.tocStreamers}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#discord" className={linkClass}>
              {ac.tocDiscord}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#how-it-works" className={linkClass}>
              {ac.tocHowItWorks}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#why-exists" className={linkClass}>
              {ac.tocWhyExists}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#faq" className={linkClass}>
              {ac.tocFaq}
            </Link>
          </li>
          <li className="pl-1">
            <Link href="#about-author" className={linkClass}>
              {ac.tocAboutContact}
            </Link>
          </li>
        </ol>
      </nav>

      <p className="text-[15px] sm:text-lg text-muted-foreground mb-5 sm:mb-4 leading-[1.7] sm:leading-relaxed">
        {ac.welcomeBefore}
        <Link href={`${localePrefix}/categories/memes`} className={linkClass}>
          {ac.linkMemeSounds}
        </Link>
        {ac.welcomeAfter}
      </p>
      <p className="text-[15px] sm:text-lg text-muted-foreground mb-8 sm:mb-6 leading-[1.7] sm:leading-relaxed">
        {ac.welcomeParagraph2}
      </p>

      <section id="what-are-sound-buttons" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.whatAreSoundButtonsTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.whatAreSoundButtonsPart1}
          <Link href={`${localePrefix}/categories/memes`} className={linkClass}>
            {ac.linkMemeSoundButtons}
          </Link>
          {ac.whatAreSoundButtonsPart2}
          <Link href={`${localePrefix}/categories/laugh`} className={linkClass}>
            {ac.linkFunnySoundButtons}
          </Link>
          {ac.whatAreSoundButtonsPart3}
          <Link href={`${localePrefix}/categories/sound-effects`} className={linkClass}>
            {ac.linkSoundEffects}
          </Link>
          {ac.whatAreSoundButtonsPart4}
          <Link href={`${localePrefix}/trends`} className={linkClass}>
            {ac.linkTrendingSoundButtons}
          </Link>
          {ac.whatAreSoundButtonsPart5}
          <Link href={`${localePrefix}/categories/games`} className={linkClass}>
            {ac.linkContentCreators}
          </Link>
          {ac.whatAreSoundButtonsPart6}
        </p>
      </section>

      <section id="what-you-get" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.whatYouGetTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.whatYouGetPart1}
          <Link href={`${localePrefix}/trends`} className={linkClass}>
            {ac.linkTrendingSoundButtons2}
          </Link>
          {ac.whatYouGetPart2}
        </p>
      </section>

      <section id="quality-sounds" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.qualitySoundsTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.qualitySoundsPart1}
          <Link href={`${localePrefix}/categories/memes`} className={linkClass}>
            {ac.linkMemeButtons}
          </Link>
          {ac.qualitySoundsPart2}
        </p>
      </section>

      <section id="works-everywhere" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.worksEverywhereTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.worksEverywherePart1}
          <Link href={`${localePrefix}/play-random`} className={linkClass}>
            {ac.linkSoundboardUnblocked}
          </Link>
          {ac.worksEverywherePart2}
        </p>
      </section>

      <section id="easy-to-use" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.easyToUseTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.easyToUseContent}
        </p>
      </section>

      <section id="organization" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.organizationTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          {ac.organizationIntro}
        </p>
        <ul className="list-disc list-outside space-y-3 sm:space-y-1.5 text-[15px] sm:text-base text-muted-foreground pl-5 sm:pl-4">
          <li className="pl-1">
            <Link href={`${localePrefix}/categories/memes`} className={linkClass}>
              {ac.linkMemeSection}
            </Link>
            {ac.organizationMemeDesc}
          </li>
          <li className="pl-1">
            <Link href={`${localePrefix}/categories/laugh`} className={linkClass}>
              {ac.linkFunnyStuff}
            </Link>
            {ac.organizationFunnyDesc}
          </li>
          <li className="pl-1">
            <Link href={`${localePrefix}/categories/games`} className={linkClass}>
              {ac.linkGamingSounds}
            </Link>
            {ac.organizationGamingDesc}
          </li>
          <li className="pl-1">
            <Link href={`${localePrefix}/categories/movies`} className={linkClass}>
              {ac.linkMovieTvClips}
            </Link>
            {ac.organizationMovieDesc}
          </li>
          <li className="pl-1">
            <Link href={`${localePrefix}/categories/sound-effects`} className={linkClass}>
              {ac.linkSoundEffects2}
            </Link>
            {ac.organizationEffectsDesc}
          </li>
        </ul>
      </section>

      <section id="meme-soundboard" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.memeSoundboardTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          {ac.memeSoundboardPart1}
          <Link href={`${localePrefix}/categories/memes`} className={linkClass}>
            {ac.linkMemeSoundboard}
          </Link>
          {ac.memeSoundboardPart2}
          <Link href={`${localePrefix}/play-random`} className={linkClass}>
            {ac.linkMemeSoundboard2}
          </Link>
          {ac.memeSoundboardPart3}
        </p>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.memeSoundboardPart4}
        </p>
      </section>

      <section id="streamers" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.streamersTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.streamersPart1}
          <Link href={`${localePrefix}/new`} className={linkClass}>
            {ac.linkMemeButtons2}
          </Link>
          {ac.streamersPart2}
        </p>
      </section>

      <section id="discord" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.discordTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.discordContent}
        </p>
      </section>

      <section id="how-it-works" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.howItWorksTitle}
        </h3>
        <ol className="list-decimal list-outside space-y-3 sm:space-y-1.5 text-[15px] sm:text-base text-muted-foreground pl-5 sm:pl-4">
          <li className="pl-1">
            <strong>{ac.howItWorksStep1Label}</strong>{" "}
            <Link href={`${localePrefix}/categories/sound-effects`} className={linkClass}>
              {ac.linkBrowseCategories}
            </Link>
            {ac.howItWorksStep1Rest}
          </li>
          <li className="pl-1">
            <strong>{ac.howItWorksStep2Label}</strong>
            {ac.howItWorksStep2Rest}
          </li>
          <li className="pl-1">
            <strong>{ac.howItWorksStep3Label}</strong>
            {ac.howItWorksStep3Rest}
          </li>
        </ol>
      </section>

      <section id="why-exists" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          {ac.whyExistsTitle}
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          {ac.whyExistsParagraph1}
        </p>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          {ac.whyExistsParagraph2}
        </p>
      </section>

      <section id="faq" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-3 text-foreground">
          {ac.faqTitle}
        </h3>
        <div className="space-y-6 sm:space-y-3">
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">
              {ac.faq1Question}
            </h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              {ac.faq1Answer}
            </p>
          </div>
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">
              {ac.faq2Question}
            </h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              {ac.faq2Answer}
            </p>
          </div>
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">
              {ac.faq3Question}
            </h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              {ac.faq3Answer}
            </p>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">
              {ac.faq4Question}
            </h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              {ac.faq4Answer}
            </p>
          </div>
        </div>
      </section>

      <section
        id="about-author"
        className="mb-10 sm:mb-8 scroll-mt-20 mt-14 sm:mt-12 pt-10 sm:pt-8 border-t border-border"
      >
        <h2 className="text-xl sm:text-3xl font-bold mb-8 sm:mb-6 text-foreground">
          {about.aboutTitle}
        </h2>

        <div className="space-y-10 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-3 text-foreground">
              {about.authorCreator}
            </h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              <strong>{ac.founderLabel}</strong>
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
              {about.whyStartedTitle}
            </h3>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              {ac.whyStartedP1}
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              {ac.whyStartedP2}
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              {ac.whyStartedP3}
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              {ac.whyStartedP4}
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
              {about.contactInfoTitle}
            </h3>
            <div className="space-y-3 sm:space-y-2 text-[15px] sm:text-base text-muted-foreground">
              <p className="leading-[1.7]">
                <strong>{ac.emailLabel}</strong>{" "}
                <a href="mailto:play@soundbuttons.com" className={linkClass}>
                  play@soundbuttons.com
                </a>
              </p>
              <p className="leading-[1.7]">
                <strong>{ac.phoneLabel}</strong>{" "}
                <a href="tel:+1-555-847-2638" className={linkClass}>
                  +1 (555) 847-2638
                </a>
              </p>
              <p className="leading-[1.7]">
                <strong>{ac.addressLabel}</strong> {ac.addressValue}
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="text-[15px] sm:text-lg text-muted-foreground mt-8 sm:mt-6 leading-[1.7] sm:leading-relaxed">
        {ac.finalPart1}
        <Link href={`${localePrefix}/trends`} className={linkClass}>
          {ac.linkCheckOutCollection}
        </Link>
        {ac.finalPart2}
      </p>
    </article>
  )
}
