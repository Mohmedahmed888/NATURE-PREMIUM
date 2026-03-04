export default function Loading() {
  return (
    <div className="min-h-[60vh] px-4">
      <div className="max-w-7xl mx-auto animate-pulse space-y-8 pt-8">
        <div className="h-12 w-48 bg-stone-200 rounded-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100">
              <div className="aspect-[4/3] bg-stone-200" />
              <div className="p-6 space-y-2">
                <div className="h-5 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-1/2 bg-stone-100 rounded" />
                <div className="h-10 w-full bg-stone-200 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
