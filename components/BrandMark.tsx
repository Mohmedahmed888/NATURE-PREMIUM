export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-2xl bg-brand-500/20 border border-brand-300/30 grid place-items-center">
        <div className="h-4 w-4 rounded-full bg-brand-500" />
      </div>
      <div className="leading-tight font-brand font-normal">
        <div className="text-sm text-orange-500 font-semibold brand-text uppercase">NATURE</div>
        <div className="text-xl tracking-wide text-slate-800 uppercase">NATURE PREMIUM</div>
      </div>
    </div>
  )
}
