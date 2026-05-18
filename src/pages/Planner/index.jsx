import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import './index.css'

const transportRates = {
  Bus: 1400,
  Train: 1700,
  Flight: 5200,
  Car: 3400,
}

const foodRates = {
  'Budget Friendly': 900,
  'Mid-Range': 1200,
  Premium: 1650,
}

const activityRates = {
  'Budget Friendly': 600,
  'Mid-Range': 900,
  Premium: 1200,
}

const getStatusFromDate = (dateString) => {
  if (!dateString) return 'Upcoming'

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'Upcoming'
  }

  const now = new Date()

  return date > now ? 'Upcoming' : 'Completed'
}

function Planner({ user }) {

  const [destinationId, setDestinationId] = useState(() => {
  return localStorage.getItem('plannerDestination') || ''
})

const [groupSize, setGroupSize] = useState(() => {
  return Number(
    localStorage.getItem('plannerGroupSize')
  ) || 2
})

const [duration, setDuration] = useState(() => {
  return Number(
    localStorage.getItem('plannerDuration')
  ) || 3
})

const [transportType, setTransportType] = useState(() => {
  return localStorage.getItem(
    'plannerTransport'
  ) || 'Train'
})
  const [tripDate, setTripDate] = useState('')
  const [accommodationType, setAccommodationType] = useState('')
  const [savedTrips, setSavedTrips] = useState([])
  const [message, setMessage] = useState('')
  const [confirmationTrip, setConfirmationTrip] = useState(null)

  /* NEW */
  const [showBudget, setShowBudget] = useState(false)
  useEffect(() => {
  localStorage.setItem(
    'plannerDestination',
    destinationId
  )
}, [destinationId])

useEffect(() => {
  localStorage.setItem(
    'plannerGroupSize',
    groupSize
  )
}, [groupSize])

useEffect(() => {
  localStorage.setItem(
    'plannerDuration',
    duration
  )
}, [duration])

useEffect(() => {
  localStorage.setItem(
    'plannerTransport',
    transportType
  )
}, [transportType])

useEffect(() => {
  localStorage.setItem(
    'plannerAccommodation',
    accommodationType
  )
}, [accommodationType])

  useEffect(() => {

    const raw = localStorage.getItem('smartTravelHubTrips')

    if (raw) {
      try {
        setSavedTrips(JSON.parse(raw))
      } catch {
        setSavedTrips([])
      }
    }

  }, [])

  const selectedDestination =
    destinations.find((item) => item.id === destinationId)

  useEffect(() => {

    if (selectedDestination?.accommodation?.length) {
      setAccommodationType(
        selectedDestination.accommodation[0]?.type
      )
    }

    /* HIDE BUDGET WHEN DESTINATION CHANGES */
    setShowBudget(false)

  }, [destinationId])

  const parseAverageCost = (costString) => {

    const cleaned = String(costString)
      .replace(/[₹,]/g, '')

    const match = cleaned.match(
      /(\d+)(?:–|-| to )?(\d+)?/
    )

    if (!match) return 0

    const low = Number(match[1])
    const high = Number(match[2] || match[1])

    return Math.round((low + high) / 2)
  }

  const selectedAccommodation =
    selectedDestination?.accommodation?.find(
      (item) => item.type === accommodationType
    ) || selectedDestination?.accommodation?.[0]

  const days = Math.max(1, Number(duration) || 1)
  const travelers = Math.max(1, Number(groupSize) || 1)

  const transportCost =
    transportRates[transportType] * travelers

  const stayCost =
    parseAverageCost(selectedAccommodation?.cost) *
    days *
    travelers

  const foodCost =
    foodRates[selectedDestination?.budget || 'Mid-Range'] *
    days *
    travelers

  const activitiesCost =
    activityRates[selectedDestination?.budget || 'Mid-Range'] *
    days *
    travelers

  const totalBudget =
    transportCost +
    stayCost +
    foodCost +
    activitiesCost

  const costPerPerson =
    Math.round(totalBudget / travelers)

  const handleGenerateBudget = () => {

    if (!destinationId) {
      setMessage(
        'Please select a destination first.'
      )
      return
    }

    setMessage('')
    setShowBudget(true)
  }
const handleCancelPlanning = () => {

  setDestinationId('')
  setGroupSize(2)
  setDuration(3)
  setTransportType('Train')
  setAccommodationType('')
  setTripDate('')

  setShowBudget(false)

  localStorage.removeItem('plannerDestination')
  localStorage.removeItem('plannerGroupSize')
  localStorage.removeItem('plannerDuration')
  localStorage.removeItem('plannerTransport')
  localStorage.removeItem('plannerAccommodation')

  setMessage('Trip planning cleared successfully.')

  setTimeout(() => {
    setMessage('')
  }, 3000)
}
  const handleBookTrip = () => {

    if (!user) {
      setMessage(
        'Login to save your planner trips.'
      )
      return
    }

    if (!selectedDestination) {
      setMessage(
        'Please select a destination.'
      )
      return
    }

    const trip = {
      id: `${destinationId}-${Date.now()}`,
      destinationId,
      destination: selectedDestination.name,
      date: tripDate || 'Date not selected',
      duration: `${days} days`,
      travelers,
      transportType,
      accommodationType,
      budget: totalBudget,

      status: getStatusFromDate(tripDate),

      bookingStatus: 'Booking Completed',

      summary: {
        transportCost,
        stayCost,
        foodCost,
        activitiesCost,
        costPerPerson,
      },
    }

    const updatedTrips = [trip, ...savedTrips]

    setSavedTrips(updatedTrips)

    localStorage.setItem(
      'smartTravelHubTrips',
      JSON.stringify(updatedTrips)
    )

    setConfirmationTrip(trip)

    setMessage(
      'Booking completed successfully.'
    )
  }

  return (
    <div className="planner-page">

      {/* Header */}
      <header className="planner-header">

        <div>
          <p className="planner-label">
            Smart Planner
          </p>

          <h2>
            Plan smarter trips with
            clear budget estimation.
          </h2>
        </div>

      </header>

      <div className="planner-grid">

        {/* LEFT SIDE */}
        <section className="planner-form-card">

          {/* Destination */}
          <label className="planner-field">

            <span>Destination</span>

            <select
              value={destinationId}
              onChange={(e) =>
                setDestinationId(e.target.value)
              }
            >

              <option value="">
                Select destination
              </option>

              {destinations.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}

            </select>

          </label>

          {/* Group + Duration */}
          <div className="planner-row">

            <div className="planner-field group-field">

              <span>Group size</span>

              <div className="counter-input">

                <button
                  type="button"
                  onClick={() =>
                    setGroupSize(
                      Math.max(1, travelers - 1)
                    )
                  }
                >
                  -
                </button>

                <span>{travelers}</span>

                <button
                  type="button"
                  onClick={() =>
                    setGroupSize(travelers + 1)
                  }
                >
                  +
                </button>

              </div>

            </div>

            <label className="planner-field">

              <span>Duration</span>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) =>
                  setDuration(Number(e.target.value))
                }
              />

            </label>

          </div>

          {/* Transport */}
          <label className="planner-field">

            <span>Transport</span>

            <select
              value={transportType}
              onChange={(e) =>
                setTransportType(e.target.value)
              }
            >
              <option>Bus</option>
              <option>Train</option>
              <option>Flight</option>
              <option>Car</option>
            </select>

          </label>

          {/* Accommodation */}
          {selectedDestination && (
            <label className="planner-field">

              <span>Accommodation</span>

              <div className="accommodation-options">

                {selectedDestination.accommodation.map(
                  (option) => (
                    <button
                      key={option.type}
                      type="button"
                      className={`accommodation-button ${
                        accommodationType === option.type
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setAccommodationType(
                          option.type
                        )
                      }
                    >
                      {option.type}
                    </button>
                  )
                )}

              </div>

            </label>
          )}

          {/* Trip Date */}
          <label className="planner-field">

            <span>Trip Date</span>

            <input
              type="date"
              value={tripDate}
              onChange={(e) =>
                setTripDate(e.target.value)
              }
            />

          </label>

          {/* Generate Budget */}
          <button
            type="button"
            className="generate-button"
            onClick={handleGenerateBudget}
          >
            Generate Trip Plan
          </button>
              <button
  type="button"
  className="cancel-button"
  onClick={handleCancelPlanning}
>
  Cancel Planning
</button>
          {/* Placeholder */}
          {!showBudget && (
            <div className="planner-placeholder">

              <h4>
                🌍 No Trip Calculation Yet
              </h4>

              <p>
                Select your destination,
                travelers, duration,
                transport, and accommodation
                to generate your smart trip budget.
              </p>

            </div>
          )}

          {/* Budget Breakdown */}
          {showBudget && (
            <div className="planner-summary-card">

              <h4>Budget Breakdown</h4>

              <div className="budget-row">
                <span>Transport</span>
                <strong>
                  ₹{transportCost.toLocaleString()}
                </strong>
              </div>

              <div className="budget-row">
                <span>Stay</span>
                <strong>
                  ₹{stayCost.toLocaleString()}
                </strong>
              </div>

              <div className="budget-row">
                <span>Food</span>
                <strong>
                  ₹{foodCost.toLocaleString()}
                </strong>
              </div>

              <div className="budget-row">
                <span>Activities</span>
                <strong>
                  ₹{activitiesCost.toLocaleString()}
                </strong>
              </div>

              <div className="budget-total">
                <span>Total Budget</span>

                <strong>
                  ₹{totalBudget.toLocaleString()}
                </strong>
              </div>

              <div className="budget-total">
                <span>Per Person</span>

                <strong>
                  ₹{costPerPerson.toLocaleString()}
                </strong>
              </div>

            </div>
          )}

         {/* Book Trip */}
{showBudget && (
  <button
    type="button"
    className={`book-button ${
      confirmationTrip ? 'completed' : ''
    }`}
    onClick={handleBookTrip}
    disabled={confirmationTrip}
  >
    {confirmationTrip
      ? 'Booking Completed'
      : 'Book Trip'}
  </button>
)}

          {/* Message */}
          {message && (
            <p className="planner-message">
              {message}
            </p>
          )}

        </section>

        {/* RIGHT SIDE */}
        {showBudget && selectedDestination && (
          <section className="planner-info-card">

            <div className="planner-section">

              <h3>
                Smart Travel Summary
              </h3>

              <p>
                Practical travel insights and
                destination information.
              </p>

            </div>

            <div className="planner-detail-row">
              <span>Destination</span>
              <strong>
                {selectedDestination.name}
              </strong>
            </div>

            <div className="planner-detail-row">
              <span>Best Month</span>
              <strong>
                {selectedDestination.bestMonth}
              </strong>
            </div>

            <div className="planner-detail-row">
              <span>Budget</span>
              <strong>
                {selectedDestination.budget}
              </strong>
            </div>

            <div className="planner-detail-row">
              <span>Crowd Level</span>
              <strong>
                {selectedDestination.crowdLevel}
              </strong>
            </div>

            <div className="packing-suggestions">

              <h4>
                Packing Suggestions
              </h4>

              <ul>
                {selectedDestination.packing.map(
                  (item) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
              </ul>

            </div>

          </section>
        )}

      </div>

      {/* Booking Confirmation */}
      {confirmationTrip && (
        <section className="planner-confirmation-card">

          <h4>
            🌍 Booking Completed
          </h4>

          <div className="budget-row">
            <span>Destination</span>
            <strong>
              {confirmationTrip.destination}
            </strong>
          </div>

          <div className="budget-row">
            <span>Travelers</span>
            <strong>
              {confirmationTrip.travelers}
            </strong>
          </div>

          <div className="budget-row">
            <span>Duration</span>
            <strong>
              {confirmationTrip.duration}
            </strong>
          </div>

          <div className="budget-row">
            <span>Total Budget</span>

            <strong>
              ₹{confirmationTrip.budget.toLocaleString()}
            </strong>
          </div>

        </section>
      )}

    </div>
  )
}

export default Planner