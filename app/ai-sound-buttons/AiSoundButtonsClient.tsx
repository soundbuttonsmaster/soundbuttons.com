"use client"

import React, { useEffect, useState, useRef } from "react"
import { Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import SoundButton from "@/components/sound/sound-button"
import { CATEGORIES } from "@/lib/constants/categories"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const AVATAR_BOT = <Bot className="w-8 h-8 text-primary shrink-0" />
const AVATAR_USER = <User className="w-8 h-8 text-muted-foreground shrink-0" />

const predefinedPrompt = (name: string) => `I want to play ${name} sound buttons`

type QuickReply = { type: "sound-buttons"; path: string[]; name: string }

type ChatMessage = {
  sender: "user" | "bot"
  text: string
  sounds?: Sound[]
  soundLimit?: number
}

export default function AiSoundButtonsClient() {
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [quickReplies] = useState<QuickReply[]>(() =>
    CATEGORIES.map((cat) => ({
      type: "sound-buttons" as const,
      path: [cat.slug],
      name: cat.name.replace(/\s+Soundboard$/, ""),
    }))
  )
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat, loading])

  const findBestCategory = (question: string): QuickReply | null => {
    const lower = question.toLowerCase()
    return (
      quickReplies.find((q) => lower.includes(q.name.toLowerCase())) ||
      quickReplies.find((q) => lower.includes(q.path[0].toLowerCase().replace(/-/g, " "))) ||
      null
    )
  }

  const handleLoadMoreSounds = (msgIdx: number) => {
    setChat((prev) =>
      prev.map((msg, i) => {
        if (i === msgIdx && msg.sounds != null) {
          return { ...msg, soundLimit: (msg.soundLimit ?? 4) + 4 }
        }
        return msg
      })
    )
  }

  const handleUserQuestion = async (
    question: string,
    catType?: "sound-buttons",
    catPath?: string[]
  ) => {
    if (loading) return
    setChat((prev) => [...prev, { sender: "user", text: question }])
    setInput("")
    setLoading(true)
    try {
      const match =
        catType && catPath
          ? { type: "sound-buttons" as const, path: catPath, name: catPath[0] }
          : findBestCategory(question)

      if (!match) {
        setChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "Sorry, I couldn't find a matching category. Please try another question or click one of the quick replies above.",
          },
        ])
        return
      }

      const category = CATEGORIES.find((c) => c.slug === match.path[0])
      if (!category) {
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: "No sounds found for this category." },
        ])
        return
      }

      const { data: sounds } = await apiClient.getSoundsByCategory(
        category.apiName,
        1,
        50
      )

      if (!sounds || sounds.length === 0) {
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: "No sounds found for this category." },
        ])
      } else {
        const displayName = category.name.replace(/\s+Soundboard$/, "")
        setChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Here are some ${displayName} sound buttons:`,
            sounds,
            soundLimit: 4,
          },
        ])
      }
    } catch {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-background dark:from-gray-900 dark:to-gray-950 flex flex-col items-center py-0 px-0">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-[85vh] min-h-[500px] rounded-xl shadow-lg bg-card border border-border overflow-hidden mt-8">
        {/* Welcome */}
        <div className="px-4 pt-6 pb-2 bg-gradient-to-r from-blue-50/60 to-background dark:from-gray-800/60 dark:to-gray-900/80 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-10 h-10 text-2xl">
              🤖
            </span>
            <span className="text-lg font-bold text-primary">Hi, I&apos;m Siya</span>
          </div>
          <p className="text-base text-muted-foreground mb-1">
            Your personal sound buttons AI assistant!
          </p>
        </div>

        {/* Quick replies */}
        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-blue-50/60 to-background dark:from-gray-800/60 dark:to-gray-900/80">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Quick Questions:
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
            style={{ scrollbarWidth: "thin" }}
          >
            {quickReplies.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="rounded-full px-3 py-1 text-sm whitespace-nowrap flex-shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() =>
                  handleUserQuestion(predefinedPrompt(q.name), "sound-buttons", q.path)
                }
                disabled={loading}
              >
                {predefinedPrompt(q.name)}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
          style={{ scrollbarWidth: "thin" }}
        >
          {chat.length === 0 && (
            <div className="text-center text-muted-foreground mt-12">
              <p className="text-lg font-medium mb-2">Welcome to AI Sound Buttons!</p>
              <p className="text-sm">
                Click a quick question above or type your own below to get started.
              </p>
            </div>
          )}
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 animate-in fade-in duration-300`}
            >
              {msg.sender === "bot" && <div>{AVATAR_BOT}</div>}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] shadow ${
                  msg.sender === "user"
                    ? "bg-primary/10 text-right"
                    : "bg-muted"
                }`}
              >
                <div className="whitespace-pre-line text-base font-medium">
                  {msg.text}
                </div>
                {msg.sounds != null && msg.sounds.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2 text-primary">Sound Buttons</p>
                    <div className="grid grid-cols-2 gap-3">
                      {msg.sounds
                        .slice(0, msg.soundLimit ?? 4)
                        .map((sound, index) => (
                          <div key={sound.id} className="flex justify-center">
                            <SoundButton
                              sound={sound}
                              isAboveTheFold={index < 4}
                              isMobileDevice={false}
                            />
                          </div>
                        ))}
                    </div>
                    {msg.sounds.length > (msg.soundLimit ?? 4) && (
                      <div className="flex justify-center mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadMoreSounds(i)}
                        >
                          Load More
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Showing {Math.min(msg.sounds.length, msg.soundLimit ?? 4)} of{" "}
                      {msg.sounds.length} sounds
                    </p>
                  </div>
                )}
              </div>
              {msg.sender === "user" && <div>{AVATAR_USER}</div>}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Bot className="w-5 h-5 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          className="flex gap-3 px-4 py-4 border-t border-border bg-card"
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim() && !loading) {
              handleUserQuestion(input.trim())
            }
          }}
        >
          <input
            className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-base focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            placeholder="Type your question (e.g. I want to play meme sound buttons)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <Button type="submit" disabled={loading || !input.trim()} className="px-6">
            {loading ? "Sending..." : "Ask"}
          </Button>
        </form>
      </div>
    </main>
  )
}
