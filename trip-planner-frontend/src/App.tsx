import React, { useState } from 'react'
import type { FormInput, RestStop, Trip } from './types'
import { MapView, TripDetails, TripForm } from './components'

export default function App(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [trip, setTrip] = useState<Trip>({
    current_coords: [0, 0],
    pickup_coords: [0, 0],
    dropoff_coords: [0, 0],
    total_distance_miles: 0,
    travel_time: '0 hour 0 minute',
    fuel_stops: 0,
    remaining_cycle_time: 0,
    rest_stops: [] as RestStop[],
    route: '',
  })

  const handleSubmit = async (input: FormInput): Promise<void> => {
    try {
      setLoading(true)
      const res = await fetch(
        `http://127.0.0.1:8000/api/trips/plan/?current_location=${input.currentLocation}&dropoff={${input.dropoffLocation}}&pickup={${input.pickupLocation}&current_cycle_used=${input.cycleHours}`,
      )
      const json = (await res.json()) as Trip
      setTrip(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-row">
      <div className="flex overflow-hidden relative -mr-1 w-full min-h-screen bg-neutral-50 max-sm:flex-col">
        <nav
          className={`flex flex-col p-8 -mr-px bg-indigo-700 text-white w-[401px] max-md:w-[350px] menu-button ${
            menuOpen ? 'open' : 'closed'
          }`}
        >
          <h1 className="mb-8 pl-5 text-2xl font-semibold">Spotter</h1>
          <div className="flex-1 h-40 p-6 mb-52 rounded-xl bg-white bg-opacity-10">
            <TripForm onSubmit={(input) => handleSubmit(input)} isLoading={isLoading} />
          </div>
        </nav>

        <main className="overflow-auto relative flex-1 p-12 pt-20 bg-slate-50 max-md:p-8 max-sm:p-6 max-sm:mt-16 max-sm:h-[calc(100vh_-_60px)]">
          <MapView
            currentLocation={{
              coordinates: { lat: trip.current_coords[0], lng: trip.current_coords[1] },
            }}
            pickupLocation={{
              coordinates: { lat: trip.pickup_coords[0], lng: trip.pickup_coords[1] },
            }}
            dropoffLocation={{
              coordinates: { lat: trip.dropoff_coords[0], lng: trip.dropoff_coords[1] },
            }}
            route={trip.route}
          />
          <TripDetails
            totalDistance={trip?.total_distance_miles}
            travelTime={trip?.travel_time}
            fuelStops={trip?.fuel_stops}
            remainingCycleTime={trip?.remaining_cycle_time}
            restStops={trip.rest_stops}
          />
        </main>
      </div>

      <button
        type="button"
        className="hidden fixed right-5 bottom-5 justify-center items-center bg-indigo-700 rounded-full h-[50px] text-white w-[50px] z-[100] max-sm:flex"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <span>×</span> : <span>☰</span>}
      </button>
    </div>
  )
}
