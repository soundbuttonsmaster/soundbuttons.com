"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

function generateSlug(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""
}

export default function SearchBar({
  searchBasePath = "",
  placeholder = "Search Sound buttons...",
}: {
  searchBasePath?: string
  placeholder?: string
}) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      const slug = generateSlug(query.trim())
      if (!slug) return
      const base = searchBasePath || ""
      router.push(base ? `${base}/search/${slug}` : `/search/${slug}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-lg flex gap-2"
      style={{ minHeight: "40px" }}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
          style={{ height: "40px", boxSizing: "border-box" }}
        />
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          style={{ pointerEvents: "none" }}
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-sky-600 dark:hover:bg-sky-700 transition-colors"
        style={{ height: "40px", boxSizing: "border-box" }}
      >
        Search
      </button>
    </form>
  )
}
