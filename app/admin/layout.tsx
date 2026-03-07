export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-900">
      {children}
    </div>
  )
}
