export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-0 bg-transparent" style={{ background: "transparent" }}>
      {children}
    </div>
  )
}
