export default function SkeletonSoundButton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-xl bg-muted animate-pulse" />
      <div className="h-3 w-14 rounded bg-muted animate-pulse" />
    </div>
  )
}
