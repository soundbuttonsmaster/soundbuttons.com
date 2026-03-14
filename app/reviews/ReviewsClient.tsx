"use client"

export default function ReviewsClient() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 blur-3xl dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-30" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 opacity-30 blur-3xl dark:from-pink-900 dark:via-indigo-900 dark:to-blue-900 dark:opacity-20" />
      </div>

      <main className="flex-1 flex flex-col items-center relative z-10 py-8 md:py-12 px-4">
        <div className="container max-w-7xl">
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              SoundButtons.com User Reviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We value your feedback! Read what our users say about SoundButtons.com and share your
              own experience to help us improve.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-lg rounded-3xl shadow-lg border border-border p-6 md:p-8 min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              User reviews will appear here. Thank you for being part of our community!
            </p>
          </div>

          <div className="mt-12 bg-card/80 backdrop-blur-lg rounded-3xl shadow-lg border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Why Your Feedback Matters</h2>
            <p className="mb-4 text-muted-foreground">
              At SoundButtons.com, we&apos;re committed to providing the best experience for our
              users. Your reviews help us understand what we&apos;re doing right and where we can
              improve.
            </p>
            <p className="mb-4 text-muted-foreground">
              Every review is read by our team and considered carefully as we continue to develop
              and enhance our platform. Whether you&apos;re sharing what you love about
              SoundButtons.com or suggesting improvements, your voice matters to us.
            </p>
            <p className="text-muted-foreground">
              Thank you for being part of our community and helping us make SoundButtons.com better
              for everyone!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
