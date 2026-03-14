"use client"

import Link from "next/link"

const linkClass = "text-primary underline underline-offset-2 hover:opacity-80"

export default function AboutContent() {
  return (
    <article className="w-full max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14 bg-background">
      <hr className="mb-10 sm:mb-8 border-border" />
      <h2 id="introduction" className="text-xl sm:text-3xl font-bold mb-6 sm:mb-4 text-foreground scroll-mt-20 leading-tight">
        SoundButtons.com: Your Daily Dose of Sound Effects Chaos - The Ultimate Meme Soundboard 2026
      </h2>

      {/* Table of Contents */}
      <nav className="mb-10 sm:mb-8 pb-8 sm:pb-6 border-b border-border" aria-label="Table of contents">
        <h3 className="text-lg sm:text-2xl font-bold mb-5 sm:mb-4 text-foreground">Table of Contents</h3>
        <ol className="space-y-3 sm:space-y-2 text-[15px] sm:text-base text-muted-foreground list-decimal list-outside ml-0 sm:ml-2 pl-5 sm:pl-6">
          <li className="pl-1"><Link href="#introduction" className={linkClass}>Introduction</Link></li>
          <li className="pl-1"><Link href="#what-are-sound-buttons" className={linkClass}>What are Sound Buttons?</Link></li>
          <li className="pl-1"><Link href="#what-you-get" className={linkClass}>What You&apos;re Actually Getting Here</Link></li>
          <li className="pl-1"><Link href="#quality-sounds" className={linkClass}>Sounds That Don&apos;t Sound Like Trash</Link></li>
          <li className="pl-1"><Link href="#works-everywhere" className={linkClass}>Works at School, Work, Wherever</Link></li>
          <li className="pl-1"><Link href="#easy-to-use" className={linkClass}>Just Click and It Plays</Link></li>
          <li className="pl-1"><Link href="#organization" className={linkClass}>How We&apos;ve Organized This</Link></li>
          <li className="pl-1"><Link href="#meme-soundboard" className={linkClass}>Meme Soundboard</Link></li>
          <li className="pl-1"><Link href="#streamers" className={linkClass}>Perfect for Streamers and Creators</Link></li>
          <li className="pl-1"><Link href="#discord" className={linkClass}>Perfect for Discord and Just Hanging Out</Link></li>
          <li className="pl-1"><Link href="#how-it-works" className={linkClass}>How This Actually Works</Link></li>
          <li className="pl-1"><Link href="#why-exists" className={linkClass}>Why This Site Exists</Link></li>
          <li className="pl-1"><Link href="#faq" className={linkClass}>Frequently Asked Questions</Link></li>
          <li className="pl-1"><Link href="#about-author" className={linkClass}>About SoundButtons.com & Contact</Link></li>
        </ol>
      </nav>

      <p className="text-[15px] sm:text-lg text-muted-foreground mb-5 sm:mb-4 leading-[1.7] sm:leading-relaxed">
        Welcome to SoundButtons.com! Whether you&apos;re searching for that perfect Vine boom for your Discord server or need a soundboard that actually works at school, you&apos;ve found the right place. Thousands of people have made this their go-to spot for <Link href="/categories/memes" className={linkClass}>meme sounds</Link> and funny audio clips.
      </p>
      <p className="text-[15px] sm:text-lg text-muted-foreground mb-8 sm:mb-6 leading-[1.7] sm:leading-relaxed">
        We built this site because we got tired of soundboards that are blocked, full of garbage quality sounds, or so cluttered you can&apos;t find anything. So we fixed all that stuff.
      </p>

      <section id="what-are-sound-buttons" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          What are Sound Buttons?
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          Sound buttons are interactive clickable buttons that play audio clips instantly when you click them - no downloads or installations needed. On SoundButtons.com, we offer the largest collection of free <Link href="/categories/memes" className={linkClass}>meme sound buttons</Link>, <Link href="/categories/laugh" className={linkClass}>funny sound buttons</Link>, <Link href="/categories/sound-effects" className={linkClass}>sound effects</Link>, and <Link href="/trends" className={linkClass}>trending sound buttons</Link>. Our sound buttons work instantly in any browser on computers, phones, tablets, and even at school where other sites might be blocked. Perfect for <Link href="/categories/games" className={linkClass}>content creators</Link>, streamers, students, and anyone who wants instant access to quality audio clips - all completely free with no registration required.
        </p>
      </section>

      <section id="what-you-get" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          What You&apos;re Actually Getting Here
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          We&apos;ve built up a massive collection of <Link href="/trends" className={linkClass}>trending sound buttons</Link> over the past couple years. Everything from classic meme soundboard clips to that weird sound effect you heard on TikTok last week. The whole thing works in your browser no downloads, ever.
        </p>
      </section>

      <section id="quality-sounds" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Sounds That Don&apos;t Sound Like Trash
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          Every single sound is clean audio. We actually listen to stuff before adding it. If it sounds muffled or the levels are all over the place, it doesn&apos;t make the cut. We&apos;ve got your standard <Link href="/categories/memes" className={linkClass}>meme buttons</Link>, and we also dig through the internet constantly looking for new trending sounds. When something goes viral, we usually have it up within a few days.
        </p>
      </section>

      <section id="works-everywhere" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Works at School, Work, Wherever
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          This is probably the main reason most people stick around. Our site works on restricted networks. We spent a lot of time testing this on different networks because getting blocked is incredibly annoying. This is a proper <Link href="/play-random" className={linkClass}>soundboard unblocked</Link> that you can actually rely on.
        </p>
      </section>

      <section id="easy-to-use" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Just Click and It Plays
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          No signup forms. No email verification. No &quot;watch this ad first&quot; nonsense. You see a sound you want, you click it, it plays immediately. Want to use sounds on your phone? Works great. Tablet? Yep. Your ancient laptop from 2015? Probably fine.
        </p>
      </section>

      <section id="organization" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          How We&apos;ve Organized This
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          With thousands of sounds, organization matters. Browse by category:
        </p>
        <ul className="list-disc list-outside space-y-3 sm:space-y-1.5 text-[15px] sm:text-base text-muted-foreground pl-5 sm:pl-4">
          <li className="pl-1"><Link href="/categories/memes" className={linkClass}>The Meme Section</Link> — Every meme soundboard clip you&apos;ve ever wanted</li>
          <li className="pl-1"><Link href="/categories/laugh" className={linkClass}>Funny Stuff</Link> — Designed for making your friends crack up</li>
          <li className="pl-1"><Link href="/categories/games" className={linkClass}>Gaming Sounds</Link> — Iconic sounds from popular games</li>
          <li className="pl-1"><Link href="/categories/movies" className={linkClass}>Movie and TV Clips</Link> — Famous quotes and dramatic moments</li>
          <li className="pl-1"><Link href="/categories/sound-effects" className={linkClass}>Sound Effects</Link> — Professional tones and effects for alerts</li>
        </ul>
      </section>

      <section id="meme-soundboard" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Meme Soundboard
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          Our <Link href="/categories/memes" className={linkClass}>meme soundboard</Link> is the heart of SoundButtons.com. It&apos;s where every meme soundboard clip you&apos;ve ever wanted lives. From classic Vine booms to the latest TikTok trends, our meme soundboard collection is constantly updated with the most viral sounds. Whether you&apos;re looking for reaction sounds, funny clips, or that perfect meme button for your Discord server, our <Link href="/play-random" className={linkClass}>meme soundboard</Link> has you covered.
        </p>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          What makes our meme soundboard special? Every sound is hand-picked for quality and relevance. We don&apos;t just dump random audio files we curate the best meme sounds that people actually want to use. When a new meme goes viral, we&apos;re usually one of the first to have it available on our meme soundboard. Plus, our meme soundboard works everywhere, even on restricted networks, making it the perfect unblocked meme soundboard for school, work, or anywhere else.
        </p>
      </section>

      <section id="streamers" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Perfect for Streamers and Creators
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          Every sound button here is broadcast quality. These are clean, properly leveled, well edited clips that won&apos;t make your stream sound amateur. We try to stay on top of trends, adding new <Link href="/new" className={linkClass}>meme buttons</Link> pretty much every week. Our search actually works well (use the search bar at the top), and you can save favorites for quick access.
        </p>
      </section>

      <section id="discord" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Perfect for Discord and Just Hanging Out
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          Playing sounds through Discord is super easy. You can trigger them through your mic or share links to specific sounds. Whether it&apos;s gaming with friends or just hanging out in voice chat, having instant access to thousands of funny sounds changes the vibe entirely.
        </p>
      </section>

      <section id="how-it-works" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          How This Actually Works
        </h3>
        <ol className="list-decimal list-outside space-y-3 sm:space-y-1.5 text-[15px] sm:text-base text-muted-foreground pl-5 sm:pl-4">
          <li className="pl-1"><strong>Find what you want:</strong> Either <Link href="/categories/sound-effects" className={linkClass}>browse categories</Link> or use the search bar above to find something specific.</li>
          <li className="pl-1"><strong>Click it:</strong> The sound plays immediately. No loading, no buffering, no annoying delays.</li>
          <li className="pl-1"><strong>Save the good ones:</strong> Click the heart icon on sounds you love and they get saved to your favorites.</li>
        </ol>
      </section>

      <section id="why-exists" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
          Why This Site Exists
        </h3>
        <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-[1.7] sm:leading-relaxed">
          Most soundboard sites are either blocked everywhere or they&apos;re full of random garbage people uploaded. We wanted something different. Something that actually worked reliably and only had genuinely good sounds. We&apos;re not exaggerating about the unblocked thing we&apos;ve tested this on school networks, corporate WiFi, public library computers, everywhere we could think of.
        </p>
        <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
          We don&apos;t let anyone upload anything. Every single sound gets checked by our team first. Is the audio clean? Is it something people would actually use? Does it fit our collection? If the answer to any of those is no, it doesn&apos;t go up. This keeps the quality consistent and the library actually useful instead of cluttered.
        </p>
      </section>

      <section id="faq" className="mb-10 sm:mb-8 scroll-mt-20">
        <h3 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-3 text-foreground">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6 sm:space-y-3">
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">Is this actually free?</h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              It&apos;s genuinely free. No hidden costs, no subscriptions, no premium version. Everything you see is available to everyone.
            </p>
          </div>
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">Does this really work at school?</h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              For most people, yes. We&apos;ve had thousands of students tell us it works on their school networks. Obviously we can&apos;t guarantee every single school because some have really extreme filtering, but it works on the vast majority of restricted networks.
            </p>
          </div>
          <div className="pb-4 sm:pb-0 border-b border-border/60 sm:border-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">Can I use these for YouTube videos?</h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              Yes, people do all the time. Most of these are meme sounds or public domain stuff that&apos;s fine to use in content. If you&apos;re planning to monetize videos, you might want to be slightly careful with certain movie or TV clips, but generally speaking these are meant to be used in content.
            </p>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-1.5 text-foreground">Is there a limit to how many sounds I can play?</h4>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              No. Click away. Play the same sound 500 times if that&apos;s your thing. We don&apos;t limit usage because that would be silly.
            </p>
          </div>
        </div>
      </section>

      {/* E-E-A-T Section: Author, Contact, and About */}
      <section id="about-author" className="mb-10 sm:mb-8 scroll-mt-20 mt-14 sm:mt-12 pt-10 sm:pt-8 border-t border-border">
        <h2 className="text-xl sm:text-3xl font-bold mb-8 sm:mb-6 text-foreground">
          About SoundButtons.com
        </h2>

        <div className="space-y-10 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-3 text-foreground">
              Author & Creator
            </h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              <strong>Siya P</strong> — Founder & Creator of SoundButtons.com
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
              Why I Started SoundButtons
            </h3>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              I created SoundButtons.com with a simple mission: to provide free, high-quality sound buttons that are accessible to everyone, especially kids, creators, streamers, and students. Growing up, I noticed that most soundboard websites were either blocked at school, required downloads, or had poor-quality audio. This frustrated me and many others who just wanted to have fun with sounds.
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              I wanted to build something different - a platform where kids could safely explore funny sounds and meme buttons without worrying about restrictions. A place where content creators and streamers could find broadcast-quality sound effects instantly. A resource that students could use for school projects or just for fun during breaks, without getting blocked by network filters.
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground mb-4 sm:mb-4 leading-[1.7] sm:leading-relaxed">
              SoundButtons.com is my way of giving back to the community. Every sound is hand-curated for quality, every feature is designed with the user in mind, and everything is completely free. No hidden costs, no premium tiers, no nonsense. Just quality sound buttons that work when and where you need them.
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-[1.7] sm:leading-relaxed">
              Whether you&apos;re a kid looking for funny sounds, a creator needing sound effects for your videos, a streamer wanting to enhance your broadcasts, or just someone who enjoys meme sounds - SoundButtons.com is here for you. This is more than just a website; it&apos;s a tool for creativity, entertainment, and fun.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 text-foreground">
              Contact Information
            </h3>
            <div className="space-y-3 sm:space-y-2 text-[15px] sm:text-base text-muted-foreground">
              <p className="leading-[1.7]">
                <strong>Email:</strong> <a href="mailto:play@soundbuttons.com" className={linkClass}>play@soundbuttons.com</a>
              </p>
              <p className="leading-[1.7]">
                <strong>Phone:</strong> <a href="tel:+1-555-847-2638" className={linkClass}>+1 (555) 847-2638</a>
              </p>
              <p className="leading-[1.7]">
                <strong>Address:</strong> 2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="text-[15px] sm:text-lg text-muted-foreground mt-8 sm:mt-6 leading-[1.7] sm:leading-relaxed">
        SoundButtons isn&apos;t trying to be some revolutionary platform. It&apos;s just a solid, reliable place to find quality sound effects that works everywhere and doesn&apos;t waste your time. No gimmicks, no nonsense, just sounds that work when you need them. <Link href="/trends" className={linkClass}>Check out the collection</Link>—it&apos;s free and takes like 10 seconds.
      </p>
    </article>
  )
}
