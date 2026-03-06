import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mt-4">Page not found</h2>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
