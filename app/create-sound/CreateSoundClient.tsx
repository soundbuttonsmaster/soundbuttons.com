"use client"

import Link from "next/link"
import { Scissors } from "lucide-react"

export default function CreateSoundClient() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center relative py-12 px-4">
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
        <div className="w-full bg-background/90 backdrop-blur rounded-3xl shadow-2xl border p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-3 rounded-full">
              <Scissors className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-center text-foreground">
              Create Sound Button
            </h1>
            <p className="text-sm text-center text-muted-foreground">
              Create your own custom sound by combining, trimming, and editing existing sounds or
              recording your own!
            </p>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Sign in to create custom sound buttons. Record your own audio, combine sounds, or trim
              clips to make unique sound effects. Share your creations with the community!
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-bold hover:opacity-90 transition"
            >
              Sign in to Create
            </Link>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline hover:opacity-80">
                Register
              </Link>
            </p>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Try{" "}
            <Link href="/text-to-sound" className="text-primary underline hover:opacity-80">
              Text to Sound
            </Link>{" "}
            to create sounds from text, or browse{" "}
            <Link href="/trends" className="text-primary underline hover:opacity-80">
              trending sounds
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
