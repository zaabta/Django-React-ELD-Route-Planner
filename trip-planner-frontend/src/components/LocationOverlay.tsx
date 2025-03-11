import type { LocationOverlayProps } from '../types'

export default function LocationOverlay({
  currentLocation,
  pickupLocation,
  dropoffLocation,
}: LocationOverlayProps): JSX.Element {
  return (
    <aside className="absolute top-14 right-2 p-4 rounded-xl border border-solid bg-white border-indigo-700 border-opacity-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-fit max-sm:w-[calc(50%_-_40px)] max-sm:right-2 max-sm:p-3">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center max-sm:gap-2">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            className="w-8 h-8 max-sm:w-6 max-sm:h-6"
            alt="currentLocation"
          />
          <div>
            <div className="text-sm font-medium text-slate-800 max-sm:text-xs">
              {currentLocation || 'Not set'}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center max-sm:gap-2">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            className="w-8 h-8 max-sm:w-6 max-sm:h-6"
            alt="pickupLocation"
          />
          <div>
            <div className="text-sm font-medium text-slate-800 max-sm:text-xs">
              {pickupLocation || 'Not set'}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center max-sm:gap-2">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            className="w-8 h-8 max-sm:w-6 max-sm:h-6"
            alt="dropoffLocation"
          />
          <div>
            <div className="text-sm font-medium text-slate-800 max-sm:text-xs">
              {dropoffLocation || 'Not set'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
