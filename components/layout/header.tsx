"use client"

import Link from "next/link"
import { Menu, X, ChevronDown, ChevronRight, Search, User, LayoutGrid, Heart, Upload, LogOut } from "lucide-react"
import { useState, useEffect, useRef, FormEvent, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageChanger } from "@/components/ui/language-changer"
import { useAuth } from "@/lib/auth/auth-context"
import { getTopLevelCategories } from "@/lib/constants/categories"
import { getStrings, getLocaleFromPathname } from "@/lib/i18n/strings"
import { getLocalizedHref } from "@/lib/i18n/paths"

function generateSlug(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""
}

function getDisplayName(user: { full_name?: string; username: string; email: string }): string {
  if (user.full_name?.trim()) return user.full_name.trim()
  if (user.username?.trim()) return user.username.trim()
  if (user.email) return user.email.split("@")[0] || user.email
  return user.email || "User"
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const categories = getTopLevelCategories()

  const locale = getLocaleFromPathname(pathname ?? "")
  const nav = useMemo(() => getStrings(locale).nav, [locale])
  const displayName = user ? getDisplayName(user) : ""

  const navBeforeLinks = useMemo(
    () => [
      { name: nav.home, href: getLocalizedHref("/", locale) },
      { name: nav.soundEffects, href: getLocalizedHref("/categories/sound-effects", locale) },
      { name: nav.new, href: getLocalizedHref("/new", locale) },
      { name: nav.trending, href: getLocalizedHref("/trends", locale) },
    ],
    [nav, locale]
  )
  const navAfterLinks = useMemo(
    () => [
      { name: nav.memeSoundboard, href: getLocalizedHref("/categories/memes", locale) },
      { name: nav.playRandom, href: getLocalizedHref("/play-random", locale) },
    ],
    [nav, locale]
  )

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSubmenuOpen(null)
    setCategoryDropdownOpen(false)
    setUserDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!userDropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userDropdownOpen])

  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menu ? null : menu)
  }

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const slug = generateSlug(searchQuery.trim())
      if (slug) router.push(getLocalizedHref(`/search/${slug}`, locale))
    }
  }

  const navLinkClass =
    "px-2 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:dark:bg-slate-950/80 border-slate-200 dark:border-slate-800">
        <div className="relative flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo - left */}
          <Link href={getLocalizedHref("/", locale)} className="flex shrink-0 items-center">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              SOUND BUTTONS
            </span>
          </Link>

          {/* Desktop Nav - ABSOLUTE CENTER, all links in DOM for Google sitelinks */}
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex md:items-center md:gap-0.5"
            aria-label="Main navigation"
          >
            {navBeforeLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.name}
              </Link>
            ))}
            {/* Categories dropdown */}
            <div ref={dropdownRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                aria-expanded={categoryDropdownOpen}
                aria-haspopup="true"
                className={`${navLinkClass} flex items-center gap-0.5`}
              >
                {nav.categories}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                role="menu"
                className={`absolute left-1/2 top-full z-50 mt-1 max-h-[70vh] w-64 -translate-x-1/2 overflow-y-auto rounded-lg border bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 ${
                  categoryDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } transition-opacity duration-200`}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getLocalizedHref(`/categories/${cat.slug}`, locale)}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            {navAfterLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right section: Search + Join + Theme + Mobile menu */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Search - desktop */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex sm:items-center sm:gap-1.5 sm:rounded-lg sm:border sm:border-slate-300 sm:bg-slate-50 sm:px-2.5 sm:py-1.5 sm:focus-within:ring-2 sm:focus-within:ring-slate-400/20 dark:border-slate-600 dark:bg-slate-800/50 dark:focus-within:ring-slate-500/20 sm:min-w-[140px] sm:max-w-[180px] lg:max-w-[200px]"
            >
              <Search className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={nav.searchPlaceholder}
                className="w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder-slate-500"
              />
            </form>
            {user ? (
              <div ref={userDropdownRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  className="hidden shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
                >
                  <User className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="max-w-[120px] truncate">Hi, {displayName}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{nav.signedInAs}</p>
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user.username || displayName}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href={getLocalizedHref("/profile", locale)}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {nav.myProfile}
                      </Link>
                      <Link
                        href={getLocalizedHref("/my-soundboard", locale)}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <LayoutGrid className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {nav.mySoundboard}
                      </Link>
                      <Link
                        href={getLocalizedHref("/favorites", locale)}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <Heart className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {nav.myFavorites}
                      </Link>
                      <Link
                        href={getLocalizedHref("/upload-sound", locale)}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <Upload className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {nav.upload}
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 py-1 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        {nav.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={getLocalizedHref("/register", locale)}
                className="hidden shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-flex"
              >
                {nav.joinFree}
              </Link>
            )}
            <LanguageChanger />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xs transform bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-950 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{nav.menu}</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 p-4">
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="flex gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-800/50">
                  <Search className="h-4 w-4 shrink-0 self-center text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={nav.searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none dark:text-slate-100"
                  />
                </div>
              </form>
              {navBeforeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div>
                <button
                  onClick={() => toggleMobileSubmenu("categories")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {nav.categories}
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${mobileSubmenuOpen === "categories" ? "rotate-90" : ""}`}
                  />
                </button>
                {mobileSubmenuOpen === "categories" && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-700">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={getLocalizedHref(`/categories/${cat.slug}`, locale)}
                        className="block py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {navAfterLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                {user ? (
                  <div className="space-y-1">
                    <p className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
                      {nav.signedInAs} {displayName}
                    </p>
                    <Link
                      href={getLocalizedHref("/profile", locale)}
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 text-slate-400" />
                      {nav.myProfile}
                    </Link>
                    <Link
                      href={getLocalizedHref("/my-soundboard", locale)}
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutGrid className="h-5 w-5 text-slate-400" />
                      {nav.mySoundboard}
                    </Link>
                    <Link
                      href={getLocalizedHref("/favorites", locale)}
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 text-slate-400" />
                      {nav.myFavorites}
                    </Link>
                    <Link
                      href={getLocalizedHref("/upload-sound", locale)}
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Upload className="h-5 w-5 text-slate-400" />
                      {nav.upload}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-5 w-5" />
                      {nav.logout}
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={getLocalizedHref("/login", locale)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {nav.login}
                    </Link>
                    <Link
                      href={getLocalizedHref("/register", locale)}
                      className="mt-2 block rounded-lg bg-slate-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {nav.register}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
