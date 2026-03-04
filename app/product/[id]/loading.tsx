export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <div className="bg-white rounded-3xl overflow-hidden mt-6 shadow-xl border border-stone-100 animate-pulse">
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-stone-200" />
          <div className="p-8">
            <div className="h-4 w-24 bg-stone-200 rounded mb-4" />
            <div className="h-8 w-3/4 bg-stone-200 rounded mb-4" />
            <div className="h-6 w-20 bg-stone-200 rounded mb-6" />
            <div className="h-4 bg-stone-200 rounded mb-2" />
            <div className="h-4 bg-stone-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-stone-200 rounded mb-8" />
            <div className="h-12 w-full bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
