"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { CATEGORIES } from "@/lib/constants/categories"
import { Music, Search, X, Check } from "lucide-react"
import type { ProcessedSound } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface SoundPickerProps {
  selectedSounds: ProcessedSound[]
  onToggleSound: (sound: ProcessedSound) => void
  onRemoveSound: (soundId: number) => void
}

export default function SoundPicker({ selectedSounds, onToggleSound, onRemoveSound }: SoundPickerProps) {
  const [soundsByCategory, setSoundsByCategory] = useState<Record<string, ProcessedSound[]>>({})
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0]?.slug ?? "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!activeTab || soundsByCategory[activeTab]) return
    setLoading(true)
    const cat = CATEGORIES.find((c) => c.slug === activeTab)
    if (!cat) { setLoading(false); return }
    apiClient
      .getSoundsByCategory(cat.apiName, 1, 100)
      .then((res) => setSoundsByCategory((prev) => ({ ...prev, [activeTab]: res.data })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeTab, soundsByCategory])

  const isSelected = (id: number) => selectedSounds.some((s) => s.id === id)

  const filteredSounds = (() => {
    const sounds = soundsByCategory[activeTab] ?? []
    if (!search.trim()) return sounds
    const q = search.toLowerCase()
    return sounds.filter((s) => s.name.toLowerCase().includes(q))
  })()

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sounds…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 shrink-0 scrollbar-none">
        {CATEGORIES.slice(0, 12).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.slug)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
              activeTab === cat.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {cat.name.replace(" Soundboard", "")}
          </button>
        ))}
      </div>

      {/* Selected pills */}
      {selectedSounds.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15 max-h-[88px] overflow-y-auto">
          {selectedSounds.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
            >
              <span className="truncate max-w-[100px]">{s.name}</span>
              <button
                type="button"
                onClick={() => onRemoveSound(s.id)}
                className="rounded p-0.5 hover:bg-primary/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Sound grid */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border bg-muted/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground">Loading sounds…</p>
          </div>
        ) : filteredSounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
            <Music className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No sounds found</p>
          </div>
        ) : (
          <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {filteredSounds.map((sound) => {
              const selected = isSelected(sound.id)
              return (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => onToggleSound(sound)}
                  className={cn(
                    "relative px-3 py-2.5 rounded-xl text-xs text-left font-medium transition-all border",
                    selected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-muted/60"
                  )}
                >
                  {selected && (
                    <span className="absolute top-1.5 right-1.5">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="line-clamp-2 pr-3">{sound.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
