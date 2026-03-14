import Link from "next/link"
import { Mail } from "lucide-react"
import { SITE } from "@/lib/constants/site"

export default function ContactUsPage() {
  return (
    <div className="flex flex-col items-center py-8 bg-background">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Contact Us</h1>
        <p className="mb-6 text-muted-foreground">
          We&apos;d love to hear from you! For questions, feedback, support, or partnership inquiries, email us at:
        </p>

        <div className="flex items-center gap-3 mb-10 p-4 bg-muted/50 rounded-lg border border-border">
          <Mail className="h-6 w-6 text-primary shrink-0" />
          <a
            href={`mailto:${SITE.email}`}
            className="text-lg font-medium text-primary underline hover:opacity-80"
          >
            {SITE.email}
          </a>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-foreground">Why We Created SoundButtons.com</h2>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          SoundButtons.com was built with a simple mission: to provide free, high-quality sound buttons that are accessible to everyone — especially kids, creators, streamers, and students. Growing up, we noticed that most soundboard websites were either blocked at school, required downloads, or had poor-quality audio. That frustration led us to build something different.
        </p>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          We wanted a platform where kids could safely explore funny sounds and meme buttons without worrying about restrictions. A place where content creators and streamers could find broadcast-quality sound effects instantly. A resource that students could use for school projects or just for fun during breaks, without getting blocked by network filters.
        </p>
        <p className="mb-4 text-muted-foreground leading-relaxed">
          SoundButtons.com is our way of giving back to the community. Every sound is hand-curated for quality, every feature is designed with the user in mind, and everything is completely free. No hidden costs, no premium tiers, no nonsense. Just quality sound buttons that work when and where you need them.
        </p>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Whether you&apos;re a kid looking for funny sounds, a creator needing sound effects for your videos, a streamer wanting to enhance your broadcasts, or just someone who enjoys meme sounds — SoundButtons.com is here for you. This is more than just a website; it&apos;s a tool for creativity, entertainment, and fun.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-foreground">Get in Touch</h2>
        <p className="text-muted-foreground">
          Have a question, suggestion, or just want to say hello? Reach us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary underline hover:opacity-80">
            {SITE.email}
          </a>
          . We typically respond within 24-48 hours.
        </p>
        <p className="mt-4 text-muted-foreground">
          You can also explore our <Link href="/about-us" className="text-primary underline hover:opacity-80">About Us</Link> page to learn more about our story and mission.
        </p>
      </div>
    </div>
  )
}
