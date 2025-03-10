import type { TripDetailsProps } from '../types'
import RestStopCard from './RestStopCard'
import TripDetailsCard from './TripDetailsCard'

export default function TripDetails({
  totalDistance,
  travelTime,
  fuelStops,
  remainingCycleTime,
  restStops,
}: TripDetailsProps): JSX.Element {
  return (
    <section className="mt-8">
      <div className="relative p-12 mb-12 bg-white rounded-3xl border border-solid backdrop-blur-md border-indigo-700 border-opacity-10 shadow-[0_8px_32px_rgba(67,24,209,0.08)] z-[1] max-sm:p-6 max-sm:mb-8">
        <h2 className="flex gap-3 items-center mb-8 text-3xl font-bold text-slate-800">
          <span className="text-indigo-700">🗺️</span>
          <span>Trip Details</span>
        </h2>
        <div className="grid gap-5 grid-cols-[repeat(3,1fr)] max-md:gap-4 max-md:grid-cols-[repeat(2,1fr)] max-sm:gap-4 max-sm:grid-cols-[1fr]">
          <TripDetailsCard
            icon="📏"
            title="Total Distance"
            value={`${totalDistance.toLocaleString()} miles`}
          />
          <TripDetailsCard icon="⏱️" title="Travel Time" value={travelTime} />
          <div className="flex gap-4 items-center p-4 rounded-lg bg-slate-50">
            <span className="text-2xl text-indigo-700">⛽</span>
            <div>
              <h3 className="mb-1 text-sm text-slate-500">Fuel Stops</h3>
              <p className="text-base font-semibold text-slate-800">{fuelStops} stops</p>
            </div>
          </div>
          <div className="flex gap-4 items-center p-4 rounded-lg bg-slate-50">
            <span className="text-2xl text-indigo-700">⚡</span>
            <div>
              <h3 className="mb-1 text-sm text-slate-500">Remaining Cycle Time</h3>
              <p className="text-base font-semibold text-slate-800">{remainingCycleTime}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center p-4 rounded-lg bg-slate-50">
            <span className="text-2xl text-indigo-700">🛑</span>
            <div className="w-full">
              <h3 className="mb-4 text-base font-semibold text-slate-800">
                Rest Stops Required
              </h3>
              <div className="flex overflow-y-auto flex-col gap-4 p-4 rounded-xl border border-solid bg-[white] border-indigo-700 border-opacity-10 max-h-[300px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                {restStops && restStops.length > 0 ? (
                  restStops.map((stop) => <RestStopCard key={stop.address} stop={stop} />)
                ) : (
                  <div className="p-5 text-center rounded-xl border border-solid bg-indigo-700 bg-opacity-0 border-indigo-700 border-opacity-10 text-slate-500">
                    No Rest Stops Required
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-2xl font-semibold text-neutral-900">Daily Log Sheets</h2>
        <div className="flex justify-center items-center w-full rounded-lg bg-slate-100 h-[600px]">
          <img
            src="https://placehold.co/800x600"
            alt="Log Sheets"
            className="object-cover rounded-lg size-full"
          />
        </div>
      </div>
    </section>
  )
}
