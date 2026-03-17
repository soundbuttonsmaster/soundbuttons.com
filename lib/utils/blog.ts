import { marked } from "marked"

/**
 * Converts a string into a URL-friendly slug (same logic as sbmain slugify).
 * Used for blog URLs: /blog/{id}/{slug}
 */
export function blogSlugify(str: string): string {
  if (!str) return ""
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

/**
 * Cleans HTML content for meta descriptions.
 */
export function cleanHtmlForMeta(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Generates an SEO-friendly description from blog title.
 */
export function generateBlogDescription(
  title: string,
  maxLength = 160
): string {
  const descriptions = [
    `Discover amazing ${title.toLowerCase()} - Explore our collection of trending sound effects and create your own soundboard.`,
    `Learn about ${title.toLowerCase()} with our comprehensive guide to sound buttons and audio clips.`,
    `${title} - Your ultimate resource for sound effects, meme sounds, and audio entertainment.`,
    `Explore ${title.toLowerCase()} and discover the best sound buttons for your needs.`,
    `Get the latest insights on ${title.toLowerCase()} - From sound effects to audio clips, we've got you covered.`,
  ]
  const selected =
    descriptions[title.length % descriptions.length]
  if (selected.length <= maxLength) return selected
  const truncated = selected.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(" ")
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "..."
  }
  return truncated + "..."
}

function isHtml(str: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(str)
}

/**
 * Normalize and format blog content HTML so line breaks render consistently.
 * Supports both HTML and Markdown content.
 */
export function formatBlogContent(content: string): string {
  if (!content) return ""
  const normalized = content.replace(/\r\n/g, "\n").trim()
  const decoded = normalized.replace(/&lt;(\/?br\s*\/?)&gt;/gi, "<$1>")
  const hasHtmlTags = isHtml(decoded)
  const markdownHtml = marked.parse(decoded)
  let html = hasHtmlTags
    ? decoded
    : typeof markdownHtml === "string"
      ? markdownHtml
      : ""
  html = html
    .replace(/<br(?!\s*\/)>/gi, "<br />")
    .replace(/(<br \/>)(\s*<br \/>)+/gi, "<br /><br />")
    .replace(/\s*&nbsp;\s*/gi, " ")
  if (hasHtmlTags) {
    html = html.replace(/([^>\n])\n(?!\s*<)/g, "$1<br />")
  }
  return html.trim()
}
