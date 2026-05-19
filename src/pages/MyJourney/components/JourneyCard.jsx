import ReviewForm from './ReviewForm'

const FALLBACK_IMAGE_URL = new URL('../../../assets/images/destinations/fallback.jpg', import.meta.url).href

function JourneyCard({
  trip,
  destinationMeta,
  onExplore,
  onDelete,
  onModify,
  onSubmitReview,
  hasReview,
  activeReviewTripId,
  onReview,
  onCloseReview,
  user,
}) {
  const imageSrc = destinationMeta?.image || FALLBACK_IMAGE_URL

  return (
    <article className="journey-card">
      <img
        className="journey-image"
        src={imageSrc}
        alt={trip.destination}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_IMAGE_URL;
        }}
      />

      <div className="journey-body">
        <div className="journey-row">
          <div>
            <h4>{trip.destination}</h4>
            <p>{trip.startDate}</p>
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
            <strong>₹{trip.totalBudget.toLocaleString()}</strong>
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
          <button type="button" onClick={() => onModify(trip)}>
            Replan Trip
          </button>
          <button type="button" className="delete-button" onClick={() => onDelete(trip.id)}>
            Remove Trip
          </button>
          {trip.status === 'Completed' && !hasReview(trip.id) && (
            <button type="button" onClick={() => onReview(trip.id)}>
              Share Experience
            </button>
          )}
          {trip.status === 'Completed' && hasReview(trip.id) && (
            <span className="review-status">Reviewed</span>
          )}
        </div>

        {activeReviewTripId === trip.id && !hasReview(trip.id) && (
          <ReviewForm
            reviewerName={user?.username}
            onSubmit={(rating, comment) => onSubmitReview(trip, rating, comment)}
            onCancel={onCloseReview}
          />
        )}
      </div>
    </article>
  )
}

export default JourneyCard
