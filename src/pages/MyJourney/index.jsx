import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import ReminderAlert from './components/ReminderAlert'
import JourneySummary from './components/JourneySummary'
import JourneyCard from './components/JourneyCard'
import ReviewCard from './components/ReviewCard'
import { getStatusFromDate, daysUntil } from './utils/tripUtils'
import './index.css'

function MyJourney({ onExplore, user }) {
  const [savedTrips, setSavedTrips] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeReviewTripId, setActiveReviewTripId] = useState(null)
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
  }

  const closeReviewForm = () => {
    setActiveReviewTripId(null)
  }

  const handleSubmitReview = (trip, reviewRating, reviewComment) => {
    if (!user) {
      return { success: false, message: 'Login first to share your experience.' }
    }

    if (!reviewComment.trim()) {
      return { success: false, message: 'Please add a comment for your review.' }
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
    return { success: true, message: 'Review shared successfully.' }
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

      {reminder && <ReminderAlert reminder={reminder} />}

      <JourneySummary groupedTrips={groupedTrips} />

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
                  <JourneyCard
                    key={trip.id}
                    trip={trip}
                    destinationMeta={destinationMeta}
                    onExplore={onExplore}
                    onDelete={handleDelete}
                    onReplan={handleReplan}
                    onReviewSubmit={handleSubmitReview}
                    hasReview={hasReview}
                    activeReviewTripId={activeReviewTripId}
                    onOpenReview={openReviewForm}
                    onCloseReview={closeReviewForm}
                    user={user}
                  />
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
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MyJourney
