import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import './index.css'

const transportRates = {
  Bus: 1400,
  Train: 1700,
  Flight: 5200,
  Car: 3400,
}

const stayRates = {
  'Budget Friendly': 1800,
  'Mid-Range': 2800,
  Premium: 4200,
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
  if (Number.isNaN(date.getTime())) return 'Upcoming'
  const now = new Date()
  return date > now ? 'Upcoming' : 'Completed'
}

const defaultAccommodationType =
  destinations[0]?.accommodation?.[1]?.type || destinations[0]?.accommodation?.[0]?.type || ''

function Planner({ user }) {
  const [destinationId, setDestinationId] = useState(destinations[0]?.id || '')
  const [groupSize, setGroupSize] = useState(2)
  const [duration, setDuration] = useState(3)
  const [transportType, setTransportType] = useState('Train')
  const [tripDate, setTripDate] = useState('')
  const [accommodationType, setAccommodationType] = useState(defaultAccommodationType)
  const [savedTrips, setSavedTrips] = useState([])
  const [message, setMessage] = useState('')
  const [confirmationTrip, setConfirmationTrip] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('smartTravelHubTrips')
    if (raw) {
      try {
        setSavedTrips(JSON.parse(raw))
      } catch {
        setSavedTrips([])
      }
    }

    const replanRaw = localStorage.getItem('smartTravelHubReplan')
    if (replanRaw) {
      try {
        const trip = JSON.parse(replanRaw)
        if (trip.destinationId) {
          setDestinationId(trip.destinationId)
        } else if (trip.destination) {
          const matching = destinations.find((item) => item.name === trip.destination)
          if (matching) setDestinationId(matching.id)
        }
        if (trip.travelers) setGroupSize(trip.travelers)
        if (trip.duration) {
          const parsed = Number(trip.duration.replace(/[^0-9]/g, ''))
          if (parsed) setDuration(parsed)
        }
        if (trip.transportType) setTransportType(trip.transportType)
        if (trip.date) setTripDate(trip.date)
      } catch {
        // ignore malformed replan data
      }
      localStorage.removeItem('smartTravelHubReplan')
    }
  }, [])

  const selectedDestination = destinations.find((item) => item.id === destinationId) || destinations[0]
  const days = Math.max(1, Number(duration) || 1)
  const travelers = Math.max(1, Number(groupSize) || 1)

  useEffect(() => {
    if (selectedDestination.accommodation?.length) {
      setAccommodationType(
        selectedDestination.accommodation[1]?.type || selectedDestination.accommodation[0]?.type,
      )
    }
  }, [selectedDestination.id])

  const selectedAccommodation =
    selectedDestination.accommodation.find((item) => item.type === accommodationType) ||
    selectedDestination.accommodation[0]

  const parseAverageCost = (costString) => {
    const cleaned = String(costString).replace(/[₹,]/g, '')
    const match = cleaned.match(/(\d+)(?:–|-| to )?(\d+)?/)
    if (!match) return 0
    const low = Number(match[1])
    const high = Number(match[2] || match[1])
    return Math.round((low + high) / 2)
  }

  const transportCost = transportType === 'Car'
    ? transportRates.Car * travelers
    : transportRates[transportType] * travelers

  const stayUnit = parseAverageCost(selectedAccommodation?.cost)
  const stayCost = stayUnit * days * travelers
  const foodCost = foodRates[selectedDestination.budget || 'Mid-Range'] * days * travelers
  const activitiesCost = activityRates[selectedDestination.budget || 'Mid-Range'] * days * travelers
  const totalBudget = transportCost + stayCost + foodCost + activitiesCost
  const costPerPerson = Math.round(totalBudget / travelers)

  const comfortLevel = () => {
    if (selectedDestination.budget === 'Premium') return 'High'
    if (selectedDestination.crowdLevel === 'Low') return 'High'
    if (selectedDestination.budget === 'Budget Friendly') return 'Moderate'
    return 'Moderate'
  }

  const getStatus = (dateValue = tripDate) => getStatusFromDate(dateValue)

  const handleBookTrip = () => {
    if (!user) {
      setMessage('Login to save your planner trips and access personalized tools.')
      return
    }

    const trip = {
      id: `${destinationId}-${Date.now()}`,
      destinationId,
      destination: selectedDestination.name,
      date: tripDate || 'Date not set',
      duration: `${days} days`,
      travelers,
      transportType,
      accommodationType: selectedAccommodation.type,
      accommodationCost: stayCost,
      budget: totalBudget,
      status: getStatus(tripDate),
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
    localStorage.setItem('smartTravelHubTrips', JSON.stringify(updatedTrips))
    setConfirmationTrip(trip)
    setMessage('Booking completed. Your trip is now saved and ready to review.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="planner-page">
      <header className="planner-header">
        <div>
          <p className="planner-label">Smart Planner</p>
          <h2>Build a practical travel budget and plan smart trips.</h2>
        </div>
        <p className="planner-intro">
          Choose a destination, define your group, and get a clear travel budget breakdown.
        </p>
      </header>

      <div className="planner-grid">
        <section className="planner-form-card">
          <div className="planner-section">
            <h3>Plan your next trip</h3>
            <p>Select your travel details and see the budget update in real time.</p>
            {!user && (
              <div className="planner-lock-note">
                Login first to save trips, access your planner, and keep review access ready.
              </div>
            )}
          </div>

          <label className="planner-field">
            <span>Destination</span>
            <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
              {destinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="planner-row">
            <div className="planner-field group-field">
              <span>Group size</span>
              <div className="counter-input">
                <button type="button" onClick={() => setGroupSize(Math.max(1, travelers - 1))}>-</button>
                <span>{travelers}</span>
                <button type="button" onClick={() => setGroupSize(travelers + 1)}>+</button>
              </div>
            </div>
            <label className="planner-field">
              <span>Duration (days)</span>
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </label>
          </div>

          <label className="planner-field">
            <span>Transport type</span>
            <select value={transportType} onChange={(e) => setTransportType(e.target.value)}>
              <option>Bus</option>
              <option>Train</option>
              <option>Flight</option>
              <option>Car</option>
            </select>
          </label>

          <label className="planner-field">
            <span>Accommodation</span>
            <div className="accommodation-options">
              {selectedDestination.accommodation.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={`accommodation-button ${accommodationType === option.type ? 'active' : ''}`}
                  onClick={() => setAccommodationType(option.type)}
                >
                  {option.type}
                </button>
              ))}
            </div>
          </label>

          <label className="planner-field">
            <span>Trip date</span>
            <input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} />
          </label>

          <div className="planner-summary-card">
            <h4>Budget breakdown</h4>
            <div className="budget-row">
              <span>Transport</span>
              <strong>₹{transportCost.toLocaleString()}</strong>
            </div>
            <div className="budget-row">
              <span>Stay</span>
              <strong>₹{stayCost.toLocaleString()}</strong>
            </div>
            <div className="budget-row">
              <span>Food</span>
              <strong>₹{foodCost.toLocaleString()}</strong>
            </div>
            <div className="budget-row">
              <span>Activities</span>
              <strong>₹{activitiesCost.toLocaleString()}</strong>
            </div>
            <div className="budget-total">
              <span>Total Budget</span>
              <strong>₹{totalBudget.toLocaleString()}</strong>
            </div>
            <div className="budget-total">
              <span>Cost Per Person</span>
              <strong>₹{costPerPerson.toLocaleString()}</strong>
            </div>
          </div>

          <button type="button" className="book-button" onClick={handleBookTrip} disabled={!user}>
            Book Trip
          </button>
          {message && <p className="planner-message">{message}</p>}
          {confirmationTrip && (
            <div className="planner-confirmation-card">
              <h4>🌍 Booking Completed</h4>
              <div className="budget-row">
                <span>Destination</span>
                <strong>{confirmationTrip.destination}</strong>
              </div>
              <div className="budget-row">
                <span>Travelers</span>
                <strong>{confirmationTrip.travelers}</strong>
              </div>
              <div className="budget-row">
                <span>Duration</span>
                <strong>{confirmationTrip.duration}</strong>
              </div>
              <div className="budget-row">
                <span>Total Budget</span>
                <strong>₹{confirmationTrip.budget.toLocaleString()}</strong>
              </div>
            </div>
          )}
        </section>

        <section className="planner-info-card">
          <div className="planner-section">
            <h3>Smart travel summary</h3>
            <p>A practical summary of the trip, costs, and destination insights.</p>
          </div>

          <div className="planner-detail-row">
            <span>Destination</span>
            <strong>{selectedDestination.name}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Best month</span>
            <strong>{selectedDestination.bestMonth}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Budget category</span>
            <strong>{selectedDestination.budget}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Accommodation</span>
            <strong>{selectedAccommodation.type}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Stay estimate</span>
            <strong>₹{stayCost.toLocaleString()}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Crowd level</span>
            <strong>{selectedDestination.crowdLevel}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Difficulty</span>
            <strong>{selectedDestination.difficulty}</strong>
          </div>
          <div className="planner-detail-row">
            <span>Comfort level</span>
            <strong>{comfortLevel()}</strong>
          </div>

          <div className="packing-suggestions">
            <h4>Packing suggestions</h4>
            <ul>
              {selectedDestination.packing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="planner-detail-row">
            <span>Trip status</span>
            <strong>{getStatus()}</strong>
          </div>
        </section>
      </div>

      {savedTrips.length > 0 && (
        <section className="planner-saved-trips">
          <div className="planner-section">
            <h3>Saved trips</h3>
            <p>Review the trips you booked through the planner.</p>
          </div>
          <div className="saved-trip-list">
            {savedTrips.map((trip) => (
              <article key={trip.id} className="saved-trip-card">
                <div>
                  <h4>{trip.destination}</h4>
                  <p>{trip.date}</p>
                </div>
                <div>
                  <span>{trip.status}</span>
                  <strong>₹{trip.budget.toLocaleString()}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Planner
