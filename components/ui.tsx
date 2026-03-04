import clsx from 'clsx'

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 min-h-[44px] font-semibold transition',
        'bg-brand-600 hover:bg-brand-500 active:bg-brand-700',
        'text-white shadow-lg shadow-brand-900/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        '[touch-action:manipulation]',
        className,
      )}
    />
  )
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-xl px-4 py-3 min-h-[44px] outline-none text-base',
        'bg-stone-50 border border-stone-200 text-slate-800',
        'focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30',
        '[touch-action:manipulation]',
        className,
      )}
    />
  )
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx('rounded-3xl', className)} />
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        'w-full rounded-xl px-4 py-3 outline-none min-h-[100px] resize-y text-base',
        'bg-stone-50 border border-stone-200 text-slate-800',
        'focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30',
        '[touch-action:manipulation]',
        className,
      )}
    />
  )
}
