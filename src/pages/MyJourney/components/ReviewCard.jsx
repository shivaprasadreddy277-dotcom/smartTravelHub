function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-top-row">
        <div>
          <h4>{review.name}</h4>
          <p>{review.destination}</p>
        </div>
        <span className="rating-pill">{review.rating} ★</span>
      </div>
      <p>{review.comment}</p>
    </article>
  )
}

export default ReviewCard
