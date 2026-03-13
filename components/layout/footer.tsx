"use client"

import Link from "next/link"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

export default function Footer() {
  const categories = getActiveCategories()

  const link = (path: string) => path

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              {SITE.name.toUpperCase()}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Play thousands of sound buttons with the best meme soundboard,
              prank, and funny sound effects. Free and unblocked.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/play-random"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Play Random
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  New Sounds
                </Link>
              </li>
              <li>
                <Link
                  href="/trends"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={link(`/categories/${category.slug}`)}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about-us"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Contact
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Have questions?
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
            >
              {SITE.email}
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {SITE.domain}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
