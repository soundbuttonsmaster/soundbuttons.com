# Edge Requests Cost Breakdown

## What are Edge Requests?

**Every request to your domain = 1 Edge Request** — whether cached or not. Vercel charges for the total count.

- **Cached (CDN hit)**: Served from edge, cheap, no serverless
- **Uncached (cache miss)**: Hits serverless function = **expensive** (compute + data transfer)

---

## Your Current Traffic (from dashboard)

| Route | Requests/hr | Cached | Cost Impact |
|-------|-------------|--------|-------------|
| `/[slug]/[id]` | 11K | **87.5%** ✅ | Improved! Was 0%, now mostly cached |
| `/new` | 3.8K | **0%** ❌ | Every request hits serverless |
| `/search/[query]` | 3.3K | **0%** ❌ | Every request hits serverless |
| `/kids-soundboard` | 3.3K | **0%** ❌ | Every request hits serverless |
| `/` (homepage) | 3.7K | 100% ✅ | Fully cached |
| `/sw.js`, favicons, segments | ~11K | 100% | Cached but still count as edge requests |

---

## Root Cause: Why These Routes Show 0% Cache

### `headers()` forces DYNAMIC rendering

These pages use `headers()` to detect mobile:
- **`/new`** - line 19: `const headersList = await headers()`
- **`/kids-soundboard`** - line 11: `const headersList = await headers()`
- **`/search/[query]`** - uses `headers()` for user-agent

When you call `headers()` in a Server Component, Next.js **cannot cache** the page. Every request = fresh render = 0% cache.

---

## What We Fixed Before (and what worked)

| Task | Route | Result |
|------|-------|--------|
| generateStaticParams | `/[slug]/[id]` | **87.5% cache** (was 0%) |
| Moved updateViews to client | `/[slug]/[id]` | Less serverless work |
| API caching (revalidate) | All API fetches | Fewer origin API calls |
| Removed force-dynamic | `/kids-soundboard` | But `headers()` still forces dynamic! |

---

## Features Causing High Edge Requests

1. **Real user traffic** - People browsing /new, /search, /kids-soundboard
2. **Bots/crawlers** - Google, social crawlers hitting same pages
3. **RSC payloads** - `index.segments/_tree.segment`, `register.segments` = React Server Components streaming (each navigation can trigger these)
4. **Service worker** - `/sw.js` requested frequently (PWA)

---

## Fix Applied: Removed `headers()` ✅

**Changed:**
- `/new` - Removed `headers()`, use fixed PAGE_SIZE=35, `isMobileDevice={false}` for SSR
- `/kids-soundboard` - Removed `headers()`, use fixed PAGE_SIZE=36
- `/search/[query]` - Removed `headers()`, `isMobileDevice={false}`

These pages can now be **ISR cached** (revalidate: 300). After deploy, expect cache to climb from 0% toward ~80–100% for these routes.

**Trade-off:** Mobile users get desktop count (35/36 items) on first load instead of 20/18. Layout remains responsive; "load more" still works. Client can detect mobile for any UI tweaks.
