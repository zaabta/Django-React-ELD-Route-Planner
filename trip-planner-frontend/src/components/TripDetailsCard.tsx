import type { TripDetailsCardProps } from '../types'

export default function TripDetailsCard({
  icon,
  title,
  value,
  subtitle,
  className = '',
}: TripDetailsCardProps): JSX.Element {
  return (
    <article
      className={`flex overflow-hidden relative flex-col gap-4 p-4 rounded-2xl border border-solid transition-all bg-indigo-700 bg-opacity-0 border-indigo-700 border-opacity-10 duration-[0.3s] ease-[ease-in-out] ${className}`}
    >
      <div className="flex gap-4 items-center">
        <span className="w-16 h-16 text-3xl text-indigo-700 rounded-2xl bg-[white] shadow-[0_4px_12px_rgba(67,24,209,0.16)] flex items-center justify-center">
          {icon}
        </span>
        <div>
          <h3 className="mb-1 text-lg text-slate-500">{title}</h3>
          <p className="flex gap-1 items-baseline text-base font-bold text-slate-800">{value}</p>
          {subtitle && <p className="text-base font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </article>
  )
}
