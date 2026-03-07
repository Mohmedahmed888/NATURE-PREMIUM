export function Background() {
  return (
    <div className="fixed inset-0 -z-10 w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100/80 via-amber-50/30 to-stone-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(251,146,60,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
      <div className="absolute inset-0 wave-pattern opacity-60" />
    </div>
  )
}
