"use client"

import Link from "next/link"
import { Menu, X, ChevronDown, ChevronRight, Search, User, LayoutGrid, Heart, Upload, LogOut, Moon, Sun, Flame } from "lucide-react"
import { useState, useEffect, useRef, FormEvent, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageChanger } from "@/components/ui/language-changer"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
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

const isHomePath = (path: string | null) =>
  path === "/" || path === "/fr" || path === "/es" || path === "/pt"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const [headerStreak, setHeaderStreak] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [addMoreFunDropdownOpen, setAddMoreFunDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const addMoreFunDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const searchOverlayInputRef = useRef<HTMLInputElement>(null)
  const categories = getTopLevelCategories()

  const locale = getLocaleFromPathname(pathname ?? "")
  const nav = useMemo(() => getStrings(locale).nav, [locale])
  const displayName = user ? getDisplayName(user) : ""
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && (resolvedTheme || theme) === "dark"

  const navBeforeLinks = useMemo(
    () => [
      { name: nav.home, href: getLocalizedHref("/", locale) },
      { name: nav.new, href: getLocalizedHref("/new", locale) },
      { name: nav.trending, href: getLocalizedHref("/trends", locale) },
    ],
    [nav, locale]
  )
  const addMoreFunLinks = useMemo(
    () => [
      { name: nav.playRandom, href: getLocalizedHref("/play-random", locale) },
      { name: nav.aiSoundButtons, href: getLocalizedHref("/ai-sound-buttons", locale) },
      { name: nav.textToSound, href: getLocalizedHref("/text-to-sound", locale) },
      { name: nav.leaderboard, href: getLocalizedHref("/leaderboard", locale) },
      { name: nav.createSound, href: getLocalizedHref("/create-sound", locale) },
      { name: nav.kidsSoundboard, href: getLocalizedHref("/kids-soundboard", locale) },
    ],
    [nav, locale]
  )

  const isHome = isHomePath(pathname ?? null)

  useEffect(() => {
    if (token)
      apiClient.getMyStreak(token).then((d) => setHeaderStreak(d.current_streak)).catch(() => setHeaderStreak(null))
    else setHeaderStreak(null)
  }, [token])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSubmenuOpen(null)
    setCategoryDropdownOpen(false)
    setAddMoreFunDropdownOpen(false)
    setUserDropdownOpen(false)
    setSearchOverlayOpen(false)
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
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setCategoryDropdownOpen(false)
      }
      if (addMoreFunDropdownRef.current && !addMoreFunDropdownRef.current.contains(target)) {
        setAddMoreFunDropdownOpen(false)
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
      setSearchOverlayOpen(false)
    }
  }

  useEffect(() => {
    if (searchOverlayOpen) searchOverlayInputRef.current?.focus()
  }, [searchOverlayOpen])

  useEffect(() => {
    if (!searchOverlayOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOverlayOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [searchOverlayOpen])

  const navLinkClass =
    "px-2 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"

  return (
    <>
      {/* z-[9999999] — must stay above Mediavine/PubNation ad units injected at body level (they use up to ~999999) */}
      <header className="sticky top-0 z-[9999999] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:dark:bg-slate-950/80 border-slate-200 dark:border-slate-800">
        <div className="relative flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo - left */}
          <Link href={getLocalizedHref("/", locale)} className="relative z-10 flex shrink-0 items-center">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              SOUND BUTTONS
            </span>
          </Link>

          {/* Desktop Nav - centered as before */}
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:flex lg:items-center lg:gap-0.5 lg:pointer-events-auto"
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
                    {cat.apiName}
                  </Link>
                ))}
              </div>
            </div>
            {/* Add More Fun dropdown */}
            <div ref={addMoreFunDropdownRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setAddMoreFunDropdownOpen(!addMoreFunDropdownOpen)}
                aria-expanded={addMoreFunDropdownOpen}
                aria-haspopup="true"
                className={`${navLinkClass} flex items-center gap-0.5`}
              >
                {nav.addMoreFun}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${addMoreFunDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                role="menu"
                className={`absolute left-1/2 top-full z-50 mt-1 max-h-[70vh] w-56 -translate-x-1/2 overflow-y-auto rounded-lg border bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 ${
                  addMoreFunDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } transition-opacity duration-200`}
              >
                {addMoreFunLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => setAddMoreFunDropdownOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right: Streak (home only), Search, user/Join Free, language, theme, mobile menu */}
          <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
            {isHome && (
              <Link
                href={getLocalizedHref("/streak", locale)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-orange-500 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50"
                aria-label="Streak"
              >
                <Flame className="h-5 w-5" />
              </Link>
            )}
            {/* Search icon - when inline search is hidden (< xl) to avoid overlapping centered nav */}
            <button
              type="button"
              onClick={() => setSearchOverlayOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 xl:hidden"
              aria-label={nav.searchPlaceholder}
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Search - desktop (xl and up only, so no overlap with centered nav on smaller desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden xl:flex xl:items-center xl:gap-1.5 xl:rounded-lg xl:border xl:border-slate-300 xl:bg-slate-50 xl:px-2.5 xl:py-1.5 xl:focus-within:ring-2 xl:focus-within:ring-slate-400/20 dark:border-slate-600 dark:bg-slate-800/50 dark:focus-within:ring-slate-500/20 xl:min-w-[140px] xl:max-w-[200px]"
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
              <div ref={userDropdownRef} className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  className="hidden shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:inline-flex"
                >
                  <User className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="max-w-[120px] truncate">Hi, {displayName}</span>
                  {headerStreak != null && headerStreak > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-500 dark:text-orange-400" title="Streak">
                      <Flame className="h-4 w-4 shrink-0" />
                      <span className="tabular-nums">{headerStreak}</span>
                    </span>
                  )}
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
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {user.username || displayName}
                        {headerStreak != null && headerStreak > 0 && (
                          <span className="flex items-center gap-0.5 text-orange-500 dark:text-orange-400 shrink-0">
                            <Flame className="h-3.5 w-3.5" />
                            <span className="tabular-nums text-xs">{headerStreak}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href={getLocalizedHref("/streak", locale)}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        role="menuitem"
                      >
                        <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                        Streak
                      </Link>
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
                      <div
                        className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
                        role="menuitem"
                      >
                        <span className="flex items-center gap-2.5">
                          {isDark ? (
                            <Moon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          ) : (
                            <Sun className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          )}
                          Dark mode
                        </span>
                        <button
                          type="button"
                          onClick={() => setTheme(isDark ? "light" : "dark")}
                          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                          role="switch"
                          aria-checked={isDark}
                          aria-label="Toggle dark mode"
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                              isDark ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
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
                className="hidden shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 lg:inline-flex"
              >
                {nav.joinFree}
              </Link>
            )}
            <LanguageChanger />
            {!user && <ThemeToggle />}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay - above header */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[99999999] bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile menu panel - above header when open */}
      <div
        className={`fixed top-0 right-0 z-[99999999] h-full w-full max-w-xs transform bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-950 lg:hidden ${
          mobileMenuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
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
                        {cat.apiName}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileSubmenuOpen((v) => (v === "addMoreFun" ? null : "addMoreFun"))
                  }
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {nav.addMoreFun}
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${mobileSubmenuOpen === "addMoreFun" ? "rotate-90" : ""}`}
                  />
                </button>
                {mobileSubmenuOpen === "addMoreFun" && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-700">
                    {addMoreFunLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                {user ? (
                  <div className="space-y-1">
                    <p className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      {nav.signedInAs} {displayName}
                      {headerStreak != null && headerStreak > 0 && (
                        <span className="flex items-center gap-0.5 text-orange-500 dark:text-orange-400">
                          <Flame className="h-3.5 w-3.5" />
                          <span className="tabular-nums">{headerStreak}</span>
                        </span>
                      )}
                    </p>
                    <Link
                      href={getLocalizedHref("/streak", locale)}
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                      Streak
                    </Link>
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

      {/* Search overlay - shown when search icon is visible (below xl) so tap works on small/medium screens */}
      {searchOverlayOpen && (
        <div
          className="fixed inset-0 z-[99999999] flex items-start justify-center pt-20 px-4 xl:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Search"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSearchOverlayOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-800/50">
                <Search className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                <input
                  ref={searchOverlayInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={nav.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-slate-900 placeholder-slate-500 focus:outline-none dark:text-slate-100"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOverlayOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
