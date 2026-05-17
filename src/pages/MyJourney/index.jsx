import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import './index.css'

const getStatusFromDate = (dateString) => {
  if (!dateString) return 'Upcoming'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Upcoming'
  const now = new Date()
  if (date > now) return 'Upcoming'
  return 'Completed'
}

const daysUntil = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  return diff
}

function MyJourney({ onExplore, user }) {
  const [savedTrips, setSavedTrips] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeReviewTripId, setActiveReviewTripId] = useState(null)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [reminder, setReminder] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('smartTravelHubTrips')
    if (!raw) return

    try {
      const trips = JSON.parse(raw)
      const updated = trips.map((trip) => ({
        ...trip,
        status: getStatusFromDate(trip.date),
      }))
      setSavedTrips(updated)
    } catch {
      setSavedTrips([])
    }
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem('smartTravelHubReviews')
    if (!raw) return

    try {
      const storedReviews = JSON.parse(raw)
      setReviews(storedReviews)
    } catch {
      setReviews([])
    }
  }, [])

  useEffect(() => {
    const upcoming = savedTrips
      .filter((trip) => trip.date && getStatusFromDate(trip.date) === 'Upcoming')
      .map((trip) => ({
        ...trip,
        days: daysUntil(trip.date),
      }))
      .filter((trip) => trip.days !== null && trip.days >= 0 && trip.days <= 5)
      .sort((a, b) => a.days - b.days)

    if (upcoming.length > 0) {
      const nextTrip = upcoming[0]
      const destinationMeta = destinations.find(
        (item) => item.id === nextTrip.destinationId || item.name === nextTrip.destination,
      )
      setReminder({
        trip: nextTrip,
        destination: destinationMeta,
      })
    } else {
      setReminder(null)
    }
  }, [savedTrips])

  const handleDelete = (id) => {
    const nextTrips = savedTrips.filter((trip) => trip.id !== id)
    setSavedTrips(nextTrips)
    localStorage.setItem('smartTravelHubTrips', JSON.stringify(nextTrips))
  }

  const handleReplan = (trip) => {
    localStorage.setItem('smartTravelHubReplan', JSON.stringify(trip))
    onExplore('planner')
  }

  const hasReview = (tripId) => reviews.some((review) => review.tripId === tripId)

  const openReviewForm = (tripId) => {
    setActiveReviewTripId(tripId)
    setReviewName(user?.username || '')
    setReviewRating(5)
    setReviewComment('')
    setReviewMessage('')
  }

  const closeReviewForm = () => {
    setActiveReviewTripId(null)
    setReviewMessage('')
  }

  const handleSubmitReview = (trip) => {
    if (!user) {
      setReviewMessage('Login first to share your experience.')
      return
    }
    if (!reviewComment.trim()) {
      setReviewMessage('Please add a comment for your review.')
      return
    }

    const newReview = {
      id: `${trip.id}-${Date.now()}`,
      tripId: trip.id,
      destination: trip.destination,
      name: user.username,
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedReviews = [newReview, ...reviews]
    setReviews(updatedReviews)
    localStorage.setItem('smartTravelHubReviews', JSON.stringify(updatedReviews))
    setActiveReviewTripId(null)
    setReviewMessage('Review shared successfully.')
  }

  const groupedTrips = {
    Upcoming: savedTrips.filter((trip) => trip.status === 'Upcoming'),
    Completed: savedTrips.filter((trip) => trip.status === 'Completed'),
  }

  return (
    <div className="journey-page">
      <section className="journey-welcome">
        <p className="journey-label">My Journey</p>
        <h2>Manage your travel history, reminders, and next steps.</h2>
        <p>
          Track upcoming and completed trips with reminders and quick replanning.
        </p>
      </section>

      {reminder && (
        <section className="journey-alert">
          <strong>🌍 Upcoming Trip Alert</strong>
          <p>
            Your {reminder.trip.destination} trip starts in {reminder.trip.days} days.
            Suggested: {reminder.destination?.packing.slice(0, 2).join(', ')}.
          </p>
        </section>
      )}

      <section className="journey-summary">
        {Object.entries(groupedTrips).map(([label, trips]) => (
          <div key={label} className="journey-group-card">
            <h3>{label} trips</h3>
            <p>{trips.length} trip{trips.length === 1 ? '' : 's'} recorded</p>
          </div>
        ))}
      </section>

      {['Upcoming', 'Completed'].map((sectionKey) => (
        <section key={sectionKey} className="journey-section">
          <div className="journey-section-header">
            <h3>{sectionKey}</h3>
            <p>
              {sectionKey === 'Upcoming'
                ? 'Trips that are coming soon and need preparation.'
                : 'Trips you have completed and can review.'}
            </p>
          </div>

          {groupedTrips[sectionKey].length === 0 ? (
            <p className="empty-state">No {sectionKey.toLowerCase()} trips yet.</p>
          ) : (
            <div className="journey-list">
              {groupedTrips[sectionKey].map((trip) => {
                const destinationMeta = destinations.find(
                  (item) => item.id === trip.destinationId || item.name === trip.destination,
                )
                return (
                  <article key={trip.id} className="journey-card">
                    <img
                      className="journey-image"
                      src={destinationMeta?.image}
                      alt={trip.destination}
                    />
                    <div className="journey-body">
                      <div className="journey-row">
                        <div>
                          <h4>{trip.destination}</h4>
                          <p>{trip.date}</p>
                        </div>
                        <div className="journey-status-group">
                          {trip.bookingStatus && (
                            <span className="booking-badge">{trip.bookingStatus}</span>
                          )}
                          <span className={`status-badge status-${trip.status.toLowerCase()}`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>

                      <div className="journey-details">
                        <span>Travelers: {trip.travelers}</span>
                        <span>Duration: {trip.duration}</span>
                        <span>Transport: {trip.transportType}</span>
                        <span>Accommodation: {trip.accommodationType || 'Standard stay'}</span>
                      </div>
                      <div className="journey-budget">
                        <div>
                          <small>Total</small>
                          <strong>₹{trip.budget.toLocaleString()}</strong>
                        </div>
                        <div>
                          <small>Per person</small>
                          <strong>₹{trip.summary.costPerPerson.toLocaleString()}</strong>
                        </div>
                      </div>
                      <div className="journey-actions">
                        <button type="button" onClick={() => onExplore('destinationdetails', trip.destinationId)}>
                          View destination
                        </button>
                        <button type="button" onClick={() => handleReplan(trip)}>
                          Replan Trip
                        </button>
                        <button type="button" className="delete-button" onClick={() => handleDelete(trip.id)}>
                          Remove Trip
                        </button>
                        {trip.status === 'Completed' && !hasReview(trip.id) && (
                          <button type="button" onClick={() => openReviewForm(trip.id)}>
                            Share Experience
                          </button>
                        )}
                        {trip.status === 'Completed' && hasReview(trip.id) && (
                          <span className="review-status">Reviewed</span>
                        )}
                      </div>

                      {activeReviewTripId === trip.id && (
                        <form
                          className="review-form"
                          onSubmit={(event) => {
                            event.preventDefault()
                            handleSubmitReview(trip)
                          }}
                        >
                          <div className="review-row">
                            <div className="review-note">
                              Reviewing as <strong>{reviewName || 'Guest'}</strong>
                            </div>
                            <label>
                              Rating
                              <select
                                value={reviewRating}
                                onChange={(event) => setReviewRating(event.target.value)}
                              >
                                {[5, 4, 3, 2, 1].map((value) => (
                                  <option key={value} value={value}>
                                    {value} star{value > 1 ? 's' : ''}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <label>
                            Comment
                            <textarea
                              value={reviewComment}
                              onChange={(event) => setReviewComment(event.target.value)}
                              placeholder="Share what you enjoyed and what future travelers should know."
                            />
                          </label>
                          <div className="review-actions">
                            <button type="submit">Send Review</button>
                            <button type="button" className="delete-button" onClick={closeReviewForm}>
                              Cancel
                            </button>
                          </div>
                          {reviewMessage && <p className="review-message">{reviewMessage}</p>}
                        </form>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      ))}

      {reviews.length > 0 && (
        <section className="journey-section">
          <div className="journey-section-header">
            <h3>Traveler Reviews</h3>
            <p>Real feedback from completed trips and fellow travelers.</p>
          </div>
          <div className="review-list">
            {reviews.map((review) => (
              <article key={review.id} className="review-card">
                <div className="review-top-row">
                  <div>
                    <h4>{review.name}</h4>
                    <p>{review.destination}</p>
                  </div>
                  <span className="rating-pill">{review.rating} ★</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MyJourney
