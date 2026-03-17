import { ImageResponse } from "next/og"
import { getCategoryBySlug } from "@/lib/constants/categories"
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/components/og/StaticOgImage"

export const alt = "Sound Buttons - SoundButtons.com"
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = "image/png"

const COLOR_PALETTE = ["#E74C3C", "#27AE60", "#3498DB", "#9B59B6", "#F1C40F", "#1abc9c"]

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 3) + "..."
}

function getButtonColor(id: number): string {
  return COLOR_PALETTE[id % COLOR_PALETTE.length] ?? "#3498DB"
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 52, g: 152, b: 219 }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((x) => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    })
    .join("")}`
}

/** 3D sound button SVG - same as sound detail opengraph-image */
function SoundButtonSvg({ categoryId, size: sz }: { categoryId: number; size: number }) {
  const innerHex = getButtonColor(categoryId)
  const rgb = hexToRgb(innerHex)
  const bid = `cat-og-${categoryId}`
  const c1 = rgbToHex(Math.max(0, rgb.r - 30), Math.max(0, rgb.g - 30), Math.max(0, rgb.b - 30))
  const c5 = rgbToHex(Math.max(0, rgb.r - 20), Math.max(0, rgb.g - 20), Math.max(0, rgb.b - 20))
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 508.88 499.32"
      width={sz}
      height={sz}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient
          id={`lg-${bid}`}
          x1="883.46"
          y1="-341.94"
          x2="1037.44"
          y2="-75.24"
          gradientTransform="translate(1217.61 -59.25) rotate(-180)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.05" stopColor="#fff" stopOpacity="0.83" />
          <stop offset="0.09" stopColor="#fff" stopOpacity="0.46" />
          <stop offset="0.11" stopColor="#fff" stopOpacity="0.33" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`lg2-${bid}`}
          x1="254.44"
          y1="293.77"
          x2="254.44"
          y2="23.06"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.05" stopColor="#fff" stopOpacity="0.83" />
          <stop offset="0.15" stopColor="#fff" stopOpacity="0.61" />
          <stop offset="0.26" stopColor="#fff" stopOpacity="0.43" />
          <stop offset="0.36" stopColor="#fff" stopOpacity="0.27" />
          <stop offset="0.46" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.73" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
        <path fill="#1f1f1f" d="M482.41,213.7H26.47c-10.23,18.8-15.83,39.21-15.83,60.54v50.43c0,7.1.71,14.08,2.22,20.92,16.02,75.81,118.07,134.27,241.58,134.27s225.56-58.46,241.58-134.27c1.47-6.84,2.22-13.82,2.22-20.92v-50.43l-15.83-60.54Z" />
        <path fill="#404140" d="M498.24,274.24c0,94.1-109.15,170.4-243.8,170.4S10.63,368.34,10.63,274.24c0-21.33,5.6-41.73,15.83-60.54,34.94-64.22,123.82-109.86,227.97-109.86s193.03,45.64,227.97,109.86c10.23,18.8,15.83,39.21,15.83,60.54Z" />
        <ellipse fill="#b0aaab" cx="255.32" cy="270.96" rx="235.23" ry="160.56" />
      </g>
      <g>
        <path fill={c1} d="M462.66,154.7v94c0,6-.63,11.94-1.9,17.73-13.68,64.23-100.85,113.74-206.32,113.74s-192.63-49.51-206.32-113.74c-1.27-5.79-1.9-11.72-1.9-17.73v-94h416.43Z" />
        <ellipse fill={c5} cx="254.44" cy="154.7" rx="208.22" ry="139.17" />
        <ellipse fill={innerHex} cx="254.53" cy="152.02" rx="197.7" ry="131.14" />
      </g>
      <path fill={`url(#lg-${bid})`} d="M257.8,283.16c-51.32,0-102.69-12.82-141.89-38.46-38.78-25.35-60.16-59.32-60.2-95.66-.05-36.1,21.01-69.85,59.28-95.03,77.9-51.29,205.05-51.3,283.44-.02,38.77,25.35,60.15,59.32,60.2,95.65.05,36.1-21.02,69.86-59.31,95.05-38.94,25.64-90.2,38.47-141.52,38.47ZM256.54,23.66c-50.01,0-99.95,12.49-137.89,37.48-35.93,23.64-55.7,54.85-55.66,87.88.04,33.27,20.13,64.71,56.56,88.53h0c76.37,49.96,200.23,49.97,276.1,0,35.95-23.65,55.72-54.87,55.68-87.9-.04-33.27-20.13-64.7-56.56-88.52-38.18-24.98-88.24-37.47-138.24-37.47Z" />
      <ellipse fill={`url(#lg2-${bid})`} cx="254.44" cy="150.44" rx="187.39" ry="116.99" />
    </svg>
  )
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  const categoryName = category?.name ?? "Soundboard"
  const categoryId = category?.id ?? 13
  const displayName = truncate(categoryName, 40)

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fef08a 0%, #fce7f3 50%, #bfdbfe 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles - play-random style */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "rgba(253, 224, 71, 0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 100,
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "rgba(249, 168, 212, 0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 150,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "rgba(147, 197, 253, 0.4)",
        }}
      />

      {/* Center: 3D sound button + category name */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <SoundButtonSvg categoryId={categoryId} size={360} />
        <div
          style={{
            marginTop: 20,
            fontSize: 56,
            fontWeight: 800,
            color: "#1e293b",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          }}
        >
          {displayName}
        </div>
      </div>

      {/* soundbuttons.com branding */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          fontSize: 28,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: "0.05em",
        }}
      >
        soundbuttons.com
      </div>
    </div>,
    { ...size }
  )
}
