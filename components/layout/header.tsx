"use client"

import Link from "next/link"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const categories = getActiveCategories()

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSubmenuOpen(null)
    setCategoryDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [mobileMenuOpen])

  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menu ? null : menu)
  }

  const navLinkClass =
    "flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white whitespace-nowrap shrink-0"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-14 w-full items-center gap-4 px-4 lg:px-6">
          <div className="flex flex-shrink-0 items-center min-w-0">
            <Link href="/" className="shrink-0">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap lg:text-xl">
                SOUND BUTTONS
              </span>
            </Link>
          </div>

          <nav className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="flex items-center gap-3 lg:gap-4">
              <Link href="/" className={navLinkClass}>
                Home
              </Link>
              <Link href="/new" className={navLinkClass}>
                New
              </Link>
              <Link href="/trends" className={navLinkClass}>
                Trending
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`${navLinkClass} flex items-center gap-1`}
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-48 -translate-x-1/2 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50 max-h-96 overflow-y-auto pt-2 transition-opacity duration-200 ${
                    categoryDropdownOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setCategoryDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/play-random" className={navLinkClass}>
                Play Random
              </Link>
            </div>
          </nav>

          <div className="flex-1 min-w-0 md:hidden" aria-hidden />

          <div className="header-right flex flex-shrink-0 items-center justify-end gap-3 md:gap-4">
            <div className="hidden w-44 min-w-0 md:block lg:w-52">
              <SearchBar placeholder="Search Sound buttons..." />
            </div>
            <span
              className="hidden text-slate-300 dark:text-slate-600 md:inline"
              aria-hidden
            >
              |
            </span>
            <Link
              href="/register"
              className="hidden items-center gap-1 text-sm font-semibold text-white whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 transition-all hover:from-blue-600 hover:to-purple-700 md:inline-flex"
            >
              Join Free
            </Link>
            <span
              className="hidden text-slate-300 dark:text-slate-600 md:inline"
              aria-hidden
            >
              |
            </span>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Menu
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              <div className="mb-4">
                <SearchBar placeholder="Search Sound buttons..." />
              </div>

              <Link
                href="/"
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/new"
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New
              </Link>
              <Link
                href="/trends"
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </Link>

              <div>
                <button
                  onClick={() => toggleMobileSubmenu("categories")}
                  className="w-full flex items-center justify-between py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Categories
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${mobileSubmenuOpen === "categories" ? "rotate-90" : ""}`}
                  />
                </button>
                {mobileSubmenuOpen === "categories" && (
                  <div className="ml-4 mt-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block py-2 px-4 text-base text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/play-random"
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Play Random
              </Link>

              <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
                <Link
                  href="/login"
                  className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block py-3 px-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Free Account
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
