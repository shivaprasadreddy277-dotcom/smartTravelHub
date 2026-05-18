import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import { getUserLocalStorage, setUserLocalStorage } from '../../utils/storageUtils'
import ReminderAlert from './components/ReminderAlert'
import JourneySummary from './components/JourneySummary'
import JourneyCard from './components/JourneyCard'
import ReviewCard from './components/ReviewCard'
import { getTripStatus, daysUntilTrip, daysRemainingInTrip, formatTripDate } from './utils/dateUtils'
import './index.css'

function MyJourney({ onExplore, user }) {
  const [savedTrips, setSavedTrips] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeReviewTripId, setActiveReviewTripId] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [reminder, setReminder] = useState(null)

  const userId = user?.username || 'guest'

  useEffect(() => {
    const trips = getUserLocalStorage('smartTravelHubTrips', userId) || []
    setSavedTrips(trips)
  }, [userId])

  useEffect(() => {
    const storedReviews = getUserLocalStorage('smartTravelHubReviews', userId) || []
    setReviews(storedReviews)
  }, [userId])

  // Find upcoming trip for reminder (within 7 days)
  useEffect(() => {
    const upcomingTrips = savedTrips
      .filter((trip) => getTripStatus(trip.startDate, trip.endDate) === 'Upcoming')
      .map((trip) => ({
        ...trip,
        daysUntil: daysUntilTrip(trip.startDate),
      }))
      .filter((trip) => trip.daysUntil !== null && trip.daysUntil >= 0 && trip.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil)

    if (upcomingTrips.length > 0) {
      const nextTrip = upcomingTrips[0]
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
    if (window.confirm('Are you sure you want to cancel this trip? This action cannot be undone.')) {
      const nextTrips = savedTrips.filter((trip) => trip.id !== id)
      setSavedTrips(nextTrips)
      setUserLocalStorage('smartTravelHubTrips', userId, nextTrips)
    }
  }

  const handleReplan = (trip) => {
    setUserLocalStorage('smartTravelHubReplan', userId, trip)
    onExplore('planner')
  }

  const handleModifyTrip = (trip) => {
    // Pre-fill planner with trip details
    setUserLocalStorage('smartTravelHubReplan', userId, trip)
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
    setUserLocalStorage('smartTravelHubReviews', userId, updatedReviews)
    setActiveReviewTripId(null)
    return { success: true, message: 'Review shared successfully.' }
  }

  // Organize trips by status
  const tripsByStatus = {
    Upcoming: savedTrips.filter((trip) => getTripStatus(trip.startDate, trip.endDate) === 'Upcoming'),
    Ongoing: savedTrips.filter((trip) => getTripStatus(trip.startDate, trip.endDate) === 'Ongoing'),
    Completed: savedTrips.filter((trip) => getTripStatus(trip.startDate, trip.endDate) === 'Completed'),
  }

  return (
    <div className="journey-page">
      <section className="journey-welcome">
        <p className="journey-label">My Journey</p>
        <h2>Your Travel Bookings & Itineraries</h2>
        <p>
          Manage all your trips, track upcoming travels, view completed journeys, and share your experiences.
        </p>
      </section>

      {reminder && <ReminderAlert reminder={reminder} />}

      <JourneySummary 
        upcomingCount={tripsByStatus.Upcoming.length}
        ongoingCount={tripsByStatus.Ongoing.length}
        completedCount={tripsByStatus.Completed.length}
      />

      {/* Trip Status Tabs */}
      <div className="journey-tabs">
        <button
          type="button"
          className={`journey-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({tripsByStatus.Upcoming.length})
        </button>
        <button
          type="button"
          className={`journey-tab ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing ({tripsByStatus.Ongoing.length})
        </button>
        <button
          type="button"
          className={`journey-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({tripsByStatus.Completed.length})
        </button>
      </div>

      {/* Upcoming Trips */}
      {activeTab === 'upcoming' && (
        <section className="journey-section">
          <div className="journey-section-header">
            <h3>Upcoming Trips</h3>
            <p>Prepare for your upcoming adventures with complete itinerary and booking details.</p>
          </div>

          {tripsByStatus.Upcoming.length === 0 ? (
            <div className="empty-state-card">
              <p>✈️ No upcoming trips planned yet.</p>
              <p>Start planning your next adventure!</p>
            </div>
          ) : (
            <div className="journey-list">
              {tripsByStatus.Upcoming.map((trip) => {
                const destinationMeta = destinations.find(
                  (item) => item.id === trip.destinationId || item.name === trip.destination,
                )
                const daysUntil = daysUntilTrip(trip.startDate)

                return (
                  <JourneyCard
                    key={trip.id}
                    trip={trip}
                    destinationMeta={destinationMeta}
                    onExplore={onExplore}
                    onDelete={handleDelete}
                    onModify={handleModifyTrip}
                    onReview={openReviewForm}
                    hasReview={hasReview}
                    activeReviewTripId={activeReviewTripId}
                    onSubmitReview={handleSubmitReview}
                    onCloseReview={closeReviewForm}
                    user={user}
                    daysUntil={daysUntil}
                  />
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Ongoing Trips */}
      {activeTab === 'ongoing' && (
        <section className="journey-section">
          <div className="journey-section-header">
            <h3>Ongoing Trips</h3>
            <p>You're currently on these amazing adventures!</p>
          </div>

          {tripsByStatus.Ongoing.length === 0 ? (
            <div className="empty-state-card">
              <p>🌍 No trips in progress at the moment.</p>
            </div>
          ) : (
            <div className="journey-list">
              {tripsByStatus.Ongoing.map((trip) => {
                const destinationMeta = destinations.find(
                  (item) => item.id === trip.destinationId || item.name === trip.destination,
                )
                const daysRemaining = daysRemainingInTrip(trip.endDate)

                return (
                  <JourneyCard
                    key={trip.id}
                    trip={trip}
                    destinationMeta={destinationMeta}
                    onExplore={onExplore}
                    onDelete={handleDelete}
                    onModify={handleModifyTrip}
                    onReview={openReviewForm}
                    hasReview={hasReview}
                    activeReviewTripId={activeReviewTripId}
                    onSubmitReview={handleSubmitReview}
                    onCloseReview={closeReviewForm}
                    user={user}
                    daysRemaining={daysRemaining}
                  />
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Completed Trips */}
      {activeTab === 'completed' && (
        <section className="journey-section">
          <div className="journey-section-header">
            <h3>Completed Trips</h3>
            <p>Relive your wonderful journeys and share your experiences.</p>
          </div>

          {tripsByStatus.Completed.length === 0 ? (
            <div className="empty-state-card">
              <p>📸 No completed trips yet.</p>
              <p>Start your first trip and create memories!</p>
            </div>
          ) : (
            <div className="journey-list">
              {tripsByStatus.Completed.map((trip) => {
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
                    onModify={handleModifyTrip}
                    onReview={openReviewForm}
                    hasReview={hasReview}
                    activeReviewTripId={activeReviewTripId}
                    onSubmitReview={handleSubmitReview}
                    onCloseReview={closeReviewForm}
                    user={user}
                  />
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="journey-section reviews-section">
          <div className="journey-section-header">
            <h3>Traveler Reviews & Feedback</h3>
            <p>Real experiences shared by fellow travelers from SmartTravelHub community.</p>
          </div>
          <div className="review-list">
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          {reviews.length > 6 && (
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
              +{reviews.length - 6} more reviews
            </p>
          )}
        </section>
      )}

      {/* Empty State */}
      {savedTrips.length === 0 && (
        <section className="journey-section">
          <div className="empty-state-card large">
            <p>🎯 Start Your Journey with SmartTravelHub</p>
            <p>Plan your first trip, create itineraries, and share your travel experiences with our community.</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default MyJourney
