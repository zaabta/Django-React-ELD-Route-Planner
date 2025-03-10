import { useState } from 'react'
import type { FormInput, TripFormProps } from '../types'

export default function TripForm({ onSubmit, isLoading }: TripFormProps): JSX.Element {
  const [formInput, setFormInput] = useState<FormInput>({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    cycleHours: 0,
    isSubmitting: false,
  })

  const handleInputChange = <K extends keyof typeof formInput>(
    key: K,
    value: (typeof formInput)[K],
  ): void => {
    setFormInput((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const validateForm = (): boolean => {
    return !!(
      formInput.currentLocation &&
      formInput.pickupLocation &&
      formInput.dropoffLocation &&
      formInput.cycleHours
    )
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!validateForm()) return
    handleInputChange('isSubmitting', true)
    onSubmit(formInput)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="current-location" className="text-sm font-medium text-white">
            Current Location
          </label>
          <input
            id="current-location"
            type="text"
            placeholder="Enter current location"
            className="px-4 py-3 w-full text-base rounded-lg border border-slate-200 text-zinc-800"
            value={formInput.currentLocation}
            onChange={(event) => handleInputChange('currentLocation', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pickup-location" className="text-sm font-medium text-white">
            Pickup Location
          </label>
          <input
            id="pickup-location"
            type="text"
            placeholder="Enter pickup location"
            className="px-4 py-3 w-full text-base rounded-lg border border-slate-200 text-zinc-800"
            value={formInput.pickupLocation}
            onChange={(event) => handleInputChange('pickupLocation', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="dropoff-location" className="text-sm font-medium text-white">
            Dropoff Location
          </label>
          <input
            id="dropoff-location"
            type="text"
            placeholder="Enter dropoff location"
            className="px-4 py-3 w-full text-base rounded-lg border border-slate-200 text-zinc-800"
            value={formInput.dropoffLocation}
            onChange={(event) => handleInputChange('dropoffLocation', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="cycle-hours" className="text-sm font-medium text-white">
            Current Cycle Hours Used
          </label>
          <input
            id="cycle-hours"
            type="number"
            placeholder="Enter hours (0-24)"
            min="0"
            max="70"
            className="px-4 py-3 w-full text-base rounded-lg border border-slate-200 text-zinc-800"
            value={formInput.cycleHours}
            onChange={(event) => handleInputChange('cycleHours', Number(event.target.value))}
          />
        </div>
        <button
          type="submit"
          className="py-4 w-full text-base font-medium text-white rounded-lg"
          disabled={!isLoading}
          style={{
            background: !isLoading ? '#9CA3AF' : '#4318D1',
            cursor: !isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isLoading ? 'Processing...' : 'Generate Trip & Logs'}
        </button>
      </div>
    </form>
  )
}
