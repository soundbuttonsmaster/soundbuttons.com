/**
 * Reusable OG image component for static pages.
 * Standard 1200x630 (1.91:1) for Facebook, LinkedIn, Twitter compatibility.
 * Use with Next.js opengraph-image.tsx via ImageResponse.
 *
 * @example
 * // In app/404/opengraph-image.tsx:
 * return new ImageResponse(<StaticOgImage title="Page Not Found (404)" />)
 */
export interface StaticOgImageProps {
  /** Page title to display (e.g., "About Us", "Terms and Conditions", "Page Not Found (404)") */
  title: string
  /** Optional subtitle - shown below title in smaller text */
  subtitle?: string
  /** Size - default 1200x630 (standard OG image ratio 1.91:1) */
  width?: number
  height?: number
}

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
const BG_DARK = "#0f172a"      // slate-900 - matches theme primary
const ACCENT = "#2563eb"       // blue - theme-color
const TEXT_WHITE = "#ffffff"
const TEXT_MUTED = "#94a3b8"   // slate-400

export function StaticOgImage({
  title,
  subtitle,
  width = OG_IMAGE_WIDTH,
  height = OG_IMAGE_HEIGHT,
}: StaticOgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BG_DARK,
        padding: 48,
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* Accent line at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${ACCENT}, #7c3aed)`,
        }}
      />
      {/* Brand */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          fontSize: 24,
          fontWeight: 600,
          color: TEXT_MUTED,
          letterSpacing: "0.05em",
        }}
      >
        soundbuttons.com
      </div>
      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: TEXT_WHITE,
            lineHeight: 1.1,
            marginBottom: subtitle ? 16 : 0,
            maxWidth: "90%",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: TEXT_MUTED,
              maxWidth: "80%",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {/* Decorative sound wave hint */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          position: "absolute",
          bottom: 36,
        }}
      >
        {[32, 44, 56, 44, 32].map((h, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: h,
              backgroundColor: ACCENT,
              borderRadius: 6,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  )
}
