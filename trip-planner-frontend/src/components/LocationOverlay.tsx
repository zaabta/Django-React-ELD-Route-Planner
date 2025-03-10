import type { LocationOverlayProps } from '../types'

export default function LocationOverlay({
  currentLocation,
  pickupLocation,
  dropoffLocation,
}: LocationOverlayProps): JSX.Element {
  return (
    <aside className="absolute top-5 right-5 p-4 rounded-xl border border-solid bg-[white] border-indigo-700 border-opacity-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-[300px] max-sm:w-[calc(100%_-_40px)]">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            className="w-8 h-8 text-xl flex items-center justify-center"
            alt="currentLocation"
          />
          <div>
            <div className="mb-0.5 text-xs text-slate-500">Current Location</div>
            <div className="text-sm font-medium text-slate-800">
              {currentLocation || 'Not set'}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            className="w-8 h-8 text-xl flex items-center justify-center"
            alt="pickupLocation"
          />
          <div>
            <div className="mb-0.5 text-xs text-slate-500">Pickup Point</div>
            <div className="text-sm font-medium text-slate-800">
              {pickupLocation || 'Not set'}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            className="w-8 h-8 text-xl flex items-center justify-center"
            alt="pickupLocation"
          />
          <div>
            <div className="mb-0.5 text-xs text-slate-500">Dropoff Point</div>
            <div className="text-sm font-medium text-slate-800">
              {dropoffLocation || 'Not set'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
