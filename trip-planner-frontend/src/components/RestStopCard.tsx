import { RestStopCardProps } from '../types'

export default function RestStopCard({ stop }: RestStopCardProps): JSX.Element {
  const hours = Math.floor(Number(stop.duration) / 60)
  const minutes = Math.round(Number(stop.duration) % 60)

  return (
    <article className="p-4 rounded-lg border border-solid bg-[white] border-indigo-700 border-opacity-10">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <span className="p-2 text-sm font-semibold bg-indigo-700 rounded-md text-[white]">
            {hours}h {minutes}m
          </span>
          <span className="text-sm text-slate-500">{stop.reason}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-indigo-700 self-start">📍</span>
          <span className="text-sm text-slate-500">{stop.address}</span>
        </div>
      </div>
    </article>
  )
}
