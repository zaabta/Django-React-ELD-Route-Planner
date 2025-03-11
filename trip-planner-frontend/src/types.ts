export interface Location {
  address?: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface RestStop {
  duration: number
  reason: string
  address: string
  place?: string
}

export interface RestStopCardProps {
  stop: RestStop
}

export interface TripDetail {
  totalDistance: number
  travelTime: {
    hours: number
    minutes: number
  }
  fuelStops: number
  remainingCycleTime: number
  restStops: RestStop[]
}

export interface TripDetailsCardProps {
  icon: string
  title: string
  value: React.ReactNode
  subtitle?: string
  className?: string
}

export interface TripFormProps {
  onSubmit: (formData: FormInput) => void
  isLoading: boolean
}

export interface TripDetailsProps {
  totalDistance: number
  travelTime: string
  fuelStops: number
  remainingCycleTime: number
  restStops: RestStop[]
}

export interface LocationOverlayProps {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
}

export interface MapViewProps {
  currentLocation: Location
  pickupLocation: Location
  dropoffLocation: Location
  route: string
}

export interface Trip {
  current_coords: [number, number]
  pickup_coords: [number, number]
  dropoff_coords: [number, number]
  travel_time: string
  total_distance_miles: number
  route: string
  fuel_stops: number
  remaining_cycle_time: number
  rest_stops: RestStop[]
}

export interface FormInput {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  cycleHours: number
  isSubmitting: boolean
}
