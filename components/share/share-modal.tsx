"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Copy } from "lucide-react"
import { SITE } from "@/lib/constants/site"

function generateSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface ShareModalProps {
  soundName: string
  soundId: number
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({
  soundName,
  soundId,
  isOpen,
  onClose,
}: ShareModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseSlug = generateSlug(soundName)
  const nameSlug = baseSlug || "sound"
  const soundUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${nameSlug}/${soundId}`
      : `${SITE.baseUrl}/${nameSlug}/${soundId}`

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(soundUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Share
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          {soundName}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={soundUrl}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
