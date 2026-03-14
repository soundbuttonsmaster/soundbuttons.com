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
    <form onSubmit={handleSubmit} className="flex w-full gap-2 rounded-xl border-2 border-slate-300 bg-white shadow-sm transition focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-400/20 dark:border-slate-600 dark:bg-slate-800/50 dark:focus-within:border-slate-500 dark:focus-within:ring-slate-500/20">
      <div className="relative flex flex-1 min-w-0 items-center">
        <Search className="absolute left-3.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 rounded-l-lg bg-transparent py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder-slate-400"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Search
      </button>
    </form>
  )
}
