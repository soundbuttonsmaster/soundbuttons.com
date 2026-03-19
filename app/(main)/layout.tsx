/**
 * Route group layout - ensures title.template from root layout applies to homepage.
 * Next.js docs: template doesn't apply to page.js in the same segment as layout.js.
 * Nesting homepage here fixes the title showing "soundbuttons.com" on refresh.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
